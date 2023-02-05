const readConn = require('../../dbconnection').readPool
const writeConn = require('../../dbconnection').writePool
const util = require('../../utility/util');


module.exports.getList = async (data) => {
    try {
        const sql = "SELECT id,businessunittypecode,businessunittypedesc" +
            " from mst_business_unit_type " +
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
        const sql = "INSERT INTO mst_business_unit_type (businessunittypecode,businessunittypedesc, reraid)" +
            " values (?,?,?)";

        data.businessunittypecode = data.businessunittypecode == '' ? null : data.businessunittypecode;
        data.businessunittypedesc = data.businessunittypedesc == '' ? null : data.businessunittypedesc;
        const [result] = await writeConn.query(sql,
            [data.businessunittypecode, data.businessunittypedesc, data.reraid]);
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
        const sql = "SELECT id  from mst_business_unit_type where deleted='0' AND reraid = ? AND businessunittypecode = ? AND businessunittypedesc = ? ";
        const [result] = await  readConn.query(sql,[data.reraid,data.businessunittypecode,data.businessunittypedesc ]);
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
        const sql = "UPDATE mst_business_unit_type SET businessunittypecode = ?, businessunittypedesc = ?  WHERE id = ?";
        const [result] = await writeConn.query(sql, [data.businessunittypecode, data.businessunittypedesc, data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.delete = async (data) => {
    try {
        const sql = "UPDATE mst_business_unit_type SET deleted = '1' WHERE id = ?";
        const [result] = await writeConn.query(sql, [data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}