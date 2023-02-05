const readConn = require('../../dbconnection').readPool;
const writeConn = require('../../dbconnection').writePool;
const util = require('../../utility/util');

// 1=> Project, 2 => Profile, 3=> Director, 4=> Landowner
module.exports.outputList = [
    {
        "fieldName": "Address",
        "fieldid": 387,
        "kayname": "Project_Address",
        "whichfrom": 1
    }, {
        "fieldName": "Proposed_Start_Date",
        "fieldid": 496,
        "kayname": "project_start_date",
        "whichfrom": 1
    }, {
        "fieldName": "Proposed_End_Date",
        "fieldid": 497,
        "kayname": "project_complited_date",
        "whichfrom": 1
    }, {
        "fieldName": "Project_Category",
        "fieldid": 1,
        "kayname": "Project_Type",
        "whichfrom": 1
    }, {
        "fieldName": "State",
        "fieldid": 513,
        "kayname": "Project_State",
        "whichfrom": 1
    }, {
        "fieldName": "District",
        "fieldid": 514,
        "kayname": "Project_District",
        "whichfrom": 1
    }, {
        "fieldName": "Address",
        "fieldid": 17,
        "kayname": "Address",
        "whichfrom": 2
    }, {
        "fieldName": "Address_Line_one",
        "fieldid": 30,
        "kayname": "Address_1Respondent",
        "whichfrom": 2
    }, {
        "fieldName": "Address_Line_two",
        "fieldid": 31,
        "kayname": "Address_1Respondent2",
        "whichfrom": 2
    }, {
        "fieldName": "State",
        "fieldid": 18,
        "kayname": "State_1",
        "whichfrom": 2
    }, {
        "fieldName": "District",
        "fieldid": 19,
        "kayname": "District_1",
        "whichfrom": 2
    }, {
        "fieldName": "Pin_Code",
        "fieldid": 21,
        "kayname": "Pin_Code_1",
        "whichfrom": 2
    }, {
        "fieldName": "Mobile_Number",
        "fieldid": 129,
        "kayname": "Telephone_Number1",
        "whichfrom": 2
    }, {
        "fieldName": "Email_ID",
        "fieldid": 22,
        "kayname": "emailAddress1",
        "whichfrom": 2
    }, {
        "fieldName": "Name_Director",
        "fieldid": 285,
        "kayname": "Name",
        "whichfrom": 3
    }, {
        "fieldName": "Designation",
        "fieldid": 447,
        "kayname": "Designation",
        "whichfrom": 3
    }, {
        "fieldName": "Home_Address_Line_one",
        "fieldid": 132,
        "kayname": "Address_1Respondent",
        "whichfrom": 3
    }, {
        "fieldName": "Home_Address_Line_two",
        "fieldid": 133,
        "kayname": "Address_1Respondent2",
        "whichfrom": 3
    }, {
        "fieldName": "Email_ID_Director",
        "fieldid": 283,
        "kayname": "EmailAddress1",
        "whichfrom": 3
    }, {
        "fieldName": "Mobile_Number_Director",
        "fieldid": 284,
        "kayname": "Telephone_Number1",
        "whichfrom": 3
    }, {
        "fieldName": "State",
        "fieldid": 18,
        "kayname": "State_1",
        "whichfrom": 3
    }, {
        "fieldName": "District",
        "fieldid": 19,
        "kayname": "District_1",
        "whichfrom": 3
    }, {
        "fieldName": "Pin_Code",
        "fieldid": 21,
        "kayname": "Pin_Code_1",
        "whichfrom": 3
    },
];

module.exports.landownerFieldList = [{
    "fieldName": "Name",
    "fieldid": 973,
    "kayname": "Name",
    "whichfrom": 4
}, {
    "fieldName": "Contact_No",
    "fieldid": 764,
    "kayname": "Telephone_Number1",
    "whichfrom": 4
}, {
    "fieldName": "Email_Id",
    "fieldid": 373,
    "kayname": "EmailAddress1",
    "whichfrom": 4
}, {
    "fieldName": "Designation",
    "fieldid": null,
    "kayname": "Designation",
    "whichfrom": 4
}];

module.exports.fieldGroupId = {
    Society: 15,
    Partnership: 19,
    Liability: 14,
    Trust: 12,
    Cooperative: 18,
    Competent: 8      // Director
}

