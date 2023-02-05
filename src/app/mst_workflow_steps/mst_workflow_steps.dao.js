const readConn = require('../../dbconnection').readPool
const writeConn = require('../../dbconnection').writePool
const util = require('../../utility/util');


module.exports.getList = async (data) => {
    try {
        const sql = "SELECT id,stepname" +
            " from mst_workflow_steps " +
            " WHERE reraid = ? AND deleted='0'";
        const [result] = await readConn.query(sql, [data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.add = async (data) => {
    try {
        // let i = 0;
        // for (const obj of data.fieldList) {
        const sql = "INSERT INTO mst_workflow_steps (stepname, reraid, userid)" +
            " values (?,?,?)";

        data.stepname = data.stepname == '' ? null : data.stepname;
        const [result] = await writeConn.query(sql, [data.stepname, data.reraid, data.userid]);
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
        const sql = "SELECT id  from mst_workflow_steps where deleted='0' AND reraid = ? AND stepname = ?";
        const [result] = await  readConn.query(sql,[data.reraid,data.stepname]);
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
        const sql = "UPDATE mst_workflow_steps SET stepname = ?  WHERE id = ?";
        const [result] = await writeConn.query(sql, [data.stepname, data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.delete = async (data) => {
    try {
        const sql = "UPDATE mst_workflow_steps SET deleted = '1' WHERE id = ?";
        const [result] = await writeConn.query(sql, [data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}