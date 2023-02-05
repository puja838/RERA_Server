const dao = require('./project.dao');
const userdao = require('../mst_user/mst_user.dao');
const businessunitdao = require('../mst_business_unit/mst_business_unit.dao');
const token = require('../../utility/token');
const util = require('../../utility/util');
let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");
let fs = require("fs");
const config = require('../../config');
const axios = require("axios");
const common = require('../services/common.service');
const SMSmgov = require('../../utility/smsmgov');
const notificationDao = require('../notification/notification.dao');
const alertDao = require('../alert/alert.dao');

const groupBy = (xs, key) => {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}

const getControlValueFromBusinessUnit = async (reraid, businessunittypeid) => {
    let controlValue = '';
    try {
        const result = await businessunitdao.getBusinessUnitByType({
            reraid: reraid,
            businessunittypeid: businessunittypeid
        });
        for (const d of result) {
            controlValue += '|' + d.businessunittypename;
        }
        return controlValue;
    } catch (e) {
        util.createLog(e);
        return controlValue;
    }
}

const getFieldsByGroupList = async (groupRes, reraId) => {
    try {
        let i = 0;
        for (const group of groupRes) {
            group.fielddetails = await dao.getFieldsByGroupId(group.fieldgroupid);
            for (const obj of group.fielddetails) {
                if (obj.busnessunittypeid !== null && obj.busnessunittypeid !== '') {
                    obj.controlvalue = await getControlValueFromBusinessUnit(reraId, obj.busnessunittypeid)
                }
            }
            if (groupRes.length === (i + 1)) {
                return groupRes;
            }
            i++;
        }
    } catch (e) {
        util.createLog(e);
        return [];
    }
}


const getValuesForGroup = async (stepId, data, projectId, groupId, fieldGroupId, keys, groupPosition = -1) => {
    try {
        const fieldDetails = [];
        const fieldKeys = [];
        let maxCount = await dao.getFieldsValueMaxCountByGroupId(stepId, groupId, projectId, 1, fieldGroupId, groupPosition);
        if (maxCount === 0) {
            maxCount = await dao.getFieldsValueMaxCountByGroupId(stepId, groupId, projectId, 0, fieldGroupId, groupPosition);
        }
        if (maxCount > 0) {
            for (let i = 0; i < maxCount; i++) {
                let pos = i;
                if (groupPosition !== -1) {
                    pos = groupPosition
                }
                let fieldValues = await dao.getFieldsValueByGroupIdFromDtl(stepId, groupId, projectId, fieldGroupId, pos);
                if (fieldValues.length === 0) {
                    fieldValues = await dao.getFieldsValueByGroupId(stepId, groupId, projectId, fieldGroupId, pos);
                }

                fieldValues = groupBy(fieldValues, 'fieldid');
                const resCopy = JSON.parse(JSON.stringify(data));
                for (const key of keys) {
                    if (resCopy[key][0].fieldgroupid == null) {
                        if (fieldValues[resCopy[key][0].fieldid]) {
                            if (fieldGroupId !== 0) {
                                resCopy[key][0].fieldvalue = fieldValues[resCopy[key][0].fieldid][i] == undefined ? '' : fieldValues[resCopy[key][0].fieldid][i].fieldvalue;
                                if (fieldValues[resCopy[key][0].fieldid][i] !== undefined) {
                                    resCopy[key][0].tempid = fieldValues[resCopy[key][0].fieldid][i].id;
                                }
                            } else {
                                resCopy[key][0].fieldvalue = fieldValues[resCopy[key][0].fieldid][0] == undefined ? '' : fieldValues[resCopy[key][0].fieldid][0].fieldvalue;
                                if (fieldValues[resCopy[key][0].fieldid][0] !== undefined) {
                                    resCopy[key][0].tempid = fieldValues[resCopy[key][0].fieldid][0].id;
                                }
                            }
                            if (resCopy[key][0].controltype == 17) {
                                resCopy[key][0].fieldvalue = resCopy[key][0].fieldvalue.split('|');
                            }
                        }
                        if (resCopy[key][0].fielddesc === 'Is_there_any_Cases') {
                            resCopy[key][0].fieldvalue = 'Yes';
                        }
                    } else {
                        const gResD = await getValuesForGroup(stepId, resCopy[key][0].fielddetails[0], projectId, groupId, resCopy[key][0].fieldgroupid, resCopy[key][0].fielddetailskeys[0], i);
                        resCopy[key][0].fielddetails = gResD.field;
                        resCopy[key][0].fielddetailskeys = gResD.key;
                    }
                    if (resCopy[key][0].busnessunittypeid !== null && resCopy[key][0].busnessunittypeid !== '') {
                        resCopy[key][0].controlvalue = await getControlValueFromBusinessUnit(1, resCopy[key][0].busnessunittypeid)
                    }
                }
                fieldDetails.push(JSON.parse(JSON.stringify(resCopy)));
                fieldKeys.push(keys);
            }
        } else {
            if (groupId === 21 && data['Is_there_any_Cases'] !== undefined) {
                data['Is_there_any_Cases'][0].fieldvalue = 'Yes';
            }
            fieldDetails.push(data);
            fieldKeys.push(keys);
        }
        return {field: fieldDetails, key: fieldKeys};
    } catch (e) {
        util.createLog(e);
        return {field: [], key: []};
    }
};


