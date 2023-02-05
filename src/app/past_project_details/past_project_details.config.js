const readConn = require('../../dbconnection').readPool
const writeConn = require('../../dbconnection').writePool
const {config} = require('dotenv');
const util = require('../../utility/util');

module.exports.outputList = [
    {
        "fieldName": "Is_it_Registered_with_RERA",
        "fieldid": 330,
        "kayname": "Is_it_Registered_with_RERA",
        "whichfrom": 1
    }, {
        "fieldName": "Registered_With_RERA_of_which_State",
        "fieldid": 325,
        "kayname": "Registered_With_RERA_of_which_State",
        "whichfrom": 1
    }, {
        "fieldName": "RERA_Registration_No",
        "fieldid": 326,
        "kayname": "RERA_Registration_No",
        "whichfrom": 1
    }, {
        "fieldName": "Project_Status",
        "fieldid": 502,
        "kayname": "Project_Status",
        "whichfrom": 1
    }, {
        "fieldName": "Name_of_the Project",
        "fieldid": 399,
        "kayname": "Name_of_the Project",
        "whichfrom": 1
    }, {
        "fieldName": "Project_Type",
        "fieldid": 1,
        "kayname": "Project_Type",
        "whichfrom": 1
    }, {
        "fieldName": "Project_Address_Line__one",
        "fieldid": 387,
        "kayname": "Project_Address_Line__one",
        "whichfrom": 1
    }, {
        "fieldName": "Project_Address_Line_two",
        "fieldid": 338,
        "kayname": "Project_Address_Line_two",
        "whichfrom": 1
    }, {
        "fieldName": "District",
        "fieldid": 514,
        "kayname": "District",
        "whichfrom": 1
    }, {
        "fieldName": "Pin_Code",
        "fieldid": 10,
        "kayname": "Pin_Code",
        "whichfrom": 1
    }, {
        "fieldName": "Block",
        "fieldid": 11,
        "kayname": "Block",
        "whichfrom": 1
    }, {
        "fieldName": "Village_Sector",
        "fieldid": 7,
        "kayname": "Village_Sector",
        "whichfrom": 1
    }, {
        "fieldName": "Project_Website_Address",
        "fieldid": 406,
        "kayname": "Project_Website_Address",
        "whichfrom": 1
    }, {
        "fieldName": "Payment_Pending",
        "fieldid": 407,
        "kayname": "Payment_Pending",
        "whichfrom": 1
    }, {
        "fieldName": "No_of_month_Delayed_",
        "fieldid": 408,
        "kayname": "No_of_month_Delayed_",
        "whichfrom": 1
    }, {
        "fieldName": "If_development_is_in_phases",
        "fieldid": 411,
        "kayname": "If_development_is_in_phases",
        "whichfrom": 1
    }, {
        "fieldName": "Has_the_Project_Revoked",
        "fieldid": 412,
        "kayname": "Has_the_Project_Revoked",
        "whichfrom": 1
    }, {
        "fieldName": "Total_Area_of_Land_Sq_Mt",
        "fieldid": 523,
        "kayname": "Total_Area_of_Land_Sq_Mt",
        "whichfrom": 1
    }, {
        "fieldName": "Total_Open_Area_Sq_Mt",
        "fieldid": 415,
        "kayname": "Total_Open_Area_Sq_Mt",
        "whichfrom": 1
    }, {
        "fieldName": "Total_Covered_Area_Sq_Mt",
        "fieldid": 416,
        "kayname": "Total_Covered_Area_Sq_Mt",
        "whichfrom": 1
    }, {
        "fieldName": "Total_Builtup_Area_Sq_Mt",
        "fieldid": 13,
        "kayname": "Total_Builtup_Area_Sq_Mt",
        "whichfrom": 1
    }, {
        "fieldName": "Plan_Sanction_Authority",
        "fieldid": 14,
        "kayname": "Plan_Sanction_Authority",
        "whichfrom": 1
    }, {
        "fieldName": "Plan_Sanction_Year",
        "fieldid": 541,
        "kayname": "Plan_Sanction_Year",
        "whichfrom": 1
    }, {
        "fieldName": "Total_Sanction_Area",
        "fieldid": 542,
        "kayname": "Total_Sanction_Area",
        "whichfrom": 1
    }, {
        "fieldName": "Any_payment_pending_against_the_project_to_Landowner_etc",
        "fieldid": 539,
        "kayname": "Any_payment_pending_against_the_project_to_Landowner_etc",
        "whichfrom": 1
    }, {
        "fieldName": "Project_Commencement_Date_Past_Project",
        "fieldid": 496,
        "kayname": "Project_Commencement_Date_Past_Project",
        "whichfrom": 1
    }, {
        "fieldName": "Project_Sanctioned_Year",
        "fieldid": 418,
        "kayname": "Project_Sanctioned_Year",
        "whichfrom": 1
    }, {
        "fieldName": "Project_Sanction_State",
        "fieldid": 419,
        "kayname": "Project_Sanction_State",
        "whichfrom": 1
    }, {
        "fieldName": "Completion_delay",
        "fieldid": 420,
        "kayname": "Completion_delay",
        "whichfrom": 1
    }, {
        "fieldName": "Revenue_Estates_Name ",
        "fieldid": 223,
        "kayname": "Revenue_Estates_Name ",
        "whichfrom": 2
    }, {
        "fieldName": "Survey_No",
        "fieldid": 224,
        "kayname": "Survey_No",
        "whichfrom": 2
    }, {
        "fieldName": "Cadastral_No",
        "fieldid": 225,
        "kayname": "Cadastral_No",
        "whichfrom": 2
    }, {
        "fieldName": "Khasra_Plot No",
        "fieldid": 226,
        "kayname": "Khasra_Plot No",
        "whichfrom": 2
    }, {
        "fieldName": "Land_Type",
        "fieldid": 426,
        "kayname": "Land_Type",
        "whichfrom": 2
    }, {
        "fieldName": "SubDivision",
        "fieldid": 9,
        "kayname": "SubDivision",
        "whichfrom": 1
    }, {
        "fieldName": "Thana",
        "fieldid": 588,
        "kayname": "Thana",
        "whichfrom": 1
    }, {
        "fieldName": "Mauja",
        "fieldid": 689,
        "kayname": "Mauja",
        "whichfrom": 1
    }, {
        "fieldName": "Project_Completion_Date",
        "fieldid": 497,
        "kayname": "Project_Completion_Date",
        "whichfrom": 1
    }, {
        "fieldName": "Proposed_Project_In",
        "fieldid": 493,
        "kayname": "Proposed_Project_In",
        "whichfrom": 1
    }, {
        "fieldName": "Does_it_Fall_under_Planning_Area",
        "fieldid": 582,
        "kayname": "Does_it_Fall_under_Planning_Area",
        "whichfrom": 1
    }, {
        "fieldName": "Municipal_Area_Name",
        "fieldid": 581,
        "kayname": "Municipal_Area_Name",
        "whichfrom": 1
    }, {
        "fieldName": "Planning_Area_Name",
        "fieldid": 583,
        "kayname": "Planning_Area_Name",
        "whichfrom": 1
    }, {
        "fieldName": "Plan_Sanction_Date",
        "fieldid": 515,
        "kayname": "Plan_Sanction_Date",
        "whichfrom": 1
    }, {
        "fieldName": "Project_Commencement_Date",
        "fieldid": 496,
        "kayname": "Project_Commencement_Date",
        "whichfrom": 1
    }, {
        "fieldName": "Planned_Completion_Date",
        "fieldid": 497,
        "kayname": "Planned_Completion_Date",
        "whichfrom": 1
    }, {
        "fieldName": "Geographic_Location",
        "fieldid": 21,
        "kayname": "Geographic_Location",
        "whichfrom": 1
    }, {
        "fieldName": "Geographic_Other_Location",
        "fieldid": 347,
        "kayname": "Geographic_Other_Location",
        "whichfrom": 1
    }, {
        "fieldName": "Estimated_Cost_of_Land",
        "fieldid": 586,
        "kayname": "Estimated_Cost_of_Land",
        "whichfrom": 1
    }, {
        "fieldName": "Total_Project_Area",
        "fieldid": 523,
        "kayname": "Total_Project_Area",
        "whichfrom": 1
    }, {
        "fieldName": "Received_Fire",
        "fieldid": 654,
        "kayname": "Received_Fire",
        "whichfrom": 1
    }, {
        "fieldName": "Issue_Date_fire",
        "fieldid": 655,
        "kayname": "Issue_Date_fire",
        "whichfrom": 1
    }, {
        "fieldName": "Validity_Date_fire",
        "fieldid": 656,
        "kayname": "Validity_Date_fire",
        "whichfrom": 1
    }, {
        "fieldName": "Fire_Upload_NOC",
        "fieldid": 657,
        "kayname": "Fire_Upload_NOC",
        "whichfrom": 1
    }, {
        "fieldName": "Fire_Reason",
        "fieldid": 658,
        "kayname": "Fire_Reason",
        "whichfrom": 1
    }, {
        "fieldName": "Likely_Issue_Date",
        "fieldid": 659,
        "kayname": "Likely_Issue_Date",
        "whichfrom": 1
    }, {
        "fieldName": "Received_Aai",
        "fieldid": 660,
        "kayname": "Received_Aai",
        "whichfrom": 1
    }, {
        "fieldName": "AAI_Issue_Date",
        "fieldid": 663,
        "kayname": "AAI_Issue_Date",
        "whichfrom": 1
    }, {
        "fieldName": "AAi_Validity_Date",
        "fieldid": 665,
        "kayname": "AAi_Validity_Date",
        "whichfrom": 1
    }, {
        "fieldName": "AAI_Upload_NOC",
        "fieldid": 667,
        "kayname": "AAI_Upload_NOC",
        "whichfrom": 1
    }, {
        "fieldName": "AAI_Reason",
        "fieldid": 669,
        "kayname": "AAI_Reason",
        "whichfrom": 1
    }, {
        "fieldName": "AAi_Likely_Issue_Date",
        "fieldid": 673,
        "kayname": "AAi_Likely_Issue_Date",
        "whichfrom": 1
    }, {
        "fieldName": "Received_Environmental",
        "fieldid": 661,
        "kayname": "Received_Environmental",
        "whichfrom": 1
    }, {
        "fieldName": "Environmental_Issue_Date",
        "fieldid": 664,
        "kayname": "Environmental_Issue_Date",
        "whichfrom": 1
    }, {
        "fieldName": "Environmental_Validity_Date",
        "fieldid": 666,
        "kayname": "Environmental_Validity_Date",
        "whichfrom": 1
    }, {
        "fieldName": "Environmental_Upload_NOC",
        "fieldid": 668,
        "kayname": "Environmental_Upload_NOC",
        "whichfrom": 1
    }, {
        "fieldName": "Environmental_Reason",
        "fieldid": 670,
        "kayname": "Environmental_Reason",
        "whichfrom": 1
    }, {
        "fieldName": "En_Likely_Issue_Date",
        "fieldid": 674,
        "kayname": "En_Likely_Issue_Date",
        "whichfrom": 1
    }, {
        "fieldName": "Brief_detail_of_project",
        "fieldid": 432,
        "kayname": "Brief_detail_of_project",
        "whichfrom": 1
    }, {
        "fieldName": "Registration_Number",
        "fieldid": 894,
        "kayname": "Registration_Number",
        "whichfrom": 1
    }
];

