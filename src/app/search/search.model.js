const util = require('../../utility/util');
const dao = require('./search.dao');
const BUILDING_DETAILS_STEP_ID = 16;
const SANCTION_PLAN_STEP_ID = 2;
const PROFILE_DETAILS_STEP_ID = 9;
const PROJECT_DETAILS_STEP_ID = 1;

const BUILDING_DETAILS_GROUP_ID = 13;
const SANCTION_PLAN_GROUP_ID = 24;


const PROMOTER_SHARE_FIELD_ID = 893;
const SANCTIONED_BUILDING_FIELD_ID = 525;
const SANCTIONED_AUTHORITY_FIELD_ID = 14;
const OPEN_AREA_FIELD_ID = 1050;
const DESCRIPTION_FIELD_ID = 937;
const COMPLETION_DATE_FIELD_ID = 497;
const ADDRESS_FIELD_ID = 387;
const STATE_FIELD_ID = 513;
const DISTRICT_FIELD_ID = 514;
const CATEGORY_FIELD_ID = 1;
const LEGAL_FIELD_ID = 0;
const COMPLETION_CERT_FIELD_ID = 0;
const COMPLETION_REASON_FIELD_ID = 0;
const OCCUPENCY_CERT_FIELD_ID = 0;
const OCCUPENCY_REASON_FIELD_ID = 0;
const BUILDING_NAME_FIELD_ID = 44;
const SANCTIONED_FLOOR_FIELD_ID = 277;
const PROJECT_CATEGORY_FIELD_ID = 1;
const UNIT_TYPE_RESI_FIELD_ID = 677;
const NUM_UNIT_RESI_FIELD_ID = 678;
const TOTAL_CARPET_RESI_FIELD_ID = 680;
const TOTAL_TERRACE_RESI_FIELD_ID = 681;
const TOTAL_BALCONY_RESI_FIELD_ID = 682;
const UNIT_TYPE_COM_FIELD_ID = 858;
const NUM_UNIT_COM_FIELD_ID = 684;
const TOTAL_CARPET_COM_FIELD_ID = 861;
const TOTAL_TERRACE_COM_FIELD_ID = 862;
const TOTAL_BALCONY_COM_FIELD_ID = 863;
const FINANCIAL_YEAR_FIELD_ID = 471;

