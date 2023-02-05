const readConn = require('../../dbconnection').readPool
const writeConn = require('../../dbconnection').writePool
const util = require('../../utility/util');

module.exports.addFieldValidation  = async(data, otp) => {
    try {
        if(data.isRegistration == "false"){
            if(data.groupid == ''){
                data.groupid = null;
                data.groupposition = null;
            }
            if(data.groupposition == ''){
                data.groupposition = 0;
            }
            const sql = "INSERT INTO field_validation (reraid, userid, fieldvalue, fieldid, stepid, groupid, groupposition, otp) values (?,?,?,?,?,?,?,?)";
            const [result] = await  readConn.query(sql,[data.reraid, data.userid, data.fieldvalue, data.fieldid, data.stepid, data.groupid, data.groupposition, otp]);
            return result.insertId;
        } else {
            data.fieldid = null;
            data.stepid = null;
            data.groupid = null;
            data.groupposition = null;
            const sql = "INSERT INTO field_validation (reraid, userid, fieldvalue, fieldid, stepid, groupid, groupposition, otp) values (?,?,?,?,?,?,?,?)";
            const [result] = await  readConn.query(sql,[data.reraid, data.userid, data.fieldvalue, data.fieldid, data.stepid, data.groupid, data.groupposition, otp]);
            return result.insertId;
        }
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.fieldOTPValidation = async (data) => {
    try {
        console.log(data.isRegistration);
        if(data.isRegistration == "false"){
            const sql = "UPDATE field_validation SET isvarified='1' WHERE id=? AND otp=? AND deleted='0'";
            const [result] = await  writeConn.query(sql,[data.id, data.verifyOTP]);
            if(result.affectedRows == 0){
                return false;
            } else {
                return true;
            }
        } else {
            const latestIDsql = "SELECT MAX(id) as latestid FROM field_validation WHERE fieldvalue=? AND deleted='0'";
            const [lastID] = await  writeConn.query(latestIDsql,[data.fieldvalue]);
            if(lastID.length > 0){
                const sql = "UPDATE field_validation SET isvarified='1', isregistration='1' WHERE id=? AND otp=? AND deleted='0'";
                const [result] = await  writeConn.query(sql,[lastID[0].latestid, data.verifyOTP]);
                if(result.affectedRows == 0){
                    return false;
                } else {
                    return true;
                }
            } else {
                false;
            }
        }
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.updateMstEntityProfileDtlTemp = async (data) => {
    try {
        let result;
        let result2;
        if(data.groupposition == ''){
            data.groupposition = 0;
        }
        if(data.groupid == ''){
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
        if(data.groupposition == ''){
            data.groupposition = 0;
        }
        let result;
        let result2;
        if(data.groupid == ''){
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

module.exports.checkEmail = async (data) => {
    try {
        // let where = '';
        // if (data.id !== 0) {
        //     where += " AND id != " + data.id;
        // }
        const sql = "SELECT userid  from mst_user where deleted='0' AND reraid = ? AND useremail = ?";
        const [result] = await  readConn.query(sql,[data.reraid,data.fieldvalue]);
        util.createLog(result.length);
        return result.length > 0;
    } catch (e) {
        util.createLog(e);
        return false;
    }
    
}

module.exports.checkMobile = async (data) => {
    try {
        // let where = '';
        // if (data.id !== 0) {
        //     where += " AND id != " + data.id;
        // }
        const sql = "SELECT userid  from mst_user where deleted='0' AND reraid = ? AND usermobile = ?";
        const [result] = await  readConn.query(sql,[data.reraid,data.fieldvalue]);
        util.createLog(result.length);
        return result.length > 0;
    } catch (e) {
        util.createLog(e);
        return false;
    }
    
}
