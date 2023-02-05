const readConn = require('../../dbconnection').readPool
const writeConn = require('../../dbconnection').writePool
const util = require('../../utility/util');

module.exports.getTabEntityMap  = async(data) => {
    try {
        const sql = "SELECT a.id, a.entitytypeid, a.tabid, b.entitytypedesc, c.tabname FROM mst_checklist_tab_map a, mst_entity_type b, mst_checklist_tab_master c  WHERE a.entitytypeid = b.entitytypeid AND a.tabid = c.id AND a.reraid = ? AND a.deleted = 0";
        const [result] = await readConn.query(sql,[data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.checkTabEntityMapDuplication  = async(data) => {
    try {
        const sql = "SELECT id FROM mst_checklist_tab_map WHERE reraid = ? AND userid = ? AND entitytypeid = ? AND tabid = ? AND deleted = 0";
        const [result] = await readConn.query(sql,[data.reraid, data.userid, data.entitytypeid, data.tabid]);
        return result.length > 0 ? result[0].id : null
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.addTabEntityMap  = async(data) => {
    try {
        const sql = "INSERT INTO mst_checklist_tab_map (reraid, userid, entitytypeid, tabid) VALUES (?,?,?,?)";
        const [result] = await  readConn.query(sql,[data.reraid, data.userid, data.entitytypeid, data.tabid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.checkTabEntityMapDuplicationForUpdate  = async(data) => {
    try {
        const sql = "SELECT id FROM mst_checklist_tab_map WHERE id = ? AND reraid = ? AND entitytypeid = ? AND tabid = ? AND deleted = 0";
        const [result] = await readConn.query(sql,[data.id, data.reraid, data.entitytypeid, data.tabid]);
        return result.length > 0 ? result[0].id : null
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.updateTabEntityMap  = async(data) => {
    try {
        const sql = "UPDATE mst_checklist_tab_map SET entitytypeid = ?, tabid = ?  WHERE id = ? AND reraid = ?";
        const [result] = await  readConn.query(sql,[data.entitytypeid, data.tabid, data.id, data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.deleteTabEntityMap  = async(data) => {
    try {
        const sql = "UPDATE mst_checklist_tab_map SET deleted = 1 WHERE id = ? AND reraid = ?";
        const [result] = await  readConn.query(sql,[data.id, data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

