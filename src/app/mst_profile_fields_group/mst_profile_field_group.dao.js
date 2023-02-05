const readConn = require('../../dbconnection').readPool
const writeConn = require('../../dbconnection').writePool
const util = require('../../utility/util');

module.exports.getFieldListByGroup  = async(data) => {
    try {
        const sql = "SELECT b.id, b.fieldid, c.fielddisplaydesc, b.sequence, b.parentfieldid, d.groupname, d.groupid, IF(b.fieldid IS NOT NULL, 'field', 'group') as fieldType, b.fieldwidth, b.fontsize, b.isrequired,b.fieldgroupid, " +
            " (SELECT fielddisplaydesc FROM mst_entity_profile_fields WHERE fieldid =  b.parentfieldid) as parentfielddisplaydesc, b.parentfieldvalue" +
            " from mst_profile_fields_group_map b LEFT JOIN mst_entity_profile_fields c ON b.fieldid = c.fieldid" +
            " LEFT JOIN mst_profile_fields_group as d ON b.fieldgroupid = d.groupid " +
            " where b.reraid = ? AND b.groupid =  ? AND b.deleted='0' AND b.deleted='0' ORDER BY  b.sequence ASC";
        const [result] = await  readConn.query(sql,[data.reraid, data.groupid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getList  = async(data) => {
    try {
        const sql = "SELECT a.groupid, a.groupname  from mst_profile_fields_group a where a.reraid = ? AND a.deleted='0'";
        const [result] = await  readConn.query(sql,[data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.checkName  = async(reraid, name, id) => {
    try {
        let where = '';
        if (id !== 0) {
            where += " AND id != " + id;
        }
        const sql = "SELECT groupid  from mst_profile_fields_group where deleted ='0' AND reraid = ? AND groupname = ? " + where;
        const [result] = await  readConn.query(sql,[reraid, name]);
        return result.length > 0;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

const checkMap  = async(reraid, groupid, fieldid, id) => {
    try {
        let where = '';
        if (id !== 0) {
            where += " AND id != " + id;
        }
        const sql = "SELECT id  from mst_profile_fields_group_map where deleted ='0' AND reraid = ? AND groupid = ? AND fieldid = ? " + where;
        const [result] = await  readConn.query(sql,[reraid, groupid, fieldid]);
        return result.length > 0;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.add  = async(data) => {
    try {
        const sql = "INSERT INTO mst_profile_fields_group (groupname, reraid) values (?,?)";
        const [result] = await  writeConn.query(sql,[data.groupname,data.reraid]);
        return result.insertId;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

const getLastSequence = async (reraId, groupId) => {
    try {
        const sql = "SELECT sequence FROM mst_profile_fields_group_map WHERE reraid = ? AND groupid = ? ORDER BY sequence DESC LIMIT 1";
        const [result] = await readConn.query(sql,[reraId,groupId]);
        return result.length > 0 ? result[0].sequence : 0;
    } catch (e) {
        util.createLog(e);
        return 0;
    }
}

module.exports.addMapping  = async(data, groupid, reraid) => {
    try {
        let i = 0;
        for(const item of data) {
            const resp = await checkMap(reraid, groupid, item.fieldId, 0);
            // const resp = false;
            if (!resp) {
                const sequence = await getLastSequence(reraid, groupid);
                if(item.parentFieldId === '') {
                    item.parentFieldId = null;
                }
                if(item.parentValue === '') {
                    item.parentValue = null;
                }
                item.groupId = item.groupId === '' ? null : item.groupId;
                item.fieldId = item.fieldId === '' ? null : item.fieldId;
                if (item.isrequired === undefined || item.isrequired === '') {
                    item.isrequired = 0
                }
                const sql = "INSERT INTO mst_profile_fields_group_map (reraid, groupid, fieldid, sequence,parentfieldid, parentfieldvalue, fieldgroupid, fieldwidth, fontsize, isrequired) values (?,?,?,?,?,?,?,?,?,?)";
                const [result] = await writeConn.query(sql,[reraid,groupid,item.fieldId,sequence+1,item.parentFieldId, item.parentValue, item.groupId, item.fieldWidth, item.fontSize,item.isrequired]);
            }
            if (data.length === (i+1)) {
                return true;
            }
        }
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.updateGroupMap  = async(data) => {
    try {
        if(data.parentfieldid === '') {
            data.parentfieldid = null;
        }
        if(data.parentfieldvalue === '') {
            data.parentfieldvalue = null;
        }
        if (data.isrequired === '') {
            data.isrequired = 0;
        }
        console.log('data.isrequired >>> ', data.isrequired)
        const sql = "UPDATE mst_profile_fields_group_map SET fieldid = ?,parentfieldid=?, parentfieldvalue=?, fieldgroupid = ?, fieldwidth=?,fontsize=?, isrequired =?  WHERE id = ?";
        const [result] = await  writeConn.query(sql,[data.fieldid,data.parentfieldid,data.parentfieldvalue,data.fieldgroupid,data.fieldwidth,data.fontsize,data.isrequired, data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.delete  = async(data) => {
    try {
        const sql = "UPDATE mst_profile_fields_group_map SET deleted = '1' WHERE id = ?";
        const [result] = await  writeConn.query(sql,[data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.updateSequence  = async(data) => {
    try {
        let i = 0;
        for (const obj of data) {
            const sql = "UPDATE mst_profile_fields_group_map SET sequence = ? WHERE id = ?";
            const [result] = await writeConn.query(sql,[obj.sequence, obj.id]);
            if (data.length === (i + 1)) {
                return true;
            }
            i++;
        }
    } catch (e) {
        util.createLog(e);
        return false;
    }
}