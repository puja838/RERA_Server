const dao = require('./projectlist.dao');
// const token = require('../../utility/token');
const util = require('../../utility/util');
const searchdao = require('../search/search.dao');

const PROJECT_INFORMATION_STEP_ID = 1;

const START_DATE_FIELD_ID = 496;
const PROJECT_TYPE_FIELD_ID = 1;
const PROJECT_ADDRESS_FIELD_ID = 387;
const PROJECT_STATUS_FIELD_ID = 502;
const config = require('../../config');
module.exports.fetchProjectDetailsForUser = async (data) => {
    try {
        // if (Number(data.status) === 0) {
        //     data.status = [0, 1, 2];
        // } else {
        //     data.status = [3];
        // }
        // console.log(JSON.stringify(data));
        let roleresp = await dao.getworkflowstepbyrole(data);
        if (!roleresp) {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
        let userresp = await dao.getworkflowstepbyuser(data);
        if (!userresp) {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
        for (let i = 0; i < userresp.length; i++) {
            roleresp.push(userresp[i])
        }
        return {
            success: true,
            status: util.statusCode.SUCCESS,
            message: '',
            response: await util.encryptResponse(roleresp)
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
module.exports.fetchProjectDetailsForUserCount = async (data) => {
    try {
        let roleresp = await dao.getworkflowstepbyrolecount(data);
        if (!roleresp) {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
        let userresp = await dao.getworkflowstepbyusercount(data);
        if (!userresp) {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
        let total = 0;
        // console.log(roleresp,userresp)
        total = total + roleresp[0].total + userresp[0].total;
        return {
            success: true,
            status: util.statusCode.SUCCESS,
            message: '',
            response: await util.encryptResponse({ total: total, type: data.type })
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

module.exports.fetchProjectRegisterDetails = async (data) => {
    try {
        let resp = await dao.fetchProjectRegisterDetails(data);
        let resp1 = await dao.fetchProjectRegisterCount(data)
        if (!resp) {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error',response: null }
        }
        // let userresp = await dao.getworkflowstepbyusercount(data);
        // if (!userresp) {
        //     return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        // }
        let total = 0;
        total = total + resp1[0].total
        return {
            success: true,
            status: util.statusCode.SUCCESS,
            message: '',
            response: await util.encryptResponse({resp, total: total,})
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

module.exports.fetchProjectRegisterCount = async (data) => {
    try {
        let resp = await dao.fetchProjectRegisterCount(data);
        if (!resp) {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
        // let userresp = await dao.getworkflowstepbyusercount(data);
        // if (!userresp) {
        //     return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        // }
        let total = 0;
        total = total + resp[0].total
        return {
            success: true,
            status: util.statusCode.SUCCESS,
            message: '',
            response: await util.encryptResponse({ total: total, type: data.type })
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

module.exports.fetchRevenue = async (data) => {
    try {
        let resp = await dao.fetchRevenue(data);
        if (!resp) {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
        // let userresp = await dao.getworkflowstepbyusercount(data);
        // if (!userresp) {
        //     return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        // }
        let total = 0;
        if (resp.length > 0) {
            for (let i = 0; i < resp.length; i++) {
                total = Number(total) + Number(resp[i].amount);
            }
        }
        total = total
        return {
            success: true,
            status: util.statusCode.SUCCESS,
            message: '',
            response: await util.encryptResponse({ total: total, type: data.type })
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


module.exports.fetchProjectDetailsbyisApprove = async (data) => {
    try {
        let roleresp = await dao.getworkflowstepbyisapprove(data);
        if (!roleresp) {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
        // let userresp = await dao.getworkflowstepbyisapproveuser(data);
        // if (!userresp) {
        //     return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        // }
        // for(let i=0;i<userresp.length;i++){
        //     roleresp.push(userresp[i])
        // }
        return {
            success: true,
            status: util.statusCode.SUCCESS,
            message: '',
            response: await util.encryptResponse(roleresp)
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
module.exports.fetchProjectDetailsById = async (data) => {
    try {
        let resp = [];
        if (Number(data.workflowtype) === config.AGENT_TYPE) {
            resp = await dao.fetchAgentDetailsById(data);
        } else {
            resp = await dao.fetchProjectDetailsById(data);
        }
        console.log(JSON.stringify(resp));
        if (resp) {
            if (data.projectid) {
                data.stepid = PROJECT_INFORMATION_STEP_ID;
                data.fieldid = [START_DATE_FIELD_ID, PROJECT_TYPE_FIELD_ID, PROJECT_ADDRESS_FIELD_ID, PROJECT_STATUS_FIELD_ID];
                const resp2 = await searchdao.fetchProjectValueDetails(data);
                if (resp2) {
                    for (let i = 0; i < resp2.length; i++) {
                        if (resp2[i].fieldid === START_DATE_FIELD_ID) {
                            resp[0].projectStartDate = resp2[i].projectfieldvalue;
                        } else if (resp2[i].fieldid === PROJECT_TYPE_FIELD_ID) {
                            resp[0].projectType = resp2[i].projectfieldvalue;
                        } else if (resp2[i].fieldid === PROJECT_ADDRESS_FIELD_ID) {
                            resp[0].address = resp2[i].projectfieldvalue;
                        } else if (resp2[i].fieldid === PROJECT_STATUS_FIELD_ID) {
                            resp[0].progressstatus = resp2[i].projectfieldvalue;
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
            let resp1 = await dao.fetchWorkflowHistoryId(data);
            if (resp1) {
                if (resp1.length > 0) {
                    resp[0].workflowhistoryid = resp1[0].id;
                    resp[0].tostepid = resp1[0].tostepid;
                    resp[0].workflowid = resp1[0].workflowid;
                    if (data.extensionid) {
                        resp[0].submitiontime = resp1[0].submitedtime
                        resp[0].certificate = resp1[0].certificate;
                    }
                }
                return {
                    success: true,
                    status: util.statusCode.SUCCESS,
                    message: '',
                    response: await util.encryptResponse(resp)
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
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
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
module.exports.fetchTabbyEntityType = async (data) => {
    try {
        let resp = await dao.fetchTabbyEntityType(data);
        if (resp) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(resp)
            }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
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
module.exports.fetchChecklistByTabExtension = async (data) => {
    try {
        let resp = [];
        if (data.tabid == 4) {
            resp = await dao.fetchDocumentTabGroupByTab(data);
        } else {
            resp = await dao.fetchApplicationTabGroupByTab(data);
        }
        if (resp) {
            // console.log("--1",JSON.stringify(resp));
            // let resp3 = await dao.fetchTabGroupByTab2(data);
            if (resp.length > 0) {
                const a = [];
                // console.log(JSON.stringify(resp))
                for (let i = 0; i < resp.length; i++) {
                    data.id = resp[i].id;
                    data.entitytypedtlid = resp[i].entitytypedtlid;
                    resp[i].systemcheckedresult = (resp[i].issystemverified === 1 ? 'Verified by system' : 'Not able to read');
                    // console.log(resp[i].issystemverified)
                    resp[i].systemchecked = (resp[i].issystemverified === 1 ? 'Yes' : 'No');
                    let resp1 = await dao.fetchChecklistValueNotCurrent(data);
                    if (resp1) {
                        // console.log("---->",JSON.stringify(resp1))
                        if (resp1.length > 0) {
                            resp[i].olddata = [];
                            for (let j = 0; j < resp1.length; j++) {
                                resp[i].olddata.push({
                                    "filepath": resp1[j].filepath,
                                    "filedesc": resp1[j].filedesc,
                                    "rolename": resp1[j].roledesc,
                                    "comment": resp1[j].comment,
                                    "checklistcommentchecked": (resp1[j].checklistcommentchecked === 1) ? 'Yes' : 'No'
                                })
                            }

                        } else {
                        }

                    } else {
                        return {
                            success: false,
                            status: util.statusCode.SOME_ERROR_OCCURRED,
                            message: 'Some error occurred',
                            response: null
                        }
                    }
                    let resp2 = await dao.fetchChecklistValueCurrent(data);
                    if (resp2) {
                        // console.log(JSON.stringify(resp2))
                        if (resp2.length > 0) {
                            // resp[i].olddata = [];
                            for (let j = 0; j < resp2.length; j++) {
                                resp[i].checkid = resp2[j].id;
                                resp[i].filepath = resp2[j].filepath;
                                resp[i].filedesc = resp2[j].filedesc;
                                // resp[i].systemchecked = (resp2[j].systemchecked === 1 ? 'YES' : 'No');
                                resp[i].comment = resp2[j].comment;
                                resp[i].checklistcommentchecked = resp2[j].checklistcommentchecked + '';
                            }
                            // resp[i].systemchecked = (resp[0].systemchecked === 1 ? 'YES' : 'No');
                        } else {
                            // resp[i].systemchecked = 'No';
                            resp[i].comment = "";
                            resp[i].checklistcommentchecked = '0';
                        }
                        // console.log(JSON.stringify(resp))

                    } else {
                        return {
                            success: false,
                            status: util.statusCode.SOME_ERROR_OCCURRED,
                            message: 'Some error occurred',
                            response: null
                        }
                    }
                }
                // console.log(JSON.stringify(resp))
                for (let i = 0; i < resp.length; i++) {
                    if (a.length === 0) {
                        a.push({ groupname: resp[i].groupname, details: [resp[i]] })
                    } else {
                        let matched = false;
                        for (let j = 0; j < a.length; j++) {
                            if (a[j].groupname === resp[i].groupname) {
                                a[j].details.push(resp[i]);
                                matched = true;
                                break;
                            }
                        }
                        if (!matched) {
                            a.push({ groupname: resp[i].groupname, details: [resp[i]], "isnested": false })
                        }
                    }
                }
                return {
                    success: true,
                    status: util.statusCode.SUCCESS,
                    message: '',
                    response: await util.encryptResponse(a)
                }
            } else {
                return {
                    success: false,
                    status: util.statusCode.INTERNAL,
                    message: 'No checklist mapped with this Project',
                    response: null
                }
            }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
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
};
module.exports.fetchChecklistByTab = async (data) => {
    try {
        let resp1 = [];
        if (Number(data.workflowtype) === config.REGISTRATION_TYPE) {
            resp1 = await dao.fetchTabGroupByTab(data);
        }
        if (resp1) {
            // console.log("--1",JSON.stringify(resp1));
            let resp3 = await dao.fetchTabGroupByTab2(data);
            if (resp3) {
                const resp = [];
                // console.log("--2",JSON.stringify(resp3));
                for (let i = 0; i < resp3.length; i++) {
                    if (resp3[i].isgrouping === 0) {
                        if (resp3[i].groupid === null) {
                            // console.log("inside",resp3[i].groupid)
                            resp.push(resp3[i])
                        }
                    } else {
                        if (resp3[i].groupid !== null) {
                            resp.push(resp3[i])
                        }
                    }

                }
                for (let i = 0; i < resp1.length; i++) {
                    if (resp1[i].isgrouping === 0) {
                        if (resp1[i].groupid === null) {
                            resp.push(resp1[i])
                        }
                    } else {
                        if (resp1[i].groupid !== null) {
                            resp.push(resp1[i])
                        }
                    }

                }
                if (resp.length > 0) {
                    const a = [];
                    // console.log(JSON.stringify(resp))
                    for (let i = 0; i < resp.length; i++) {
                        data.id = resp[i].id;
                        data.entitytypedtlid = resp[i].entitytypedtlid;
                        resp[i].systemcheckedresult = (resp[i].issystemverified === 1 ? 'Verified by system' : 'Not able to read');
                        console.log(resp[i].issystemverified)
                        resp[i].systemchecked = (resp[i].issystemverified === 1 ? 'Yes' : 'No');
                        let resp1 = await dao.fetchChecklistValueNotCurrent(data);
                        if (resp1) {
                            // console.log("---->",JSON.stringify(resp1))
                            if (resp1.length > 0) {
                                resp[i].olddata = [];
                                for (let j = 0; j < resp1.length; j++) {
                                    resp[i].olddata.push({
                                        "filepath": resp1[j].filepath,
                                        "filedesc": resp1[j].filedesc,
                                        "rolename": resp1[j].roledesc,
                                        "comment": resp1[j].comment,
                                        "checklistcommentchecked": (resp1[j].checklistcommentchecked === 1) ? 'Yes' : 'No'
                                    })
                                }

                            } else {
                                // resp[i].systemchecked = 'No';
                            }
                            // resp[i].comment = "";
                            // resp[i].checklistcommentchecked = '0';
                        } else {
                            return {
                                success: false,
                                status: util.statusCode.SOME_ERROR_OCCURRED,
                                message: 'Some error occurred',
                                response: null
                            }
                        }
                        let resp2 = await dao.fetchChecklistValueCurrent(data);
                        if (resp2) {
                            // console.log(JSON.stringify(resp2))
                            if (resp2.length > 0) {
                                // resp[i].olddata = [];
                                for (let j = 0; j < resp2.length; j++) {
                                    resp[i].checkid = resp2[j].id;
                                    resp[i].filepath = resp2[j].filepath;
                                    resp[i].filedesc = resp2[j].filedesc;
                                    // resp[i].systemchecked = (resp2[j].systemchecked === 1 ? 'YES' : 'No');
                                    resp[i].comment = resp2[j].comment;
                                    resp[i].checklistcommentchecked = resp2[j].checklistcommentchecked + '';
                                }
                                // resp[i].systemchecked = (resp[0].systemchecked === 1 ? 'YES' : 'No');
                            } else {
                                // resp[i].systemchecked = 'No';
                                resp[i].comment = "";
                                resp[i].checklistcommentchecked = '0';
                            }
                            // console.log(JSON.stringify(resp))

                        } else {
                            return {
                                success: false,
                                status: util.statusCode.SOME_ERROR_OCCURRED,
                                message: 'Some error occurred',
                                response: null
                            }
                        }
                    }
                    // console.log(JSON.stringify(resp))
                    for (let i = 0; i < resp.length; i++) {
                        if (a.length === 0) {
                            a.push({ groupname: resp[i].groupname, details: [resp[i]] })
                        } else {
                            let matched = false;
                            for (let j = 0; j < a.length; j++) {
                                if (a[j].groupname === resp[i].groupname) {
                                    a[j].details.push(resp[i]);
                                    matched = true;
                                    break;
                                }
                            }
                            if (!matched) {
                                a.push({ groupname: resp[i].groupname, details: [resp[i]] })
                            }
                        }
                    }

                    for (let i = 0; i < a.length; i++) {
                        let b = [];
                        for (let j = 0; j < a[i].details.length; j++) {
                            if (b.length === 0) {
                                if (a[i].details[j].groupposition !== null) {
                                    a[i].isnested = true;
                                    b.push({ groupposition: a[i].details[j].groupposition, details: [a[i].details[j]] })
                                } else {
                                    a[i].isnested = false;
                                    b.push(a[i].details[j])
                                }
                            } else {
                                let matched = false;
                                for (let k = 0; k < b.length; k++) {
                                    if (b[k].groupposition === a[i].details[j].groupposition && a[i].details[j].groupposition !== null) {
                                        a[i].isnested = true;
                                        b[k].details.push(a[i].details[j]);
                                        matched = true
                                    }
                                }
                                if (!matched) {
                                    if (a[i].details[j].groupposition !== null) {
                                        a[i].isnested = false;
                                        b.push({
                                            groupposition: a[i].details[j].groupposition,
                                            details: [a[i].details[j]]
                                        })

                                    } else {
                                        b.push(a[i].details[j])
                                    }
                                }
                            }

                        }
                        a[i].details = b;

                    }

                    return {
                        success: true,
                        status: util.statusCode.SUCCESS,
                        message: '',
                        response: await util.encryptResponse(a)
                    }
                } else {
                    return {
                        success: false,
                        status: util.statusCode.INTERNAL,
                        message: 'No checklist mapped with this Project',
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
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
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
};
module.exports.getNextStepDetails = async (data) => {
    try {
        let resp = await dao.getNextStepDetails(data);
        if (resp) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(resp)
            }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
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
module.exports.getQueryCommentsByProject = async (data) => {
    try {
        // data=JSON.parse(data)
        let resp = await dao.getQueryByProject(data);
        if (resp) {
            for (let i = 0; i < resp.length; i++) {
                data.id = resp[i].id;
                resp[i].details = [];
                let resp1 = await dao.getCommentsByQuery(data);
                if (resp1) {
                    resp[i].details = resp1;
                }
            }
            let a = [];
            for (let i = 0; i < resp.length; i++) {
                if (a.length === 0) {
                    a.push({ roledesc: resp[i].roledesc, details: [resp[i]] })
                } else {
                    let matched = false;
                    for (let j = 0; j < a.length; j++) {
                        if (a[j].roledesc === resp[i].roledesc) {
                            a[j].details.push(resp[i]);
                            matched = true;
                            break;
                        }
                    }
                    if (!matched) {
                        a.push({ roledesc: resp[i].roledesc, details: [resp[i]] })
                    }
                }
            }
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(a)
            }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
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
module.exports.getStepidBytype = async (data) => {
    try {
        let resp = await dao.getStepidBytype(data);
        if (resp) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(resp)
            }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
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
module.exports.getOfficerQuestion = async (data) => {
    try {
        let resp = await dao.getOfficerQuestion(data);
        if (resp) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(resp)
            }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
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
module.exports.getInternalNotes = async (data) => {
    try {
        let resp = await dao.getInternalNotes(data);
        if (resp) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(resp)
            }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
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
module.exports.insertInternalNotes = async (data) => {
    try {
        let resp = await dao.insertInternalNotes(data);
        if (resp) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(resp)
            }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
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
module.exports.getSingleQueryAnswer = async (data) => {
    try {
        let resp = await dao.getSingleQueryAnswer(data);
        if (resp) {
            for (let i = 0; i < resp.length; i++) {
                data.queryid = resp[i].id;
                resp[i].details = [];
                let resp1 = await dao.fetchPromoterAnswerDetails(data);
                console.log(resp1)
                if (resp1) {
                    resp[i].details = resp1;
                }
            }
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(resp)
            }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
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
module.exports.getApprovalTypes = async (data) => {
    try {
        let resp = await dao.getApprovalTypes(data);
        if (resp) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(resp)
            }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
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
module.exports.insertApprovalNotes = async (data) => {
    try {
        let resp = await dao.insertApprovalNotes(data);
        if (resp) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(resp)
            }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
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
module.exports.insertOfficerAnswer = async (data) => {
    try {
        let count = 0;
        // util.createLog(JSON.stringify(data));
        for (let i = 0; i < data.answers.length; i++) {
            data.answers[i].reraid = data.reraid;
            data.answers[i].userid = data.userid;
            data.answers[i].workflowtype = data.workflowtype;
            if (Number(data.workflowtype) === config.AGENT_TYPE) {
                data.answers[i].agentid = data.agentid;
            } else {
                data.answers[i].projectid = data.projectid;
                if (this.workflowtype === this.EXTENSION_TYPE) {
                    data.answers[i].extensionid = data.extensionid;
                }
            }
            let resp = await dao.insertOfficerAnswer(data.answers[i]);
            if (!resp) {
                count++;
            }
        }
        if (count === data.answers.length) {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        } else {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: null
            }
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
module.exports.getApprovalNotes = async (data) => {
    try {
        let resp = await dao.getApprovalNotes(data);
        if (resp) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(resp)
            }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
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
module.exports.getChairmanApprovalTypes = async (data) => {
    try {
        let resp = await dao.getMinApprovalType(data);
        if (resp) {
            let minapprovaltype = 0;
            if (resp.length > 0) {
                minapprovaltype = resp[0].approvaltypeid;
                // if (resp[0].approvaltypeid === 2) {
                //     minapprovaltype = 2;
                // }
            }
            let resp1 = await dao.getApprovalTypes(data, minapprovaltype);
            if (resp1) {
                return {
                    success: true,
                    status: util.statusCode.SUCCESS,
                    message: '',
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
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
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
module.exports.getPromoterQueryDashboard = async (data) => {
    try {
        let resp = await dao.getPromoterQueryDashboard(data);
        if (resp) {
            for (let i = 0; i < resp.length; i++) {
                if (resp[i].total === 0) {
                    resp.splice(i, 1)
                }
            }
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(resp)
            }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
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
module.exports.getQueryById = async (data) => {
    try {
        let resp = await dao.getQueryById(data);
        if (resp) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(resp)
            }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
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
module.exports.getPromoterAnswer = async (data) => {
    try {
        let resp = await dao.getPromoterAnswer(data);
        if (resp) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(resp)
            }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
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