const readConn = require('../../dbconnection').readPool;
const writeConn = require('../../dbconnection').writePool;
const util = require('../../utility/util');

module.exports.getList  = async(data) => {
    try {
        const sql = "SELECT a.sequenceno, a.isrequired, a.approvalrequired, a.stepid, a.fieldid, a.groupid, a.rowname, a.islabelshow, " +
            " a.fieldwidth, a.fontsize, a.parentfieldid, a.parentfieldvalue, ms.stepdesc, ms.sequenceno as stepsequenceno, ms.istableview," +
            " a.customclass " +
            " FROM mst_profile_step_fields a, mst_steps ms" +
            " WHERE a.deleted='0' AND a.reraid = ? AND a.entityid = ? AND a.entitytypeid = ? AND a.stepid=ms.stepid AND ms.deleted = '0'";
        const [result] = await  readConn.query(sql,[data.reraid, data.entityid, data.entitytypeid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getFieldDetailsById = async (id) => {
    try {
        const sql = "SELECT fieldid, fielddesc, fielddisplaydesc, isuniqueid, fieldtype, controltype, controlvalue, '' fieldvalue, busnessunittypeid FROM mst_entity_profile_fields WHERE fieldid=? AND deleted = '0'";
        const [result] = await readConn.query(sql,[id]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getFieldValueById = async (userId, fieldId, stepId) => {
    try {
        const sql = "SELECT id, fieldvalue, isverified FROM mst_entity_profile_dtl_temp WHERE userid = ? AND fieldid = ? AND stepid = ?";
        const [result] = await readConn.query(sql,[userId, fieldId, stepId]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getFieldValueByIdFromDtl = async (userId, fieldId, stepId) => {
    try {
        const sql = "SELECT id, fieldvalue, isverified FROM mst_entity_profile_values_dtl WHERE userid = ? AND fieldid = ? AND stepid = ?";
        const [result] = await readConn.query(sql,[userId, fieldId, stepId]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}



module.exports.getFieldsByGroupId = async (id) => {
    try {
        const sql = "SELECT b.fieldid, b.fielddesc, b.fielddisplaydesc, b.isuniqueid, b.fieldtype, b.controltype, b.controlvalue, '' fieldvalue," +
            " a.parentfieldid, a.parentfieldvalue, a.sequence, a.fieldgroupid, a.fieldwidth, a.fontsize, b.busnessunittypeid, a.isrequired " +
            " FROM mst_profile_fields_group_map a, mst_entity_profile_fields b" +
            " WHERE a.fieldid=b.fieldid AND a.groupid = ? AND a.deleted = '0' AND b.deleted = '0' ORDER BY a.sequence ASC";
        const [result] = await readConn.query(sql,[id]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getGroupsByGroupId = async (id) => {
    try {
        const sql = "SELECT a.fieldgroupid, a.sequence, a.parentfieldid, a.parentfieldvalue, b.groupname" +
            " FROM mst_profile_fields_group_map a, mst_profile_fields_group b" +
            " WHERE a.groupid = ? AND a.deleted = '0' AND a.fieldid IS NULL AND a.fieldgroupid = b.groupid";
        const [result] = await readConn.query(sql,[id]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getFieldsValueMaxCountByGroupId = async (stepId, groupId, userId, flag = 0, fieldGroupId = 0, groupPosition = -1) => {
    try {
        let tableName = flag === 0 ? 'mst_entity_profile_dtl_temp' : 'mst_entity_profile_values_dtl';
        let where = flag === 0 ? "" : " AND deleted = 0 ";
        where += fieldGroupId !== 0 ? " AND fieldgroupid = " + fieldGroupId : " AND fieldgroupid IS NULL ";
        where += groupPosition !== -1 ? " AND groupposition = " + groupPosition : "";
        const sql = "SELECT groupposition FROM " + tableName + " WHERE stepid = ? AND groupid = ? AND userid = ? " + where + " GROUP BY groupposition";
        const [result] = await readConn.query(sql,[stepId, groupId, userId]);
        /*if (result.length === 0) {
            return 0;
        } else {
            return await util.getMaxFromJSONArray(result, 'count');
        }*/
        return result.length;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getFieldsValueByGroupId = async (stepId, groupId, userId, fieldGroupId, groupposition) => {
    try {
        let where = "";
        if (fieldGroupId !== null && fieldGroupId !== 0) {
            where += " AND fieldgroupid = " + fieldGroupId;
        } else {
            where += " AND fieldgroupid IS NULL"
        }
        let sql = "SELECT id, fieldid, fieldvalue, groupposition, groufieldpposition, isverified FROM mst_entity_profile_dtl_temp WHERE stepid = ? AND groupid = ? AND userid = ? AND groupposition = ? " + where + " ORDER BY id ASC";
        const [result] = await readConn.query(sql,[stepId, groupId, userId, groupposition]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getFieldsValueByGroupIdFromDtl = async (stepId, groupId, userId, fieldGroupId, groupposition) => {
    try {
        let where = "";
        if (fieldGroupId !== null && fieldGroupId !== 0) {
            where += " AND fieldgroupid = " + fieldGroupId;
        } else {
            where += " AND fieldgroupid IS NULL"
        }
        let sql = "SELECT id, fieldid, fieldvalue, groupposition, groufieldpposition, isverified FROM mst_entity_profile_values_dtl WHERE stepid = ? AND groupid = ? AND userid = ? AND groupposition = ? " + where + " ORDER BY id ASC";
        const [result] = await readConn.query(sql,[stepId, groupId, userId, groupposition]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

const checkExistingFieldTemp = async (userId, fieldId, stepId, groupId, groupPosition, fieldGroupPos) => {
    try{
        let where = "";
        if (groupPosition) {
            where += " AND groupposition = " + groupPosition
        }
        if (fieldGroupPos) {
            where += " AND groufieldpposition = " + fieldGroupPos
        }
        if (groupId) {
            where += " AND groupid = " + groupId
        }
        const sql = "SELECT id FROM mst_entity_profile_dtl_temp WHERE userid = ? AND fieldid = ? AND stepid = ?" + where;
        const [result] = await readConn.query(sql,[userId, fieldId, stepId]);
        return result.length > 0 ? result[0].id : false;
    } catch (e) {
        const log = util.createLog(e);
        return false;
    }
}

module.exports.storeFieldInfoIntoTemp = async (data) => {
    try {
        util.createLog("data.fileName<>>>>>>>>>>>>>>>>>> ", data.fileName)
        if (data.fieldtype === '5') {
            data.fieldvalue = data.fileName;
        }
        util.createLog("data.fieldvalue<>>>>>>>>>>>>>>>>>> ", data.fieldvalue)
        const existResp = await checkExistingFieldTemp(data.userid, data.fieldid, data.stepid, data.groupid, data.pos, data.fieldGroupPos)
        if (existResp) {
            const sql = 'UPDATE mst_entity_profile_dtl_temp SET fieldvalue = ? WHERE id = ?';
            const [result] = await writeConn.query(sql,[data.fieldvalue, existResp]);
            util.createLog("data.fieldvalue<>>>>>>>>>>>>>>>>>> ", data.fieldvalue)
            return {id: data.tempid, value: data.fieldvalue};
        } else {
            if (data.fieldtype === '5') {
                data.fieldvalue = data.fileName;
            }
            data.groupid = data.groupid === '' ? null : data.groupid;
            data.tempid = data.tempid === '' ? null : data.tempid;
            data.fieldgroupid = data.fieldgroupid === '' ? null : data.fieldgroupid;
            if(Number(data.pos) === -1) {
                data.pos = null;
            }
            console.log(">>>>>>> ", data.fieldGroupPos)
            if(Number(data.fieldGroupPos) === -1) {
                data.fieldGroupPos = null;
            }
            const sql = "INSERT INTO mst_entity_profile_dtl_temp (userid, groupid, stepid, fieldid, fieldgroupid, fieldvalue, groupposition, groufieldpposition) VALUES (?,?,?,?,?,?,?, ?)";
            const [result] = await writeConn.query(sql,[data.userid, data.groupid, data.stepid, data.fieldid, data.fieldgroupid, data.fieldvalue, data.pos, data.fieldGroupPos]);
            util.createLog("data.fieldvalue<>>>>>>>>>>>>>>>>>> ", data.fieldvalue)
            return {id: result.insertId, value: data.fieldvalue};
        }
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.deleteFromGroup = async (data) => {
    try {
        let where = '';
        if (data.fieldgroupid != '0') {
            where += " AND fieldgroupid=" + data.fieldgroupid;
            where += " AND groufieldpposition=" + data.fieldgrouppos == '' ? 0 : data.fieldgrouppos;
        }
        const sql = "DELETE FROM mst_entity_profile_dtl_temp WHERE groupid = ? AND groupposition = ? AND userid = ? " + where;
        const usql = "UPDATE mst_entity_profile_values_dtl SET deleted = 1  WHERE groupid=? AND groupposition=? AND userid=? " +  where;
        const [result] = await writeConn.query(sql,[data.groupid, data.position, data.userid]);
        const [result1] = await writeConn.query(usql,[data.groupid, data.position, data.userid]);
        return true
    } catch (e) {
        console.log(e);
        const log = util.createLog(e);
        return false;
    }
}

module.exports.deleteTempDataForProfile = async (userId) => {
    try {
        const sql = "DELETE FROM mst_entity_profile_dtl_temp WHERE userid = ?";
        const [result] = await writeConn.query(sql,[userId]);
        return true
    } catch (e) {
        console.log(e);
        const log = util.createLog(e);
        return false;
    }
}

module.exports.getProfileFieldValue = async (userId) => {
    try {
        const sql = "SELECT a.groupid, a.stepid, a.fieldid, a.fieldgroupid, a.fieldvalue, a.groupposition, a.groufieldpposition, a.issystemverified, a.isverified FROM mst_entity_profile_dtl_temp a WHERE a.userid = ?";
        const [result] = await readConn.query(sql,[userId]);
        return result
    } catch (e) {
        const log = util.createLog(e);
        return false;
    }
}

const checkExistingField = async (userId, stepId, fieldId, groupId, groupPosition, fieldGroupId, fieldGroupPosition) => {
    try{
        let where = "";
        if (groupId) {
            where += " AND groupid = " + groupId
        }
        if (groupPosition) {
            where += " AND groupposition = " + groupPosition
        }
        if (fieldGroupId) {
            where += " AND fieldgroupid = " + fieldGroupId
        }
        if (fieldGroupPosition) {
            where += " AND groufieldpposition = " + fieldGroupPosition
        }
        const sql = "SELECT id FROM mst_entity_profile_values_dtl WHERE deleted=0 AND userid = ? AND fieldid = ? AND stepid = ?" + where;
        const [result] = await readConn.query(sql,[userId, fieldId, stepId]);
        return result.length > 0 ? result[0].id : false;
    } catch (e) {
        const log = util.createLog(e);
        return false;
    }
}

module.exports.insertIntoProfileDtl = async (fieldList, reraId, userId) => {
    try {
        let i = 0;
        for (const obj of fieldList) {
            const existingRes = await checkExistingField(userId, obj.stepid, obj.fieldid, obj.groupid, obj.groupposition, obj.fieldgroupid, obj.groufieldpposition);
            if (existingRes) {
                const uSql = "UPDATE mst_entity_profile_values_dtl SET fieldvalue = ?, issystemverified = ?, isverified = ? WHERE id = ?";
                const [result] = await writeConn.query(uSql,[obj.fieldvalue, obj.issystemverified, obj.isverified, existingRes]);
            } else {
                const sql = "INSERT INTO mst_entity_profile_values_dtl" +
                    " (reraid, userid, groupid, stepid, fieldid, fieldgroupid, fieldvalue, groupposition, groufieldpposition, issystemverified, isverified)" +
                    " VALUES (?,?,?,?,?,?,?,?,?,?,?)";
                const [result] = await writeConn.query(sql,[reraId, userId, obj.groupid, obj.stepid, obj.fieldid, obj.fieldgroupid, obj.fieldvalue, obj.groupposition, obj.groufieldpposition, obj.issystemverified, obj.isverified]);
            }
            if ((i+1) === fieldList.length) {
                return true;
            }
            i++;
        }
    } catch (e) {
        console.log(e);
        const log = util.createLog(e);
        return false;
    }
}

module.exports.getSystemVerificationFields = async (data) => {
    try {
        let sql = "SELECT a.strfieldid, a.filefieldid, b.fielddesc as strfileddesc, c.fielddesc as filefielddesc" +
            " FROM systemvefificationfields a, mst_entity_profile_fields b, mst_entity_profile_fields c" +
            " WHERE a.reraid = ? AND a.deleted='0' AND  a.fromwhich = 2 AND a.strfieldid = b.fieldid AND a.filefieldid = c.fieldid";
        const [result] = await readConn.query(sql, [data.reraid]);
        return result
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.checkVerificationField = async (data) => {
    try {
        let sql = "SELECT strfieldid, filefieldid from systemvefificationfields where reraid = ? AND fromwhich = 2 AND deleted='0' AND (strfieldid = ? OR filefieldid = ?)";
        const [result] = await readConn.query(sql, [data.reraid, data.fieldid,  data.fieldid]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.insertIntoVerificationSchedule = async (data) => {
    try {
        let fsql = "SELECT * FROM verificationschedulefields WHERE reraid = ? AND particularmoduleid = ? AND (strfieldid = ? OR filefieldid = ?) AND fromwhich = 2";
        const [result] = await readConn.query(fsql, [data.reraid, data.userid, data.strfieldid, data.filefieldid]);
        if (result.length > 0) {
            if (result[0].strfieldid ===  Number(data.fieldid)) {
                result[0].strfieldid = Number(data.fieldid);
                result[0].strfieldvalue = data.fieldvalue;
            } else if (result[0].filefieldid === Number(data.fieldid)) {
                result[0].filefieldid = Number(data.fieldid);
                result[0].filefieldvalue = data.fieldvalue;
            }
            const usql = "UPDATE verificationschedulefields SET strfieldid = ?, strfieldvalue = ?, filefieldid = ?, filefieldvalue = ?, isprocess = 0 WHERE id = ?";
            const uRes = await writeConn.query(usql, [result[0].strfieldid, result[0].strfieldvalue, result[0].filefieldid, result[0].filefieldvalue, result[0].id]);
        } else {
            let sql = "INSERT INTO verificationschedulefields (reraid, particularmoduleid, strfieldid, strfieldvalue,filefieldid,filefieldvalue, fromwhich) VALUE (?,?,?,?,?,?,?)";
            const uRes = await writeConn.query(sql, [data.reraid, data.userid, data.strfieldid, data.strfieldvalue, data.filefieldid, data.filefieldvalue, 2]);
        }
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.updateIsSubmittedField = async (reraid, userid) => {
    try {
        let sql = "UPDATE mst_user SET issubmitted='1' WHERE reraid=? AND userid=? AND deleted='0'";
        const [result] = await readConn.query(sql, [reraid,  userid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getFormSubmitInfo = async (data) => {
    try {
        let sql = "SELECT issubmitted FROM mst_user WHERE reraid=? AND userid=? AND deleted='0'";
        const [result] = await readConn.query(sql, [data.reraid, data.userid]);
        return result
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.uploadSignature = async (data) => {
    try {
        const sql = "UPDATE mst_user SET signature = ? WHERE userid = ? ";
        const [result] = await readConn.query(sql, [data.fileName, data.userid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getSignature = async (data) => {
    try {
        const sql = "SELECT signature FROM mst_user WHERE userid = ?;";
        const [result] = await readConn.query(sql, [data.userid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.agentrenewalhdr = async (data) => {
    try {
        const sql = "INSERT INTO agent_renewal_hdr (agentid,userid,submitted) VALUES (?,?,?);";
        const [result] = await readConn.query(sql, [data.userid,data.userid,1]);
        return result.insertId? result.insertId:false;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}