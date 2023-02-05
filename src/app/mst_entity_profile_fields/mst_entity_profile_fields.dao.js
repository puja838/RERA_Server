const readConn          = require('../../dbconnection').readPool
const writeConn         = require('../../dbconnection').writePool
const util              = require('../../utility/util');

module.exports.getList  = async(data) => {
    try {
        let where = '';
        if (data.searchText !== undefined && data.searchText !== '') {
            where += " AND a.fielddisplaydesc LIKE '%" + data.searchText + "%' "
        }
        if (data.limit && data.offset) {
            where +=   " LIMIT " + data.limit + " OFFSET " + data.offset
        }
        const sql = "SELECT a.fieldid, a.fielddesc, a.fielddisplaydesc, a.fieldtype, a.controltype, a.controlvalue, a.isuniqueid, a.busnessunittypeid, b.businessunittypecode " +
            " from mst_entity_profile_fields a LEFT JOIN mst_business_unit_type b ON a.busnessunittypeid = b.id" +
            " where a.reraid = ? AND a.deleted='0' " + where;
        const [result] = await  readConn.query(sql,[data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.checkName  = async(reraid, fielddesc, id) => {
    try {
        let where = '';
        if (id !== 0) {
            where += " AND fieldid != " + id;
        }
        const sql = "SELECT fieldid  from mst_entity_profile_fields where reraid = ? AND fielddesc = ? " + where;
        const [result] = await  readConn.query(sql,[reraid, fielddesc]);
        return result.length > 0;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.add  = async(data) => {
    try {
        if (data.busnessunittypeid === undefined || data.busnessunittypeid === '') {
            data.busnessunittypeid = null;
        }
        const sql = "INSERT INTO mst_entity_profile_fields (fielddesc, fielddisplaydesc, fieldtype, controltype, controlvalue, isuniqueid, reraid, busnessunittypeid) values (?,?,?,?,?,?,?,?)";
        const [result] = await  writeConn.query(sql,[data.fielddesc, data.fielddisplaydesc, data.fieldtype, data.controltype, data.controlvalue, data.isuniqueid, data.reraid, data.busnessunittypeid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.update  = async(data) => {
    try {
        if (data.busnessunittypeid === undefined || data.busnessunittypeid === '') {
            data.busnessunittypeid = null;
        }
        const sql = "UPDATE mst_entity_profile_fields SET fielddesc = ?, fielddisplaydesc = ?, fieldtype = ?, controltype = ?, controlvalue = ?, isuniqueid = ?, busnessunittypeid = ? WHERE fieldid = ?";
        const [result] = await  writeConn.query(sql,[data.fielddesc, data.fielddisplaydesc, data.fieldtype, data.controltype, data.controlvalue, data.isuniqueid, data.busnessunittypeid, data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.delete  = async(data) => {
    try {
        const sql = "UPDATE mst_entity_profile_fields SET deleted = '1' WHERE fieldid = ?";
        const [result] = await  writeConn.query(sql,[data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}