const dao = require('./workflow.dao');
// const token = require('../../utility/token');
const userdao = require('../mst_user/mst_user.dao');
const projdao = require('../project/project.dao')
const util = require('../../utility/util');
const common=require('../services/common.service')
const PROMOTER_STEP_SEQ = 10;
const config = require('../../config');

module.exports.moveWorkflow = async (data) => {
    try {
        /*if(!data.workflowtype){
            data.workflowtype=1
        }*/
        let resp = await dao.fetchWorkflowByreraid(data);
        if (resp) {
            if (resp.length > 0) {
                data.workflowid = resp[0].id;
                if (data.tostepid === undefined || data.tostepid == 0) {
                    let respto = await dao.fetchTostepId(data);
                    if (respto) {
                        if (respto.length > 0) {
                            data.tostepid = respto[0].tostepid;
                        } else {
                            return {
                                success: false,
                                status: util.statusCode.CUSTOM_ERROR,
                                message: 'Workflow next step is not defined',
                                response: null
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
                let resp1 = await dao.fetchTransitionId(data);
                if (resp1) {
                    if (resp1.length > 0) {
                        data.workflowstepsworksid = resp1[0].id;
                        // console.log('data.workflowstepsworksid->',data.workflowstepsworksid)
                        if (data.steproleid == 0 || data.steproleid == "" || data.steproleid === undefined) {
                            let userresp2 = await dao.fetchRoleUserInStep(data);
                            if (userresp2) {
                                // console.log("userresp2: "+JSON.stringify(userresp2))
                                if (userresp2.length > 0 && userresp2[0].roleid != 0 && userresp2[0].workflowuserid != 0) {
                                    data.roleid = userresp2[0].roleid;
                                    data.workflowuserid = userresp2[0].workflowuserid;
                                } else if (userresp2.length > 0 && userresp2[0].roleid == 0 && userresp2[0].workflowuserid == 0) {
                                    /**
                                     * Fetch userdetails for 'Go to Creator'
                                     * @type {boolean|undefined}
                                     */
                                    if (Number(data.workflowtype) === config.AGENT_TYPE) {
                                        let profileresp = await dao.getuserrole(data);
                                        if (profileresp) {
                                            if (profileresp.length > 0) {
                                                data.workflowuserid = data.agentid;
                                                data.roleid = profileresp[0].roleid
                                            } else {
                                                return {
                                                    success: false,
                                                    status: util.statusCode.CUSTOM_ERROR,
                                                    message: 'Agent user is not defined',
                                                    response: null
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
                                    } else {
                                        let profileresp = await dao.getparticularprofileid(data)
                                        if (profileresp) {
                                            if (profileresp.length > 0) {
                                                data.workflowuserid = profileresp[0].particularprofileid;
                                                data.roleid = profileresp[0].roleid
                                            } else {
                                                return {
                                                    success: false,
                                                    status: util.statusCode.CUSTOM_ERROR,
                                                    message: 'Workflow profile user is not defined',
                                                    response: null
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
                                } else if (userresp2.length > 0 && userresp2[0].roleid == 0 && userresp2[0].workflowuserid == -1) {
                                    let senderresp = await dao.getsenderdetails(data);
                                    if (senderresp) {
                                        if (senderresp.length > 1) {
                                            data.workflowuserid = senderresp[1].workflowuserid;
                                            data.roleid = senderresp[1].roleid;
                                        } else {
                                            return {
                                                success: false,
                                                status: util.statusCode.CUSTOM_ERROR,
                                                message: 'Sender details not found',
                                                response: null
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
                                } else {
                                    let resp2 = await dao.fetchRoleInStep(data);
                                    if (resp2) {
                                        if (resp2.length > 0) {
                                            data.roleid = resp2[0].roleid;
                                        } else {
                                            return {
                                                success: false,
                                                status: util.statusCode.CUSTOM_ERROR,
                                                message: 'Role and User is not mapped in this step',
                                                response: null
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
                            } else {
                                return {
                                    success: false,
                                    status: util.statusCode.INTERNAL,
                                    message: 'Internal server error',
                                    response: null
                                }
                            }
                        } else {
                            data.roleid = data.steproleid;
                            data.workflowuserid = data.stepuserid;
                        }
                        let resp3 = await dao.addWorkflowHistory(data);
                        if (resp3) {
                            let resp4 = await dao.fetchLatestStepByProject(data);
                            if (resp4) {
                                // console.log(JSON.stringify(data))
                                if (resp4.length > 0) {
                                    data.id = resp4[0].id;
                                    let resp6 = await dao.updateWorkflowLatest(data);
                                    if (!resp6) {
                                        return {
                                            success: false,
                                            status: util.statusCode.INTERNAL,
                                            message: 'Internal server error',
                                            response: null
                                        }
                                    }
                                } else {
                                    let resp5 = await dao.addWorkflowLatest(data)
                                    if (!resp5) {
                                        // await sendmail(data);
                                        return {
                                            success: false,
                                            status: util.statusCode.INTERNAL,
                                            message: 'Internal server error',
                                            response: null
                                        }
                                    }
                                }
                                await sendmail(data);
                                return {
                                    success: true,
                                    status: util.statusCode.SUCCESS,
                                    message: 'Step Change Successfully',
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

                        } else {
                            return {
                                success: false,
                                status: util.statusCode.INTERNAL,
                                message: 'Internal server error',
                                response: null
                            }
                        }
                    } else {
                        return {
                            success: false,
                            status: util.statusCode.CUSTOM_ERROR,
                            message: 'Workflow step not defined',
                            response: null
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
            } else {
                return {
                    success: false,
                    status: util.statusCode.CUSTOM_ERROR,
                    message: 'Workflow not found for this project',
                    response: null
                }
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

async function sendmail(data) {
    console.log(JSON.stringify(data))
    try {
        let resp7 = await dao.fetchStepSeqByStepid(data);
        if (resp7) {
            if (resp7.length > 0) {
                const seq = resp7[0].seqno;
                console.log("seq:", seq);
                if (seq === PROMOTER_STEP_SEQ) {
                    let projectname = ''
                    const projects = await projdao.getProjectUID(data.projectid);
                    if (projects.length > 0) {
                        projectname = projects[0].projectfieldvalue
                    }
                    const subject = 'Query - ' + projectname;
                    const userEmail = await userdao.getUserEmail(data.uniquepromoterid);
                    const message = 'Some queries are generated against your project: ' + projectname + '. To check the queries, please visit to the portal.';
                    util.createLog(" userEmail >>>>>>>>>>>>> " + userEmail);
                    if (userEmail) {
                        const sendMailRes = await util.sendMail({
                            subject: subject,
                            toemail: userEmail,
                            message: message
                        });
                        util.createLog('User email response >> ' + sendMailRes);
                    }
                    await common.sendSMS(data.userid,data.projectid,'query')

                }
            } else {
                util.createLog('STEP SEQ NOT FOUND')
            }
        }
    } catch (e) {
        console.log(e)
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }

}

module.exports.workflowStepUserQuery = async (data) => {
    try {
        let count = 0;
        let ids = [];
        // console.log(data)
        for (let i = 0; i < data.details.length; i++) {
            data.details[i].reraid = data.reraid;
            data.details[i].userid = data.userid;

            data.details[i].workflowstepsroleuserprojectid = data.workflowstepsroleuserprojectid;
            data.details[i].workflowtype = data.workflowtype;
            if (Number(data.workflowtype) === config.AGENT_TYPE) {
                data.details[i].agentid = data.agentid;
            } else {
                data.details[i].uniqueprojectid = data.uniqueprojectid;
                data.details[i].uniquepromoterid = data.uniquepromoterid;
                if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
                    data.details[i].extensionid = data.extensionid;
                }
            }
            let resp = await dao.workflowStepUserQuery(data.details[i]);
            if (resp) {
                count++;
                ids.push(resp)
                /*data.details[i].workflowstepsroleuserqueryid=resp;
                let resp1 = await dao.workflowStepQueryAttachment(data.details[i]);
                if (resp1) {
                    count++
                }*/
            }
        }
        if (count === data.details.length) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Query Added Successfully',
                response: await util.encryptResponse(ids)
            }
        } else {
            return {
                success: false,
                status: util.statusCode.CUSTOM_ERROR,
                message: 'All queries not added.Please try again later',
                response: null
            }
        }
    } catch (e) {
        console.log(e)
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}
module.exports.workflowStepResolvedQuery = async (data) => {
    try {
        let resp = await dao.workflowStepResolvedQuery(data);
        if (resp) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Query Resolved Successfully',
                response: await util.encryptResponse(resp)
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
module.exports.fetchUserFromStep = async (data) => {
    try {
        let resp = await dao.fetchUserFromStep(data);
        if (resp) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(resp)
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
module.exports.workflowStepQueryAnswer = async (data) => {
    try {
        let resp = await dao.workflowStepQueryAnswer(data);
        if (resp) {
            if (data.filepath && data.filepath !== '') {
                data.workflowstepsroleuserqueryanswerid = resp;
                let resp1 = await dao.workflowStepQueryAnswerAttachment(data);
                if (resp1) {
                    return {
                        success: true,
                        status: util.statusCode.SUCCESS,
                        message: 'Answer Added Successfully',
                        response: await util.encryptResponse(resp1)
                    }
                } else {
                    return {
                        success: false,
                        status: util.statusCode.INTERNAL,
                        message: 'Internal server error',
                        response: null
                    }
                }
            } else {
                return {
                    success: true,
                    status: util.statusCode.SUCCESS,
                    message: 'Answer Added Successfully',
                    response: await util.encryptResponse(resp)
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
};
module.exports.workflowStepQueryAnswerMultiple = async (data) => {
    try {
        let count = 0;
        for (let i = 0; i < data.response.length; i++) {
            data.response[i].reraid = data.reraid;

            data.response[i].workflowstepsroleuserprojectid = data.workflowstepsroleuserprojectid;
            data.response[i].workflowstepsroleuserqueryid = data.workflowstepsroleuserqueryid;
            data.response[i].userid = data.userid;
            data.response[i].workflowtype = data.workflowtype;
            if (Number(data.workflowtype) === config.AGENT_TYPE) {
                data.response[i].agentid = data.agentid;
            } else {
                data.response[i].uniqueprojectid = data.uniqueprojectid;
                data.response[i].uniquepromoterid = data.uniquepromoterid;
                if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
                    data.response[i].extensionid = data.extensionid;
                }
            }
            let resp = await dao.workflowStepQueryAnswer(data.response[i]);
            if (resp) {
                console.log(resp)
                if (data.response[i].filepath && data.response[i].filepath !== '') {
                    data.response[i].workflowstepsroleuserqueryanswerid = resp;
                    let resp1 = await dao.workflowStepQueryAnswerAttachment(data.response[i]);
                    if (resp1) {

                    } else {
                        count++;
                    }
                } else {

                }
            } else {
                count++;
            }
        }
        if (count === data.response.length) {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        } else {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Answer Added Successfully',
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

module.exports.workflowStepQueryComment = async (data) => {
    try {
        let resp = await dao.workflowStepQueryComment(data);
        if (resp) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Comment Added Successfully',
                response: await util.encryptResponse(resp)
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
module.exports.workflowStepAttachment = async (data) => {
    try {
        let resp = await dao.workflowStepAttachment(data);
        if (resp) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Attachment Added Successfully',
                response: await util.encryptResponse(resp)
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
module.exports.workflowStepChecklistComment = async (data) => {
    try {
        let count = 0;
        for (let i = 0; i < data.details.length; i++) {
            data.details[i].reraid = data.reraid;
            data.details[i].userid = data.userid;
            data.details[i].workflowstepsroleuserprojectid = data.workflowstepsroleuserprojectid;
            data.details[i].workflowtype = data.workflowtype;
            if (Number(data.workflowtype) === config.AGENT_TYPE) {
                data.details[i].agentid = data.agentid;
            } else {
                data.details[i].uniqueprojectid = data.uniqueprojectid;
                if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
                    data.details[i].extensionid = data.extensionid;
                }
            }
            let resp2 = await dao.deleteWorkflowStepChecklistComment(data.details[i]);
            if (resp2) {
                // console.log("-------deleted 1-------")
                let resp = await dao.workflowStepChecklistComment(data.details[i]);
                if (resp) {
                    // console.log("-------inserted 1-------")
                    count++
                    // let resp3 = await dao.deleteWorkflowStepAttachment(data.details[i]);
                    // if (resp3) {
                    //     // console.log("-------deleted 2-------")
                    //     data.details[i].workflowstepsroleuserchecklistconversationid = resp;
                    //     let resp1 = await dao.workflowStepAttachment(data.details[i]);
                    //     if (resp1) {
                    //         count++
                    //     }
                    // }
                } else {
                    // return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
                }
            }

        }
        if (count === data.details.length) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Comment Added Successfully',
                response: null
            }
        } else {
            return {
                success: false,
                status: util.statusCode.CUSTOM_ERROR,
                message: 'All checklist not added.Please try again later',
                response: null
            }
        }
        // let resp = await dao.workflowStepChecklistComment(data);

    } catch (e) {
        util.createLog(e)
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
};
module.exports.workflowStepChecklistPromoterComment = async (data) => {
    try {
        let resp = await dao.workflowStepChecklistPromoterComment(data);
        if (resp) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Comment Added Successfully',
                response: await util.encryptResponse(resp)
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
module.exports.workflowStepChecklistApprove = async (data) => {
    try {
        let resp = await dao.workflowStepChecklistApprove(data);
        if (resp) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Checklist Approved',
                response: await util.encryptResponse(resp)
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
module.exports.invalidateQuery = async (data) => {
    try {
        let resp = await dao.invalidateQuery(data);
        if (resp) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Operation Successful',
                response: await util.encryptResponse(resp)
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
module.exports.getProjectHistory = async (data) => {
    try {
        let resp = await dao.getProjectHistory(data);
        if (resp) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(resp)
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
module.exports.hasValidQuery = async (data) => {
    try {
        let resp = await dao.hasValidQuery(data);
        if (resp) {
            let hasValidQuery = false;
            if (resp.length > 0) {
                hasValidQuery = true;
            }
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse({hasValidQuery: hasValidQuery})
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
module.exports.fetchRoleUserInStep = async (data) => {
    try {
        let resp = await dao.fetchRoleUserInStep(data);
        if (resp) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(resp)
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
module.exports.changeUserInStep = async (data) => {
    try {
        let resp4 = await dao.fetchLatestStepByProject(data);
        if (resp4) {
            // console.log(JSON.stringify(data))
            if (resp4.length > 0) {
                resp4[0].roleid = data.steproleid;
                resp4[0].workflowuserid = data.stepuserid;
                resp4[0].userid = data.userid;
                let resp3 = await dao.addWorkflowHistory(resp4[0]);
                if (resp3) {
                    // data.id = resp4[0].id;
                    let resp6 = await dao.updateWorkflowLatest(resp4[0]);
                    if (!resp6) {
                        return {
                            success: false,
                            status: util.statusCode.INTERNAL,
                            message: 'Internal server error',
                            response: null
                        }
                    }
                    await sendmail(data);
                } else {
                    return {
                        success: false,
                        status: util.statusCode.INTERNAL,
                        message: 'Internal server error',
                        response: null
                    }
                }
            } else {
                return {
                    success: false,
                    status: util.statusCode.INTERNAL,
                    message: 'Workflow not created for this project',
                    response: null
                }
            }

            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Step Change Successfully',
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
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
};
module.exports.updateExtensionStatus = async (data) => {
    try {
        let resp = await dao.updateExtensionStatus(data);
        if (resp) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Comment Added Successfully',
                response: await util.encryptResponse(resp)
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
module.exports.updateAgentStatus = async (data) => {
    try {
        let resp = await dao.updateAgentStatus(data);
        if (resp) {
            let resp1 = await dao.updateAgentRegno(data);
            if (resp1) {
                return {
                    success: true,
                    status: util.statusCode.SUCCESS,
                    message: 'Comment Added Successfully',
                    response: await util.encryptResponse(resp1)
                }
            } else {
                return {
                    success: false,
                    status: util.statusCode.INTERNAL,
                    message: 'Internal server error',
                    response: null
                }
            }
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        util.createLog(e)
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
};

module.exports.workflowStepQueryAnswerComment = async (data) => {
    try {

        let resp1 = await dao.workflowStepQueryAnswerComment(data);
        if (resp1) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Comment Added Successfully',
                response: await util.encryptResponse(resp1)
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

