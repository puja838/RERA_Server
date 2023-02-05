const readConn = require('../../dbconnection').readPool
const writeConn = require('../../dbconnection').writePool
const util = require('../../utility/util');


module.exports.getList = async (data) => {
    try {
        const sql = "SELECT a.id,a.checklistname,a.projectfieldid, b.fielddisplaydesc as projectfieldname, c.tabname, a.tabid, d.groupname, a.tabgroupid "
            + " from mst_workflow_steps_role_user_checklist a, mst_fields b, mst_checklist_tab_master c, mst_checklist_group d"
            + " WHERE a.reraid = ? AND b.fieldid = a.projectfieldid AND a.deleted ='0' AND a.tabid = c.id AND a.tabgroupid = d.id";
        const [result] = await readConn.query(sql, [data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.add = async (data) => {
    try {
        const sql = "INSERT INTO mst_workflow_steps_role_user_checklist (checklistname,projectfieldid, reraid, userid,tabid,tabgroupid)" +
            " values (?,?,?,?,?,?)";
        data.checklistname = data.checklistname == '' ? null : data.checklistname;
        data.projectfieldid = data.projectfieldid == 0 ? null : data.projectfieldid;
        const [result] = await writeConn.query(sql, [data.checklistname, data.projectfieldid, data.reraid, data.userid,data.tabid,data.tabgroupid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.check = async (data) => {
    try {
        const sql = "SELECT id  from mst_workflow_steps_role_user_checklist where deleted='0' AND reraid = ? AND checklistname = ? AND projectfieldid=?";
        const [result] = await  readConn.query(sql,[data.reraid,data.checklistname,data.projectfieldid]);
        util.createLog(result.length);
        return result.length > 0;
    } catch (e) {
        util.createLog(e);
        return false;
    }
    
}

module.exports.update = async (data) => {
    try {
        util.createLog(data);
        const sql = "UPDATE mst_workflow_steps_role_user_checklist SET checklistname = ?,projectfieldid = ?  WHERE id = ?";
        const [result] = await writeConn.query(sql, [data.checklistname, data.projectfieldid, data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.delete = async (data) => {
    try {
        const sql = "UPDATE mst_workflow_steps_role_user_checklist SET deleted = '1' WHERE id = ?";
        const [result] = await writeConn.query(sql, [data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}