const readConn = require('../../dbconnection').readPool
const writeConn = require('../../dbconnection').writePool
const util = require('../../utility/util');

module.exports.getList  = async(data) => {
    try {
        const sql = "SELECT a.entitytypemapid, a.entitytypeid, a.entityid, b.entitydesc, c.entitytypedesc" +
            " FROM mst_entity_map a, mst_entity b, mst_entity_type c" +
            " WHERE a.reraid = ? AND a.deleted='0' AND a.entityid = b.entityid AND a.entitytypeid = c.entitytypeid";
        const [result] = await  readConn.query(sql,[data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.check  = async(reraid, entitytypeid, entityid, id) => {
    try {
        let where = '';
        if (entityid !== 0) {
            where += " AND entitytypemapid != " + id;
        }
        const sql = "SELECT entitytypemapid  from mst_entity_map where deleted='0' AND reraid = ? AND entitytypeid = ? AND entityid = ? " + where;
        const [result] = await  readConn.query(sql,[reraid, entitytypeid, entityid]);
        return result.length > 0;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.add  = async(data) => {
    try {
        const sql = "INSERT INTO mst_entity_map (entitytypeid, reraid, entityid) values (?,?,?)";
        const [result] = await  writeConn.query(sql,[data.entitytypeid, data.reraid, data.entityid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.update  = async(data) => {
    try {
        const sql = "UPDATE mst_entity_map SET entitytypeid = ?, entityid = ? WHERE entitytypemapid = ?";
        const [result] = await  writeConn.query(sql,[data.entitytypeid,data.entityid, data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.delete  = async(data) => {
    try {
        const sql = "UPDATE mst_entity_map SET deleted = '1' WHERE entitytypemapid = ?";
        const [result] = await  writeConn.query(sql,[data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}