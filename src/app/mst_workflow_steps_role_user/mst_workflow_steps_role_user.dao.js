const readConn = require('../../dbconnection').readPool
const writeConn = require('../../dbconnection').writePool
const util = require('../../utility/util');

module.exports.getUserRole = async (data) => {
    try {
        const sql = "SELECT roleid,workflowuserid FROM mst_workflow_steps_role_user WHERE reraid = ? AND deleted='0';";
        const [result] = await readConn.query(sql, [data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getList = async (data) => {
    try {
        const sql = "SELECT a.id, a.workflowid, b.workflowname, a.stepid, c.stepname, a.workflowstepsworksid, g.stepname as fromstepname, i.stepname as "+
                    "tostepname, a.roleid, e.roledesc, a.workflowuserid,f.username as workflowusername from mst_workflow_steps_role_user a LEFT JOIN mst_role e"+
                    " ON a.roleid = e.roleid LEFT JOIN mst_user f ON a.workflowuserid = f.userid, mst_workflow b, mst_workflow_steps c, mst_workflow_steps g,"+
                    " mst_workflow_steps_works h, mst_workflow_steps i WHERE a.reraid = ? AND b.id = a.workflowid AND c.id = a.stepid AND h.id = a.workflowstepsworksid"+
                    " AND g.id = h.fromstepid AND i.id = h.tostepid AND a.deleted='0';";
        const [result] = await readConn.query(sql, [data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getRole = async (data) => {
    try {
        const sql ="SELECT roleid, roledesc FROM mst_role WHERE reraid = ? AND roleid NOT IN (1);";
        const [result] = await readConn.query(sql, [data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getWorkflowUser = async (data) => {
    try {
        const sql ="SELECT a.userid, a.username FROM mst_role_user b, mst_user a WHERE b.roleid = ? AND b.reraid = ? AND b.userid = a.userid AND a.deleted = '0'"
        const [result] = await readConn.query(sql, [data.roleid, data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.add = async (data) => {
    var roleid
    var workflowuserid 
    if(data.roleid == ''){
        roleid = 0
    }
    else{
        roleid = data.roleid
    }

    if(data.workflowuserid == ''){
        workflowuserid = 0
    }
    else{
        workflowuserid = data.workflowuserid
    }
    
    try {
        util.createLog(data)
        const sql = "INSERT INTO mst_workflow_steps_role_user (workflowid, stepid, workflowstepsworksid, roleid, workflowuserid, userid, reraid)" +
            " values (?,?,?,?,?,?,?)";

        data.workflowid = data.workflowid == 0 ? null : data.workflowid;
        data.stepid = data.stepid == 0 ? null : data.stepid;
        data.workflowstepsworksid = data.workflowstepsworksid == 0 ? null : data.workflowstepsworksid;
        // data.roleid = data.roleid == 0 ? null : data.roleid;
        // data.workflowuserid = data.workflowuserid == 0 ? null : data.workflowuserid
        console.log(data.workflowid, data.stepid, data.workflowstepsworksid, roleid, workflowuserid, data.userid, data.reraid)
        const [result] = await writeConn.query(sql, [data.workflowid, data.stepid, data.workflowstepsworksid, roleid, workflowuserid, data.userid, data.reraid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.check = async (data) => {
    try {
        const sql = "SELECT id  from mst_workflow_steps_role_user where deleted='0' AND reraid = ? AND workflowid = ? AND"+
                    " workflowstepsworksid = ? AND roleid = ? AND workflowuserid=?;";
        const [result] = await  readConn.query(sql,[data.reraid,data.workflowid, data.workflowstepsworksid, data.roleid,data.workflowuserid]);
        util.createLog(result.length);
        return result.length > 0;
    } catch (e) {
        util.createLog(e);
        return false;
    }
    
}

module.exports.update = async (data) => {
    var roleid
    var workflowuserid 
    if(data.roleid == ''){
        roleid = 0
    }
    else{
        roleid = data.roleid
    }

    if(data.workflowuserid == ''){
        workflowuserid = 0
    }
    else{
        workflowuserid = data.workflowuserid
    }
    try {
        util.createLog(data);
        const sql = "UPDATE mst_workflow_steps_role_user SET workflowid = ?,  stepid = ?, workflowstepsworksid = ?, roleid = ?, workflowuserid =? WHERE id = ?;";
        const [result] = await writeConn.query(sql, [data.workflowid, data.stepid, data.workflowstepsworksid, roleid, workflowuserid, data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.delete = async (data) => {
    try {
        const sql = "UPDATE mst_workflow_steps_role_user SET deleted = '1' WHERE id = ?";
        const [result] = await writeConn.query(sql, [data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