const setValueFormArray = async (reraId, res, projectId, stepId, groupid) => {
    try {
        let i = 0;
        for (const obj of res) {
            if (obj.busnessunittypeid !== null && obj.busnessunittypeid !== '') {
                obj.controlvalue = await getControlValueFromBusinessUnit(reraId, obj.busnessunittypeid)
            }
            let dtlRes = await dao.getFieldValueByIdFromDtl(projectId, obj.fieldid, stepId, groupid);
            if (dtlRes == null) {
                dtlRes = await dao.getFieldValueById(projectId, obj.fieldid, stepId, groupid);
            }
            if (dtlRes) {
                obj.fieldvalue = dtlRes.fieldvalue;
                obj.tempid = dtlRes.id;
            }
            if (i === (res.length - 1)) {
                return res;
            }
            i++;
        }
    } catch (e) {
        util.createLog(e);
        return [];
    }
};


const setFieldDetails = async (reraid, stepFieldList, projectId, isComplete) => {
    // let i = 0;
    for (let i = 0; i < stepFieldList.length; i++) {
        let obj = stepFieldList[i];
        obj.groupView = null;
        if (obj.fieldid !== null) {
            obj.fielddetails = await dao.getFieldDetailsById(obj.fieldid);
            if (obj.fielddetails === null) {
                stepFieldList.splice(i, 1);
                i = i - 1;
                continue
            }
            if (obj.fielddetails.busnessunittypeid !== null && obj.fielddetails.busnessunittypeid !== '') {
                obj.fielddetails.controlvalue = await getControlValueFromBusinessUnit(reraid, obj.fielddetails.busnessunittypeid)
            }
            if (projectId !== 0) {
                let dtlRes = await dao.getFieldValueByIdFromDtl(projectId, obj.fieldid, obj.stepid);
                if (dtlRes == null) {
                    dtlRes = await dao.getFieldValueById(projectId, obj.fieldid, obj.stepid);
                }
                if (dtlRes) {
                    obj.fielddetails.fieldvalue = dtlRes.fieldvalue;
                    obj.tempid = dtlRes.id;
                }
            }
            if ((obj.fieldid === 654 || obj.fieldid === 660 || obj.fieldid === 661) && obj.fielddetails.fieldvalue === '') {
                obj.fielddetails.fieldvalue = 'Yes';
            }
            /*if (obj.stepid === 1 && (obj.fieldid === 962 || obj.fieldid === 1046 || obj.fieldid === 929) && obj.fielddetails.fieldvalue === '') {
                obj.fielddetails.fieldvalue = 'No';
            }
            if (obj.stepid === 13 && (obj.fieldid === 1031) && obj.fielddetails.fieldvalue === '') {
                obj.fielddetails.fieldvalue = 'No';
            }*/
        } else if (obj.groupid !== null) {
            let grpDtl = await dao.getGroupsDetailsByGroupId(obj.groupid);
            if (grpDtl) {
                obj.groupView = grpDtl.groupView;
            } else {
                obj.groupView = 'form';
            }
            let res = await dao.getFieldsByGroupId(obj.groupid);
            if ((obj.rowname !== '' && obj.rowname !== null) || obj.groupView === 'table') {
                obj.fielddetails = await setValueFormArray(reraid, res, projectId, obj.stepid, obj.groupid);
                // console.log(JSON.stringify(res))
            } else {
                res = groupBy(res, 'fielddesc');
                obj.fielddetailskeys = Object.keys(res);
                let groupRes = await dao.getGroupsByGroupId(obj.groupid);
                if (groupRes.length > 0) {
                    groupRes = await getFieldsByGroupList(groupRes, reraid);
                    groupRes = groupBy(groupRes, 'groupname');
                    // console.log(JSON.stringify(groupRes))
                    const keys = Object.keys(groupRes);
                    for (const key of keys) {
                        obj.fielddetailskeys.push(key);
                        const d = groupRes[key][0].fielddetails;
                        const dRes = groupBy(d, 'fielddesc');
                        groupRes[key][0].fielddetailskeys = Object.keys(dRes);
                        groupRes[key][0].fielddetails = [dRes];
                        groupRes[key][0].fielddetailskeys = [groupRes[key][0].fielddetailskeys];
                        res[key] = groupRes[key];
                    }
                    const sortKey = [];
                    for (const key of obj.fielddetailskeys) {
                        sortKey.push({key: key, seq: res[key][0].sequence})
                    }
                    sortKey.sort((a, b) => {
                        return a.seq - b.seq;
                    });
                    obj.fielddetailskeys = [];
                    sortKey.map((item) => {
                        obj.fielddetailskeys.push(item.key);
                    })
                }
                // console.log('res >>>>>>>>>> ', JSON.stringify(sortKey));
                const gResD = await getValuesForGroup(obj.stepid, res, projectId, obj.groupid, 0, obj.fielddetailskeys);
                obj.fielddetails = gResD.field;
                obj.fielddetailskeys = gResD.key;
            }
        }
        if (stepFieldList.length === (i + 1)) {
            return stepFieldList;
        }
    }
}