module.exports.staticIdsForLandDetails = {
    "stepid": 6,
    "groupid": 30
}

module.exports.JSONData = {
    'projectRegNo': '',
    'Project_Started_in_year': '',
    "Is_it_Registered_with_RERA": "",
    "Registered_With_RERA_of_which_State": "",
    "RERA_Registration_No": "",
    "Project_Status": "",
    "Name_of_the Project": "",
    "Project_Type": "",
    "Project_Address_Line__one": "",
    "Project_Address_Line_two": "",
    "District": "",
    "Thana": "",
    "SubDivision": "",
    "Pin_Code": "",
    "Block": "",
    "Village_Sector": "",
    "Project_Website_Address": "",
    "Payment_Pending": "",
    "No_of_month_Delayed_": "",
    "If_development_is_in_phases": "",
    "Has_the_Project_Revoked": "",
    "Total_Area_of_Land_Sq_Mt": "",
    "Total_Open_Area_Sq_Mt": "",
    "Total_Covered_Area_Sq_Mt": "",
    "Total_Builtup_Area_Sq_Mt": "",
    "Plan_Sanction_Authority": "",
    "Plan_Sanction_Year": "",
    "Total_Sanction_Area": "",
    "Any_payment_pending_against_the_project_to_Landowner_etc": "",
    "For_not_registred_with_RERA_take_Commecment_Date": "",
    "Project_Sanctioned_Year": "",
    "Project_Sanction_State": "",
    "Completion_delay": "",
    "Planned_Completion_Date": "",
    "Proposed_Project_In": "",
    "Does_it_Fall_under_Planning_Area": "",
    "Municipal_Area_Name": "",
    "Planning_Area_Name": "",
    "Plan_Sanction_Date": "",
    "Project_Commencement_Date": "",
    "Geographic_Location": "",
    "Geographic_Other_Location": "",
    "Estimated_Cost_of_Land": "",
    "Total_Project_Area": "",
    "Registration_Number": "",
    "Number_of_Cases_pending_against_the_project_with_RERA_Bihar_": "",
    "Land Details": {
        "landdetails_keys": [],
        "landdetails_values": []
    },
    "Is there any Cases?": {
        "fielddetails": [],
        "fielddetailskeys": []
    }
}

