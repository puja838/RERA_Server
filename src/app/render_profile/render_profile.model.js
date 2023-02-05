const dao = require('./render_profile.dao');
const businessunitdao = require('../mst_business_unit/mst_business_unit.dao');
const token = require('../../utility/token');
const util = require('../../utility/util');
const common = require('../services/common.service');
const SMSmgov = require('../../utility/smsmgov');
const notificationDao = require('../notification/notification.dao');
const workflowDao = require('../workflow/workflow.model');

const groupBy = (xs, key) => {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}

const getControlValueFromBusinessUnit = async (reraid, businessunittypeid) => {
    let controlValue = '';
    try {
        const result = await businessunitdao.getBusinessUnitByType({ reraid: reraid, businessunittypeid: businessunittypeid });
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

const getValuesForGroup = async (stepId, data, userId, groupId, fieldGroupId, keys, groupPosition = -1) => {
    try {
        const fieldDetails = [];
        const fieldKeys = [];
        let maxCount = await dao.getFieldsValueMaxCountByGroupId(stepId, groupId, userId, 1, fieldGroupId, groupPosition);
        if (maxCount === 0) {
            maxCount = await dao.getFieldsValueMaxCountByGroupId(stepId, groupId, userId, 0, fieldGroupId, groupPosition);
        }
        if (maxCount > 0) {
            for (let i = 0; i < maxCount; i++) {
                let pos = i;
                if (groupPosition !== -1) {
                    pos = groupPosition
                }
                let fieldValues = await dao.getFieldsValueByGroupIdFromDtl(stepId, groupId, userId, fieldGroupId, pos);
                if (fieldValues.length === 0) {
                    fieldValues = await dao.getFieldsValueByGroupId(stepId, groupId, userId, fieldGroupId, pos);
                }
                fieldValues = groupBy(fieldValues, 'fieldid');
                const resCopy = JSON.parse(JSON.stringify(data));
                for (const key of keys) {
                    if (resCopy[key][0].fieldgroupid == null) {
                        if (fieldValues[resCopy[key][0].fieldid]) {
                            resCopy[key][0].fieldvalue = fieldValues[resCopy[key][0].fieldid][0] === undefined ? '' : fieldValues[resCopy[key][0].fieldid][0].fieldvalue;
                            resCopy[key][0].isverified = fieldValues[resCopy[key][0].fieldid][0] === undefined ? '' : fieldValues[resCopy[key][0].fieldid][0].isverified;
                            if (fieldValues[resCopy[key][0].fieldid][i] !== undefined) {
                                resCopy[key][0].tempid = fieldValues[resCopy[key][0].fieldid][i].id;
                            }
                        }
                    } else {
                        const gResD = await getValuesForGroup(stepId, resCopy[key][0].fielddetails[0], userId, groupId, resCopy[key][0].fieldgroupid, resCopy[key][0].fielddetailskeys[0], i);
                        resCopy[key][0].fielddetails = gResD.field;
                        resCopy[key][0].fielddetailskeys = gResD.key;
                    }
                }
                fieldDetails.push(JSON.parse(JSON.stringify(resCopy)));
                fieldKeys.push(keys);
            }
        } else {
            fieldDetails.push(data);
            fieldKeys.push(keys);
        }
        return { field: fieldDetails, key: fieldKeys };
    } catch (e) {
        util.createLog(e);
        return { field: [], key: [] };
    }
};

const setFieldDetails = async (reraid, stepFieldList, userId, isComplete) => {
    let i = 0;
    for (const obj of stepFieldList) {
        if (obj.fieldid !== null) {
            obj.fielddetails = await dao.getFieldDetailsById(obj.fieldid);
            if (obj.fielddetails.busnessunittypeid !== null && obj.fielddetails.busnessunittypeid !== '') {
                obj.fielddetails.controlvalue = await getControlValueFromBusinessUnit(reraid, obj.fielddetails.busnessunittypeid)
            }
            if (userId !== 0) {
                let flag = 0;
                let dtlRes = await dao.getFieldValueById(userId, obj.fieldid, obj.stepid);
                if (dtlRes === null) {
                    flag = 1;
                    dtlRes = await dao.getFieldValueByIdFromDtl(userId, obj.fieldid, obj.stepid);
                }
                if (dtlRes) {
                    if (obj.fielddetails.controltype === 12) {
                        const valSplit = dtlRes.fieldvalue.split('|');
                        if (valSplit.length > 0) {
                            obj.fielddetails.fieldvalue = valSplit[0];
                            obj.fielddetails.fieldvalue1 = valSplit[1];
                        }
                    } else {
                        obj.fielddetails.fieldvalue = dtlRes.fieldvalue;
                    }
                    obj.fielddetails.isverified = dtlRes.isverified;
                    obj.tempid = flag === 0 ? dtlRes.id : null;
                } else {
                    if (obj.fielddetails.controltype === '12') {
                        obj.fielddetails.fieldvalue1 = '';
                    }
                    obj.fielddetails.isverified = 0;
                }
            }
        } else if (obj.groupid !== null) {
            let res = await dao.getFieldsByGroupId(obj.groupid);
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
                    // const resD = await getValuesForGroup(dRes, userId, obj.groupid, groupRes[key][0].fieldgroupid, groupRes[key][0].fielddetailskeys);
                    /*groupRes[key][0].fielddetails = resD.field;
                    groupRes[key][0].fielddetailskeys = resD.key;*/
                    groupRes[key][0].fielddetails = [dRes];
                    groupRes[key][0].fielddetailskeys = [groupRes[key][0].fielddetailskeys];
                    res[key] = groupRes[key];
                }
                const sortKey = [];
                for (const key of obj.fielddetailskeys) {
                    sortKey.push({ key: key, seq: res[key][0].sequence })
                }
                sortKey.sort((a, b) => {
                    return a.seq - b.seq;
                });
                obj.fielddetailskeys = [];
                sortKey.map((item) => {
                    obj.fielddetailskeys.push(item.key);
                })
            }
            const gResD = await getValuesForGroup(obj.stepid, res, userId, obj.groupid, 0, obj.fielddetailskeys);
            obj.fielddetails = gResD.field;
            obj.fielddetailskeys = gResD.key;
        }
        if (stepFieldList.length === (i + 1)) {
            return stepFieldList;
        }
        i++;
    }
}

