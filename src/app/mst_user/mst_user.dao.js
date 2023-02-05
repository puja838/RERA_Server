const readConn = require('../../dbconnection').readPool;
const writeConn = require('../../dbconnection').writePool;
const common = require('../services/common.service');
const util = require('../../utility/util');
const axios = require("axios");
const config = require('../../config');
module.exports.login = async (data) => {
    try {
        const sql = "SELECT user.userid,user.username,user.reraid, role.roleid, user.usermobile, user.useremail,user.userpan, user.entitytypeid, user.userpassword,user.issubmitted, mstrole.roledesc, mstrole.type as roletype" +
            " from mst_user user,mst_role_user role, mst_role mstrole" +
            " WHERE user.userid=role.userid AND (user.useremail = ? OR user.userpan = ?) AND user.deleted=0 AND role.deleted=0 AND role.roleid = mstrole.roleid";
        const [result] = await readConn.query(sql, [data.username,data.username]);
        return result.length > 0 ? result[0] : false;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getList = async (data) => {
    try {
        const sql = "SELECT user.userid,user.username,user.reraid, role.roleid,rolename.roledesc, user.userpan, user.useremail, user.usermobile, user.entitytypeid,user.userLoginType,user.SptgrpSelected,user.address" +
            " from mst_user user,mst_role_user role,mst_role rolename " +
            " WHERE user.userid=role.userid AND role.roleid = rolename.roleid AND user.reraid = ? AND user.deleted=0 AND role.deleted=0 AND rolename.deleted=0";
        const [result] = await readConn.query(sql, [data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.check = async (data) => {
    try {
        const sql = "SELECT userid  from mst_user where deleted=0 AND reraid = ? AND useremail = ? OR userpan = ?";
        const [result] = await  readConn.query(sql,[data.reraid,data.username,data.username]);
        util.createLog(result.length);
        return result.length > 0;
    } catch (e) {
        util.createLog(e);
        return false;
    }

}
module.exports.add = async (data) => {
    try {
        const sql = "INSERT INTO mst_user (username,userpassword, useremail, usermobile, reraid,userLoginType,SptgrpSelected,address)" +
            " values (?,?,?,?,?,?,?,?)";
        const [result] = await writeConn.query(sql,
            [data.username, data.password, data.useremail, data.usermobile, data.reraid,data.userLoginType,data.SptgrpSelected,data.address]);
        const sql2 = "INSERT INTO mst_role_user (reraid,userid, roleid)" +
            " values (?,?,?)";
        const [result2] = await writeConn.query(sql2,
                [data.reraid, result.insertId, data.roleid]);
        common.addUserCustomized(data)
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getUserDetails = async (data) => {
    try {
        const sql = "SELECT user.userid,user.username,user.reraid, role.roleid,rolename.roledesc, user.useremail, user.usermobile " +
            " from mst_user user,mst_role_user role,mst_role rolename " +
            " WHERE user.userid=role.userid AND role.roleid = rolename.roleid AND user.reraid = ? AND user.userid = ? AND user.deleted=0 AND role.deleted=0 ";
        const [result] = await  readConn.query(sql,[data.reraid,data.userid]);
        return result[0];
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getUserEmail = async (userid) => {
    try {
        const sql = "SELECT useremail from mst_user user  WHERE userid = ? AND deleted=0";
        const [result] = await  readConn.query(sql,[userid]);
        return result[0].useremail;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.update = async (data) => {
    try {
        util.createLog(data);
        const sql = "UPDATE mst_user SET username = ?,userLoginType=?,SptgrpSelected=?,useremail=?,address=?,usermobile=?,modified_at=current_timestamp  WHERE userid = ?";
        const [result] = await writeConn.query(sql, [data.username,data.userLoginType,data.SptgrpSelected,data.useremail,data.address,data.usermobile,data.userid]);

        const sql3 = "UPDATE mst_role_user SET deleted = 1 WHERE userid = ?";
        const [result3] = await writeConn.query(sql3, [data.userid]);

        const sql2 = "INSERT INTO mst_role_user (reraid,userid, roleid)" +
            " values (?,?,?)";
        const [result2] = await writeConn.query(sql2,
                [data.reraid, data.userid, data.roleid]);
        common.updateUserCustomized(data)
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.delete = async (data) => {
    try {
        const sql = "UPDATE mst_user SET deleted = 1 WHERE id = ?";
        const [result] = await writeConn.query(sql, [data.userid]);
        const sql1 = "UPDATE mst_role_user SET deleted = 1 WHERE id = ?";
        const [result1] = await writeConn.query(sql1, [data.userid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.rolelist = async (data) => {
    try {
        const sql = "SELECT roleid,roledesc" +
            " from mst_role" +
            " WHERE reraid = ? AND deleted=0 ";
        const [result] = await readConn.query(sql, [data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.changeRoleName = async (data) => {
    try {
        util.createLog(data);

        const sql3 = "UPDATE mst_role SET roledesc = ? WHERE roleid = ?";
        const [result3] = await writeConn.query(sql3, [data.roleName,data.roleid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
