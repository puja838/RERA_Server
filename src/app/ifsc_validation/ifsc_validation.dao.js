const readConn = require('../../dbconnection').readPool
const writeConn = require('../../dbconnection').writePool
const util = require('../../utility/util');


module.exports.checkIFSCAccountExists = async (data, response) => {
    try {
        if(response.account_exists){
            return true;
        } else {
            return false;
        }
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.addIFSCDetails  = async(data) => {
    try {
        if(data.isRegistration == "false"){
            if(data.groupid == ''){
                data.groupid = null;
                data.groupposition = null;
            }
            if(data.groupposition == ''){
                data.groupposition = 0;
            }
            const sql = "INSERT INTO field_validation (reraid, userid, fieldvalue, fieldid, stepid, groupid, groupposition) values (?,?,?,?,?,?,?)";
            const [result] = await  readConn.query(sql,[data.reraid, data.userid, data.ifsc, data.fieldid, data.stepid, data.groupid, data.groupposition]);
            const sqlUpdate = "UPDATE field_validation SET isvarified='1', isregistration='0' WHERE id=?";
            const [result2] = await  readConn.query(sqlUpdate,[result.insertId]);
            return result.insertId;
        } else {
            data.fieldid = null;
            data.stepid = null;
            data.groupid = null;
            data.groupposition = null;
            const sql = "INSERT INTO field_validation (reraid, userid, fieldvalue, fieldid, stepid, groupid, groupposition) values (?,?,?,?,?,?,?)";
            const [result] = await  readConn.query(sql,[data.reraid, data.userid, data.ifsc, data.fieldid, data.stepid, data.groupid, data.groupposition]);
            const sqlUpdate = "UPDATE field_validation SET isvarified='1', isregistration='1' WHERE id=?";
            const [result2] = await  readConn.query(sqlUpdate,[result.insertId]);
            return result.insertId;
        }
    } catch (e) {
        util.createLog(e);
        return false;
    }
}