const readConn = require('../../dbconnection').readPool
const writeConn = require('../../dbconnection').writePool
const util = require('../../utility/util');


module.exports.getList = async (data) => {
    try {
        const sql = "SELECT a.id, a.workflowid,b.workflowname, a.fromstepid, c.stepname as fromstepname,"+
        " a.tostepid, e.stepname as tostepname, a.stepworkid, d.stepworkname from mst_workflow_steps_works a, mst_workflow b,"+
        " mst_workflow_steps c,  mst_workflow_steps e, mst_steps_works d WHERE a.workflowid = ? AND a.reraid = ? AND b.id = a.workflowid"+
        " AND c.id = a.fromstepid AND e.id = a.tostepid AND d.id = a.stepworkid AND a.deleted='0'";
        const [result] = await readConn.query(sql, [data.workflowid,data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getWorkFlow = async (data) => {
    try {
        const sql = "SELECT c.stepname as fromstepname, e.stepname as tostepname FROM mst_workflow_steps_works a,"+
                    " mst_workflow_steps c,  mst_workflow_steps e  WHERE a.reraid = ? AND a.workflowid = ? AND"+
                    " c.id = a.fromstepid AND e.id = a.tostepid AND a.deleted = '0'";
        const [result] = await readConn.query(sql, [data.reraid,data.workflowid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.getworkflowid = async (data) => {
    try {
        const sql = "SELECT id,workflowname FROM mst_workflow WHERE reraid = ? AND deleted='0'";
        const [result] = await readConn.query(sql, [data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getworkflowstepid = async (data) => {
    try {
        const sql = "SELECT id,stepname FROM mst_workflow_steps WHERE reraid = ? AND deleted='0'";
        const [result] = await readConn.query(sql, [data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getstepid = async (data) => {
    try {
        const sql = "SELECT id,stepworkname FROM mst_steps_works WHERE reraid = ? AND deleted='0'";
        const [result] = await readConn.query(sql, [data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.add = async (data) => {
    try {
        const sql = "INSERT INTO mst_workflow_steps_works (workflowid,fromstepid,tostepid,stepworkid,reraid)" +
            " values (?,?,?,?,?)";

        data.workflowid = data.workflowid == 0 ? null : data.workflowid;
        data.fromstepid = data.fromstepid == 0 ? null : data.fromstepid;
        data.tostepid = data.tostepid == 0 ? null : data.tostepid;
        data.stepworkid = data.stepworkid == 0 ? null : data.stepworkid;
        const [result] = await writeConn.query(sql,
            [data.workflowid, data.fromstepid, data.tostepid, data.stepworkid, data.reraid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.check = async (data) => {
    try {
        // let where = '';
        // if (data.id !== 0) {
        //     where += " AND id != " + data.id;
        // }
        const sql = "SELECT id  from mst_workflow_steps_works where deleted='0' AND reraid = ? AND workflowid = ?"+
                    "AND fromstepid = ? AND tostepid = ?";
        const [result] = await  readConn.query(sql,[data.reraid, data.workflowid, data.fromstepid, data.tostepid]);
        util.createLog(result.length);
        return result.length > 0;
    } catch (e) {
        util.createLog(e);
        return false;
    }
    
}
module.exports.updatecheck = async (data) => {
    try {
        // let where = '';
        // if (data.id !== 0) {
        //     where += " AND id != " + data.id;
        // }
        const sql = "SELECT id  from mst_workflow_steps_works where id !=? AND deleted='0' AND reraid = ? AND workflowid = ?"+
                    "AND fromstepid = ? AND tostepid = ? ";
        const [result] = await  readConn.query(sql,[data,id,data.reraid, data.workflowid, data.fromstepid, data.tostepid]);
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
        const sql = "UPDATE mst_workflow_steps_works SET workflowid = ?,fromstepid = ?, tostepid = ? , stepworkid = ?  WHERE id = ?";
        const [result] = await writeConn.query(sql, [data.workflowid, data.fromstepid, data.tostepid, data.stepworkid, data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.delete = async (data) => {
    try {
        const sql = "UPDATE mst_workflow_steps_works SET deleted = '1' WHERE id = ?";
        const [result] = await writeConn.query(sql, [data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}