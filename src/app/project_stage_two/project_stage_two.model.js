const dao = require('./project_stage_two.dao');
const token = require('../../utility/token');
const util = require('../../utility/util');
const config = require('../../config');
const common = require('../services/common.service');
const SMSmgov = require('../../utility/smsmgov');
const projectModel = require('../project/project.model');
const projectDao = require('../project/project.dao');

const groupBy = (xs, key) => {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}

const getFieldsWithValue = async (data) => {
    try {
        const fieldList = await dao.getFieldListByGroup(data.relationid, data.projectid);
        for (const [index, obj] of fieldList.entries()) {
            const fieldVal = await dao.getFieldValue({
                reraid: data.reraid,
                relationid: data.relationid,
                userid: data.userid,
                fieldid: obj.fieldid,
                projectid: data.projectid,
                stagetwofieldid: data.stagetwofieldid,
                updatestatus: data.updatestatus
            });
            obj.fieldproposedvalue = fieldVal ? fieldVal.fieldproposedvalue : '';
            obj.startdate = fieldVal ? fieldVal.startdate : '';
            obj.enddate = fieldVal ? fieldVal.enddate : '';
            if (index === (fieldList.length - 1)) {
                return fieldList;
            }
        }
        if (fieldList.length === 0) {
            return fieldList;
        }
    } catch (e) {
        util.createLog(e);
        return [];
    }
}

const getFieldDetailsList = async (data, step) => {
    try {
        const result = await dao.getFieldListWithStep({reraid: data.reraid, stepid: step.stepid});
        for (const [index, obj] of result.entries()) {
            if (obj.isrelated === 1 && obj.relationtype === 'group') {
                obj.fielddetails = await getFieldsWithValue({
                    relationid: obj.relationid,
                    stagetwofieldid: obj.stagetwofieldid,
                    reraid: data.reraid,
                    projectid: data.projectid,
                    userid: data.userid,
                    updatestatus: data.updatestatus
                });
            } else if (obj.isrelated === 0) {
                const fieldVal = await dao.getFieldValue({
                    reraid: data.reraid,
                    relationid: null,
                    userid: data.userid,
                    fieldid: null,
                    projectid: data.projectid,
                    stagetwofieldid: obj.stagetwofieldid,
                    updatestatus: data.updatestatus
                });
                obj.fieldproposedvalue = fieldVal ? fieldVal.fieldproposedvalue : '';
                obj.startdate = fieldVal ? fieldVal.startdate : '';
                obj.enddate = fieldVal ? fieldVal.enddate : '';
            }
            if ((result.length - 1) === index) {
                return result;
            }
        }
        if (result.length > 0) {
            return result;
        }
    } catch (e) {
    }
}

const getDetailsOfEachBuilding = async (data, step) => {
    try {
        const buildingList = await dao.getBuildingListOfProject(data);
        const result = await dao.getFieldListWithStep({reraid: data.reraid, stepid: step.stepid});
        for (const building of buildingList) {
            for (const obj of result) {
                const fieldVal = await dao.getFieldValue({
                    reraid: data.reraid,
                    relationid: null,
                    userid: data.userid,
                    fieldid: null,
                    projectid: data.projectid,
                    stagetwofieldid: obj.stagetwofieldid,
                    releatedgroupid: building.groupid,
                    relatedfieldid: building.fieldid,
                    relatedgrouppos: building.groupposition,
                    updatestatus: data.updatestatus
                });
                obj.fieldproposedvalue = fieldVal ? fieldVal.fieldproposedvalue : '';
                obj.startdate = fieldVal ? fieldVal.startdate : '';
                obj.enddate = fieldVal ? fieldVal.enddate : '';
            }
            building.fielddetails = JSON.parse(JSON.stringify(result));
        }
        return buildingList;
    } catch (e) {
        return [];
    }
}

