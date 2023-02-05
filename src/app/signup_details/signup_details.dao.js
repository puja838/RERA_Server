const readConn = require('../../dbconnection').readPool
const writeConn = require('../../dbconnection').writePool
const util = require('../../utility/util');

module.exports.checkUserPan = async (data) => {
    try {
        const sql = "SELECT userid FROM mst_user WHERE userpan = ? AND deleted = 0";
        const [result] = await readConn.query(sql,[data.userpan]);
        return result.length > 0
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.checkUserEmail = async (data) => {
    try {
        const sql = "SELECT userid FROM mst_user WHERE useremail = ? AND deleted = 0";
        const [result] = await readConn.query(sql,[data.useremail]);
        return result.length > 0
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.updateUserNo = async (data) => {
    try {
        const sql = "UPDATE mst_user SET userno = ? WHERE userid = ?";
        const [result] = await writeConn.query(sql,[data.userno, data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}



module.exports.getUnsaveSignUpInfo = async (data) => {
    try {
        const sql = "SELECT userid FROM mst_user WHERE reraid = ? AND userpan = ? AND useremail = ? AND usermobile = ? AND deleted = 0";
        const [result] = await readConn.query(sql,[data.reraid, data.username, data.userpassword, data.userpan, data.useremail, data.usermobile, data.usertype, data.promotertype]);
        return result.length > 0 ? result[0].userid : null
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.createNewSignUpInfo = async (data) => {
    try {
        const sql = "INSERT INTO mst_user (reraid, username, userpassword, userpan, useremail, usermobile, entitytypeid) VALUES (?,?,?,?,?,?,?)";
        const [result] = await writeConn.query(sql,[data.reraid, data.username, data.userpassword, data.userpan, data.useremail, data.usermobile, data.promotertype]);
        return result.insertId;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.mapUserRole = async (data) => {
    try {
        const sql2 = "INSERT INTO mst_role_user (reraid,userid, roleid) values (?,?,?)";
        const [result2] = await writeConn.query(sql2,
            [data.reraid, data.insertId, data.roleId]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getSignUpInfo = async (data) => {
    try {
        const sql = "SELECT * FROM mst_user WHERE reraid = ? AND userpassword = ? AND userpan = ? AND deleted = 0";
        const [result] = await writeConn.query(sql,[data.reraid, data.userpassword, data.userpan]);
        return result.insertId;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.updateSignUpInfo = async (data) => {
    try {
        const sql = "UPDATE mst_user SET reraid = ?, username = ?, userpassword = ?, userpan = ?, useremail = ?, usermobile = ?, usertype = ?, promotertype = ? WHERE userid = ?";
        const [result] = await writeConn.query(sql,[data.reraid, data.username, data.userpassword, data.userpan, data.useremail, data.usermobile, data.usertype, data.promotertype, data.userid]);
        return result.insertId;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.deleteSignUpInfo = async (data) => {
    try {
        const sql = "UPDATE mst_user SET deleted = 1 WHERE userid = ?";
        const [result] = await writeConn.query(sql,[data.userid]);
        return result.insertId;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.storeFieldDataintemp = async (data) => {
    try{
        const sql = "INSERT INTO mst_entity_profile_dtl_temp (userid, stepid, fieldid,fieldvalue,isverified) VALUES (?,?,?,?,?)";
        data.isverified = data.isverified == '' ? 0 : data.isverified;
        const [result] = await writeConn.query(sql,[data.userid, data.stepid, data.fieldid, data.fieldvalue, data.isverified])
        return result
    } catch (e){
        util.createLog(e);
        return false;
    }
}