module.exports.formInfo = async (data) => {
    try {
        let stepFieldList = await dao.getList(data);
        if (stepFieldList) {
            let projectId = 0;
            let isComplete = 0;
            if (data.projectid !== undefined && data.projectid !== '' && data.projectid !== 0) {
                projectId = data.projectid;
            }
            if (data.iscomplete !== undefined && data.iscomplete !== '' && data.iscomplete !== 0) {
                isComplete = Number(data.iscomplete);
            }
            stepFieldList = await setFieldDetails(data.reraid, stepFieldList, projectId, isComplete);
            stepFieldList.sort(function (a, b) {
                return a.stepsequenceno - b.stepsequenceno
            });
            const result = groupBy(stepFieldList, 'stepdesc');
            const signature = await dao.getSignature(projectId);
            const amount = await dao.getPaymentAmount(projectId);
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(result),
                sign: signature,
                amt: amount
            }
        } else {
            return {
                success: false,
                status: util.statusCode.INTERNAL,
                message: 'Internal server error',
                response: null,
                sign: ''
            }
        }
    } catch (e) {
        util.createLog(e);
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null,
            sign: ''
        }
    }
};

module.exports.createNewTempProject = async (data) => {
    try {
        let result;
        /*const unsaveProject = await dao.getUnsaveProject(data);
        if (unsaveProject) {
            result = unsaveProject
        } else {*/
        const userno = await dao.getUserNoByUserId(data.userid);
        // console.log('userno >>>>>>>>>>> ', userno)
        if (userno) {
            const totalCount = await dao.getTotalCount(data.userid);
            data.projectuid = await util.genProjectNo(userno, totalCount + 1);
        } else {
            data.projectuid = await util.genUniqueId();
        }
        result = await dao.createNewTempProject(data);
        // }
        if (result) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'New Project added successfully',
                response: await util.encryptResponse({projectid: result})
            }
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}


module.exports.getSystemVerificationFields = async (data) => {
    try {
        const result = await dao.getSystemVerificationFields(data);
        if (result) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(result)
            }
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}

module.exports.storeFieldInfoIntoTemp = async (data) => {
    try {
        if (data.fieldtype === '5') {
            data.fieldvalue = data.fileName;
        }
        data.groupid = data.groupid === '' ? null : data.groupid;
        data.tempid = data.tempid === '' ? null : data.tempid;
        if (Number(data.pos) === -1) {
            data.pos = null;
        }
        util.createLog(JSON.stringify(data));
        let resp = null;
        if (data.externalProjectId !== undefined && data.externalProjectId !== '' && data.externalProjectId !== '0') {
            data.issystemverified = 0;
            data.isverified = 0;
            data.groupposition = data.pos;
            data.groufieldpposition = data.fieldGroupPos;
            resp = await dao.insertIntoProjectDtl([data], data.reraid, data.entityid, data.entitytypeid, data.externalProjectId, data.userid);
        } else {
            resp = await dao.storeFieldInfoIntoTemp(data, '');
            const validationResp = await dao.checkVerificationField(data);
            if (validationResp) {
                const params = {
                    reraid: data.reraid,
                    projectid: data.projectid,
                    strfieldid: validationResp.strfieldid,
                    strfieldvalue: null,
                    filefieldid: validationResp.filefieldid,
                    filefieldvalue: null,
                    fieldid: data.fieldid,
                    fieldvalue: data.fieldvalue
                };
                if (validationResp.strfieldid === Number(data.fieldid)) {
                    params.strfieldid = data.fieldid;
                    params.strfieldvalue = data.fieldvalue;
                } else if (validationResp.filefieldid === Number(data.fieldid)) {
                    params.filefieldid = data.fieldid;
                    params.filefieldvalue = data.fieldvalue;
                }
                const iRes = await dao.insertIntoVerificationSchedule(params);
            }
        }
        if (resp) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Field info updated successfully',
                response: await util.encryptResponse({tempid: resp.id, value: resp.value})
            }
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
};

module.exports.deleteFromGroup = async (data) => {
    try {
        const resp = await dao.deleteFromGroup(data);
        if (resp) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Field info deleted successfully',
                response: null
            }
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}

module.exports.deleteDraftProject = async (data) => {
    try {
        const resp = await dao.deleteDraftProject(data.projectid);
        if (resp) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Project deleted successfully',
                response: null
            }
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}

async function sendProjectInfoToCRM(projectid, userid) {
    try {
        const projectInf = await dao.getProjectDtlForCRM(projectid);
        const promoterDtl = await dao.getUserNameById(userid);
        const projectAddress = await dao.getProjectAddress(projectid);
        const params = {
            Project_Name: projectInf ? projectInf.projectName : '',
            Project_Reg_No: projectInf ? projectInf.projectuid : '',
            Project_RERA_Address: projectAddress ? projectAddress.projectfieldvalue : '',
            promotor_name: promoterDtl ? promoterDtl.username : '',
            Project_registration_Status: 'Under Scrutiny'
        };
        console.log("project submit params >>> ", params);
        await axios.post(config.PROJECT_REG_API, JSON.stringify(params), {
            headers: {
                'content-type': 'application/json',
                'UserAgent': "Mozilla/4.0 (compatible; MSIE 5.0; Windows 98; DigExt)"
            }
        })
            .then((res) => {
                util.createLog(res.data);
            }).catch((err) => {
                util.createLog(err);
            });
    } catch (e) {
        util.createLog(e)
    }
}