module.exports.getFieldListWithStep = async (data) => {
    try {
        const stepList = await dao.getStepList(data);
        const updateStatus = await dao.getProjectUpdationStatus(data);
        if (stepList) {
            data.updatestatus = updateStatus;
            for (const [index, step] of stepList.entries()) {
                if (step.stepdesc === 'Common Amenities Plan') {
                    step.formDetails = await getFieldDetailsList(data, step);
                } else if (step.stepdesc === 'Building Development Plan') {
                    step.formDetails = await getDetailsOfEachBuilding(data, step);
                }
                if ((stepList.length - 1) === index) {
                    return {
                        success: true,
                        status: util.statusCode.SUCCESS,
                        message: '',
                        response: await util.encryptResponse(stepList)
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

module.exports.storeTemp = async (data) => {
    try {
        const result = await dao.storeTemp(data);
        if (result) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Data saved successfully',
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


module.exports.submitForm = async (data) => {
    try {
        const result = await dao.submitForm(data);
        if (result) {
            const uRes = await dao.setProjectUpdationStatus(data);
            const iRes = await dao.insertStageTwoHdr(data);
            const quoterInsRes = await setProjectExecutionHdr(data);
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Details updated successfully',
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


module.exports.getBuildingListOfProject = async (data) => {
    try {
        const result = await dao.getBuildingListOfProject(data);
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

function checkQuoterExistance(quoterId, year, quoterList) {
    let flag = 0;
    for (const obj of quoterList) {
        if (obj.quoterId === quoterId && obj.year === year) {
            flag = 1;
        }
    }
    if (flag === 1) {
        return true;
    } else {
        return false;
    }
}

function calaculateQuoter(date, endDate, quoterArr, quoterList) {
    let startD;
    if (util.getCurrentTime(-1, date) === util.getCurrentTime(-1, endDate)) {
        startD = new Date(endDate);
    } else {
        startD = new Date(date);
    }

    const endD = new Date(endDate);
    const month = startD.getMonth() + 1;
    for (const obj of quoterArr) {
        if (month >= Number(obj.startmonth) && month <= Number(obj.endmonth)) {
            if (checkQuoterExistance(obj.id, startD.getFullYear(), quoterList) === false) {
                const quoterEndDate = new Date(date);
                if (util.getCurrentTime(-1, date) === util.getCurrentTime(-1, endDate)) {
                    quoterEndDate.setMonth(endD.getMonth() + 1);
                    quoterEndDate.setDate(endD.getDate());
                } else {
                    quoterEndDate.setMonth(quoterEndDate.getMonth() + (obj.endmonth - month));
                    quoterEndDate.setDate(util.daysInMonth(quoterEndDate.getMonth() + 1, startD.getFullYear()));
                }
                quoterList.push({
                    quoterId: obj.id,
                    year: startD.getFullYear(),
                    startDate: util.getCurrentTime(0, startD),
                    endDate: util.getCurrentTime(0, quoterEndDate)
                })
            }
        }
    }
    if (util.getCurrentTime(-1, date) === util.getCurrentTime(-1, endDate)) {
        return quoterList;
    } else {
        startD.setMonth(startD.getMonth() + 1);
        startD.setDate(1);
        quoterList = calaculateQuoter(util.getCurrentTime(0, startD), endDate, quoterArr, quoterList);
        return quoterList;
    }

}

const setProjectExecutionHdr = async (data) => {
    try {
        const dates = await getProjectStartEndDate(data);
        if (dates) {
            const quoterArr = await dao.getQuoterList();
            let quoterList = [];
            quoterList = calaculateQuoter(dates.startDate, dates.endDate, quoterArr, quoterList);
            const iRes = await dao.insertQuoterListOfProject(data, quoterList);
        }
    } catch (e) {
        util.createLog(e)
        return null;
    }
}

const getProjectStartEndDate = async (data) => {
    try {
        const returnObj = {
            startDate: '',
            endDate: ''
        };
        const result = await dao.getProjectStartEndDate(data);
        if (result.length > 0) {
            for (const obj of result) {
                if (obj.fieldid === 496) {
                    returnObj.startDate = obj.projectfieldvalue;
                } else if (obj.fieldid === 497) {
                    returnObj.endDate = obj.projectfieldvalue;
                }
            }
            return returnObj;
        } else {
            return null;
        }
    } catch (e) {
        util.createLog(e)
        return null;
    }
}

module.exports.getInformationUpdateData = async (data) => {
    try {
        const resWebDtl = await dao.getProjectWebPageInfo(data);
        const fields = [{name: 'Project Contact Person', groupid: 45, stepid: 1}, {
            name: 'Registered Agents',
            groupid: 4,
            stepid: 3
        }];
        for (const [index, obj] of fields.entries()) {
            let res = await projectDao.getFieldsByGroupId(obj.groupid);
            res = await util.groupBy(res, 'fielddesc');
            obj.fielddetailskeys = Object.keys(res);
            const gResD = await projectModel.getValuesForGroup(obj.stepid, res, data.projectid, obj.groupid, 0, obj.fielddetailskeys);
            obj.fielddetails = gResD.field;
            obj.fielddetailskeys = gResD.key;
            if (index === (fields.length - 1)) {
                return {
                    success: true,
                    status: util.statusCode.SUCCESS,
                    message: '',
                    response: await util.encryptResponse({groupFields: fields, resWebDtl: resWebDtl})
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

module.exports.saveInformationUpdateData = async (data) => {
    try {
        const projUp = await dao.updateProjectWebPageInfo(data);
        const projPersonUp = await saveContactPersonAndAgent(data);
        return {
            success: true,
            status: util.statusCode.SUCCESS,
            message: 'Project information updated successfully',
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

module.exports.getStageTwoHdr = async (data) => {
    try {
        const result = await dao.getStageTwoHdr(data);
        if (result) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(result)
            }
        } else {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
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
module.exports.getInventoryDetails = async (data) => {
    try {
        let total = [];
        let total1 = [];
        const result = await dao.getBuildingGarageDetails(data, [44, 532]);
        // console.log(JSON.stringify(result));
        const result1 = await dao.getBuildingGarageDetails(data, [44, 897, 898]);
        if (!result1 && !result) {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        } else {
            if (!result) {
                total = []
            } else if (!result1) {
                total1 = []
            } else {
                if (result.length > 0) {
                    for (let i = 0; i < result.length; i = i + 2) {
                        let fieldid = [];
                        let fieldgroupid = 0;
                        let buildname = '';
                        // console.log(result[i].projectfieldvalue, i)
                        if (result[i].fieldid === 532) {
                            buildname = result[i + 1].projectfieldvalue;
                            if (result[i].projectfieldvalue === 'Mixed') {
                                const mixedresult = await dao.getMixedDetails(data, result[i].groupposition);
                                if (mixedresult) {
                                    if (mixedresult.length > 0) {
                                        for (let k = 0; k < mixedresult.length; k++) {
                                            if (mixedresult[k].projectfieldvalue === 'Residential') {
                                                fieldid = [677, 679, 678, 893];
                                                fieldgroupid = 29;
                                            } else if (mixedresult[k].projectfieldvalue === 'Commercial') {
                                                fieldid = [858, 683, 684, 893];
                                                fieldgroupid = 29;
                                            }
                                            const total2 = apartmentDetails(data, buildname, fieldgroupid, fieldid, result[i].groupposition, total, mixedresult[k].projectfieldvalue);
                                            if (!total2) {
                                                return {
                                                    success: false,
                                                    status: util.statusCode.INTERNAL,
                                                    message: 'Internal server error',
                                                    response: null
                                                }
                                            }
                                        }
                                    }
                                }

                            } else {
                                if (result[i].projectfieldvalue === 'Residential') {
                                    fieldid = [677, 679, 678, 893];
                                    fieldgroupid = 27;
                                } else if (result[i].projectfieldvalue === 'Commercial') {
                                    fieldid = [858, 683, 684, 893];
                                    fieldgroupid = 28;
                                }
                                const total2 = apartmentDetails(data, buildname, fieldgroupid, fieldid, result[i].groupposition, total, result[i].projectfieldvalue)
                                if (!total2) {
                                    return {
                                        success: false,
                                        status: util.statusCode.INTERNAL,
                                        message: 'Internal server error',
                                        response: null
                                    }
                                }
                            }
                        } else {
                            buildname = result[i].projectfieldvalue;
                            if (result[i + 1].fieldid === 532) {
                                if (result[i + 1].projectfieldvalue === 'Mixed') {
                                    const mixedresult = await dao.getMixedDetails(data, result[i].groupposition);
                                    if (mixedresult) {
                                        if (mixedresult.length > 0) {
                                            for (let k = 0; k < mixedresult.length; k++) {
                                                if (mixedresult[k].projectfieldvalue === 'Residential') {
                                                    fieldid = [677, 679, 678, 893];
                                                    fieldgroupid = 29;
                                                } else if (mixedresult[k].projectfieldvalue === 'Commercial') {
                                                    fieldid = [858, 683, 684, 893];
                                                    fieldgroupid = 29;
                                                }
                                                const total2 = apartmentDetails(data, buildname, fieldgroupid, fieldid, result[i].groupposition, total, mixedresult[k].projectfieldvalue);
                                                if (!total2) {
                                                    return {
                                                        success: false,
                                                        status: util.statusCode.INTERNAL,
                                                        message: 'Internal server error',
                                                        response: null
                                                    }
                                                }
                                            }
                                        }
                                    }
                                } else {
                                    if (result[i + 1].projectfieldvalue === 'Residential') {
                                        fieldid = [677, 679, 678, 893];
                                        fieldgroupid = 27;
                                    } else if (result[i + 1].projectfieldvalue === 'Commercial') {
                                        fieldid = [858, 683, 684, 899];
                                        fieldgroupid = 28;
                                    }
                                    const total2 = apartmentDetails(data, buildname, fieldgroupid, fieldid, result[i].groupposition, total, result[i + 1].projectfieldvalue)
                                    if (!total2) {
                                        return {
                                            success: false,
                                            status: util.statusCode.INTERNAL,
                                            message: 'Internal server error',
                                            response: null
                                        }
                                    }
                                }
                            }
                        }
                        // util.createLog(JSON.stringify(fieldid))
                    }
                }
                if (result1.length > 0) {
                    let name = '';
                    let garage = '';
                    let gprom = '';
                    for (let j = 0; j < result1.length; j++) {
                        if (result1[j].fieldid === 44) {
                            name = result1[j].projectfieldvalue;
                        } else if (result1[j].fieldid === 897) {
                            garage = result1[j].projectfieldvalue;
                        } else if (result1[j].fieldid === 898) {
                            gprom = result1[j].projectfieldvalue;
                        }

                        if ((j + 1) % 3 === 0) {
                            const bookresult = await dao.getBookedGarageDetails(data, result1[j].groupposition, 13);
                            if (bookresult) {
                                let bookedunit = "";
                                let soldunit = '';
                                if (bookresult.length > 0) {
                                    bookedunit = bookresult[0].bookedunit;
                                    soldunit = bookresult[0].soldunit
                                }
                                total1.push({
                                    build: name,
                                    garage: garage,
                                    gprom: gprom,
                                    groupposition: result1[j].groupposition,
                                    groupid: 13,
                                    bookedunit: bookedunit,
                                    soldunit: soldunit
                                })
                            } else {
                                return {
                                    success: false,
                                    status: util.statusCode.INTERNAL,
                                    message: 'Internal server error',
                                    response: null
                                }
                            }
                        }
                    }
                }
                let resi = [];
                let comp = [];
                for (let i = 0; i < total.length; i++) {
                    if (total[i].type === 'Residential') {
                        resi.push(total[i])
                    } else if (total[i].type === 'Commercial') {
                        comp.push(total[i])
                    }
                }
                return {
                    success: true,
                    status: util.statusCode.SUCCESS,
                    message: '',
                    response: await util.encryptResponse({building: resi, commercial: comp, garage: total1})
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

async function apartmentDetails(data, buildname, fieldgroupid, fieldid, groupposition, total, type) {
    util.createLog(buildname);
    const aptresult = await dao.getApartmentDetails(data, fieldgroupid, groupposition, fieldid);
    if (aptresult) {
        util.createLog(JSON.stringify(aptresult))
        if (aptresult.length > 0) {
            let utype = '';
            let care = '';
            let sapart = '';
            let sprom = '';
            for (let j = 0; j < aptresult.length; j++) {
                if (aptresult[j].fieldid === 677 || aptresult[j].fieldid === 858) {
                    utype = aptresult[j].projectfieldvalue;
                } else if (aptresult[j].fieldid === 679 || aptresult[j].fieldid === 683) {
                    care = aptresult[j].projectfieldvalue;
                } else if (aptresult[j].fieldid === 678 || aptresult[j].fieldid === 684) {
                    sapart = aptresult[j].projectfieldvalue;
                } else if (aptresult[j].fieldid === 893 || aptresult[j].fieldid === 899) {
                    sprom = aptresult[j].projectfieldvalue;
                }
                if ((j + 1) % 4 === 0) {
                    // console.log(utype)
                    const bookresult = await dao.getBookedDetails(data, fieldgroupid, groupposition, aptresult[j].groufieldpposition, 13);
                    if (bookresult) {
                        let bookedunit = "";
                        let soldunit = '';
                        if (bookresult.length > 0) {
                            bookedunit = bookresult[0].bookedunit;
                            soldunit = bookresult[0].soldunit
                        }
                        total.push({
                            build: buildname,
                            utype: utype,
                            care: care,
                            sapart: sapart,
                            sprom: sprom,
                            groupposition: groupposition,
                            groupid: 13,
                            fieldgroupid: fieldgroupid,
                            groufieldpposition: aptresult[j].groufieldpposition,
                            bookedunit: bookedunit,
                            soldunit: soldunit,
                            type: type
                        });

                    } else {
                        return false;
                    }
                }
            }
        }
        return true;
    } else {
        return false;
    }
}


const saveContactPersonAndAgent = async (data) => {
    try {
        if (data.groupFields.length === 0) {
            return true;
        }
        for (const [ind, obj] of data.groupFields.entries()) {
            for (const [index, field] of obj.fielddetails.entries()) {
                for (const key of obj.fielddetailskeys[index]) {
                    if (field[key][0].controltype != 7) {
                        const params = {
                            projectid: data.projectid,
                            fieldid: field[key][0].fieldid,
                            fieldvalue: field[key][0].fieldvalue,
                            stepid: obj.stepid,
                            groupid: obj.groupid,
                            groupposition: index,
                            fieldgroupid: null,
                            groufieldpposition: null,
                            issystemverified: 0,
                            isverified: 0,
                        };
                        const resp = await projectDao.insertIntoProjectDtl([params], data.reraid, data.entityid, data.entitytypeid, data.projectid, data.userid);
                    }
                }
            }
            if (ind === (data.groupFields.length - 1)) {
                return true
            }
        }
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.saveInventoryData = async (data) => {
    try {
        if (data.quoterid === undefined) {
            data.quoterid = null;
        }
        let bRes, gRes;
        if (data.inventoryData.building.length > 0) {
            bRes = await dao.saveInventoryBuildingData(data.inventoryData.building, data.reraid, data.projectid, data.userid, data.quoterid, 'residential');
        }
        if (data.inventoryData.commercial.length > 0) {
            bRes = await dao.saveInventoryBuildingData(data.inventoryData.commercial, data.reraid, data.projectid, data.userid, data.quoterid, 'commercial');
        }
        if (data.inventoryData.garage.length > 0) {
            gRes = await dao.saveInventoryGarageData(data.inventoryData.garage, data.reraid, data.projectid, data.userid, data.quoterid, 'garage');
        }
        if (bRes && gRes) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Details saved successfully',
                response: null
            }
        } else {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
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
