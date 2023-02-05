const dao = require('./past_project_details.dao');
const config = require('./past_project_details.config');
const token = require('../../utility/token');
const util = require('../../utility/util');
const { json } = require('express');

const groupBy = (xs, key) => {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}

module.exports.pastProjectsInfo = async (data) => {
    try {
        var stepFieldList = await dao.getPastProjectList(data);
        // console.log(JSON.stringify(stepFieldList));
        var outputList = JSON.parse(JSON.stringify(config.outputList));
        var JSONData = JSON.parse(JSON.stringify(config.JSONData));
        // var landDetails = JSON.parse(JSON.stringify(config.landDetails));
        // var staticIdsForLandDetails = JSON.parse(JSON.stringify(config.staticIdsForLandDetails));
        if (stepFieldList) {
            var result = [];
            var storeRecords = [];
            var storeKeys = [];
            var storeLandDetailsKeys = [];
            if(stepFieldList.length > 0){
                for(let i=0;i<stepFieldList.length;i++){
                    JSONData['projectRegNo'] = stepFieldList[i].projectuid;
                    JSONData['projectid'] = stepFieldList[i].id;
                    JSONData[outputList[4].fieldName] = stepFieldList[i].projectfieldvalue;
                    JSONData['Registration_Number'] = stepFieldList[i].projectuid;
                    result = await config.getPastProjectDetails(stepFieldList[i], outputList);
                    if(result.length > 0){
                        for(let j=0;j<result.length;j++){
                            for(let k=0;k<outputList.length;k++){
                                if(outputList[k].whichfrom == 1) {
                                    if(j == 0 && i == 0) {
                                        storeKeys.push(outputList[k].fieldName);
                                    }
                                    if((result[j].fieldid == outputList[k].fieldid) && (result[j].fieldid !== outputList[4].fieldid)){
                                        JSONData[outputList[k].fieldName] = result[j].projectfieldvalue;
                                    }
                                }
                            }
                        }
                        JSONData["Land Details"] = await config.getPastProjectLandDetails(stepFieldList[i]);
                        storeRecords.push(JSONData);
                        JSONData = JSON.parse(JSON.stringify(config.JSONData));
                    }
                }
                storeKeys.push("Land Details");
                return {success: true, status: util.statusCode.SUCCESS, message: '', 
                        response: await util.encryptResponse({
                            "pastproject_keys": storeKeys, 
                            "pastproject_values":storeRecords
                        })}
            } else {
                return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse([])}
            }
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        util.createLog(e);
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
};

module.exports.getPastProjectOutsideCaseDtl = async (data) => {
    try {
        const result = await dao.getPastProjectOutsideCaseDtl(data);
        if (result.length > 0) {
            const resultGroup = await util.groupBy(result, 'groufieldpposition');
            return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(resultGroup)};
        } else {
            return {success: true, status: util.statusCode.SUCCESS, message: '', response: null};
        }
    } catch (e) {
        util.createLog(e);
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}