module.exports.submitForm = async (data) => {
    try {
        const uniqueFieldValue = await dao.getProjectUniqueFieldValue(data.projectid);
        if (uniqueFieldValue) {
            const currentDate = util.getCurrentTime(0);
            const projectHdrUpdateRes = await dao.updateProjectUniqueFieldValue(uniqueFieldValue.fieldvalue, uniqueFieldValue.fieldid, data.projectid, currentDate);
        }
        const tempFields = await dao.getProjectFieldValue(data.projectid);
        if (tempFields.length > 0) {
            const resp = await dao.insertIntoProjectDtl(tempFields, data.reraid, data.entityid, data.entitytypeid, data.projectid, data.userid)
            const delRes = await dao.deleteFromTempByProjectId(data.projectid);
        }
        const latRes = await insertLatLong(data.projectid);
        const userContactDtl = await common.getMobileEmailByUserId(data.userid);
        const projectDtl = await common.getProjectShortDtl(data.projectid);
        if (userContactDtl) {
            const smsGov = new SMSmgov();
            const message = util.generateSMSTemplate('newProjectSubmit', userContactDtl.userno, projectDtl.projectuid, '', '')
            const smsResp = await smsGov.sendOTPsms(message, userContactDtl.usermobile);
            const sendMailRes = await util.sendMail({
                subject: 'Project Submission',
                toemail: userContactDtl.useremail,
                message: message
            });
            const notiRest = await notificationDao.saveNotification({
                userid: data.userid,
                projectid: data.projectid,
                ntype: 'newProjectSubmit',
                content: message.split('|')[0],
                sendby: null
            })
        }
        common.insertProjectStatusLog({
            projectid: data.projectid,
            userid: data.userid,
            reraid: data.reraid,
            status: 'scrutiny'
        });
        sendProjectInfoToCRM(data.projectid, data.userid);
        return {
            success: true,
            status: util.statusCode.SUCCESS,
            message: 'Project submitted successfully',
            response: null
        }
    } catch (e) {
        util.createLog(e);
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}

async function insertLatLong(projectId) {
    try {
        const result = await dao.getLatLongByProjectId(projectId);
        if (result.length === 2) {
            const res = await dao.insertLatLongByProjectId(projectId, result);
        }
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getProjectList = async (data) => {
    try {
        const headList = await dao.getProjectListTableHead();
        const headGroup = await groupBy(headList, 'fielddisplaydesc');
        const projectList = await dao.getProjectList(data);
        if (projectList.length > 0) {
            let i = 0;
            for (const obj of projectList) {
                const fieldList = await dao.getValuesForList(obj.id, obj.iscomplete);
                obj.fieldList = await groupBy(fieldList, 'fielddisplaydesc');
                if (projectList.length === (i + 1)) {
                    return {
                        success: true,
                        status: util.statusCode.SUCCESS,
                        message: '',
                        response: await util.encryptResponse({head: Object.keys(headGroup), list: projectList})
                    }
                }
                i++;
            }
        } else {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse({
                    head: Object.keys(headGroup, 'fielddisplaydesc'),
                    list: projectList
                })
            }
        }
    } catch (e) {
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}

function generateCertificate(data) {
    return new Promise((resolve, reject) => {
        try {
            const htmlString = fs.readFileSync(config.FILEOPPATH + "template/registrationCertificate.ejs").toString();
            let options = {
                format: 'A3', orientation: "portrait", childProcessOptions: {
                    env: {
                        OPENSSL_CONF: '/dev/null',
                    },
                }
            };
            const ejsData = ejs.render(htmlString, data);
            const timestamp = new Date().getTime();
            pdf.create(ejsData, options).toFile(config.FILEOPPATH + 'certificate/Registration_Certificate_' + timestamp + '.pdf', async (err1, response1) => {
                if (err1) return console.log(err1);
                resolve({filename: 'Registration_Certificate_' + timestamp + '.pdf'})
            });
        } catch (e) {
            reject({success: false})
        }
    })
}

module.exports.getRegistrationCertificate = async (data) => {
    try {
        if (data.promoterid) {
            data.userid = data.promoterid;
        }
        const certificateFile = await dao.getGeneratedCertificate(data.projectid);
        if (certificateFile) {
            console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< certificate found >>>>>>>>>>>>>>>>>>>>>>>>>>>>')
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Project submitted successfully',
                response: await util.encryptResponse({fileName: certificateFile})
            }
        } else {
            console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< certificate not found >>>>>>>>>>>>>>>>>>>>>>>>>>>>')
            const projectRegNumber = await dao.getRegistrationNumber(data.projectid);
            const validityStartDate = await util.getCurrentTime(0);
            const validityEndDate = await util.getNextDate(5);
            const templateData = {
                REGISTRATION_NUMBER: projectRegNumber.toUpperCase(),
                VALIDATION_YEAR: 5,
                VALIDATION_START_DATE: validityStartDate,
                VALIDATION_END_DATE: validityEndDate,
                userid: data.userid
            };
            const uniqueFieldValue = await dao.getRegistrationCertificateFields(data);
            if (uniqueFieldValue.length > 0) {
                let i = 0;
                for (const obj of uniqueFieldValue) {
                    let fieldDtl = {};
                    if (obj.fromwhich === 2) {
                        fieldDtl = await dao.getProfileFieldValueById(data.userid, obj.fieldid);
                    } else {
                    }
                    util.createLog(fieldDtl);
                    if (fieldDtl) {
                    } else {
                        fieldDtl = await dao.getProfileFieldDtlById(obj.fieldid)
                    }
                    templateData[fieldDtl.fielddesc] = fieldDtl.fieldvalue;
                    if (i === (uniqueFieldValue.length - 1)) {
                        const certRes = await generateCertificate(templateData);
                        if (data.fromchecklist !== undefined) {
                            const userEmail = await userdao.getUserEmail(data.userid);
                            if (userEmail) {
                                const sendMailRes = await util.sendMail({
                                    subject: 'Project Approval Notification',
                                    toemail: userEmail,
                                    message: 'Your project has been approved. You can download the certificate from portal.'
                                });
                                util.createLog('User email response >> ' + sendMailRes);
                            }
                        }
                        const uRes = await dao.uploadRegistrationCertificate({
                            startDate: validityStartDate,
                            endDate: validityEndDate,
                            certificate: certRes.filename,
                            projectid: data.projectid
                        });
                        return {
                            success: true,
                            status: util.statusCode.SUCCESS,
                            message: 'Project submitted successfully',
                            response: await util.encryptResponse({fileName: certRes.filename})
                        }
                    }
                    i++;
                }
            } else {
                return {
                    success: true,
                    status: util.statusCode.SUCCESS,
                    message: 'Project submitted successfully',
                    response: await util.encryptResponse(templateData)
                }
            }
        }
    } catch (e) {
        const log = util.createLog(e);
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
};

async function updateProjectStatusToCRM(projectid, status) {
    try {
        const projectInf = await dao.getProjectDtlForCRM(projectid);
        const params = {
            Project_Name: projectInf ? projectInf.projectName : '',
            Project_Reg_No: projectInf ? projectInf.projectuid : '',
            Project_RERA_Address: '',
            promotor_name: '',
            Project_registration_Status: status
        };
        console.log("project submit params >>> ", params);
        await axios.post(config.PROJECT_STATUS_UPDATE_API, JSON.stringify(params), {
            headers: {
                'content-type': 'application/json',
                'UserAgent': "Mozilla/4.0 (compatible; MSIE 5.0; Windows 98; DigExt)"
            }
        })
            .then((res) => {
                util.createLog(res.data);
            }).catch((err) => {
                util.createLog(err);
            });
    } catch (e) {
        util.createLog(e)
    }
}

module.exports.updateApprovalComments = async (data) => {
    try {
        data.approvetime = util.getCurrentTime(1);
        if (data.regno === undefined || data.regno === '') {
            data.regno = null;
        }
        const result = await dao.updateApprovalComments(data);
        if (data.promoterid !== undefined) {
            let projectname = '';
            const projects = await dao.getProjectUID(data.projectid);
            if (projects.length > 0) {
                projectname = projects[0].projectfieldvalue
            }
            let subject = 'Rejected -' + projectname;
            let message = '';
            if (data.type !== 1) {
                const userContactDtl = await common.getMobileEmailByUserId(data.promoterid);
                const projectDtl = await common.getProjectShortDtl(data.projectid);
                if (data.isapproved == 3) {
                    common.insertProjectStatusLog({
                        projectid: data.projectid,
                        userid: data.userid,
                        reraid: data.reraid,
                        status: 'approve'
                    });
                    updateProjectStatusToCRM(data.projectid, 'Approved');
                    subject = 'Approved - ' + projectname;
                    message = 'Project No. ' + projectname + ' is approved. To download the registration certificate visit to the portal.';
                    if (userContactDtl) {
                        const smsGov = new SMSmgov();
                        const message = util.generateSMSTemplate('projectApproval', userContactDtl.userno, projectDtl.projectuid, '', '')
                        const smsResp = await smsGov.sendOTPsms(message, userContactDtl.usermobile);
                        const notiRest = await notificationDao.saveNotification({
                            userid: data.userid,
                            projectid: data.projectid,
                            ntype: 'projectApproval',
                            content: message.split('|')[0],
                            sendby: null
                        });
                    }
                } else {
                    common.insertProjectStatusLog({
                        projectid: data.projectid,
                        userid: data.userid,
                        reraid: data.reraid,
                        status: 'reject'
                    });
                    updateProjectStatusToCRM(data.projectid, 'Rejected');
                    message = 'Project No. ' + projectname + ' is rejected. For more details, please visit to the portal.';
                    if (userContactDtl) {
                        const smsGov = new SMSmgov();
                        const message = util.generateSMSTemplate('projectReject', userContactDtl.userno, projectDtl.projectuid, '', '')
                        const smsResp = await smsGov.sendOTPsms(message, userContactDtl.usermobile);
                        const notiRest = await notificationDao.saveNotification({
                            userid: data.userid,
                            projectid: data.projectid,
                            ntype: 'projectReject',
                            content: message.split('|')[0],
                            sendby: null
                        });
                    }
                }
                const userEmail = await userdao.getUserEmail(data.promoterid);
                util.createLog(" userEmail >>>>>>>>>>>>> " + userEmail);
                if (userEmail) {
                    const sendMailRes = await util.sendMail({
                        subject: subject,
                        toemail: userEmail,
                        message: message
                    });
                    util.createLog('User email response >> ' + sendMailRes);
                }
            }
        }
        if (result) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Comment saved successfully',
                response: null
            }
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        const log = util.createLog(e);
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
};

module.exports.isChairmanApprove = async (data) => {
    try {
        const result = await dao.isChairmanApprove(data);
        if (result) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(result)
            }
        } else {
            return {success: true, status: util.statusCode.INTERNAL, message: '', response: null}
        }
    } catch (e) {
        const log = util.createLog(e);
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
};

module.exports.getProjectDashboardData = async (data) => {
    try {
        let notificationCount = 0;
        const totalProjectCount = await dao.getCountOfTotalProject(data);
        const totalWorkflowProjectCount = await dao.getCountOfTotalProjectInWorkflow(data);
        const countOfTotalProjectStageTwo = await dao.getCountOfTotalProjectStageTwo(data);
        const countOfTotalProjectQPR = await dao.getCountOfTotalProjectStageQPR(data);
        const getCountOfTotalRegisteredProjects = await dao.getCountOfTotalRegisteredProjects(data);
        const getCountOfTotalRegistrationApplications = await dao.getCountOfTotalRegistrationApplications(data);
        const extensionCount = await alertDao.getProjectCountForExtension({userid: data.userid, reraid: data.reraid});
        const updateCount = await alertDao.getProjectCountForUpdateDetails({userid: data.userid, reraid: data.reraid});
        if (extensionCount && updateCount) {
            notificationCount = extensionCount + updateCount
        }
        return {
            success: true,
            status: util.statusCode.SUCCESS,
            message: '',
            response: await util.encryptResponse({
                totalProjectCount: totalProjectCount,
                totalWorkflowProjectCount: totalWorkflowProjectCount,
                countOfTotalProjectStageTwo: countOfTotalProjectStageTwo,
                getCountOfTotalRegisteredProjects: getCountOfTotalRegisteredProjects,
                getCountOfTotalRegistrationApplications: getCountOfTotalRegistrationApplications,
                countOfTotalProjectQPR: countOfTotalProjectQPR,
                notificationCount: notificationCount
            })
        }
    } catch (e) {
        const log = util.createLog(e);
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
};


module.exports.addAllFieldDetails = async (data) => {
    try {
        let getValues;
        if (data.obj.fieldgroupid !== undefined) {
            getValues = await generateAllFieldValues(data.stepid, data.obj.fielddetails, data.projectid, data.groupid, data.obj.fieldgroupid, data.obj.fielddetailskeys, data.groupposition);
        } else {
            getValues = await generateAllFieldValues(data.stepid, data.obj.fielddetails, data.projectid, data.groupid, null, data.obj.fielddetailskeys, data.groupposition, 1);
        }
        if (getValues) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(getValues)
            }
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
};


const generateAllFieldValues = async (stepId, fielddata, projectId, groupId, fieldGroupId, keys, groupPos, isgorup = 0) => {
    try {
        if (keys.length > 0) {
            let respArray = [];
            groupPos == '' ? 0 : groupPos;
            if (Array.isArray(fielddata)) {
                for (let i = 0; i < keys.length; i++) {
                    for (let keyVal of keys[i]) {
                        if (fielddata[i] !== undefined) {
                            if (fielddata[i][keyVal][0].fieldgroupid == null) {
                                const data1 = {
                                    projectid: projectId,
                                    groupid: groupId,
                                    stepid: stepId,
                                    fieldid: fielddata[i][keyVal][0].fieldid,
                                    fieldgroupid: fieldGroupId,
                                    fieldvalue: fielddata[i][keyVal][0].fieldvalue,
                                    pos: isgorup == 0 ? groupPos : i,
                                    fieldGroupPos: isgorup == 0 ? i : -1
                                };
                                const resp = await dao.storeFieldInfoIntoTemp(data1, 'all');
                                if (resp) {
                                    respArray.push(resp);
                                }
                            } else {
                                const gResD = await generateAllFieldValues(stepId, fielddata[i][keyVal][0].fielddetails, projectId, groupId, fielddata[i][keyVal][0].fieldgroupid, fielddata[i][keyVal][0].fielddetailskeys, i);
                                fielddata[i][keyVal][0].fielddetails = gResD.field;
                                fielddata[i][keyVal][0].fielddetailskeys = gResD.key;
                            }
                        }
                    }
                }
            } else {
                for (const row of fielddata['keys']) {
                    for (const d1 of fielddata.details[row]) {
                        const data1 = {
                            projectid: projectId,
                            groupid: groupId,
                            stepid: stepId,
                            fieldid: d1.fieldid,
                            fieldgroupid: fieldGroupId,
                            fieldvalue: d1.fieldvalue,
                            pos: groupPos,
                            fieldGroupPos: 0
                        };
                        const resp = await dao.storeFieldInfoIntoTemp(data1, 'all');
                        if (resp) {
                            respArray.push(resp);
                        }
                    }
                }
            }
            if (respArray.length > 0) {
                return respArray;
            } else {
                return null;
            }
        } else {
            return null;
        }
    } catch (e) {
        util.createLog(e);
        return null;
    }
};


module.exports.getState = async (data) => {
    try {
        const result = await dao.getFieldState(data);
        if (result) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(result)
            }
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}

module.exports.getDistricts = async (data) => {
    try {
        const result = await dao.getDistricts(data);
        if (result) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(result)
            }
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}

module.exports.isPaymentComplete = async (data) => {
    try {
        const isComplete = await dao.isPaymentComplete(data.projectid);
        if (isComplete) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: null
            }
        } else {
            return {
                success: false,
                status: util.statusCode.PAYMENT_NOT_DONE,
                message: 'Payment not completed',
                response: null
            }
        }
    } catch (e) {
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}

module.exports.uploadSignature = async (data) => {
    try {
        const isComplete = await dao.uploadSignature(data);
        if (isComplete) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(data)
            }
        } else {
            return {
                success: false,
                status: util.statusCode.INTERNAL,
                message: 'Internal Server error',
                response: null
            }
        }
    } catch (e) {
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}

module.exports.fetchUpdateProjectDetailsForUser = async (data) => {
    try {
        const headList = await dao.getProjectListTableHead();
        const headGroup = await groupBy(headList, 'fielddisplaydesc');
        if (data.flag === undefined || data.flag === null || data.flag === '') {
            data.flag = 0;
        }
        const projectList = await dao.fetchUpdateProjectDetailsForUser(data);
        if (projectList.length > 0) {
            let i = 0;
            for (const obj of projectList) {
                const fieldList = await dao.getValuesForList(obj.id, obj.iscomplete);
                obj.fieldList = await groupBy(fieldList, 'fielddisplaydesc');
                if (projectList.length === (i + 1)) {
                    return {
                        success: true,
                        status: util.statusCode.SUCCESS,
                        message: '',
                        response: await util.encryptResponse({head: Object.keys(headGroup), list: projectList})
                    }
                }
                i++;
            }
        } else {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse({
                    head: Object.keys(headGroup, 'fielddisplaydesc'),
                    list: projectList
                })
            }
        }
    } catch (e) {
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
};

module.exports.getFinancialYearList = async (data) => {
    try {
        const createdDate = await dao.getProjectCreatedDate(data.projectid);
        if (createdDate) {
            const yearList = [];
            let today = new Date(createdDate);
            for (let i = 1; i <= 3; i++) {
                today.setFullYear(today.getFullYear() - 1);
                if ((today.getMonth() + 1) <= 3) {
                    yearList.push((today.getFullYear() - 1) + "-" + today.getFullYear())
                } else {
                    yearList.push(today.getFullYear() + "-" + (today.getFullYear() + 1))
                }
            }
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse({dateList: yearList})
            }
        } else {
            return {
                success: false,
                status: util.statusCode.INTERNAL,
                message: 'Internal server error',
                response: null
            }
        }

    } catch (e) {
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
};


function generateCertificate_v2(data, type = 'A') {
    return new Promise((resolve, reject) => {
        try {
            let htmlString = '';
            let fileName = '';
            if (type === 'A') {
                fileName = 'Registration_Certificate_';
                htmlString = fs.readFileSync(config.FILEOPPATH + "template/registrationCertificate_v2.ejs").toString();
            } else {
                fileName = 'Rejection_Certificate_';
                htmlString = fs.readFileSync(config.FILEOPPATH + "template/rejectionCertificate.ejs").toString();
            }
            let options = {
                format: 'A3', orientation: "portrait", childProcessOptions: {
                    env: {
                        OPENSSL_CONF: '/dev/null',
                    },
                }
            };
            const ejsData = ejs.render(htmlString, data);
            const timestamp = new Date().getTime();
            pdf.create(ejsData, options).toFile(config.FILEOPPATH + 'certificate/' + fileName + timestamp + '.pdf', async (err1, response1) => {
                if (err1) return console.log(err1);
                resolve({success: true, filename: fileName + timestamp + '.pdf', content: await util.parseHtml(ejsData)})
            });
        } catch (e) {
            console.log(e)
            reject({success: false})
        }
    })
}

function generateCertificateFromContent(content) {
    return new Promise((resolve, reject) => {
        try {
            let options = {
                format: 'A3', orientation: "portrait", childProcessOptions: {
                    env: {
                        OPENSSL_CONF: '/dev/null',
                    },
                }
            };
            const timestamp = new Date().getTime();
            // console.log(content)
            pdf.create(content, options).toFile(config.FILEOPPATH + 'certificate/Registration_Certificate_' + timestamp + '.pdf', async (err1, response1) => {
                if (err1) return console.log(err1);
                resolve({success: true, filename: 'Registration_Certificate_' + timestamp + '.pdf'})
            });
        } catch (e) {
            console.log(e)
            reject({success: false})
        }
    })
}

module.exports.getRegistrationCertificate_v2 = async (data) => {
    try {
        if (data.promoterid) {
            data.userid = data.promoterid;
        }
        // const certificateFile = await dao.checkCertificateContent(data.projectid);
        const certificateFile = false;
        if (certificateFile) {
            console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< certificate found >>>>>>>>>>>>>>>>>>>>>>>>>>>>')
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Project submitted successfully',
                response: await util.encryptResponse({fileName: certificateFile})
            }
        } else {
            let templateData = {}
            let validityStartDate = await util.getCurrentTime(0);
            let validityEndDate = await util.getNextDate(5);
            console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< certificate not found >>>>>>>>>>>>>>>>>>>>>>>>>>>>')
            if (data.type === 'A') {
                const projectRegNumber = await dao.getRegistrationNumber(data.projectid);
                templateData = {
                    REGISTRATION_NUMBER: projectRegNumber.toUpperCase(),
                    VALIDATION_YEAR: 5,
                    VALIDATION_START_DATE: validityStartDate,
                    VALIDATION_END_DATE: validityEndDate,
                    userid: data.userid,
                    Company_Name: '',
                    Registered_Office_Address_Line_one: '',
                    Tehsil: '',
                    Mauja: '',
                    Thana: ''
                };
                const projectFieldValue = await dao.getRegistrationCertificateProjectFields(data);
                const profileFieldValue = await dao.getRegistrationCertificateProfileFields(data);
                if (projectFieldValue.length > 0 && profileFieldValue.length > 0) {
                    for (const obj of projectFieldValue) {
                        templateData[obj.fielddesc] = obj.projectfieldvalue;
                    }
                    for (const obj of profileFieldValue) {
                        templateData['P_' + obj.fielddesc] = obj.fieldvalue;
                    }
                } else {
                    return {
                        success: false,
                        status: util.statusCode.SOME_ERROR_OCCURRED,
                        message: 'Some error occurred',
                        response: await util.encryptResponse(templateData)
                    }
                }
            } else {
                validityStartDate = null;
                validityEndDate = null;
                const details = await dao.getDetailsForApplRej({projectid: data.projectid});
                if (details) {
                    templateData = {
                        projectName: details.projectName,
                        projectuid: details.projectuid,
                        username: details.username,
                        HEADING: util.REJECTION_PROJECT_HEADING,
                        CONTENT: util.REJECTION_PROJECT_BODY,
                        CurrentDate: await util.getCurrentTime(0),
                        reason: data.reason
                    };
                }
            }
            const certRes = await generateCertificate_v2(templateData, data.type);
            if (data.fromchecklist !== undefined) {
                const userEmail = await userdao.getUserEmail(data.userid);
                if (userEmail) {
                    const sendMailRes = await util.sendMail({
                        subject: 'Project Approval Notification',
                        toemail: userEmail,
                        message: 'Your project has been approved. You can download the certificate from portal.'
                    });
                    util.createLog('User email response >> ' + sendMailRes);
                }
            }
            const uRes = await dao.uploadRegistrationCertificate({
                startDate: validityStartDate,
                endDate: validityEndDate,
                certificate: certRes.filename,
                projectid: data.projectid,
            });
            const contentSaveRes = await dao.insertCertificateContent(data.projectid, data.userid, certRes.filename, certRes.content, validityStartDate, validityEndDate);
            const resp = {
                fileName: certRes.filename,
                content: certRes.content
            }
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(resp)
            }

        }
    } catch (e) {
        const log = util.createLog(e);
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
};

