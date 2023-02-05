const dao = require('./mst_search.dao');
const config = require('./mst_search.config');
const util = require('../../utility/util');
const common = require('../services/common.service');

module.exports.mstSearchDetails = async (data) => {
    try {
        var resultForMultiple;
        var finalResponseResult = [];
        var currentProjectRecords = [];
        var pastProjectRecords = [];
        var allProjectRecords = [];
        var JSONData = JSON.parse(JSON.stringify(config.JSONData));
        var StoreRecord = JSON.parse(JSON.stringify(config.StoreRecord));
        var pastproject = JSON.parse(JSON.stringify(config.pastproject));
        resultForMultiple = await dao.mstSearchByPastProjects(data, pastproject);
        if (resultForMultiple !== null) {
            resultForMultiple = resultForMultiple.sort(await sortByProperty("groupposition"));
            var resultRegistration;
            for (let j = 0; j < resultForMultiple.length; j++) {
                pastProjectRecords.push(resultForMultiple[j]);
            }
        }
        resultForMultiple = await dao.mstSearchByRegistrationNo(data);
        if (resultForMultiple !== null) {
            var resultRegistration;
            for (let j = 0; j < resultForMultiple.length; j++) {
                currentProjectRecords.push(resultForMultiple[j]);
            }
        }
        let projectFieldId;
        projectFieldId = await config.mstSearchForProject(data);
        if (projectFieldId.length == 0) {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Database error', response: null}
        }
        resultForMultiple = await dao.mstSearchByProjectNameFromProjectHdr(data, projectFieldId[0].fieldid);
        if (resultForMultiple !== null) {
            for (let j = 0; j < resultForMultiple.length; j++) {
                currentProjectRecords.push(resultForMultiple[j]);
            }
        }
        let profileFieldId;
        profileFieldId = await config.mstSearchForProfile(data);
        if (profileFieldId.length == 0) {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Database error', response: null}
        }
        const result1 = await dao.mstSearchByPromoterName(data, profileFieldId[0].fieldid);
        if (result1 !== null) {
            StoreRecord.userid = result1[0].userid;
            const resultArray = await dao.getProjectDetailsUsingUserId(result1[0].userid);
            if (resultArray.length > 0) {
                for (let i = 0; i < resultArray.length; i++) {
                    data.search = resultArray[i].projectfieldvalue;
                    let projectFieldId;
                    projectFieldId = await config.mstSearchForProject(data);
                    if (projectFieldId.length == 0) {
                        return {
                            success: false,
                            status: util.statusCode.INTERNAL,
                            message: 'Database error',
                            response: null
                        }
                    }
                    resultForMultiple = await dao.mstSearchByProjectNameFromProjectHdr(data, projectFieldId[0].fieldid);
                    if (resultForMultiple !== null) {
                        for (let j = 0; j < resultForMultiple.length; j++) {
                            if (resultForMultiple[j].particularprofileid == result1[0].userid) {
                                currentProjectRecords.push(resultForMultiple[j]);
                            }
                        }
                    }
                }
            }
        }
        var seenIDs = {};
        currentProjectRecords = currentProjectRecords.filter(function (currentObject) {
            if (currentObject.id in seenIDs) {
                return false;
            } else {
                seenIDs[currentObject.id] = true;
                return true;
            }
        });
        if (pastProjectRecords.length > 0) {
            for (let i = 0; i < pastProjectRecords.length; i++) {
                allProjectRecords.push(pastProjectRecords[i]);
            }
        }
        if (currentProjectRecords.length > 0) {
            for (let i = 0; i < currentProjectRecords.length; i++) {
                allProjectRecords.push(currentProjectRecords[i]);
            }
        }
        if (allProjectRecords.length > 0) {
            for (let k = 0; k < allProjectRecords.length; k++) {
                if (allProjectRecords[k].projectuid) {
                    JSONData.Project_Reg_No = allProjectRecords[k].projectuid;
                    resultRegistration = await getRecordDetails(data, allProjectRecords[k], JSONData, StoreRecord, '');
                } else {
                    resultRegistration = await getRecordDetails(data, allProjectRecords[k], JSONData, StoreRecord, 'past_project');
                }
                finalResponseResult.push(resultRegistration[0]);
                JSONData = JSON.parse(JSON.stringify(config.JSONData));
            }
        }
        if (finalResponseResult.length > 0) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse({result: finalResponseResult})
            }
        } else {
            return {
                success: false,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(config.noData)
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


async function getRecordDetails(data, resultForMultiple, JSONData, StoreRecord, type) {
    var respondent = JSON.parse(JSON.stringify(config.respondent));
    var storeDetails = [];
    var flag = 0;
    JSONData.id = resultForMultiple.id;
    JSONData.Project_Name = resultForMultiple.projectfieldvalue;
    JSONData.Promoter_id = resultForMultiple.particularprofileid;
    JSONData.Promoter_name = await dao.getPromoterName(resultForMultiple.particularprofileid);
    StoreRecord.entitytypeprojecthdrid = resultForMultiple.id;
    StoreRecord.fieldid = resultForMultiple.fieldid;
    StoreRecord.userid = resultForMultiple.particularprofileid;
    const projectFields = await config.mstSearchForProjectDetails(data, resultForMultiple, config.outputList, type);
    if (projectFields.length > 0) {
        for (let i = 0; i < projectFields.length; i++) {
            for (let j = 0; j < config.outputList.length; j++) {
                if (Number(config.outputList[j].whichfrom) == 1) {
                    if (Number(projectFields[i].fieldid) == Number(config.outputList[j].fieldid)) {
                        JSONData[config.outputList[j].kayname] = projectFields[i].projectfieldvalue;
                    }
                }
            }
        }
    }
    // const profileFields = await config.mstSearchForProfileDetails(data, resultForMultiple, config.outputList);
    // if(profileFields.length > 0){
    //     for (let i=0;i<profileFields.length;i++) { 
    //         for(let j=0;j<config.outputList.length;j++){
    //             if(Number(config.outputList[j].whichfrom) == 2){
    //                 if(Number(profileFields[i].fieldid) == Number(config.outputList[j].fieldid)){
    //                     respondent[config.outputList[j].kayname] = profileFields[i].fieldvalue;
    //                 }
    //             }
    //         }
    //     }
    //     JSONData.respondent_details.push(respondent);
    //     respondent = JSON.parse(JSON.stringify(config.respondent));
    // }
    // For director details
    const directorDtl = await dao.getDirectorDetails({userid: resultForMultiple.particularprofileid});
    const directorRes = await makeDirectorLIst(directorDtl, JSONData.respondent_details, 'Director');
    // For landowner details
    const landownerDtl = await landownerDetails(JSONData.id, JSONData.respondent_details);
    const Society = await getMemberDetails(resultForMultiple.particularprofileid, JSONData.respondent_details, 'Society');
    const Partnership = await getMemberDetails(resultForMultiple.particularprofileid, JSONData.respondent_details, 'Partnership');
    const Liability = await getMemberDetails(resultForMultiple.particularprofileid, JSONData.respondent_details, 'Liability');
    const Trust = await getMemberDetails(resultForMultiple.particularprofileid, JSONData.respondent_details, 'Trust');
    const Cooperative = await getMemberDetails(resultForMultiple.particularprofileid, JSONData.respondent_details, 'Cooperative');
    storeDetails.push(JSONData);
    // JSONData = config.JSONData;
    return storeDetails.length > 0 ? storeDetails : null;
}

// groupid 15 for society

async function sortByProperty(property) {
    return function (a, b) {
        if (a[property] > b[property])
            return 1;
        else if (a[property] < b[property])
            return -1;

        return 0;
    }
}

async function makeOwnershipLIst(fieldList, array, type) {
    try {
        const groupList = await util.groupBy(fieldList, 'groufieldpposition');
        for (const key of Object.keys(groupList)) {
            const respondentObj = JSON.parse(JSON.stringify(config.respondent));
            for (const obj of groupList[key]) {
                respondentObj.Designation = type;
                if (obj.fielddesc === 'Ownership_Name') {
                    respondentObj.Name = obj.fieldvalue;
                } else if (obj.fielddesc === 'Email_ID') {
                    respondentObj.EmailAddress1 = obj.fieldvalue;
                } else if (obj.fielddesc === 'Contact_No') {
                    respondentObj.Telephone_Number1 = obj.fieldvalue;
                }
            }
            array.push(respondentObj);
        }
        return array;
    } catch (e) {
        return []
    }
}


async function makeDirectorLIst(fieldList, array, type) {
    try {
        const groupList = await util.groupBy(fieldList, 'groupposition');
        for (const key of Object.keys(groupList)) {
            const respondentObj = JSON.parse(JSON.stringify(config.respondent));
            for (const obj of groupList[key]) {
                respondentObj.Designation = type;
                if (obj.fielddesc === 'Name_Director') {
                    respondentObj.Name = obj.fieldvalue;
                } else if (obj.fielddesc === 'Email_ID') {
                    respondentObj.EmailAddress1 = obj.fieldvalue;
                } else if (obj.fielddesc === 'Mobile_Number_Director') {
                    respondentObj.Telephone_Number1 = obj.fieldvalue;
                } else if (obj.fielddesc === 'Designation') {
                    respondentObj.Designation = obj.fieldvalue;
                } else if (obj.fielddesc === 'Home_Address_Line_one') {
                    respondentObj.Address_1Respondent = obj.fieldvalue;
                } else if (obj.fielddesc === 'Home_Address_Line_two') {
                    respondentObj.Address_1Respondent2 = obj.fieldvalue;
                } else if (obj.fielddesc === 'State') {
                    respondentObj.State_1 = obj.fieldvalue;
                } else if (obj.fielddesc === 'District') {
                    respondentObj.District_1 = obj.fieldvalue;
                } else if (obj.fielddesc === 'Pin_Code') {
                    respondentObj.Pin_Code_1 = obj.fieldvalue;
                }
            }
            array.push(respondentObj);
        }
        return array;
    } catch (e) {
        return []
    }
}

module.exports.projectRespondent = async (data) => {
    try {
        let error = 0;
        let message = '';
        let arr = [];
        const dtl = await common.getProjectIdUserIdByRegNo(data.projRegNo);
        if (dtl) {
            console.log(dtl)
            let projectid = dtl.id;
            let userid = dtl.userid;
            if (data.type === 'Promoter' || data.type === 'Landowner') {
                const groupDtl = await dao.getProjectRespondentPositions({projectid: projectid, type: data.type});
                for (const obj of groupDtl) {
                    const groupType = await dao.getProjectLandOwnerShipTitleGroup({projectid: projectid,groupposition: obj.groupposition});
                    let fieldGroupId = 43;
                    if (groupType.fieldvalue === 'Joint') {
                        fieldGroupId = 32;
                    }
                    const fieldDetails = await dao.getFieldGroupDetails({projectid: projectid, groupposition: obj.groupposition, fieldgroupid: fieldGroupId});
                    arr = await makeOwnershipLIst(fieldDetails, arr, data.type);
                }
            } else if (data.type === 'Director') {
                const directorDtl = await dao.getDirectorDetails({userid: userid});
                arr = await makeDirectorLIst(directorDtl, arr, data.type);
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
                status: util.statusCode.SOME_ERROR_OCCURRED,
                message: 'No Project found',
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

const landownerDetails = async (projectId, respondentList) => {
    try {
        const result = await dao.getLandownerDetails(projectId);
        const groupList = await util.groupBy(result, 'pos');
        const keys = Object.keys(groupList);
        for(const key of keys) {
            const respondent = JSON.parse(JSON.stringify(config.respondent));
            respondent['Designation'] = 'Landowner';
            for (const d of groupList[key]) {
                for (const field of config.landownerFieldList) {
                    if (field.fieldid === d.fieldid) {
                        respondent[field.kayname] = d.fieldvalue;
                    }
                }
            }
            respondentList.push(respondent);
        }
        return true
    } catch (e) {
        console.log(e);
        return false;
    }
};

const getMemberDetails = async (userId, respondentList, type) => {
    try {
        let groupId = config.fieldGroupId[type];
        let fieldList = [];
        if (type === 'Society') {
            fieldList = config.memberFieldList;
        } else if (type === 'Partnership') {
            fieldList = config.partnerFirmFieldList;
        } else if (type === 'Liability') {
            fieldList = config.LiabilityFirmFieldList;
        } else if (type === 'Trust') {
            fieldList = config.TrustFirmFieldList;
        } else if (type === 'Cooperative') {
            fieldList = config.CooperativeFirmFieldList;
        } else if (type === 'Competent') {
            fieldList = config.CompetentFirmFieldList;
        }
        const result = await dao.getGroupValueDetails({userid: userId, groupid: groupId});
        const groupList = await util.groupBy(result, 'groupposition');
        const keys = Object.keys(groupList);
        for(const key of keys) {
            const respondent = JSON.parse(JSON.stringify(config.respondent));
            // respondent['Designation'] = 'Landowner';
            for (const d of groupList[key]) {
                for (const field of fieldList) {
                    if (field.fieldid === d.fieldid) {
                        respondent[field.kayname] = d.fieldvalue;
                    }
                }
            }
            respondentList.push(respondent);
        }
        return true
    } catch (e) {
        console.log(e);
        return false;
    }
}

