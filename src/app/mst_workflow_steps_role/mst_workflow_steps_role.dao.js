const readConn = require('../../dbconnection').readPool;
const writeConn = require('../../dbconnection').writePool;
const util = require('../../utility/util');


module.exports.getList = async (data) => {
    try {
        // const sql = "SELECT a.id, a.workflowid, b.workflowname, a.stepid, c.stepname, a.workflowstepsworksid, d.stepworkname,"+
        //             " a.roleid, e.roledesc from mst_workflow_steps_role a, mst_workflow b, mst_workflow_steps c, mst_steps_works d,"+
        //             " mst_role e WHERE a.reraid = 1 AND b.id = a.workflowid AND c.id = a.stepid AND d.id = a.workflowstepsworksid"+
        //             " AND e.roleid = a.roleid AND a.deleted='0';";
        const sql = "SELECT a.id, a.workflowid, b.workflowname, a.stepid, c.stepname, a.workflowstepsworksid,"+
                    " f.stepname as fromstepname, g.stepname as tostepname, a.roleid, e.roledesc from mst_workflow_steps_role a,"+
                    " mst_workflow b, mst_workflow_steps c, mst_role e, mst_workflow_steps f, mst_workflow_steps g,mst_workflow_steps_works h"+
                    " WHERE a.reraid = ? AND b.id = a.workflowid AND c.id = a.stepid AND e.roleid = a.roleid AND h.id = a.workflowstepsworksid AND"+
                    " f.id = h.fromstepid AND g.id = h.tostepid AND a.deleted='0'";
        const [result] = await readConn.query(sql, [data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getRole = async (data) => {
    try {
        const sql ="SELECT roleid, roledesc FROM mst_role WHERE reraid = ? AND roleid NOT IN (1);"
        const [result] = await readConn.query(sql, [data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.getstepid = async (data) => {
    try {
        const sql = "SELECT  a.id, c.stepname as fromstepname, e.stepname as tostepname FROM mst_workflow_steps_works a,"+
                    " mst_workflow_steps c,  mst_workflow_steps e  WHERE a.reraid = ? AND a.workflowid = ? AND c.id = a.fromstepid AND "+
                    "e.id = a.tostepid AND a.deleted = '0';";
        const [result] = await readConn.query(sql, [data.reraid,data.workflowid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.add = async (data) => {
    try {
        util.createLog(data)
        const sql = "INSERT INTO mst_workflow_steps_role (workflowid, stepid, workflowstepsworksid, roleid, userid, reraid)" +
            " values (?,?,?,?,?,?)";

        data.workflowid = data.workflowid == 0 ? null : data.workflowid;
        data.stepid = data.stepid == 0 ? null : data.stepid;
        data.workflowstepsworksid = data.workflowstepsworksid == 0 ? null : data.workflowstepsworksid;
        data.roleid = data.roleid == 0 ? null : data.roleid;
        const [result] = await writeConn.query(sql, [data.workflowid, data.stepid, data.workflowstepsworksid, data.roleid, data.userid, data.reraid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.check = async (data) => {
    try {
        const sql = "SELECT id  from mst_workflow_steps_role where deleted='0' AND reraid = ? AND workflowid = ?"+
                    "AND workflowstepsworksid = ? AND roleid=?";
        const [result] = await  readConn.query(sql,[data.reraid,data.workflowid,data.workflowstepsworksid,data.roleid]);
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
        const sql = "UPDATE mst_workflow_steps_role SET workflowid = ?,  stepid = ?, workflowstepsworksid = ?, roleid = ? WHERE id = ?;";
        const [result] = await writeConn.query(sql, [data.workflowid, data.stepid, data.workflowstepsworksid, data.roleid, data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.delete = async (data) => {
    try {
        const sql = "UPDATE mst_workflow_steps_role SET deleted = '1' WHERE id = ?";
        const [result] = await writeConn.query(sql, [data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}