module.exports.saveCertificateContent = async (data) => {
    try {
        data.content = await util.parseHtml(data.content);
        data.content = data.content.replaceAll('&lt;', '<');
        data.content = data.content.replaceAll('&gt;', '>');
        const certRes = await generateCertificateFromContent(data.content);
        if (certRes.success) {
            const updateRes = await dao.updateCertificateContent(data.projectid, certRes.filename, data.content);
            const uRes = await dao.uploadRegistrationCertificate({
                certificate: certRes.filename,
                projectid: data.projectid
            });
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse({filename: certRes.filename})
            }
        } else {
            return {
                success: false,
                status: util.statusCode.INTERNAL,
                message: 'Internal server error',
                response: null
            }
        }
    } catch (e) {
        const log = util.createLog(e);
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}

module.exports.getNewLunchedProjects = async (data) => {
    try {
        if (data.offset === '') {
            data.offset = 0
        }
        const result = await dao.getNewLunchedProjects(data);
        if (result) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(result)
            }
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}

module.exports.getProjectsStatusByApplicationNo = async (data) => {
    try {
        const result = await dao.getProjectsStatusByApplicationNo(data);
        if (result) {
            let status = '';
            if (result.iscomplete === 0) {
                status = 'Draft';
            } else if (result.iscomplete === 1 && (result.isapproved !== 3 && result.isapproved !== 4)) {
                status = 'Under Scrutiny';
            } else if (result.iscomplete === 1 && result.isapproved === 3) {
                status = 'Approved';
            } else if (result.iscomplete === 1 && result.isapproved === 4) {
                status = 'Rejected';
            }
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: status
            }
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: 'Details not found with the given application no.'}
        }
    } catch (e) {
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}


module.exports.getValuesForGroup = getValuesForGroup;