module.exports.memberFieldList = [
    {
        "fieldName": "Name",
        "fieldid": 328,
        "kayname": "Name",
        "whichfrom": 4
    }, {
        "fieldName": "Contact_No",
        "fieldid": 334,
        "kayname": "Telephone_Number1",
        "whichfrom": 4
    }, {
        "fieldName": "Email_Id",
        "fieldid": 329,
        "kayname": "EmailAddress1",
        "whichfrom": 4
    }, {
        "fieldName": "Designation",
        "fieldid": 253,
        "kayname": "Designation",
        "whichfrom": 4
    }, {
        "fieldName": "Address",
        "fieldid": 132,
        "kayname": "Address_1Respondent",
        "whichfrom": 4
    }, {
        "fieldName": "Sate",
        "fieldid": 18,
        "kayname": "State_1",
        "whichfrom": 4
    }, {
        "fieldName": "District",
        "fieldid": 19,
        "kayname": "District_1",
        "whichfrom": 4
    }, {
        "fieldName": "Pin_Code",
        "fieldid": 21,
        "kayname": "Pin_Code_1",
        "whichfrom": 4
    }
];

module.exports.partnerFirmFieldList = [
    {
        "fieldName": "Name",
        "fieldid": 342,
        "kayname": "Name",
        "whichfrom": 4
    }, {
        "fieldName": "Contact_No",
        "fieldid": 334,
        "kayname": "Telephone_Number1",
        "whichfrom": 4
    }, {
        "fieldName": "Email_Id",
        "fieldid": 350,
        "kayname": "EmailAddress1",
        "whichfrom": 4
    }, {
        "fieldName": "Designation",
        "fieldid": 252,
        "kayname": "Designation",
        "whichfrom": 4
    }, {
        "fieldName": "Address",
        "fieldid": 132,
        "kayname": "Address_1Respondent",
        "whichfrom": 4
    }, {
        "fieldName": "Sate",
        "fieldid": 18,
        "kayname": "State_1",
        "whichfrom": 4
    }, {
        "fieldName": "District",
        "fieldid": 19,
        "kayname": "District_1",
        "whichfrom": 4
    }, {
        "fieldName": "Pin_Code",
        "fieldid": 21,
        "kayname": "Pin_Code_1",
        "whichfrom": 4
    }
];

module.exports.LiabilityFirmFieldList = [
    {
        "fieldName": "Name",
        "fieldid": 306,
        "kayname": "Name",
        "whichfrom": 4
    }, {
        "fieldName": "Contact_No",
        "fieldid": 334,
        "kayname": "Telephone_Number1",
        "whichfrom": 4
    }, {
        "fieldName": "Email_Id",
        "fieldid": 307,
        "kayname": "EmailAddress1",
        "whichfrom": 4
    }, {
        "fieldName": "Designation",
        "fieldid": 252,
        "kayname": "Designation",
        "whichfrom": 4
    }, {
        "fieldName": "Address",
        "fieldid": 132,
        "kayname": "Address_1Respondent",
        "whichfrom": 4
    }, {
        "fieldName": "Sate",
        "fieldid": 18,
        "kayname": "State_1",
        "whichfrom": 4
    }, {
        "fieldName": "District",
        "fieldid": 19,
        "kayname": "District_1",
        "whichfrom": 4
    }, {
        "fieldName": "Pin_Code",
        "fieldid": 21,
        "kayname": "Pin_Code_1",
        "whichfrom": 4
    }
];

module.exports.TrustFirmFieldList = [
    {
        "fieldName": "Name",
        "fieldid": 317,
        "kayname": "Name",
        "whichfrom": 4
    }, {
        "fieldName": "Contact_No",
        "fieldid": 323,
        "kayname": "Telephone_Number1",
        "whichfrom": 4
    }, {
        "fieldName": "Email_Id",
        "fieldid": 318,
        "kayname": "EmailAddress1",
        "whichfrom": 4
    }, {
        "fieldName": "Designation",
        "fieldid": 254,
        "kayname": "Designation",
        "whichfrom": 4
    }, {
        "fieldName": "Address",
        "fieldid": 132,
        "kayname": "Address_1Respondent",
        "whichfrom": 4
    }, {
        "fieldName": "Sate",
        "fieldid": 18,
        "kayname": "State_1",
        "whichfrom": 4
    }, {
        "fieldName": "District",
        "fieldid": 19,
        "kayname": "District_1",
        "whichfrom": 4
    }, {
        "fieldName": "Pin_Code",
        "fieldid": 21,
        "kayname": "Pin_Code_1",
        "whichfrom": 4
    }
];

module.exports.CooperativeFirmFieldList = [
    {
        "fieldName": "Name",
        "fieldid": 339,
        "kayname": "Name",
        "whichfrom": 4
    }, {
        "fieldName": "Contact_No",
        "fieldid": 353,
        "kayname": "Telephone_Number1",
        "whichfrom": 4
    }, {
        "fieldName": "Email_Id",
        "fieldid": 340,
        "kayname": "EmailAddress1",
        "whichfrom": 4
    }, {
        "fieldName": "Designation",
        "fieldid": 253,
        "kayname": "Designation",
        "whichfrom": 4
    }, {
        "fieldName": "Address",
        "fieldid": 132,
        "kayname": "Address_1Respondent",
        "whichfrom": 4
    }, {
        "fieldName": "Sate",
        "fieldid": 18,
        "kayname": "State_1",
        "whichfrom": 4
    }, {
        "fieldName": "District",
        "fieldid": 19,
        "kayname": "District_1",
        "whichfrom": 4
    }, {
        "fieldName": "Pin_Code",
        "fieldid": 21,
        "kayname": "Pin_Code_1",
        "whichfrom": 4
    }
];

