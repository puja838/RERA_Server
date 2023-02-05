const readConn = require('../../dbconnection').readPool;
const writeConn = require('../../dbconnection').writePool;
const util = require('../../utility/util');

module.exports.getList = async (data) => {
    try {
        const sql = "SELECT a.sequenceno, a.isrequired, a.approvalrequired, a.stepid, a.fieldid, a.groupid, a.rowname, a.islabelshow, " +
            " a.fieldwidth, a.fontsize, a.parentfieldid, a.parentfieldvalue, ms.stepdesc, ms.sequenceno as stepsequenceno, ms.istableview," +
            " a.customclass " +
            " FROM mst_entitytype_step_fields a, mst_steps ms" +
            " WHERE a.deleted='0' AND a.reraid = ? AND a.entitytypeid = ? AND a.stepid=ms.stepid AND ms.deleted=0";
        const [result] = await readConn.query(sql, [data.reraid, data.entitytypeid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getFieldDetailsById = async (id) => {
    try {
        const sql = "SELECT fieldid, fielddesc, fielddisplaydesc, projectuniqueid, fieldtype, controltype, controlvalue, fieldvalue, busnessunittypeid, isreadonly FROM mst_fields WHERE fieldid=? AND deleted = '0'";
        const [result] = await readConn.query(sql, [id]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getFieldValueById = async (projectId, fieldId, stepId, groupid = null) => {
    try {
        let sql = "SELECT id, fieldvalue FROM mst_entitytype_project_dtl_temp WHERE entitytypeprojecthdrid = ? AND fieldid = ? AND stepid = ?";
        if (groupid) {
            sql += "  AND groupid = " + groupid;
        } else {
            sql += "  AND groupid IS NULL ";
        }
        const [result] = await readConn.query(sql, [projectId, fieldId, stepId]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return null;
    }
};

module.exports.getFieldValueByIdFromDtl = async (projectId, fieldId, stepId, groupid = null) => {
    try {
        let sql = "SELECT id, projectfieldvalue as fieldvalue FROM mst_entitytype_project_dtl WHERE entitytypeprojecthdrid = ? AND fieldid = ? AND stepid = ?";
        if (groupid) {
            sql += "  AND groupid = " + groupid;
        } else {
            sql += "  AND groupid IS NULL ";
        }
        const [result] = await readConn.query(sql, [projectId, fieldId, stepId]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return null;
    }
}


module.exports.getFieldsByGroupId = async (id) => {
    try {
        const sql = "SELECT b.fieldid, b.fielddesc, b.fielddisplaydesc, b.projectuniqueid, b.fieldtype, b.controltype, b.controlvalue, b.fieldvalue, b.isreadonly, " +
            " a.parentfieldid, a.parentfieldvalue, a.sequence, a.fieldgroupid, a.fieldwidth, a.fontsize, a.rowname, b.busnessunittypeid, a.isrequired, a.islabelshow, a.customclass " +
            " FROM mst_fields_group_map a, mst_fields b" +
            " WHERE a.fieldid=b.fieldid AND a.groupid = ? AND a.deleted = '0' AND b.deleted = '0' ORDER BY a.sequence ASC";
        const [result] = await readConn.query(sql, [id]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getGroupsDetailsByGroupId = async (id) => {
    try {
        const sql = "SELECT  groupname, groupView " +
            " FROM mst_fields_group " +
            " WHERE groupid = ? AND deleted = '0'";
        const [result] = await readConn.query(sql, [id]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getGroupsByGroupId = async (id) => {
    try {
        const sql = "SELECT a.fieldgroupid, a.sequence, a.parentfieldid, a.parentfieldvalue, b.groupname, b.groupView" +
            " FROM mst_fields_group_map a, mst_fields_group b" +
            " WHERE a.groupid = ? AND a.deleted = '0' AND a.fieldid IS NULL AND a.fieldgroupid = b.groupid";
        const [result] = await readConn.query(sql, [id]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getFieldsValueMaxCountByGroupId = async (stepId, groupId, projectId, flag = 0, fieldGroupId = 0, groupPosition = -1) => {
    try {
        let tableName = flag === 0 ? 'mst_entitytype_project_dtl_temp' : 'mst_entitytype_project_dtl';
        let where = flag === 0 ? "" : " AND deleted = 0 ";
        where += fieldGroupId !== 0 ? " AND fieldgroupid = " + fieldGroupId : " AND fieldgroupid IS NULL ";
        where += groupPosition !== -1 ? " AND groupposition = " + groupPosition : "";
        let sql = "SELECT groupposition FROM " + tableName + " WHERE stepid = ? AND groupid = ? AND entitytypeprojecthdrid = ? " + where;
        if (fieldGroupId !== 0) {
            sql += " GROUP BY groufieldpposition"
        } else {
            sql += " GROUP BY groupposition"
        }
        const [result] = await readConn.query(sql, [stepId, groupId, projectId]);
        /*if (result.length === 0) {
            return 0;
        } else {
            return await util.getMaxFromJSONArray(result, 'count');
        }*/
        return result.length
    } catch (e) {
        util.createLog(e);
        return 0;
    }
}

/*module.exports.getFieldsValueByGroupId = async (id, projectId, isComplete) => {
    try {
        let sql = "SELECT id, fieldid, fieldvalue FROM mst_entitytype_project_dtl_temp WHERE groupid = ? AND entitytypeprojecthdrid = ? ORDER BY id ASC";
        if (isComplete === 1) {
            sql = "SELECT id, fieldid, projectfieldvalue as fieldvalue FROM mst_entitytype_project_dtl WHERE groupid = ? AND entitytypeprojecthdrid = ? AND deleted = 0 ORDER BY id ASC";
        }
        const [result] = await readConn.query(sql,[id, projectId]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};*/

module.exports.getFieldsValueByGroupId = async (stepId, groupId, projectId, fieldGroupId, groupposition) => {
    try {
        let where = "";
        if (fieldGroupId !== null && fieldGroupId !== 0) {
            where += " AND fieldgroupid = " + fieldGroupId;
        } else {
            where += " AND fieldgroupid IS NULL"
        }
        let sql = "SELECT id, fieldid, fieldvalue, groupposition, groufieldpposition FROM mst_entitytype_project_dtl_temp WHERE stepid = ? AND groupid = ? AND entitytypeprojecthdrid = ? AND groupposition = ? " + where + " ORDER BY id ASC";
        const [result] = await readConn.query(sql, [stepId, groupId, projectId, groupposition]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getFieldsValueByGroupIdFromDtl = async (stepId, groupId, projectId, fieldGroupId, groupposition) => {
    try {
        let where = "";
        if (fieldGroupId !== null && fieldGroupId !== 0) {
            where += " AND fieldgroupid = " + fieldGroupId;
        } else {
            where += " AND fieldgroupid IS NULL"
        }
        let sql = "SELECT id, fieldid, projectfieldvalue as fieldvalue, groupposition, groufieldpposition FROM mst_entitytype_project_dtl WHERE stepid = ? AND groupid = ? AND entitytypeprojecthdrid = ? AND groupposition = ? " + where + " ORDER BY id ASC";
        const [result] = await readConn.query(sql, [stepId, groupId, projectId, groupposition]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getUnsaveProject = async (data) => {
    try {
        const sql = "SELECT id FROM mst_entitytype_project_hdr WHERE isdelete = 0 AND reraid = ? AND entityid = ? AND entitytypeid = ? AND particularprofileid = ? AND iscomplete = 0 AND isdelete=0";
        const [result] = await readConn.query(sql, [data.reraid, data.entityid, data.entitytypeid, data.userid]);
        return result.length > 0 ? result[0].id : null
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.createNewTempProject = async (data) => {
    try {
        const sql = "INSERT INTO mst_entitytype_project_hdr (reraid, entityid, entitytypeid, particularprofileid, projectuid) VALUES (?,?,?,?,?)";
        const [result] = await writeConn.query(sql, [data.reraid, data.entityid, data.entitytypeid, data.userid, data.projectuid]);
        return result.insertId;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

// module.exports.storeFieldInfoIntoTemp = async (data) => {
//     try {
//         if (data.fieldtype === '5') {
//             data.fieldvalue = data.fileName;
//         }
//         const existResp = await checkExistingFieldTemp(data.projectid, data.fieldid, data.stepid, data.groupid, data.pos, data.fieldgroupid, data.fieldGroupPos);
//         if (existResp) {
//             const sql = "UPDATE mst_entitytype_project_dtl_temp SET fieldvalue = ? WHERE id = ?";
//             const [result] = await writeConn.query(sql,[data.fieldvalue, existResp]);
//             return {id: existResp, value: data.fieldvalue};
//         } else {
//             // if (data.fieldtype === '5') {
//             //     data.fieldvalue = data.fileName;
//             // }
//             data.groupid = data.groupid === '' ? null : data.groupid;
//             data.tempid = data.tempid === '' ? null : data.tempid;
//             data.fieldgroupid = data.fieldgroupid === '' ? null : data.fieldgroupid;
//             if(Number(data.pos) === -1) {
//                 data.pos = null;
//             }
//             if(Number(data.fieldGroupPos) === -1) {
//                 data.fieldGroupPos = null;
//             }
//             const sql = "INSERT INTO mst_entitytype_project_dtl_temp (entitytypeprojecthdrid, groupid, stepid, fieldid, fieldgroupid, fieldvalue, groupposition, groufieldpposition) VALUES (?,?,?,?,?,?,?,?)";
//             util.createLog(sql);
//             console.log(data.projectid, data.groupid, data.stepid, data.fieldid, data.fieldgroupid, data.fieldvalue, data.pos, data.fieldGroupPos);
//             const [result] = await writeConn.query(sql,[data.projectid, data.groupid, data.stepid, data.fieldid, data.fieldgroupid, data.fieldvalue, data.pos, data.fieldGroupPos]);
//             return {id: result.insertId, value: data.fieldvalue};
//         }
//     } catch (e) {
//         util.createLog(e);
//         return false;
//     }
// }

module.exports.deleteFromGroup = async (data) => {
    try {
        /*const sql = "DELETE FROM mst_entitytype_project_dtl_temp WHERE groupid=? AND groupposition=? AND entitytypeprojecthdrid=?";
        const usql = "UPDATE mst_entitytype_project_dtl SET deleted = 1  WHERE groupid=? AND groupposition=? AND entitytypeprojecthdrid=?";
        const [result] = await writeConn.query(sql,[data.groupid, data.position, data.projectid]);
        const [result1] = await writeConn.query(usql,[data.groupid, data.position, data.projectid]);
        return true*/
        let where = '';
        if (data.fieldgroupid !== '0') {
            where += " AND fieldgroupid=" + data.fieldgroupid;
            where += " AND groufieldpposition=" + data.fieldgrouppos;
        }
        const sql = "DELETE FROM mst_entitytype_project_dtl_temp WHERE groupid = ? AND groupposition = ? AND entitytypeprojecthdrid = ? " + where;
        const usql = "UPDATE mst_entitytype_project_dtl SET deleted = 1  WHERE groupid=? AND groupposition=? AND entitytypeprojecthdrid=? " + where;
        console.log(sql, data.groupid, data.position, data.projectid)
        const [result] = await writeConn.query(sql, [data.groupid, data.position, data.projectid]);
        console.log(result)
        const [result1] = await writeConn.query(usql, [data.groupid, data.position, data.projectid]);
        return true
    } catch (e) {
        console.log(e);
        const log = util.createLog(e);
        return false;
    }
}

module.exports.deleteFromTempByProjectId = async (projectId) => {
    try {
        const sql = "DELETE FROM mst_entitytype_project_dtl_temp WHERE entitytypeprojecthdrid = ?";
        const [result] = await writeConn.query(sql, [projectId]);
        return true
    } catch (e) {
        console.log(e);
        const log = util.createLog(e);
        return false;
    }
}

module.exports.deleteDraftProject = async (projectId) => {
    try {
        const sql = "UPDATE mst_entitytype_project_hdr SET isdelete = 1 WHERE id = ?";
        const [result] = await writeConn.query(sql, [projectId]);
        return true
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.updateProjectUniqueFieldValue = async (fieldValue, fieldId, projectId, currentDate) => {
    try {
        const sql = "UPDATE mst_entitytype_project_hdr SET projectfieldvalue = ?, fieldid = ?, iscomplete = 1, submitiontime = ? WHERE id = ?";
        const [result] = await writeConn.query(sql, [fieldValue, fieldId, currentDate, projectId]);
        return true
    } catch (e) {
        console.log(e);
        const log = util.createLog(e);
        return false;
    }
};

module.exports.getProjectUniqueFieldValue = async (projectId) => {
    try {
        const sql = "SELECT a.fieldid, b.fieldvalue FROM mst_fields a, mst_entitytype_project_dtl_temp b WHERE a.projectuniqueid = 1 AND a.fieldid = b.fieldid AND b.entitytypeprojecthdrid = ?";
        const [result] = await readConn.query(sql, [projectId]);
        return result.length > 0 ? result[0] : null
    } catch (e) {
        console.log(e);
        const log = util.createLog(e);
        return false;
    }
}

module.exports.getProjectFieldValue = async (projectId) => {
    try {
        const sql = "SELECT a.groupid, a.stepid, a.fieldid, a.fieldvalue, a.groupposition, a.fieldgroupid, a.groufieldpposition, a.issystemverified, a.isverified FROM mst_entitytype_project_dtl_temp a WHERE a.entitytypeprojecthdrid = ?";
        const [result] = await readConn.query(sql, [projectId]);
        return result
    } catch (e) {
        const log = util.createLog(e);
        return false;
    }
}


const checkExistingField = async (projectId, stepId, fieldId, groupId, groupPosition, fieldGroupId, fieldGroupPosition) => {
    try {
        let where = "";
        if (groupId && groupId !== '') {
            where += " AND groupid = " + groupId;
        } else {
            where += " AND groupid IS NULL ";
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
        const sql = "SELECT id FROM mst_entitytype_project_dtl WHERE deleted='0' AND entitytypeprojecthdrid = ? AND fieldid = ? AND stepid = ?" + where;
        const [result] = await readConn.query(sql, [projectId, fieldId, stepId]);
        return result.length > 0 ? result[0].id : false;
    } catch (e) {
        const log = util.createLog(e);
        return false;
    }
}

module.exports.insertIntoProjectDtl = async (fieldList, reraId, entityId, entityTypeId, projectId, userId) => {
    try {
        let i = 0;
        for (const obj of fieldList) {
            const existingRes = await checkExistingField(projectId, obj.stepid, obj.fieldid, obj.groupid, obj.groupposition, obj.fieldgroupid, obj.groufieldpposition);
            if (existingRes) {
                const uSql = "UPDATE mst_entitytype_project_dtl SET projectfieldvalue = ?, issystemverified = ?, isverified = ? WHERE id = ?"
                const [result] = await writeConn.query(uSql, [obj.fieldvalue, obj.issystemverified, obj.isverified, existingRes]);
            } else {
                const sql = "INSERT INTO mst_entitytype_project_dtl" +
                    " (projectfieldvalue, userid, reraid, entityid, entitytypeid, stepid, entitytypeprojecthdrid, fieldid, groupid, groupposition, fieldgroupid, groufieldpposition, issystemverified, isverified)" +
                    " VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                const [result] = await writeConn.query(sql, [obj.fieldvalue, userId, reraId, entityId, entityTypeId, obj.stepid, projectId, obj.fieldid, obj.groupid, obj.groupposition, obj.fieldgroupid, obj.groufieldpposition, obj.issystemverified, obj.isverified]);
            }
            if ((i + 1) === fieldList.length) {
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

module.exports.getProjectList = async (data) => {
    try {
        var sql = "SELECT a.id, a.projectuid, a.iscomplete, a.reraid, a.entityid, a.entitytypeid, a.isapproved, a.submitiontime, a.approvalcomment, b.username, a.progressstatus, a.webpagelink, a.registrationno, a.certificate \n" +
            "FROM mst_entitytype_project_hdr a, mst_user b\n" +
            "WHERE a.isdelete = 0 AND a.reraid = ? AND a.particularprofileid = ? AND a.particularprofileid = b.userid AND isdelete=0";
        if(data.isRegister && data.isMobile === undefined){
            sql += ' AND a.isapproved IN (3,4)'
        } else if (data.isMobile === undefined) {
            sql += ' AND a.isapproved NOT IN (3,4)'
        }
        if(data.isMobile) {
            sql += ' AND a.iscomplete = 1 '
        }
        sql += ' ORDER BY a.id ASC ';
        if (data.limit) {
            if (data.offset === null && data.offset === '') {
                data.offset = 0
            }
            sql += " LIMIT " + data.limit + " OFFSET " + data.offset
        }
       
        const [result] = await readConn.query(sql, [data.reraid, data.userid]);
        return result
    } catch (e) {
        console.log(e);
        const log = util.createLog(e);
        return [];
    }
};

module.exports.getProjectDetails = async (data) => {
    try {
        const sql = "SELECT a.id, a.projectuid, a.iscomplete, a.reraid, a.entityid, a.entitytypeid, a.isapproved, a.submitiontime, a.approvalcomment, b.username, a.progressstatus, a.webpagelink, a.certificate \n" +
            "FROM mst_entitytype_project_hdr a, mst_user b\n" +
            "WHERE a.isdelete = 0 AND a.id = ?";
        const [result] = await readConn.query(sql, [data.projectid]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        console.log(e);
        const log = util.createLog(e);
        return null;
    }
};

module.exports.fetchUpdateProjectDetailsForUser = async (data) => {
    try {
        let sql = "SELECT a.id, a.projectuid, a.iscomplete, a.reraid, a.entityid, a.entitytypeid, a.isapproved, a.afterapprovestatus, a.submitiontime, a.approvalcomment, a.registrationno, b.username\n" +
            "FROM mst_entitytype_project_hdr a, mst_user b\n" +
            "WHERE a.isdelete = 0 AND a.reraid = ? AND a.particularprofileid = ? AND a.particularprofileid = b.userid AND a.isapproved = 3 AND a.afterapprovestatus = ?";
        if (data.limit) {
            if (data.offset === null && data.offset === '') {
                data.offset = 0
            }
            sql += " LIMIT " + data.limit + " OFFSET " + data.offset
        }
        const [result] = await readConn.query(sql, [data.reraid,data.userid, data.flag]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getValuesForList = async (projectId, status) => {
    try {
        let sql = "";
        if (status === 0) {
            sql = "SELECT a.fieldid, f.fielddisplaydesc, b.fieldvalue as projectfieldvalue" +
                " FROM project_list_fields a, mst_fields f, mst_entitytype_project_dtl_temp b" +
                " WHERE a.deleted = 0 AND a.fieldid = f.fieldid AND  a.fieldid = b.fieldid AND a.stepid=b.stepid AND b.entitytypeprojecthdrid = ? ";
        } else {
            sql = "SELECT a.fieldid, f.fielddisplaydesc, b.projectfieldvalue" +
                " FROM project_list_fields a, mst_fields f, mst_entitytype_project_dtl b" +
                " WHERE a.deleted = 0 AND a.fieldid = f.fieldid AND a.fieldid = b.fieldid AND a.stepid=b.stepid AND b.entitytypeprojecthdrid = ? ";
        }
        const [result] = await readConn.query(sql, [projectId]);
        return result
    } catch (e) {
        console.log(e);
        const log = util.createLog(e);
        return false;
    }
}
module.exports.getProjectListTableHead = async (projectId, status) => {
    try {
        let sql = "SELECT a.fieldid, f.fielddisplaydesc" +
            " FROM project_list_fields a, mst_fields f" +
            " WHERE a.deleted = 0 AND a.fieldfor = 'W' AND a.fieldid = f.fieldid";
        const [result] = await readConn.query(sql);
        return result
    } catch (e) {
        console.log(e);
        const log = util.createLog(e);
        return false;
    }
}

module.exports.getSystemVerificationFields = async (data) => {
    try {
        let sql = "SELECT a.strfieldid, a.filefieldid, b.fielddesc as strfileddesc, c.fielddesc as filefielddesc" +
            " FROM systemvefificationfields a, mst_fields b, mst_fields c" +
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
        let sql = "SELECT strfieldid, filefieldid from systemvefificationfields where reraid = ? AND fromwhich = 1 AND deleted='0' AND (strfieldid = ? OR filefieldid = ?)";
        const [result] = await readConn.query(sql, [data.reraid, data.fieldid, data.fieldid]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.insertIntoVerificationSchedule = async (data) => {
    try {
        let fsql = "SELECT * FROM verificationschedulefields WHERE reraid = ? AND particularmoduleid = ? AND (strfieldid = ? OR filefieldid = ?) AND fromwhich = 1";
        const [result] = await readConn.query(fsql, [data.reraid, data.projectid, data.strfieldid, data.filefieldid]);
        if (result.length > 0) {
            if (result[0].strfieldid === Number(data.fieldid)) {
                result[0].strfieldid = Number(data.fieldid);
                result[0].strfieldvalue = data.fieldvalue;
            } else if (result[0].filefieldid === Number(data.fieldid)) {
                result[0].filefieldid = Number(data.fieldid);
                result[0].filefieldvalue = data.fieldvalue;
            }
            const usql = "UPDATE verificationschedulefields SET strfieldid = ?, strfieldvalue = ?, filefieldid = ?, filefieldvalue = ?, isprocess = 0 WHERE id = ?";
            const uRes = await writeConn.query(usql, [result[0].strfieldid, result[0].strfieldvalue, result[0].filefieldid, result[0].filefieldvalue, result[0].id]);
        } else {
            let sql = "INSERT INTO verificationschedulefields (reraid, particularmoduleid, strfieldid, strfieldvalue,filefieldid,filefieldvalue) VALUE (?,?,?,?,?,?)";
            const uRes = await writeConn.query(sql, [data.reraid, data.projectid, data.strfieldid, data.strfieldvalue, data.filefieldid, data.filefieldvalue]);
        }
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getRegistrationCertificateFields = async (data) => {
    try {
        const sql = "SELECT fieldid, fromwhich FROM certificatefields WHERE reraid = ?";
        const [result] = await readConn.query(sql, [data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getProfileFieldValueById = async (userId, fieldId) => {
    try {
        const sql = "SELECT b.fielddesc, a.fieldvalue FROM mst_entity_profile_values_dtl a, mst_entity_profile_fields b WHERE a.userid = ? AND a.fieldid = ? AND a.fieldid=b.fieldid";
        const [result] = await readConn.query(sql, [userId, fieldId]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getProfileFieldDtlById = async (fieldId) => {
    try {
        const sql = "SELECT fielddesc, '' as fieldvalue FROM mst_entity_profile_fields WHERE fieldid = ?";
        const [result] = await readConn.query(sql, [fieldId]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getRegistrationNumber = async (projectid) => {
    try {
        const sql = "SELECT projectuid FROM mst_entitytype_project_hdr WHERE id = ? AND isdelete=0";
        const [result] = await readConn.query(sql, [projectid]);
        return result.length > 0 ? result[0].projectuid : null;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getGeneratedCertificate = async (projectid) => {
    try {
        const sql = "SELECT certificate FROM mst_entitytype_project_hdr WHERE id = ? AND isdelete=0";
        const [result] = await readConn.query(sql, [projectid]);
        return result.length > 0 ? result[0].certificate : null;
    } catch (e) {
        util.createLog(e);
        return null;
    }
}

module.exports.getUserNoByUserId = async (userId) => {
    try {
        const sql = "SELECT userno FROM mst_user WHERE userid = ?";
        const [result] = await readConn.query(sql, [userId]);
        return result.length > 0 ? result[0].userno : null;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getTotalCount = async (userid) => {
    try {
        const sql = "SELECT COUNT(id) as pcount FROM mst_entitytype_project_hdr WHERE particularprofileid = ? AND isdelete=0";
        const [result] = await readConn.query(sql, [userid]);
        return result.length > 0 ? result[0].pcount : 0;
    } catch (e) {
        util.createLog(e);
        return 0;
    }
}

module.exports.updateApprovalComments = async (data) => {
    try {
        if (data.isapproved === undefined || data.isapproved === '') {
            data.isapproved = 0
        }
        let sql = "";
        if (data.type == 1) {
            sql = "UPDATE mst_entitytype_project_hdr SET sendtoapprovalcomment = ?, sendtoapprovalby =?, sendtoapprovaltime =?, isapproved = ? WHERE id = ?"
            const [result] = await readConn.query(sql, [data.comment, data.userid, data.approvetime, data.isapproved, data.projectid]);
        } else {
            sql = "UPDATE mst_entitytype_project_hdr SET approvalcomment = ?, approvalby =?, approvaltime =?, isapproved = ?, registrationno = ?  WHERE id = ?"
            const [result] = await readConn.query(sql, [data.comment, data.userid, data.approvetime, data.isapproved, data.regno, data.projectid]);
        }
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.isChairmanApprove = async (data) => {
    try {
        let sql = "SELECT isapproved FROM mst_entitytype_project_hdr WHERE reraid = ? AND id = ?";
        const [result] = await readConn.query(sql, [data.reraid, data.projectid]);
        return result.length > 0 ? result[0] : false;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getCountOfTotalProject = async (data) => {
    try {
        let sql = "SELECT count(id) as projectCount FROM mst_entitytype_project_hdr WHERE reraid = ? AND particularprofileid = ? AND isdelete=0";
        if(data.isMobile) {
            sql += " AND iscomplete = 1";
        }
        const [result] = await readConn.query(sql, [data.reraid, data.userid]);
        return result.length > 0 ? result[0].projectCount : 0
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.getCountOfTotalRegisteredProjects = async (data) => {
    try {
        let sql = "SELECT count(id) as projectCount FROM mst_entitytype_project_hdr WHERE reraid = ? AND particularprofileid = ? AND isapproved IN (3,4) AND isdelete=0";
        const [result] = await readConn.query(sql, [data.reraid, data.userid]);
        return result.length > 0 ? result[0].projectCount : 0
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.getCountOfTotalRegistrationApplications = async (data) => {
    try {
        let sql = "SELECT count(id) as projectCount FROM mst_entitytype_project_hdr WHERE reraid = ? AND particularprofileid = ? AND isapproved NOT IN (3,4) AND isdelete=0";
        const [result] = await readConn.query(sql, [data.reraid, data.userid]);
        return result.length > 0 ? result[0].projectCount : 0
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getCountOfTotalProjectStageTwo = async (data) => {
    try {
        let sql = "SELECT count(id) as projectCount FROM mst_entitytype_project_hdr WHERE reraid = ? AND particularprofileid = ? AND isapproved=3 AND afterapprovestatus=0 AND isdelete=0";
        const [result] = await readConn.query(sql, [data.reraid, data.userid]);
        return result.length > 0 ? result[0].projectCount : 0
    } catch (e) {
        util.createLog(e);
        return 0;
    }
}

module.exports.getCountOfTotalProjectStageQPR = async (data) => {
    try {
        let sql = "SELECT count(id) as projectCount FROM mst_entitytype_project_hdr WHERE reraid = ? AND particularprofileid = ? AND isapproved=3 AND afterapprovestatus=2 AND isdelete=0";
        const [result] = await readConn.query(sql, [data.reraid, data.userid]);
        return result.length > 0 ? result[0].projectCount : 0
    } catch (e) {
        util.createLog(e);
        return 0;
    }
}

module.exports.getCountOfTotalProjectInWorkflow = async (data) => {
    try {
        let sql = "SELECT count(id) as projectCount FROM trn_workflow_steps_latest_project WHERE reraid = ? AND workflowuserid = ?";
        const [result] = await readConn.query(sql, [data.reraid, data.userid]);
        return result.length > 0 ? result[0].projectCount : 0
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getProjectUID = async (projectid) => {
    try {
        let sql = "SELECT projectuid,projectfieldvalue FROM mst_entitytype_project_hdr WHERE id = ? AND isdelete=0";
        const [result] = await readConn.query(sql, [projectid]);
        return result
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

const checkExistingFieldTemp = async (projectId, fieldId, stepId, groupId, groupPosition, fieldGroupPos, fieldgroupid) => {
    try {
        let where = "";
        if (Number(fieldGroupPos) === -1) {
            fieldGroupPos = null;
        }
        if (groupPosition) {
            where += " AND groupposition = " + groupPosition;
        }
        if (fieldGroupPos) {
            where += " AND groufieldpposition = " + fieldGroupPos;
        }
        if (groupId && groupId !== '') {
            where += " AND groupid = " + groupId;
        } else {
            where += " AND groupid IS NULL ";
        }
        if (fieldgroupid) {
            where += " AND fieldgroupid = " + fieldgroupid;
        }
        const sql = "SELECT id FROM mst_entitytype_project_dtl_temp WHERE entitytypeprojecthdrid = ? AND fieldid = ? AND stepid = ?" + where;
        // console.log('sql >>> ', sql)
        const [result] = await readConn.query(sql, [projectId, fieldId, stepId]);
        // console.log('result >>> '. result);
        return result.length > 0 ? result[0].id : false;
    } catch (e) {
        const log = util.createLog(e);
        return false;
    }
}

module.exports.storeFieldInfoIntoTemp = async (data, type) => {
    try {
        const existResp = await checkExistingFieldTemp(data.projectid, data.fieldid, data.stepid, data.groupid, data.pos, data.fieldGroupPos, data.fieldgroupid);
        if (existResp) {
            const sql = "UPDATE mst_entitytype_project_dtl_temp SET fieldvalue = ? WHERE id = ?";
            const [result] = await writeConn.query(sql, [data.fieldvalue, existResp]);
            return {id: existResp, value: data.fieldvalue};
        } else {
            // if (data.fieldtype === '5') {
            //     data.fieldvalue = data.fileName;
            // }
            if (type !== 'all') {
                data.groupid = data.groupid === '' ? null : data.groupid;
                data.tempid = data.tempid === '' ? null : data.tempid;
                data.fieldgroupid = data.fieldgroupid === '' ? null : data.fieldgroupid;
            }
            if (Number(data.pos) === -1) {
                data.pos = null;
            }
            if (Number(data.fieldGroupPos) === -1) {
                data.fieldGroupPos = null;
            }
            const sql = "INSERT INTO mst_entitytype_project_dtl_temp (entitytypeprojecthdrid, groupid, stepid, fieldid, fieldgroupid, fieldvalue, groupposition, groufieldpposition) VALUES (?,?,?,?,?,?,?,?)";
            util.createLog(sql);
            // console.log("\n\n\n    >>>>>>>>>>>>>>>>>>>>>>>    ", data.projectid, data.groupid, data.stepid, data.fieldid, data.fieldgroupid, data.fieldvalue, data.pos, data.fieldGroupPos);
            const [result] = await writeConn.query(sql, [data.projectid, data.groupid, data.stepid, data.fieldid, data.fieldgroupid, data.fieldvalue, data.pos, data.fieldGroupPos]);
            return {id: result.insertId, value: data.fieldvalue};
        }
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getFieldState = async (id) => {
    try {
        const sql = "SELECT id, statename FROM mst_states where deleted = 0;";
        const [result] = await readConn.query(sql);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getDistricts = async (data) => {
    try {
        const sql = "SELECT id, cityname FROM mst_city where stateid = ? and deleted = 0;";
        const [result] = await readConn.query(sql, [data.stateid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getProjectDtlForCRM = async (projectid) => {
    try {
        const sql = "SELECT projectfieldvalue as projectName, projectuid  FROM mst_entitytype_project_hdr WHERE id = ? AND isdelete=0";
        const [result] = await readConn.query(sql, [projectid]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return null;
    }
}
module.exports.getUserNameById = async (userid) => {
    try {
        const sql = "SELECT username  FROM mst_user WHERE userid = ?";
        const [result] = await readConn.query(sql, [userid]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return null;
    }
}
module.exports.getProjectAddress = async (projectid) => {
    try {
        const sql = "SELECT projectfieldvalue FROM mst_entitytype_project_dtl WHERE stepid = 1 AND fieldid = 4 AND entitytypeprojecthdrid = ?";
        const [result] = await readConn.query(sql, [projectid]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return null;
    }
}

module.exports.isPaymentComplete = async (projectid) => {
    try {
        const sql = "SELECT paymentid FROM payment_mst WHERE projectid = ? AND statuscode = 'S'";
        const [result] = await readConn.query(sql, [projectid]);
        return result.length > 0;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.uploadSignature = async (data) => {
    try {
        const sql = "UPDATE mst_entitytype_project_hdr SET signature = ? WHERE id = ? ";
        const [result] = await readConn.query(sql, [data.fileName, data.projectid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getSignature = async (projectid) => {
    try {
        const sql = "SELECT signature FROM mst_entitytype_project_hdr WHERE id = ? AND isdelete=0";
        const [result] = await readConn.query(sql, [projectid]);
        return result.length > 0 ? result[0].signature : '';
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getPaymentAmount = async (projectid) => {
    try {
        const sql = "SELECT amount FROM payment_mst WHERE projectid = ?";
        const [result] = await readConn.query(sql, [projectid]);
        return result.length > 0 ? result[0].amount : 0;
    } catch (e) {
        util.createLog(e);
        return 0;
    }
}

module.exports.getProjectCreatedDate = async (projectid) => {
    try {
        const sql = "SELECT createdat FROM mst_entitytype_project_hdr WHERE id = ?";
        const [result] = await readConn.query(sql, [projectid]);
        return result.length > 0 ? result[0].createdat : null;
    } catch (e) {
        util.createLog(e);
        return null;
    }
}

module.exports.uploadRegistrationCertificate = async (data) => {
    try {
        if (data.startDate) {
            const sql = "UPDATE mst_entitytype_project_hdr SET validatystartdate = ?, validatyenddate = ?, certificate = ? WHERE id = ? ";
            const [result] = await readConn.query(sql, [data.startDate, data.endDate, data.certificate, data.projectid]);
        } else {
            const sql = "UPDATE mst_entitytype_project_hdr SET certificate = ? WHERE id = ? ";
            const [result] = await readConn.query(sql, [data.certificate, data.projectid]);
        }
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}



module.exports.getRegistrationCertificateProjectFields = async (data) => {
    try {
        const sql = "SELECT a.fieldid, a.fromwhich, c.fielddesc, b.projectfieldvalue FROM certificatefields a, mst_entitytype_project_dtl b, mst_fields c WHERE a.reraid = ? AND a.fromwhich=1 AND b.entitytypeprojecthdrid=? AND a.fieldid = b.fieldid AND a.stepid=b.stepid AND a.fieldid = c.fieldid";
        const [result] = await readConn.query(sql, [data.reraid, data.projectid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getRegistrationCertificateProfileFields = async (data) => {
    try {
        const sql = "SELECT a.fieldid, a.fromwhich, c.fielddesc, b.fieldvalue FROM certificatefields a, mst_entity_profile_values_dtl b, mst_entity_profile_fields c WHERE a.reraid = ? AND a.fromwhich=2 AND b.userid=? AND a.fieldid = b.fieldid AND a.stepid=b.stepid AND a.fieldid = c.fieldid GROUP BY c.fielddesc";
        const [result] = await readConn.query(sql, [data.reraid, data.userid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getDetailsForApplRej = async (data) => {
    try {
        const sql = "SELECT a.projectfieldvalue as projectName, a.projectuid, b.username, a.registrationno FROM mst_entitytype_project_hdr a, mst_user b WHERE a.particularprofileid = b.userid AND a.id = ?";
        const [result] = await readConn.query(sql, [data.projectid]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getLatLongByProjectId = async (projectId) => {
    try{
        const sql = "SELECT fieldid, projectfieldvalue  FROM mst_entitytype_project_dtl WHERE stepid = ? AND entitytypeprojecthdrid = ? AND fieldid IN (?) ORDER BY fieldid  ASC";
        const [result] = await readConn.query(sql, [configFieldId.latlong.stepid,projectId, configFieldId.latlong.fieldid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.insertLatLongByProjectId = async (projectId, data) => {
    try{
        const sql = "INSERT INTO mst_project_location (projectid, latitude, longitude) VALUE (?, ?, ?)";
        const [result] = await writeConn.query(sql, [projectId, data[0].projectfieldvalue, data[1].projectfieldvalue]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.insertCertificateContent = async (projectId, userId, fileName, content, validityStartDate, validityEndDate) => {
    try{
        const sql = "INSERT INTO mst_registration_certificate (projectid, userid, certificatefile, certificatecontent, validitystartdate, validityenddate) VALUE (?, ?, ?, ?, ?, ?)";
        const [result] = await writeConn.query(sql, [projectId, userId, fileName, content, validityStartDate, validityEndDate]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.checkCertificateContent = async (projectId) => {
    try{
        const sql = "SELECT certificatefile, certificatecontent FROM mst_registration_certificate WHERE projectid = ?";
        const [result] = await readConn.query(sql, [projectId]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.updateCertificateContent = async (projectId, fileName, content) => {
    try{
        const sql = "UPDATE mst_registration_certificate SET certificatefile = ?, certificatecontent = ? WHERE projectid = ?";
        const [result] = await writeConn.query(sql, [fileName, content, projectId]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getNewLunchedProjects = async (data) => {
    try{
        const sql = "SELECT a.id, a.projectuid, a.projectfieldvalue as projectName, a.submitiontime, b.projectfieldvalue as address" +
            " FROM mst_entitytype_project_hdr a, mst_entitytype_project_dtl b WHERE a.iscomplete = 1 AND a.isdelete = 0" +
            " AND a.id=b.entitytypeprojecthdrid AND b.fieldid=? AND b.stepid=? AND b.groupid IS NULL" +
            " GROUP BY a.id" +
            " ORDER BY a.createdat DESC" +
            " LIMIT ? OFFSET ?";
        const [result] = await readConn.query(sql, [util.configFieldId.projectAddress.fieldid, util.configFieldId.projectAddress.stepid, Number(data.limit), Number(data.offset)]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getProjectsStatusByApplicationNo = async (data) => {
    try{
        const sql = "SELECT iscomplete, isapproved FROM mst_entitytype_project_hdr WHERE projectuid = ? AND isdelete=0";
        const [result] = await readConn.query(sql, [data.applno]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};


