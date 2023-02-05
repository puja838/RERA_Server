const dao 			        =   require('./agent.dao');
const token 				=   require('../../utility/token');
const util 					=	require('../../utility/util');
const common                =   require('../services/common.service');
const SMSmgov               =   require('../../utility/smsmgov');


module.exports.getRegistrationCertificate_v2 = async (data) => {
    try {
        const certificateFile = await dao.checkCertificateContent(data.agentid);
        // const certificateFile = false;
        if (certificateFile) {
            console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< certificate found >>>>>>>>>>>>>>>>>>>>>>>>>>>>')
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse({fileName: certificateFile.certificate, content: certificateFile.crtcontent})
            }
        } else {
            let templateData = {};
            let validityStartDate = null;
            let validityEndDate = null;
            console.log('<<<<<<<<<<<<<<<<<<<<<<<<<<<<<< certificate not found >>>>>>>>>>>>>>>>>>>>>>>>>>>>');
            const userDtl = await dao.getAgentDetails(data.agentid);
            const cmpDtl = await getCompanyDetailsForCertificate({entitytypeid: data.entitytypeid, userid: data.agentid})
            if (data.type === 'A') {
                validityStartDate = await util.getCurrentTime(0);
                validityEndDate = await util.getNextDate(5);
                templateData = {
                    REGISTRATION_NUMBER: '',
                    VALIDATION_YEAR: 5,
                    VALIDATION_START_DATE: validityStartDate,
                    VALIDATION_END_DATE: validityEndDate,
                    userName: userDtl.username,
                    Company_Name: '',
                    Address: '',
                    District: '',
                    State: '',
                    Pincode: '',
                    ContactNo: '',
                    ...cmpDtl
                };
            } else {
                templateData = {
                    projectName: userDtl.username,
                    projectuid: userDtl.userno,
                    username: userDtl.username,
                    HEADING: util.REJECTION_AGENT_HEADING,
                    CONTENT: util.REJECTION_AGENT_BODY,
                    CurrentDate: await util.getCurrentTime(0),
                    reason: data.reason
                }
            }
            const crtType = data.type ==='A'? 'Agent' : data.type;
            const certRes = await common.generateCertificate_v2(templateData, crtType);
            /*if (data.fromchecklist !== undefined) {
                const userEmail = await userdao.getUserEmail(data.userid);
                if (userEmail) {
                    const sendMailRes = await util.sendMail({
                        subject: 'Project Approval Notification',
                        toemail: userEmail,
                        message: 'Your project has been approved. You can download the certificate from portal.'
                    });
                    util.createLog('User email response >> ' + sendMailRes);
                }
            }*/
            const uRes = await dao.updateRegistrationCertificate({
                startDate: validityStartDate,
                endDate: validityEndDate,
                certificate: certRes.filename,
                content: certRes.content,
                agentid: data.agentid,
                reraid: data.reraid
            });
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
        const certRes = await common.generateCertificateFromContent(data.content);
        if (certRes.success) {
            const updateRes = await dao.updateCertificateContent(data.agentid, certRes.filename, data.content);
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

module.exports.getDashboardData = async (data) => {
    try {
        const regDtl = await dao.getAgentRegDetails(data.userid);
        const queryCount = await dao.getAgentQueryCount(data);
        const renualCount = await dao.getAgentRenualCount(data);
        if (regDtl && (queryCount !== null) && (renualCount !== null)) {
            regDtl.queryCount = queryCount;
            regDtl.renualCount = renualCount;
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(regDtl)
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

module.exports.getDashboardAlert = async (data) => {
    try {
        const queryCount = await dao.getAgentQueryCount(data);
        const extensionList = await dao.getDashboardAlert(data);
        if (extensionList || (queryCount>0)) {
            const resultArr = [];
            for (const obj of extensionList) {
                const dayObj = util.diffDate(new Date(), new Date(obj.validityenddate));
                const remaining = dayObj.daysAll;
                obj.isDelay = remaining < 0;
                obj.remaining = Math.abs(remaining);
                obj.type = 'renual';
                let msg = util.alertMessage.RENUAL1 + obj.remaining + util.alertMessage.RENUAL2
                obj.content = msg;
                resultArr.push(obj);
            }
            if(queryCount>0){
                const obj ={}
                obj.type = 'query';
                obj.content = util.alertMessage.QUERY;
                resultArr.push(obj);
            }
            return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(resultArr)}
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

async function reArrangeDetailsFields(data, fieldList) {
    const newObj = {
        CMP_NAME: '',
        CMP_ADDRESS: '',
        CMP_STATE: '',
        CMP_DISTRICT: '',
        CMP_PIN: '',
    };
    for (const [index, fieldId] of fieldList.entries()) {
        for (const obj of data) {
            if (obj.fieldid == fieldId) {
                let key = '';
                if (index === 0) {
                    key = 'CMP_NAME';
                } else if (index === 1) {
                    key = 'CMP_ADDRESS';
                } else if (index === 2) {
                    key = 'CMP_STATE';
                } else if (index === 3) {
                    key = 'CMP_DISTRICT';
                } else if (index === 4) {
                    key = 'CMP_PIN';
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
        let details = [];
        if (data.entitytypeid === 2) {
            details = await dao.getCompanyDetails(data.userid, util.configFieldId.agentdtl.stepid, util.configFieldId.agentdtl.companyDtl);
            details = await reArrangeDetailsFields(details, util.configFieldId.agentdtl.companyDtl);
        } else if (data.entitytypeid === 3) {
            details = await dao.getCompanyDetails(data.userid, util.configFieldId.agentdtl.stepid, util.configFieldId.agentdtl.ProprietorshipFirm);
            details = await reArrangeDetailsFields(details, util.configFieldId.agentdtl.ProprietorshipFirm);
        } else if (data.entitytypeid === 4) {
            details = await dao.getCompanyDetails(data.userid, util.configFieldId.agentdtl.stepid, util.configFieldId.agentdtl.SocietyDtl);
            details = await reArrangeDetailsFields(details, util.configFieldId.agentdtl.SocietyDtl);
        } else if (data.entitytypeid === 5) {
            details = await dao.getCompanyDetails(data.userid, util.configFieldId.agentdtl.stepid, util.configFieldId.agentdtl.PartnershipFirm);
            details = await reArrangeDetailsFields(details, util.configFieldId.agentdtl.PartnershipFirm);
        } else if (data.entitytypeid === 1) {
            details = await dao.getCompanyDetails(data.userid, util.configFieldId.agentdtl.stepid, util.configFieldId.agentdtl.individualDtl);
            details = await reArrangeDetailsFields(details, util.configFieldId.agentdtl.individualDtl);
        }
        return details;
    } catch (e) {
        return false;
    }
}