const readConn = require('../../dbconnection').readPool
const writeConn = require('../../dbconnection').writePool
const util = require('../../utility/util');


module.exports.getList = async (data) => {
    try {
        const sql = "SELECT id,stepworkname from mst_steps_works " +
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
        const sql = "INSERT INTO mst_steps_works (stepworkname, reraid)" +
            " values (?,?)";

        data.stepworkname = data.stepworkname == '' ? null : data.stepworkname;
        const [result] = await writeConn.query(sql,
            [data.stepworkname, data.reraid]);
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
        const sql = "SELECT id  from mst_steps_works where deleted='0' AND reraid = ? AND stepworkname = ?";
        const [result] = await  readConn.query(sql,[data.reraid,data.stepworkname]);
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
        const sql = "UPDATE mst_steps_works SET stepworkname = ?  WHERE id = ?";
        const [result] = await writeConn.query(sql, [data.stepworkname, data.businessunittypename, data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.delete = async (data) => {
    try {
        const sql = "UPDATE mst_steps_works SET deleted = '1' WHERE id = ?";
        const [result] = await writeConn.query(sql, [data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}