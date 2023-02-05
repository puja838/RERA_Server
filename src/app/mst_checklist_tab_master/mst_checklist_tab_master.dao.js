const readConn = require('../../dbconnection').readPool
const writeConn = require('../../dbconnection').writePool
const util = require('../../utility/util');

module.exports.getTabName  = async(data) => {
    try {
        const sql = "SELECT id, tabname FROM mst_checklist_tab_master";
        const [result] = await readConn.query(sql);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.checkTabDuplication  = async(data) => {
    try {
        const sql = "SELECT id FROM mst_checklist_tab_master WHERE tabname = ?";
        const [result] = await readConn.query(sql,[data.tabname]);
        return result.length > 0 ? result[0].id : null
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.addTabName  = async(data) => {
    try {
        const sql = "INSERT INTO mst_checklist_tab_master (tabname) VALUES (?)";
        const [result] = await  readConn.query(sql,[data.tabname]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.checkTabDuplicationForUpdate  = async(data) => {
    try {
        const sql = "SELECT id FROM mst_checklist_tab_master WHERE id = ? AND tabname = ?";
        const [result] = await readConn.query(sql,[data.id, data.tabname]);
        return result.length > 0 ? result[0].id : null
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.updateTabName  = async(data) => {
    try {
        const sql = "UPDATE mst_checklist_tab_master SET tabname = ? WHERE id = ?";
        const [result] = await  readConn.query(sql,[data.tabname, data.id]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.deleteTabName  = async(data) => {
    try {
        const sql = "DELETE FROM mst_checklist_tab_master WHERE id = ?";
        const [result] = await  readConn.query(sql,[data.id]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

