const readConn = require('../../dbconnection').readPool
const writeConn = require('../../dbconnection').writePool
const util = require('../../utility/util');

module.exports.addAadhaar  = async(data) => {
    try {
        if(data.groupid === ''){
            data.groupid = null;
            data.groupposition = null;
        }
        if(data.groupposition === ''){
            data.groupposition = 0;
        }
        const sql = "INSERT INTO field_validation (reraid, userid, fieldvalue, fieldid, stepid, groupid, groupposition) values (?,?,?,?,?,?,?)";
        const [result] = await  readConn.query(sql,[data.reraid, data.userid, data.aadhaarno, data.fieldid, data.stepid, data.groupid, data.groupposition]);
        return result.insertId;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.updateAadhaarVarification = async (id) => {
    try {
        const sql = "UPDATE field_validation SET isvarified = '1' WHERE id = ? AND deleted='0'";
        const result = await  writeConn.query(sql,[id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.updateMstEntityProfileDtlTemp = async (data) => {
    try {
        let result;
        let result2;
        if(data.groupposition === ''){
            data.groupposition = 0;
        }
        if(data.groupid === ''){
            const sql = "UPDATE mst_entity_profile_dtl_temp SET isverified = '1' WHERE userid = ? AND stepid = ? AND fieldid = ?";
            const sql2 = "UPDATE mst_entity_profile_values_dtl SET isverified = '1' WHERE userid = ? AND stepid = ? AND fieldid = ?";
            result = await  writeConn.query(sql,[data.userid, data.stepid, data.fieldid]);
            result2 = await  writeConn.query(sql2,[data.userid, data.stepid, data.fieldid]);
        } else {
            const sql = "UPDATE mst_entity_profile_dtl_temp SET isverified = '1' WHERE userid = ? AND stepid = ? AND fieldid = ? AND groupid = ? AND groupposition = ?";
            const sql2 = "UPDATE mst_entity_profile_values_dtl SET isverified = '1' WHERE userid = ? AND stepid = ? AND fieldid = ? AND groupid = ? AND groupposition = ?";
            result = await  writeConn.query(sql,[data.userid, data.stepid, data.fieldid, data.groupid, data.groupposition]);
            result2 = await  writeConn.query(sql2,[data.userid, data.stepid, data.fieldid, data.groupid, data.groupposition]);
        }
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.updateMstEntitytypeProjectDtl = async (data) => {
    try {
        if(data.groupposition === ''){
            data.groupposition = 0;
        }
        let result;
        let result2;
        if(data.groupid === ''){
            const sql = "UPDATE mst_entitytype_project_dtl SET isverified = '1' WHERE userid=? AND stepid=? AND fieldid=? AND entitytypeprojecthdrid=? AND deleted='0'";
            const sql2 = "UPDATE mst_entitytype_project_dtl_temp SET isverified = '1' WHERE stepid=? AND fieldid=? AND entitytypeprojecthdrid=?";
            result = await  writeConn.query(sql,[data.userid, data.stepid, data.fieldid, data.projectid]);
            result2 = await  writeConn.query(sql2,[data.stepid, data.fieldid, data.projectid]);
        } else {
            const sql = "UPDATE mst_entitytype_project_dtl SET isverified = '1' WHERE userid=? AND stepid=? AND fieldid=? AND entitytypeprojecthdrid=? AND groupid=? AND groupposition=? AND deleted='0'";
            const sql2 = "UPDATE mst_entitytype_project_dtl_temp SET isverified = '1' WHERE stepid=? AND fieldid=? AND entitytypeprojecthdrid=? AND groupid=? AND groupposition=?";
            result = await  writeConn.query(sql,[data.userid, data.stepid, data.fieldid, data.projectid, data.groupid, data.groupposition]);
            result2 = await  writeConn.query(sql2,[data.stepid, data.fieldid, data.projectid, data.groupid, data.groupposition]);
        }
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