module.exports.search = async (data) => {
    try {
        let projresp = [];
        let promresp = [];
        let projcountresp = [];
        let promcountresp = [];
        if (data.type.indexOf('Project') > -1) {
            if (Number(data.projectOffset) === 0) {
                projcountresp = await dao.searchProjectCount(data);
            }
            projresp = await dao.searchProject(data);
        }
        if (data.type.indexOf('Promoter') > -1) {
            if (Number(data.promoterOffset) === 0) {
                promcountresp = await dao.searchPromoterCount(data);
            }
            promresp = await dao.searchPromoter(data);
        }
        if (!projcountresp) {
            projcountresp = [];
        }
        if (!promcountresp) {
            promcountresp = [];
        }
        if (!projresp && !promresp) {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        } else if (!projresp) {
            projresp = [];
        } else if (!promresp) {
            promresp = [];
        } else {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse({
                    project: projresp,
                    promoter: promresp,
                    promcountresp: promcountresp,
                    projcountresp: projcountresp
                })
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
module.exports.fetchProjectType = async (data) => {
    try {
        const resp = await dao.fetchProjectType(data);
        if (!resp) {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        } else {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(resp)
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
module.exports.maxFieldValue = async (data) => {
    try {
        const resp = await dao.maxFieldValue(data);
        if (!resp) {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        } else {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(resp)
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
module.exports.fetchProjectDetails = async (data) => {
    try {
        const resp = await dao.fetchProjectDetails(data);
        if (!resp) {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        } else {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(resp)
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
module.exports.fetchEngineerDetails = async (data) => {
    try {
        const resp = await dao.fetchEngineerDetails(data);
        if (!resp) {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        } else {
            if (resp.length > 0) {
                let arr = [];
                for (let i = 0; i < resp.length; i++) {
                    let a = {};
                    let key = resp[i].fielddisplaydesc;
                    a[key] = resp[i].projectfieldvalue;
                    arr.push(a)
                }
                return {
                    success: true,
                    status: util.statusCode.SUCCESS,
                    message: '',
                    response: await util.encryptResponse(arr)
                }
            } else {
                return {
                    success: true,
                    status: util.statusCode.SUCCESS,
                    message: '',
                    response: await util.encryptResponse(resp)
                }
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
module.exports.fetchProjectValueDetails = async (data) => {
    try {
        const resp = await dao.fetchProjectValueDetails(data);
        if (!resp) {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        } else {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(resp)
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
module.exports.fetchProfileValueDetails = async (data) => {
    try {
        const resp = await dao.fetchProfileValueDetails(data);
        if (!resp) {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        } else {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(resp)
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
module.exports.fetchCommonAmenities = async (data) => {
    try {
        const resp = await dao.fetchCommonAmenities(data);
        if (!resp) {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        } else {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(resp)
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
module.exports.fetchBuildingDetails = async (data) => {
    try {
        data.stepid = SANCTION_PLAN_STEP_ID;
        data.fieldid = [SANCTIONED_AUTHORITY_FIELD_ID];
        const resp2 = await dao.fetchProjectValueDetails(data);
        if (resp2) {
            let authority = '';
            let openarea = '';
            if (resp2.length > 0) {
                for (let i = 0; i < resp2.length; i++) {
                    if (resp2[i].fieldid === SANCTIONED_AUTHORITY_FIELD_ID) {
                        authority = resp2[i].projectfieldvalue;
                    }/* else if (resp2[i].fieldid === OPEN_AREA_FIELD_ID) {
                        openarea = resp2[i].projectfieldvalue
                    }*/
                }

            }
            data.fieldid = [OPEN_AREA_FIELD_ID];
            data.groupid = SANCTION_PLAN_GROUP_ID;
            const resp3 = await dao.fetchProjectValueDetails(data);
            if (resp3) {
                if (resp3.length > 0) {
                    for (let i = 0; i < resp3.length; i++) {
                        if (resp3[i].fieldid === OPEN_AREA_FIELD_ID) {
                            openarea = resp3[i].projectfieldvalue;
                        }
                    }

                }
                try {
                    data.stepid = BUILDING_DETAILS_STEP_ID;
                    data.fieldid = SANCTIONED_BUILDING_FIELD_ID;
                    const resp1 = await dao.fetchProjectValueDetails(data);
                    if (resp1) {
                        let totalbulding = 0;
                        if (resp1.length > 0) {
                            if (resp1[0].projectfieldvalue !== "") {
                                totalbulding = resp1[0].projectfieldvalue;
                            }
                        }
                        data.groupid = BUILDING_DETAILS_GROUP_ID;
                        data.fieldid = PROMOTER_SHARE_FIELD_ID;
                        try {
                            const resp = await dao.fetchProjectValueDetails(data);

                            if (!resp) {
                                return {
                                    success: false,
                                    status: util.statusCode.INTERNAL,
                                    message: 'Internal server error',
                                    response: null
                                }
                            } else {
                                let totalunit = 0;
                                let booked = 0;
                                if (resp.length > 0) {
                                    for (let i = 0; i < resp.length; i++) {
                                        if (resp[i].projectfieldvalue !== "" || resp[i].projectfieldvalue !== null) {
                                            totalunit = totalunit + Number(resp[i].projectfieldvalue);
                                        }
                                    }
                                    const qurtrresp = await dao.fetchMaxQuarterId(data);
                                    if (qurtrresp && qurtrresp.length > 0) {
                                        if (qurtrresp[0].quoterid !== null) {
                                            data.quoterid = qurtrresp[0].quoterid;
                                        }
                                        const availableresp = await dao.fetchAvailableUnit(data);
                                        if (availableresp) {
                                            for (let i = 0; i < availableresp.length; i++) {
                                                if (availableresp[i].bookedunit !== "" || availableresp[i].bookedunit !== null) {
                                                    booked = booked + Number(availableresp[i].bookedunit);
                                                }
                                            }
                                        }
                                    }
                                    return {
                                        success: true,
                                        status: util.statusCode.SUCCESS,
                                        message: '',
                                        response: await util.encryptResponse({
                                            totalunit: totalunit,
                                            available: totalunit - booked,
                                            totalbulding: totalbulding,
                                            authority: authority,
                                            openarea: openarea
                                        })
                                    }
                                } else {
                                    return {
                                        success: true,
                                        status: util.statusCode.SUCCESS,
                                        message: '',
                                        response: await util.encryptResponse({
                                            totalunit: totalunit,
                                            available: totalunit - booked,
                                            totalbulding: totalbulding,
                                            authority: authority,
                                            openarea: openarea
                                        })
                                    }
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
                    } else {
                        return {
                            success: false,
                            status: util.statusCode.INTERNAL,
                            message: 'Internal server error',
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
module.exports.fetchDocuments = async (data) => {
    try {
        const resp = await dao.fetchDocuments(data);
        if (!resp) {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        } else {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(resp)
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
module.exports.fetchPromoterDetails = async (data) => {
    try {
        const resp = await dao.fetchPromoterDetails(data);
        if (!resp) {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        } else {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(resp)
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
module.exports.fetchProjectByStatus = async (data) => {
    try {
        let count = 0;
        const resp = await dao.fetchProjectByStatus(data);

        if (!resp) {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        } else {
            if (Number(data.offset) === 0) {
                try {
                    const countresp = await dao.fetchProjectCountByStatus(data);
                    if (!countresp) {
                        return {
                            success: false,
                            status: util.statusCode.INTERNAL,
                            message: 'Internal server error',
                            response: null
                        }
                    } else {
                        console.log(JSON.stringify(countresp))
                        if (countresp.length > 0) {
                            count = countresp[0].projectcount;
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
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse({
                    details: resp, count: count
                })
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
module.exports.fetchDirectorDetails = async (data) => {
    NAME = 0;
    DESIGNTION = 0;
    PHOTO = 0;
    MOBILE = 0;
    ADDRESS = 132;
    STATE = 18;
    if (data.entitytypeid == 2) {
        data.groupid = 8;
        NAME = 285;
        DESIGNTION = 253;
        PHOTO = 37;
        MOBILE = 334;
    } else if (data.entitytypeid == 4) {
        data.groupid = 15;
        NAME = 328;
        DESIGNTION = 124;
        PHOTO = 286;
        MOBILE = 284;
    } else if (data.entitytypeid == 5) {
        data.groupid = 19;
        NAME = 342;
        DESIGNTION = 252;
        PHOTO = 37;
        MOBILE = 350;
    } else if (data.entitytypeid == 6) {
        data.groupid = 14;
        NAME = 306;
        DESIGNTION = 252;
        PHOTO = 37;
        MOBILE = 312;
    } else if (data.entitytypeid == 7) {
        data.groupid = 12;
        NAME = 317;
        DESIGNTION = 254;
        PHOTO = 37;
        MOBILE = 323;
    } else if (data.entitytypeid == 8) {
        data.groupid = 18;
        NAME = 339;
        DESIGNTION = 253;
        PHOTO = 37;
        MOBILE = 353;
    } else if (data.entitytypeid == 9) {
        data.groupid = 8;
        NAME = 285;
        DESIGNTION = 124;
        PHOTO = 286;
        MOBILE = 284;
    }
    fields = [{type: 'name', val: NAME}, {type: 'designation', val: DESIGNTION}, {
        type: 'photo',
        val: PHOTO
    }, {type: 'mobile', val: MOBILE}, {type: 'addr', val: ADDRESS}, {type: 'state', val: STATE}];
    return await fetchProfileValueGroupWise(data, fields);
};

async function fetchProfileValueGroupWise(data, allfields) {
    data.stepid = PROFILE_DETAILS_STEP_ID;

    fields = JSON.parse(JSON.stringify(allfields));
    try {
        let fieldids = [];
        for (let i = 0; i < allfields.length; i++) {
            fieldids.push(allfields[i].val)
        }
        data.fieldid = fieldids;
        const resp = await dao.fetchProfileValueGroupWise(data);
        if (!resp) {
            // return {success:false,err:resp}
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        } else {
            const val = [];
            let count = 0;
            let a = {};
            if (resp.length > 0) {
                for (let j = 0; j < resp.length; j++) {
                    if (count === resp[j].groupposition) {
                        for (let k = 0; k < fields.length; k++) {
                            if (fields[k] !== undefined) {
                                if (resp[j].fieldid === fields[k].val) {
                                    // console.log("----matched--",resp[j].fieldid,fields[k].type)
                                    a[fields[k].type] = resp[j].fieldvalue;
                                    delete fields[k];
                                    break;
                                }
                            }
                        }

                    }
                    if (j < resp.length - 1) {
                        if (resp[j + 1].groupposition > count) {
                            for (let i = 0; i < fields.length; i++) {
                                if (fields[i] !== undefined) {
                                    a[fields[i].type] = '';
                                }
                            }
                            count++;
                            val.push(a);
                            a = {};
                            fields = allfields;
                        }

                    } else {
                        for (let i = 0; i < fields.length; i++) {
                            if (fields[i] !== undefined) {
                                a[fields[i].type] = '';
                            }
                        }
                        val.push(a);
                    }
                }
            }
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(val)
            }
            // return {success:true,response:val}
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
module.exports.fetchPastProject = async (data) => {
    try {
        const resp = await dao.getPastProjectByUser(data);
        if (!resp) {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        } else {
            if (resp.length > 0) {
                data.stepid = PROJECT_DETAILS_STEP_ID;
                data.fieldid = [DESCRIPTION_FIELD_ID, COMPLETION_DATE_FIELD_ID, ADDRESS_FIELD_ID, STATE_FIELD_ID, DISTRICT_FIELD_ID, CATEGORY_FIELD_ID, LEGAL_FIELD_ID, COMPLETION_CERT_FIELD_ID, COMPLETION_REASON_FIELD_ID, OCCUPENCY_CERT_FIELD_ID, OCCUPENCY_REASON_FIELD_ID];
                fields = [{type: 'desc', val: DESCRIPTION_FIELD_ID}, {
                    type: 'completedate',
                    val: COMPLETION_DATE_FIELD_ID
                }, {type: 'addr', val: ADDRESS_FIELD_ID}, {type: 'dist', val: DISTRICT_FIELD_ID}, {
                    type: 'legal',
                    val: LEGAL_FIELD_ID
                }, {
                    type: 'state',
                    val: STATE_FIELD_ID
                }, {
                    type: 'category',
                    val: CATEGORY_FIELD_ID
                }, {type: 'comcert', val: COMPLETION_CERT_FIELD_ID}, {
                    type: 'comreason',
                    val: COMPLETION_REASON_FIELD_ID
                }, {type: 'occucert', val: OCCUPENCY_CERT_FIELD_ID}, {
                    type: 'ocureason',
                    val: OCCUPENCY_REASON_FIELD_ID
                }];
                for (let i = 0; i < resp.length; i++) {
                    try {
                        data.projectid = resp[i].id;
                        const valueresp = await dao.fetchProjectValueDetails(data);
                        if (!resp) {
                            // return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
                        } else {
                            for (let k = 0; k < fields.length; k++) {
                                let matched = false;
                                for (let l = 0; l < valueresp.length; l++) {
                                    if (fields[k].val === valueresp[l].fieldid) {
                                        matched = true;
                                        resp[i][fields[k].type] = valueresp[l].projectfieldvalue;
                                        break;
                                    }
                                }
                                if (!matched) {
                                    resp[i][fields[k].type] = ''
                                }
                            }
                        }
                    } catch (e) {
                        util.createLog(e)
                    }
                }
            }
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(resp)
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
module.exports.fetchFullBuildingDetails = async (data) => {
    try {
        data.stepid = PROJECT_DETAILS_STEP_ID;
        data.fieldid = [PROJECT_CATEGORY_FIELD_ID];
        const resp = await dao.fetchProjectValueDetails(data);
        if (!resp) {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        } else {
            if (resp.length > 0 && resp[0].projectfieldvalue !== '') {
                var category = '';
                let fieldgroupids = [];
                let fieldgroupids1 = [];
                let fieldgroupid = 0;
                if (resp[0].projectfieldvalue.indexOf('Mixed') > -1) {
                    category = 'mixed';
                    fieldgroupid = 29;
                    fieldgroupids = [UNIT_TYPE_RESI_FIELD_ID, NUM_UNIT_RESI_FIELD_ID, TOTAL_CARPET_RESI_FIELD_ID, TOTAL_TERRACE_RESI_FIELD_ID, TOTAL_BALCONY_RESI_FIELD_ID];
                    fieldgroupids1 = [UNIT_TYPE_COM_FIELD_ID, NUM_UNIT_COM_FIELD_ID, TOTAL_CARPET_COM_FIELD_ID, TOTAL_TERRACE_COM_FIELD_ID, TOTAL_BALCONY_COM_FIELD_ID];
                } else if (resp[0].projectfieldvalue.indexOf('Plotted') > -1) {
                    category = 'plotted'
                } else if (resp[0].projectfieldvalue.indexOf('Commercial') > -1) {
                    category = 'commercial';
                    fieldgroupid = 28;
                    fieldgroupids = [UNIT_TYPE_COM_FIELD_ID, NUM_UNIT_COM_FIELD_ID, TOTAL_CARPET_COM_FIELD_ID, TOTAL_TERRACE_COM_FIELD_ID, TOTAL_BALCONY_COM_FIELD_ID];
                } else {
                    category = 'residential';
                    fieldgroupid = 27;
                    fieldgroupids = [UNIT_TYPE_RESI_FIELD_ID, NUM_UNIT_RESI_FIELD_ID, TOTAL_CARPET_RESI_FIELD_ID, TOTAL_TERRACE_RESI_FIELD_ID, TOTAL_BALCONY_RESI_FIELD_ID];
                }
                try {
                    data.stepid = BUILDING_DETAILS_STEP_ID;
                    data.groupid = BUILDING_DETAILS_GROUP_ID;
                    data.fieldid = [BUILDING_NAME_FIELD_ID, SANCTIONED_FLOOR_FIELD_ID];
                    const resp1 = await dao.fetchProjectValueDetails(data);
                    if (!resp1) {
                        return {
                            success: false,
                            status: util.statusCode.INTERNAL,
                            message: 'Internal server error',
                            response: null
                        }
                    } else {
                        let maincount = 0;
                        let mainresp = [];
                        let a = {};
                        for (let i = 0; i < resp1.length; i++) {
                            if (maincount === resp1[i].groupposition) {
                                if (resp1[i].fieldid === BUILDING_NAME_FIELD_ID) {
                                    a.name = resp1[i].projectfieldvalue;
                                } else if (resp1[i].fieldid === SANCTIONED_FLOOR_FIELD_ID) {
                                    a.floor = resp1[i].projectfieldvalue;
                                }
                            }
                            if (i < resp1.length - 1) {
                                if (resp1[i + 1].groupposition > maincount) {
                                    a.pos = maincount;
                                    maincount++;
                                    mainresp.push(a);
                                    a = {};
                                }
                            } else {
                                a.pos = maincount;
                                mainresp.push(a);
                            }
                        }
                        data.fieldgroupid = fieldgroupid;
                        const allresp = [];
                        for (let k = 0; k < mainresp.length; k++) {

                            data.groupposition = mainresp[k].pos;
                            try {
                                data.fieldid = fieldgroupids;
                                const resp2 = await dao.getProjectValueByFieldPosition(data);
                                if (resp2) {

                                    let b = {};
                                    let subcount = 0;
                                    for (let i = 0; i < resp2.length; i++) {

                                        if (resp2[i].groufieldpposition === subcount) {

                                            if (resp2[i].fieldid === UNIT_TYPE_RESI_FIELD_ID) {
                                                b.unittype = resp2[i].projectfieldvalue;
                                            } else if (resp2[i].fieldid === NUM_UNIT_RESI_FIELD_ID) {
                                                b.numberUnit = resp2[i].projectfieldvalue;
                                            } else if (resp2[i].fieldid === TOTAL_CARPET_RESI_FIELD_ID) {
                                                b.totalcarpet = resp2[i].projectfieldvalue;
                                            } else if (resp2[i].fieldid === TOTAL_TERRACE_RESI_FIELD_ID) {
                                                b.totalterrace = resp2[i].projectfieldvalue;
                                            } else if (resp2[i].fieldid === TOTAL_BALCONY_RESI_FIELD_ID) {
                                                b.totalbalcony = resp2[i].projectfieldvalue;
                                            }
                                        }
                                        b.bookedunit = 0;
                                        b.soldunit = 0;
                                        data.fieldgrouppos = resp2[i].groufieldpposition;
                                        if (i < resp2.length - 1) {
                                            if (resp2[i + 1].groufieldpposition > subcount) {

                                                const resp3 = await dao.getInventoryDetailsForUnit(data);
                                                if (resp3) {
                                                    if (resp3.length > 0) {
                                                        b.bookedunit = resp3[0].bookedunit;
                                                        b.soldunit = resp3[0].soldunit;
                                                    }
                                                }
                                                subcount++;
                                                b.name = mainresp[k].name;
                                                b.floor = mainresp[k].floor;
                                                allresp.push(b);
                                                b = {};
                                            }
                                        } else {
                                            const resp3 = await dao.getInventoryDetailsForUnit(data);
                                            if (resp3) {
                                                if (resp3.length > 0) {
                                                    b.bookedunit = resp3[0].bookedunit;
                                                    b.soldunit = resp3[0].soldunit;
                                                }
                                            }
                                            b.name = mainresp[k].name;
                                            b.floor = mainresp[k].floor;
                                            allresp.push(b);
                                        }
                                    }
                                }
                            } catch (e) {
                                util.createLog(e);
                            }
                            if (category === 'mixed') {
                                try {
                                    data.fieldid = fieldgroupids1;
                                    const resp2 = await dao.getProjectValueByFieldPosition(data);
                                    if (resp2) {
                                        let b = {};
                                        let subcount = 0;
                                        for (let i = 0; i < resp2.length; i++) {
                                            if (resp2[i].groufieldpposition === subcount) {

                                                if (resp2[i].fieldid === UNIT_TYPE_COM_FIELD_ID) {
                                                    b.unittype = resp2[i].projectfieldvalue;
                                                } else if (resp2[i].fieldid === NUM_UNIT_COM_FIELD_ID) {
                                                    b.numberUnit = resp2[i].projectfieldvalue;
                                                } else if (resp2[i].fieldid === TOTAL_CARPET_COM_FIELD_ID) {
                                                    b.totalcarpet = resp2[i].projectfieldvalue;
                                                } else if (resp2[i].fieldid === TOTAL_TERRACE_COM_FIELD_ID) {
                                                    b.totalterrace = resp2[i].projectfieldvalue;
                                                } else if (resp2[i].fieldid === TOTAL_BALCONY_COM_FIELD_ID) {
                                                    b.totalbalcony = resp2[i].projectfieldvalue;
                                                }
                                            }
                                            b.bookedunit = 0;
                                            b.soldunit = 0;
                                            data.fieldgrouppos = resp2[i].groufieldpposition;
                                            if (i < resp2.length - 1) {
                                                if (resp2[i + 1].groufieldpposition > subcount) {

                                                    const resp3 = await dao.getInventoryDetailsForUnit(data);
                                                    if (resp3) {
                                                        if (resp3.length > 0) {
                                                            b.bookedunit = resp3[0].bookedunit;
                                                            b.soldunit = resp3[0].soldunit;
                                                        }
                                                    }
                                                    subcount++;
                                                    b.name = mainresp[k].name;
                                                    b.floor = mainresp[k].floor;
                                                    allresp.push(b);
                                                    b = {};
                                                }
                                            } else {
                                                const resp3 = await dao.getInventoryDetailsForUnit(data);
                                                if (resp3) {
                                                    if (resp3.length > 0) {
                                                        b.bookedunit = resp3[0].bookedunit;
                                                        b.soldunit = resp3[0].soldunit;
                                                    }
                                                }
                                                b.name = mainresp[k].name;
                                                b.floor = mainresp[k].floor;
                                                allresp.push(b);
                                            }
                                        }
                                    }
                                } catch (e) {
                                    util.createLog(e);
                                }
                            }
                        }
                        return {
                            success: true,
                            status: util.statusCode.SUCCESS,
                            message: '',
                            response: await util.encryptResponse(allresp)
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
            } else {
                return {
                    success: false,
                    status: util.statusCode.SOME_ERROR_OCCURRED,
                    message: 'Project Category Not Mapped Properly',
                    response: null
                }
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
module.exports.fetchFinancialDocuments = async (data) => {
    try {
        const resp = await dao.fetchDocuments(data);
        if (!resp) {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        } else {
            data.fieldid = [FINANCIAL_YEAR_FIELD_ID];
            const resp1 = await dao.fetchProjectValueDetails(data);
            if (!resp1) {
                return {
                    success: false,
                    status: util.statusCode.INTERNAL,
                    message: 'Internal server error',
                    response: null
                }
            } else {
                if (resp1.length > 0) {
                    for (let i = 0; i < resp1.length; i++) {
                        for (let j = 0; j < resp.length; j++) {
                            if (resp1[i].groupposition === resp[j].groupposition) {
                                resp[j]['year'] = resp1[i].projectfieldvalue;
                            } else {
                                if (resp1[i].groupposition < resp[j].groupposition) {
                                    break;
                                }
                            }
                        }
                    }
                }
            }
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(resp)
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
