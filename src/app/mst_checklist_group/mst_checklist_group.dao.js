const readConn = require('../../dbconnection').readPool
const writeConn = require('../../dbconnection').writePool
const util = require('../../utility/util');

module.exports.checkDataDuplication  = async(data) => {
    try {
        const sql = "SELECT id FROM mst_checklist_group WHERE reraid = ? AND userid = ? AND groupname = ? AND deleted = 0";
        const [result] = await readConn.query(sql,[data.reraid, data.userid, data.groupname]);
        return result.length > 0 ? result[0].id : null
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.addGroupName  = async(data) => {
    try {
        const sql = "INSERT INTO mst_checklist_group (reraid, userid, groupname) VALUES (?,?,?)";
        const [result] = await  readConn.query(sql,[data.reraid, data.userid, data.groupname]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.checkDataDuplicationForUpdate  = async(data) => {
    try {
        const sql = "SELECT id FROM mst_checklist_group WHERE reraid = ? AND id = ? AND groupname = ? AND deleted = 0";
        const [result] = await readConn.query(sql,[data.reraid, data.id, data.groupname]);
        return result.length > 0 ? result[0].id : null
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.updateGroupName  = async(data) => {
    try {
        const sql = "UPDATE mst_checklist_group SET groupname = ? WHERE reraid = ? AND id = ?";
        const [result] = await  readConn.query(sql,[data.groupname, data.reraid, data.id]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.deleteGroupName  = async(data) => {
    try {
        const sql = "UPDATE mst_checklist_group SET deleted = 1 WHERE reraid = ? AND id = ?";
        const [result] = await  readConn.query(sql,[data.reraid, data.id]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