module.exports.CompetentFirmFieldList = [
    {
        "fieldName": "Name",
        "fieldid": 285,
        "kayname": "Name",
        "whichfrom": 4
    }, {
        "fieldName": "Contact_No",
        "fieldid": 284,
        "kayname": "Telephone_Number1",
        "whichfrom": 4
    }, {
        "fieldName": "Email_Id",
        "fieldid": 283,
        "kayname": "EmailAddress1",
        "whichfrom": 4
    }, {
        "fieldName": "Designation",
        "fieldid": 124,
        "kayname": "Designation",
        "whichfrom": 4
    }, {
        "fieldName": "Address",
        "fieldid": 132,
        "kayname": "Address_1Respondent",
        "whichfrom": 4
    }, {
        "fieldName": "Sate",
        "fieldid": 18,
        "kayname": "State_1",
        "whichfrom": 4
    }, {
        "fieldName": "District",
        "fieldid": 19,
        "kayname": "District_1",
        "whichfrom": 4
    }, {
        "fieldName": "Pin_Code",
        "fieldid": 21,
        "kayname": "Pin_Code_1",
        "whichfrom": 4
    }
];

module.exports.StoreRecord = {
    "entitytypeprojecthdrid": "",
    "fieldid": "",
    "userid": ""
};

module.exports.JSONData =
    {
        "id": "",
        "client_id": "",
        "Promoter_name": "",
        "Promoter_id": "",
        "Promoter_spg_id": "",
        "Project_Name": "",
        "Project_Reg_No": "",
        "Project_registration_Status": "",
        "Project_Address": "",
        "Project_RERA_Address": "",
        "Project_State": "",
        "Project_District": "",
        "delete_flag": "",
        "Project_Type": "",
        "Project_Status": "",
        "project_start_date": "",
        "project_complited_date": "",
        "respondent_details": []
    }

module.exports.respondent = {
    "Id": "",
    "Name": "",
    "Designation": "",
    "Address_1Respondent": "",
    "Address_1Respondent2": "",
    "State_1": "",
    "District_1": "",
    "Subdivision_1": "",
    "Circle_1": "",
    "Pin_Code_1": "",
    "Telephone_Number1": "",
    "EmailAddress1": ""
}

module.exports.pastproject = {
    "fieldid": 399,
    "groupid": 17
}

module.exports.noData = {
    "details": [
        {
            "id": -1,
            "Project_Name": "Project is not registered with RERA, enterdetails",
            "Project_Reg_No": "",
            "Promoter_name": ""
        }
    ]
}


module.exports.getRegistrationNo = async (data, result1) => {
    try {
        const sql = "SELECT projectuid FROM mst_entitytype_project_hdr where projectfieldvalue like ? and particularprofileid=? and isdelete='0'";
        const [result] = await readConn.query(sql, ["%" + data.search + "%", result1.particularprofileid]);
        // util.createLog(result.length);
        return result[0].projectuid;
    } catch (e) {
        util.createLog(e);
        return null;
    }
}


module.exports.mstSearchForProject = async (data) => {
    try {
        const sql = "select fieldid from mst_fields where fielddesc = 'Project_Name' and deleted = '0'";
        const [result] = await readConn.query(sql);
        // util.createLog(result.length);
        return result;
    } catch (e) {
        util.createLog(e);
        return null;
    }
}

module.exports.mstSearchForProfile = async (data) => {
    try {
        const sql = "select fieldid from mst_entity_profile_fields where fielddesc = 'Full_Name' and deleted = '0'";
        const [result] = await readConn.query(sql);
        // util.createLog(result.length);
        return result;
    } catch (e) {
        util.createLog(e);
        return null;
    }
}

module.exports.mstSearchForProfileDetails = async (data, result1, ArrayList) => {
    try {
        const fieldValues = [];
        for (let j = 0; j < ArrayList.length; j++) {
            if (Number(ArrayList[j].whichfrom) === 2) {
                fieldValues.push(ArrayList[j].fieldid);
            }
        }
        const result = [];
        for (let i = 0; i < fieldValues.length; i++) {
            const sql = "select b.fieldid, b.fieldvalue from mst_entity_profile_values_dtl b where"
                + " b.fieldid=? and b.userid=? and b.deleted='0'";
            const value = await readConn.query(sql, [fieldValues[i], result1.particularprofileid]);
            if (value[0][0] !== undefined) {
                result.push(value[0][0]);
            }
        }
        // util.createLog(result.length);
        return result;
    } catch (e) {
        util.createLog(e);
        return null;
    }
}