const landDetails = [{
    keyName: 'Revenue_Estates_Name',
    fieldid: 690,
    fielddesc: 'Revenue_Estate'
}, {
    keyName: 'Khasra_Plot No',
    fieldid: 831,
    fielddesc: 'Khata_No_dot'
}];

module.exports.getPastProjectDetails = async (data, outputList) => {
    try {
        console.log('project id >>> ', data.id);
        const fieldValues = [];
        for (let j = 0; j < outputList.length; j++) {
            if (outputList[j].whichfrom == 1) {
                fieldValues.push(outputList[j].fieldid);
            }
        }
        const result = [];
        for (let i = 0; i < fieldValues.length; i++) {
            const sql = "SELECT * FROM mst_entitytype_project_dtl where entitytypeprojecthdrid=? and userid=? and fieldid=?" +
                " and groupposition is null and deleted='0'";
            const [value] = await readConn.query(sql, [data.id, data.particularprofileid, fieldValues[i]]);
            if (value.length > 0) {
                result.push(value[0]);
            }
            if ((fieldValues.length - 1) === i) {
                return result;
            }
        }
        if (fieldValues.length === 0) {
            return result;
        }
    } catch (e) {
        util.createLog(e);
        return null;
    }
}

module.exports.getPastProjectLandDetails = async (data) => {
    try{
        const outputList = [];
        const sql = "SELECT a.projectfieldvalue as fieldvalue, a.fieldid, b.fielddesc, a.groupposition FROM mst_entitytype_project_dtl as a, mst_fields b " +
            "where a.entitytypeprojecthdrid=? and a.stepid=6 and a.userid=? and a.groupid=30 and a.fieldid in(691, 831, 690) and a.deleted='0' and a.fieldid=b.fieldid order by a.groupposition asc";
        const [result] = await readConn.query(sql, [data.id, data.particularprofileid]);
        if (result.length > 0) {
            const resultGroup = util.groupBy(result, 'groupposition');
            // console.log(JSON.stringify(resultGroup));
            const keys = Object.keys(resultGroup);
            for (const [index, key] of keys.entries()) {
                const outputObj = {};
                for (const obj of landDetails) {
                    outputObj[obj.keyName] = '';
                    for (const d of resultGroup[key]) {
                        if (d.fielddesc === obj.fielddesc) {
                            outputObj[obj.keyName] = d.fieldvalue;
                            break;
                        }
                    }
                }
                outputObj['Landowners_Involved'] = await getLandOwnerName(data.id, index);
                outputList.push(outputObj);
                if (index === (keys.length - 1)) {
                    return outputList;
                }
            }
        } else {
            return [];
        }
    } catch (e) {
        util.createLog(e);
        return [];
    }
}

const getLandOwnerName = async (projectid, groupposition) => {
    try {
        const sql = "SELECT GROUP_CONCAT(projectfieldvalue) as landowners FROM mst_entitytype_project_dtl WHERE entitytypeprojecthdrid = ? AND fieldid = 696 AND groupid = 30 AND groupposition = ? AND groupposition IN (" +
            "SELECT groupposition FROM mst_entitytype_project_dtl WHERE entitytypeprojecthdrid = ? AND fieldid = 693 AND groupid = 30 AND projectfieldvalue='Landowner')"
        const [result] = await readConn.query(sql, [projectid, groupposition, projectid]);
        return result.length > 0 ? result[0].landowners : '';
    } catch (e) {
        return '';
    }
}

