const readConn = require('../../dbconnection').readPool
const writeConn = require('../../dbconnection').writePool
const util = require('../../utility/util');

module.exports.getList  = async(data) => {
    try {
        const sql = "SELECT entityid, entitydesc  from mst_entity where reraid = ? AND deleted='0'";
        const [result] = await  readConn.query(sql,[data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.checkName  = async(reraid, entitydesc, entityid) => {
    try {
        let where = '';
        if (entityid !== 0) {
            where += " AND entityid != " + entityid;
        }
        const sql = "SELECT entitydesc  from mst_entity where reraid = ? AND entitydesc = ? " + where;
        const [result] = await  readConn.query(sql,[reraid, entitydesc]);
        return result.length > 0;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.add  = async(data) => {
    try {
        const sql = "INSERT INTO mst_entity (entitydesc, reraid) values (?,?)";
        const [result] = await  writeConn.query(sql,[data.entitydesc,data.reraid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.update  = async(data) => {
    try {
        const sql = "UPDATE mst_entity SET entitydesc = ? WHERE entityid = ?";
        const [result] = await  writeConn.query(sql,[data.entitydesc,data.entityid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.delete  = async(data) => {
    try {
        const sql = "UPDATE mst_entity SET deleted = '1' WHERE entityid = ?";
        const [result] = await  writeConn.query(sql,[data.entityid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}