module.exports.mstSearchForProjectDetails = async (data, result1, ArrayList, type) => {
    try {
        const fieldValues = [];
        for (let j = 0; j < ArrayList.length; j++) {
            if (Number(ArrayList[j].whichfrom) === 1) {
                fieldValues.push(ArrayList[j].fieldid);
            }
        }
        const result = [];
        var sql;
        var value;
        for (let i = 0; i < fieldValues.length; i++) {
            if (type == 'past_project') {
                sql = "select b.fieldid, b.projectfieldvalue from mst_entitytype_project_dtl b where b.userid=? and b.entitytypeprojecthdrid=? " +
                    "and b.groupid=? and b.groupposition=? and b.fieldid=? and b.deleted='0' limit 1";
                [value] = await readConn.query(sql, [result1.particularprofileid, result1.id, result1.groupid, result1.groupposition, fieldValues[i]]);
            } else {
                sql = "select b.fieldid, b.projectfieldvalue from mst_entitytype_project_dtl b where b.userid=? and b.entitytypeprojecthdrid=? and b.fieldid=? and b.deleted='0' limit 1";
                [value] = await readConn.query(sql, [result1.particularprofileid, result1.id, fieldValues[i]]);
            }
            if (value.length > 0) {
                result.push(value[0]);
            }
        }
        // util.createLog(result.length);
        return result;
    } catch (e) {
        util.createLog(e);
        return null;
    }
}


module.exports.mstSearchForDirectorDetails = async (data, result1, staticgroupid, ArrayList, type) => {
    try {
        const fieldValues = [];
        for (let j = 0; j < ArrayList.length; j++) {
            if (Number(ArrayList[j].whichfrom) === 3) {
                fieldValues.push(ArrayList[j].fieldid);
            }
        }
        const result = [];
        var sql;
        var value;
        for (let i = 0; i < fieldValues.length; i++) {
            if (type == 'past_project') {
                sql = "select b.fieldid, b.fieldvalue, b.groupid, b.groupposition from mst_entity_profile_values_dtl b where"
                    + " b.fieldid=? and b.userid=? and b.groupid=? and b.groupposition=? and b.deleted='0' group by b.groupposition";
                [value] = await readConn.query(sql, [fieldValues[i], result1.particularprofileid, result1.groupid, result1.groupposition]);
            } else {
                sql = "select b.fieldid, b.fieldvalue, b.groupid, b.groupposition from mst_entity_profile_values_dtl b where"
                    + " b.fieldid=? and b.userid=? and b.groupid=? and b.deleted='0' group by b.groupposition";
                [value] = await readConn.query(sql, [fieldValues[i], result1.particularprofileid, staticgroupid]);
            }
            if (value.length > 0) {
                result.push(value[0]);
            }
        }
        // util.createLog(result.length);
        return result;
    } catch (e) {
        util.createLog(e);
        return null;
    }
}


module.exports.mstSearchForLandownerDetails = async (data, result1, ArrayList, type) => {
    try {
        const stepId = 6;
        const fieldValues = [];
        for (let j = 0; j < ArrayList.length; j++) {
            if (Number(ArrayList[j].whichfrom) === 4) {
                if (ArrayList[j].fieldid !== null) {
                    fieldValues.push(ArrayList[j].fieldid);
                }
            }
        }
        const result = [];
        var sql;
        var value;
        for (let i = 0; i < fieldValues.length; i++) {
            if (type == 'past_project') {
                sql = "select fieldid, projectfieldvalue as fieldvalue from mst_entitytype_project_dtl where fieldid=? and userid=? and " +
                    "entitytypeprojecthdrid=? and groupid=? and groupposition=? and deleted='0' and projectfieldvalue!='' and projectfieldvalue is not null";
                [value] = await readConn.query(sql, [fieldValues[i], result1.particularprofileid, result1.id, result1.groupid, result1.groupposition]);
            } else {
                sql = "select fieldid, projectfieldvalue as fieldvalue, CONCAT(groupposition, groufieldpposition) as pos from mst_entitytype_project_dtl where stepid=? and fieldid=? and " +
                    "entitytypeprojecthdrid=? and deleted='0' and projectfieldvalue!='' and projectfieldvalue is not null AND groupid = 47 AND fieldgroupid = 48";
                [value] = await readConn.query(sql, [stepId, fieldValues[i], result1.id]);
            }
            if (value[0] !== undefined) {
                result.push(value[0]);
            }
        }
        return result.length > 0 ? result : [];
    } catch (e) {
        util.createLog(e);
        return null;
    }
}







