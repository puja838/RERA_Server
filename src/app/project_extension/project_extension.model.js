const dao = require('./project_extension.dao');
const userdao = require('../mst_user/mst_user.dao');
const token = require('../../utility/token');
const util = require('../../utility/util');
const config = require('../../config');
const common = require('../services/common.service');
const SMSmgov = require('../../utility/smsmgov');
const executiondao = require('../project-execution/project_execution.dao');
const projectdao = require('../project/project.dao');
let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");
let fs = require("fs");

module.exports.getProjectListForExtension = async (data) => {
    try {
        const result = await dao.getProjectListForExtension(data);
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
        util.createLog(e);
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}
module.exports.getExtensionList = async (data) => {
    try {
        const result = await dao.getExtensionList(data);
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
        util.createLog(e);
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}

module.exports.generateProjectExtensionId = async (data) => {
    try {
        let result = {};
        if (data.extensionid === undefined || data.extensionid === '' || data.extensionid === null
            || data.extensionid === 0
            || data.extensionid === '0') {
            result = await dao.getExistingProjectExtensionId(data);
        } else {
            result = await dao.getDetailsByExtensionId(data);
        }
        const completedDate = await dao.getProjectCompletionDate(data.projectid);
        if (result) {
            if (result.length > 0) {
                if (!result[0].completiondate) {
                    result[0].completedDate = completedDate;
                }
                return {
                    success: true,
                    status: util.statusCode.SUCCESS,
                    message: '',
                    response: await util.encryptResponse(result[0])
                }
            } else {
                const extensionId = await dao.createProjectExtensionId(data);
                if (extensionId) {
                    return {
                        success: true,
                        status: util.statusCode.SUCCESS,
                        message: '',
                        response: await util.encryptResponse({
                            id: extensionId,
                            submitted: 0,
                            completiondate: completedDate,
                            type: 'C'
                        })
                    }
                } else {
                    return {
                        success: false,
                        status: util.statusCode.INTERNAL,
                        message: 'Internal server error',
                        response: null
                    }
                }
            }
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
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

module.exports.saveProjectExtensionInfo = async (data) => {
    try {
        const result = await dao.saveProjectExtensionInfo(data);
        if (result) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Information updated successfully',
                response: null
            }
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
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

module.exports.getDevelopmentPlan = async (data) => {
    try {
        let result;
        if (data.type === 'construct') {
            result = await dao.getConstructionProgressForExtension(data);
        } else if (data.type === 'amenity') {
            result = await dao.getAmenityProgressForExtension(data);
        }
        if (result.length > 0) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(result)
            }
        } else {
            const quarterresult = await executiondao.getQuarterIdByProject(data);
            if (!quarterresult) {
                return {
                    success: false,
                    status: util.statusCode.INTERNAL,
                    message: 'Internal server error',
                    response: null
                }
            } else {
                if (quarterresult.length > 0) {
                    let matched = false;
                    for (let i = 0; i < quarterresult.length; i++) {
                        // console.log(quarterresult[i].quarterid,data.quoterid)
                        if (quarterresult[i].quarterid === Number(data.quoterid)) {
                            matched = true;
                            break;
                        }
                    }
                    if (!matched) {
                        data.quoterid = quarterresult[0].quarterid;
                    }
                }
                try {
                    if (data.type === 'construct') {
                        result = await executiondao.getConstructionProgress(data);
                    } else if (data.type === 'amenity') {
                        result = await executiondao.getAmenityProgress(data);
                    }
                    if (!result) {
                        return {
                            success: false,
                            status: util.statusCode.INTERNAL,
                            message: 'Internal server error',
                            response: null
                        }
                    } else {
                        return {
                            success: true,
                            status: util.statusCode.SUCCESS,
                            message: '',
                            response: await util.encryptResponse(result)
                        }
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

module.exports.upsertDevelopmentPlan = async (data) => {
    try {
        let count = 0;
        if(data.progressData.length === 0) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Details updated successfully',
                response: null
            }
        } else {
            for (let i = 0; i < data.progressData.length; i++) {
                data.progressData[i].projectid = data.projectid;
                data.progressData[i].reraid = data.reraid;
                data.progressData[i].extensionid = data.extensionid;
                data.progressData[i].userid = data.userid;
                data.progressData[i].type = data.type;
                const dupresult = await dao.duplicateProgress(data.progressData[i]);
                if (dupresult) {
                    if (dupresult.length > 0) {
                        try {
                            const upresult = await dao.updateConstructionProgress(data.progressData[i], dupresult[0].id);
                            if (!upresult) {
                                count++;
                            }
                        } catch (e) {
                            count++;
                            util.createLog(e);
                        }
                    } else {
                        try {
                            const upresult = await dao.insertConstructionProgress(data.progressData[i]);
                            if (!upresult) {
                                count++;
                            }
                        } catch (e) {
                            count++;
                            util.createLog(e);

                        }
                    }

                } else {
                    count++;
                }
                if (i === (data.progressData.length - 1)) {
                    if (count === data.progressData.length) {
                        return {
                            success: false,
                            status: util.statusCode.INTERNAL,
                            message: 'Internal server error',
                            response: null
                        }
                    } else {
                        return {
                            success: true,
                            status: util.statusCode.SUCCESS,
                            message: 'Details updated successfully',
                            response: null
                        }
                    }
                }
            }
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

module.exports.getDocuments = async (data) => {
    try {
        const result = await dao.getExtensionDocumentData(data);
        const otherDocList = await dao.getOtherDocData(data);
        if (result && result.length > 0) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse({docList: result, otherDocList: otherDocList})
            }
        } else {
            const documentNames = await dao.getExtensionDocumentNames();
            if (documentNames && documentNames.length > 0) {
                for (const [index, obj] of documentNames.entries()) {
                    obj.issuingoffice = '';
                    obj.issuedate = '';
                    obj.validitydate = '';
                    obj.docfile = '';
                    if (obj.issueofficeid) {
                        obj.issuingoffice = await dao.getValueFromProject({
                            stepid: obj.stepid,
                            fieldid: obj.issueofficeid,
                            projectid: data.projectid
                        });
                    }
                    if (obj.issuedateid) {
                        obj.issuedate = await dao.getValueFromProject({
                            stepid: obj.stepid,
                            fieldid: obj.issuedateid,
                            projectid: data.projectid
                        });
                    }
                    if (obj.validitydateid) {
                        obj.validitydate = await dao.getValueFromProject({
                            stepid: obj.stepid,
                            fieldid: obj.validitydateid,
                            projectid: data.projectid
                        });
                    }
                    if (obj.docfileid) {
                        obj.docfile = await dao.getValueFromProject({
                            stepid: obj.stepid,
                            fieldid: obj.docfileid,
                            projectid: data.projectid
                        });
                    }
                    if (index === (documentNames.length - 1)) {
                        return {
                            success: true,
                            status: util.statusCode.SUCCESS,
                            message: '',
                            response: await util.encryptResponse({docList: documentNames, otherDocList: otherDocList})
                        }
                    }
                }
            } else {
                return {
                    success: false,
                    status: util.statusCode.INTERNAL,
                    message: 'Internal server error',
                    response: null
                }
            }
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

module.exports.upsertDocumentData = async (data) => {
    try {
        const upRes = await upsertOtherDocument(data);
        if (upRes) {
            for (const [index, obj] of data.docList.entries()) {
                if (obj.id) {
                    const upRes = await dao.updateDocData(obj);
                } else {
                    obj.projectid = data.projectid;
                    obj.userid = data.userid;
                    obj.extensionid = data.extensionid;
                    const insRes = await dao.insertDocData(obj);
                }
                if (index === (data.docList.length - 1)) {
                    return {
                        success: true,
                        status: util.statusCode.SUCCESS,
                        message: 'Document updated successfully',
                        response: null
                    }
                }
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
        util.createLog(e);
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
};

module.exports.deleteOtherDocData = async (data) => {
    try {
        const upRes = await dao.deleteOtherDocData(data);
        if (upRes) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Document deleted successfully',
                response: null
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
        util.createLog(e);
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
};

const upsertOtherDocument = async (data) => {
    try {
        if (data.otherDocList.length === 0) {
            return true;
        } else {
            for (const [index, obj] of data.otherDocList.entries()) {
                if (obj.documentid) {
                    const uRes = await dao.updateOtherDocData(obj);
                } else {
                    obj.extensionid = data.extensionid;
                    obj.projectid = data.projectid;
                    obj.userid = data.userid;
                    const iRes = await dao.insertOtherDocData(obj);
                }
                if (index === (data.otherDocList.length - 1)) {
                    return true;
                }
            }
        }
    } catch (e) {
        return false;
    }
};

module.exports.submitForExtension = async (data) => {
    try {
        const upRes = await dao.submitForExtension(data);
        if (upRes) {
            const checklistResp = await dao.insertIntoChecklist(data);
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Application submitted for extension successfully',
                response: null
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
        util.createLog(e);
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
};

async function reArrangeDetailsFields(data, fieldList) {
    const newObj = {
        CMP_NAME: '',
        CMP_ADDRESS: ''
    };
    for (const [index, fieldId] of fieldList.entries()) {
        for (const obj of data) {
            if (obj.fieldid == fieldId) {
                let key = '';
                if (index === 0) {
                    key = 'CMP_NAME';
                } else if (index === 1) {
                    key = 'CMP_ADDRESS';
                }
                newObj[key] = obj.fieldvalue;
                break;
            }
        }
        if (index === (fieldList.length - 1)) {
            return newObj;
        }
    }

}

const getCompanyDetailsForCertificate = async (data) => {
    try {
        let details = []
        if (data.entitytypeid === 2) {
            details = await dao.getCompanyDetails(data.userid, util.configFieldId.cmpdtlextension.stepid, util.configFieldId.cmpdtlextension.companyDtl);
            details = await reArrangeDetailsFields(details, util.configFieldId.cmpdtlextension.companyDtl);
        } else if (data.entitytypeid === 3) {
            details = await dao.getCompanyDetails(data.userid, util.configFieldId.cmpdtlextension.stepid, util.configFieldId.cmpdtlextension.ProprietorshipFirm);
            details = await reArrangeDetailsFields(details, util.configFieldId.cmpdtlextension.ProprietorshipFirm);
        } else if (data.entitytypeid === 4) {
            details = await dao.getCompanyDetails(data.userid, util.configFieldId.cmpdtlextension.stepid, util.configFieldId.cmpdtlextension.SocietyDtl);
            details = await reArrangeDetailsFields(details, util.configFieldId.cmpdtlextension.SocietyDtl);
        } else if (data.entitytypeid === 5) {
            details = await dao.getCompanyDetails(data.userid, util.configFieldId.cmpdtlextension.stepid, util.configFieldId.cmpdtlextension.PartnershipFirm);
            details = await reArrangeDetailsFields(details, util.configFieldId.cmpdtlextension.PartnershipFirm);
        } else if (data.entitytypeid === 6) {
            details = await dao.getCompanyDetails(data.userid, util.configFieldId.cmpdtlextension.stepid, util.configFieldId.cmpdtlextension.LiabilityDtl);
            details = await reArrangeDetailsFields(details, util.configFieldId.cmpdtlextension.LiabilityDtl);
        } else if (data.entitytypeid === 7) {
            details = await dao.getCompanyDetails(data.userid, util.configFieldId.cmpdtlextension.stepid, util.configFieldId.cmpdtlextension.TrustDtl);
            details = await reArrangeDetailsFields(details, util.configFieldId.cmpdtlextension.TrustDtl);
        } else if (data.entitytypeid === 8) {
            details = await dao.getCompanyDetails(data.userid, util.configFieldId.cmpdtlextension.stepid, util.configFieldId.cmpdtlextension.CooperativeDtl);
            details = await reArrangeDetailsFields(details, util.configFieldId.cmpdtlextension.CooperativeDtl);
        } else if (data.entitytypeid === 9) {
            details = await dao.getCompanyDetails(data.userid, util.configFieldId.cmpdtlextension.stepid, util.configFieldId.cmpdtlextension.ComponentDtl);
            details = await reArrangeDetailsFields(details, util.configFieldId.cmpdtlextension.ComponentDtl);
        }
        return details;
    } catch (e) {
        return false;
    }
}

function generateCertificate_v2(data, type) {
    return new Promise((resolve, reject) => {
        try {
            let htmlString = '';
            let fileName = '';
            if (type === 'A') {
                fileName = 'Extension_Certificate_';
                htmlString = fs.readFileSync(config.FILEOPPATH + "template/projectExtensionCertificate_v2.ejs").toString();
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
                resolve({success: true, filename: fileName + timestamp + '.pdf', content: ejsData})
            });
        } catch (e) {
            console.log(e)
            reject({success: false})
        }
    })
}

module.exports.getExtensionCertificate = async (data) => {
    try {
        if (data.promoterid) {
            data.userid = data.promoterid;
        }
        const certificateFile = await dao.checkCertificateContent(data.extensionid);
        let validityStartDate = null;
        let validityEndDate = null;
        // const certificateFile = false;
        if (certificateFile.certificate) {
            console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< certificate found >>>>>>>>>>>>>>>>>>>>>>>>>>>>')
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse({fileName: certificateFile.certificate, content: certificateFile.crtcontent})
            }
        } else {
            const entity = await dao.getEntityTypeByUserId(data.userid);
            let compDtl = {
                CMP_NAME: '',
                CMP_ADDRESS: ''
            };
            if (entity.entitytypeid !== 1) {
                compDtl = await getCompanyDetailsForCertificate({userid: data.userid, entitytypeid: entity.entitytypeid});
            }
            let templateData = {}
            let currentDate = await util.getCurrentTime(0);
            console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< certificate not found >>>>>>>>>>>>>>>>>>>>>>>>>>>>')
            if (data.type === 'A') {
                const extensionDtl = await dao.getExtensionDtlById(data.extensionid);
                const projectRegNumber = await dao.getRegistrationNumber(data.projectid);
                validityEndDate = extensionDtl.projectextexsionperiod;
                templateData = {
                    REGISTRATION_NUMBER: projectRegNumber,
                    validityDate: await util.getCurrentTime(0, extensionDtl.projectextexsionperiod),
                    VALIDATION_YEAR: await util.diffDate(new Date(extensionDtl.projectextexsionperiod),  new Date()),
                    currentDate: currentDate,
                    userid: data.userid,
                    Tehsil: '',
                    Mauja: '',
                    Thana: '',
                    SubDivision: '',
                    entitytypeid: entity.entitytypeid,
                    ...compDtl
                };
                const projectFieldValue = await projectdao.getRegistrationCertificateProjectFields(data);
                const profileFieldValue = await projectdao.getRegistrationCertificateProfileFields(data);
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
                        response: null
                    }
                }
                if (templateData['P_Gurdian_Name'] !== '') {
                    templateData['P_Gurdian_Name'] = templateData['P_Gurdian_Name'].split('|')[1]
                }
            } else {
                validityStartDate = null;
                validityEndDate = null;
                const details = await projectdao.getDetailsForApplRej({projectid: data.projectid});
                if (details) {
                    templateData = {
                        projectName: details.projectName,
                        projectuid: details.registrationno ? details.registrationno : '',
                        username: details.username,
                        HEADING: util.REJECTION_EXTENSION_HEADING,
                        CONTENT: util.REJECTION_EXTENSION_BODY,
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
                        subject: 'Project Extension Approval Notification',
                        toemail: userEmail,
                        message: 'Your project extension application has been approved. You can download the certificate from portal.'
                    });
                    util.createLog('User email response >> ' + sendMailRes);
                }
            }
            const uRes = await dao.updateExtensionCertificate({
                certificate: certRes.filename,
                extensionid: data.extensionid,
                content: certRes.content
            });
            if (data.type === 'A') {
                const uRes = await dao.updateProjectValidityEndDate({endDate: validityEndDate, projectid: data.projectid});
            }
            /*const contentSaveRes = await dao.insertCertificateContent(data.projectid, certRes.filename, certRes.content);*/
            const resp = {
                fileName: certRes.filename,
                content: certRes.content
            };
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
        const certRes = await common.generateCertificateFromContent(data.content, 'Extension_Certificate');
        if (certRes.success) {
            const uRes = await dao.updateExtensionCertificate({
                certificate: certRes.filename,
                extensionid: data.extensionid,
                content: data.content
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
