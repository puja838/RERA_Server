const readConn = require('../../dbconnection').readPool
const writeConn = require('../../dbconnection').writePool
const util = require('../../utility/util');


module.exports.getTabNames  = async(data) => {
    try {
        const sql = "SELECT a.id, a.tabname from mst_checklist_tab_master a, mst_checklist_tab_map b WHERE b.tabid = a.id AND b.deleted='0' AND b.reraid = ?";
        const [result] = await  readConn.query(sql,[data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getGroupNames  = async(data) => {
    try {
        const sql = "SELECT a.id, a.groupname FROM mst_checklist_group a WHERE a.reraid = ?";
        const [result] = await  readConn.query(sql,[data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
