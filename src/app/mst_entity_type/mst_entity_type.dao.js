const readConn = require('../../dbconnection').readPool
const writeConn = require('../../dbconnection').writePool
const util = require('../../utility/util');

module.exports.getList  = async(data) => {
    try {
        const sql = "SELECT entitytypeid, entitytypedesc from mst_entity_type where deleted='0'";
        const [result] = await  readConn.query(sql);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.getEntityTypeByEntity  = async(data) => {
    try {
        const sql = "SELECT b.entitytypeid, b.entitytypedesc from mst_entity_map a, mst_entity_type b" +
            " where a.entitytypeid = b.entitytypeid AND a.deleted='0' AND b.deleted='0' AND a.entityid = ? AND a.reraid = ?";
        const [result] = await  readConn.query(sql, [data.entityid, data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.checkName  = async(entitytypedesc, entitytypeid) => {
    try {
        let where = '';
        if (entitytypeid !== 0) {
            where += " AND entitytypeid != " + entitytypeid;
        }
        const sql = "SELECT entitytypedesc  from mst_entity_type where entitytypedesc = ? " + where;
        const [result] = await  readConn.query(sql,[entitytypedesc]);
        return result.length > 0;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.add  = async(data) => {
    try {
        const sql = "INSERT INTO mst_entity_type (entitytypedesc) values (?)";
        const [result] = await  writeConn.query(sql,[data.entitytypedesc]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.update  = async(data) => {
    try {
        const sql = "UPDATE mst_entity_type SET entitytypedesc = ? WHERE entitytypeid = ?";
        const [result] = await  writeConn.query(sql,[data.entitytypedesc,data.entitytypeid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.delete  = async(data) => {
    try {
        const sql = "UPDATE mst_entity_type SET deleted = '1' WHERE entitytypeid = ?";
        const [result] = await  writeConn.query(sql,[data.entitytypeid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}