module.exports.formInfo = async (data) => {
    try {
        let stepFieldList = await dao.getList(data);
        if (stepFieldList) {
            let isComplete = 0;
            if (data.iscomplete !== undefined && data.iscomplete !== '' && data.iscomplete !== 0) {
                isComplete = Number(data.iscomplete);
            }
            stepFieldList = await setFieldDetails(data.reraid, stepFieldList, data.userid, isComplete);
            stepFieldList.sort(function (a, b) { return a.stepsequenceno - b.stepsequenceno });
            let signatureresp = await dao.getSignature(data)
            const result = groupBy(stepFieldList, 'stepdesc');
            return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(result),signature: signatureresp[0].signature }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null,signature:null }
        }
    } catch (e) {
        console.log(e);
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null,signature:null }
    }
};

module.exports.storeFieldInfoIntoTemp = async (data) => {
    try {
        util.createLog(JSON.stringify(data));
        if (data.fieldtype === '5') {
            data.fieldvalue = data.fileName;
        }
        data.groupid = data.groupid === '' ? null : data.groupid;
        data.tempid = data.tempid === '' ? null : data.tempid;
        if (Number(data.pos) === -1) {
            data.pos = null;
        }
        if (Number(data.fieldGroupPos) === -1) {
            data.fieldGroupPos = null;
        }
        // util.createLog(JSON.stringify(resp));
        const resp = await dao.storeFieldInfoIntoTemp(data);
        util.createLog(JSON.stringify(resp));
        const validationResp = await dao.checkVerificationField(data);
        if (validationResp) {
            const params = {
                reraid: data.reraid,
                userid: data.userid,
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
        if (resp) {
            return { success: true, status: util.statusCode.SUCCESS, message: 'Field info updated successfully', response: await util.encryptResponse({ tempid: resp.id, value: resp.value }) }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

module.exports.deleteFromGroup = async (data) => {
    try {
        const resp = await dao.deleteFromGroup(data);
        if (resp) {
            return { success: true, status: util.statusCode.SUCCESS, message: 'Field info deleted successfully', response: null }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

module.exports.submitForm = async (data) => {
    try {
        const tempFields = await dao.getProfileFieldValue(data.userid);
        if (tempFields.length > 0) {
            const resp = await dao.insertIntoProfileDtl(tempFields, data.reraid, data.userid);
            const delRes = await dao.deleteTempDataForProfile(data.userid);
            const updateIsSubmittedValue = await dao.updateIsSubmittedField(data.reraid, data.userid);
            const userDtl = await common.getMobileEmailByUserId(data.userid);
            if (userDtl && data.entityid == 1) {
                const smsGov = new SMSmgov();
                const message = util.generateSMSTemplate('profileUpdate', userDtl.userno, '', '', '')
                const smsResp = await smsGov.sendOTPsms(message, userDtl.usermobile);
                console.log("\n smsResp  >>>>>>>>>>    ", smsResp);
                const sendMailRes = await util.sendMail({
                    subject: 'Profile Update Alert',
                    toemail: userDtl.useremail,
                    message: message
                });
                const notiRest = await notificationDao.saveNotification({
                    userid: data.userid,
                    projectid: null,
                    ntype: 'profileUpdate',
                    content: message.split('|')[0],
                    sendby: null
                });
            }
        }
        return { success: true, status: util.statusCode.SUCCESS, message: 'Profile updated successfully', response: null }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

module.exports.getFormSubmitInfo = async (data) => {
    try {
        const isSubmittedForm = await dao.getFormSubmitInfo(data);
        if (isSubmittedForm.length > 0) {
            return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(isSubmittedForm) }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
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

module.exports.renewalForm = async (data) => {
    try {
        const agentrenewalhdrresp = await dao.agentrenewalhdr(data);
        if (agentrenewalhdrresp != false) {
            const workflowData = {
                reraid: data.reraid,
                agentid: data.userid,
                agentrenewalid: agentrenewalhdrresp,
                fromstepid: -1,
                forwardflg: 1,
                userid: data.userid,
                workflowtype: 4
            }
            let resp = await workflowDao.moveWorkflow(workflowData)
            if (resp.success == true) {
                return { success: true, status: util.statusCode.SUCCESS, message: 'Profile updated successfully', response: null }
            } else {
                return {
                    success: false,
                    status: util.statusCode.INTERNAL,
                    message: 'Internal Server error',
                    response: null
                }
            }
        }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}