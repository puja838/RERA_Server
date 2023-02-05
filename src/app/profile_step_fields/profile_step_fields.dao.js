const readConn          = require('../../dbconnection').readPool
const writeConn         = require('../../dbconnection').writePool
const util              = require('../../utility/util');


module.exports.getList  = async(data) => {
    try {
        const sql = "SELECT a.id, a.entityid, b.entitydesc, a.stepid, ms.stepdesc, mt.entitytypedesc, a.entitytypeid" +
            " from mst_profile_step_fields a, mst_entity b, mst_steps ms, mst_entity_type mt" +
            " WHERE a.reraid = ? AND a.deleted='0' AND a.stepid = ms.stepid AND a.entityid = b.entityid AND a.entitytypeid = mt.entitytypeid GROUP BY a.stepid, a.entitytypeid";
        const [result] = await  readConn.query(sql,[data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getFieldList  = async(data) => {
    try {
        const sql = "SELECT a.id, a.sequenceno as sequence, a.isrequired as isRequired, a.approvalrequired as isApproval, a.fieldid as fieldId, a.groupid as groupId, a.rowname, a.fieldwidth as width, a.fontsize as size, IF(a.fieldid IS NOT NULL, 'field', 'group') as fieldType, b.fielddesc, b.fielddisplaydesc, c.groupname, a.parentfieldid as parentFieldId, a.parentfieldvalue as parentValue, b.fielddesc as parentfielddesc\n" +
            "FROM mst_profile_step_fields a LEFT JOIN mst_entity_profile_fields b ON a.fieldid = b.fieldid LEFT JOIN mst_profile_fields_group c ON a.groupid = c.groupid LEFT JOIN mst_entity_profile_fields mf ON a.parentfieldid = mf.fieldid \n" +
            "WHERE a.deleted = '0' AND a.reraid=? AND a.stepid=? AND a.entitytypeid=? AND a.entityid=? ORDER BY a.sequenceno ASC";
        const [result] = await  readConn.query(sql,[data.reraid,data.stepid,data.entitytypeid,data.entityid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.add  = async(data) => {
    try {
        let i = 0;
        for (const obj of data.fieldList) {
            const sql = "INSERT INTO mst_profile_step_fields (sequenceno, isrequired, approvalrequired, reraid, entityid, entitytypeid, stepid, fieldid, groupid, rowname, fieldwidth, fontsize, parentfieldid, parentfieldvalue)" +
                " values (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
            obj.isRequired = obj.isRequired ? 1 : 0;
            obj.isApproval = obj.isApproval ? 1 : 0;
            obj.groupId = obj.groupId == '' ? null: obj.groupId;
            obj.fieldId = obj.fieldId == '' ? null: obj.fieldId;
            obj.parentFieldId = obj.parentFieldId == '' ? null: obj.parentFieldId;
            obj.parentValue = obj.parentValue == '' ? null: obj.parentValue;
            const [result] = await  writeConn.query(sql,
                [obj.sequence,obj.isRequired, obj.isApproval, data.reraid, data.entityid, data.entitytypeid, data.stepid, obj.fieldId, obj.groupId, obj.rowname, obj.width, obj.size, obj.parentFieldId, obj.parentValue]);
            if (data.fieldList.length === (i + 1)) {
                return true;
            }
            i++;
        }
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.checkModuleExistance = async (data) => {
    try {
        let where = "";
        if (data.fieldId) {
            where += " AND fieldid = " + data.fieldId
        }
        if (data.groupId) {
            where += " AND groupid = " + data.groupId
        }
        const sql = "SELECT id FROM mst_profile_step_fields WHERE deleted = 0 AND reraid = ? AND stepid = ? AND entityid = ? AND entitytypeid = ? AND id != ?" + where;
        console.log(sql, data.reraId, data.stepId, data.entiryid, data.entitytypeid, data.id)
        const [result] = await  readConn.query(sql,[data.reraId, data.stepId, data.entiryid, data.entitytypeid, data.id]);
        return result.length > 0
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.update  = async(data) => {
    try {
        data.isRequired = data.isRequired == true ? 1 : 0;
        data.isApproval = data.isApproval == true ? 1 : 0;
        const sql = "UPDATE mst_profile_step_fields SET isrequired = ?, approvalrequired = ?, fieldid = ?, groupid = ?,rowname = ?, fieldwidth = ?, fontsize = ?, parentfieldid = ?, parentfieldvalue = ?, sequenceno = ? WHERE id = ?";
        const [result] = await  writeConn.query(sql,[data.isRequired,data.isApproval,data.fieldId,data.groupId,data.rowname,data.width, data.size, data.parentFieldId, data.parentValue, data.sequence, data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.delete  = async(data) => {
    try {
        const sql = "UPDATE mst_profile_step_fields SET deleted = '1' WHERE id = ?";
        const [result] = await  writeConn.query(sql,[data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}