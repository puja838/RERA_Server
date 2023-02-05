const readConn = require('../../dbconnection').readPool;
const writeConn = require('../../dbconnection').writePool;
const util = require('../../utility/util');


module.exports.getProjectListForExtension = async (data) => {
    try {
        const sql = "SELECT a.id, a.projectuid, a.projectfieldvalue as projectName, a.validatyenddate, a.registrationno, a.certificate, b.username as promoterName  FROM mst_entitytype_project_hdr a, mst_user b WHERE a.particularprofileid = ? AND a.particularprofileid = b.userid AND TIMESTAMPDIFF(MONTH, DATE(a.validatyenddate), CURDATE()) <= 3 AND a.isdelete = 0";
        const [result] = await readConn.query(sql, [data.userid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getExtensionList = async (data) => {
    try {
        const sql = "SELECT a.id, a.projectid, a.projectextexsionperiod, a.approvalstatus, a.certificate, a.extensionno, a.createdat, b.projectfieldvalue as projectName, b.registrationno, b.projectuid FROM project_extension_hdr a, mst_entitytype_project_hdr b WHERE a.projectid=b.id AND a.submitted=1 AND a.approvalstatus IN (3, 4) AND a.userid = ?";
        const [result] = await readConn.query(sql, [data.userid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getExistingProjectExtensionId = async (data) => {
    try {
        const sql = "SELECT id, submitted, completiondate, likelycompletiondate, delayreason, isforcemajeure, forcemajeuredesc, forcemajeureimpact, forcemajeureperiod, projectextexsionperiod, signature, ispaymentcomplete FROM project_extension_hdr WHERE projectid = ? AND approvalstatus = 0";
        const [result] = await readConn.query(sql, [data.projectid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getDetailsByExtensionId = async (data) => {
    try {
        const sql = "SELECT id, submitted, completiondate, likelycompletiondate, delayreason, isforcemajeure, forcemajeuredesc, forcemajeureimpact, forcemajeureperiod, projectextexsionperiod, signature, ispaymentcomplete FROM project_extension_hdr WHERE id = ?";
        const [result] = await readConn.query(sql, [data.extensionid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};


module.exports.createProjectExtensionId = async (data) => {
    try {
        const sql = "INSERT INTO project_extension_hdr (projectid, userid, projectstatus) VALUES (?, ?, ?)";
        const [result] = await writeConn.query(sql, [data.projectid, data.userid, data.projectstatus]);
        return result.insertId;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getProjectCompletionDate = async (projectId) => {
    try {
        const sql = "SELECT projectfieldvalue FROM mst_entitytype_project_dtl WHERE entitytypeprojecthdrid = ? AND fieldid = ? AND stepid = 1";
        const [result] = await writeConn.query(sql, [projectId, util.configFieldId.projectCompletionDate]);
        return result.length > 0 ? result[0].projectfieldvalue : '';
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.saveProjectExtensionInfo = async (data) => {
    try {
        const sql = "UPDATE project_extension_hdr SET completiondate = ?, likelycompletiondate = ?, delayreason = ?, isforcemajeure = ?, forcemajeuredesc = ?, forcemajeureimpact = ?, forcemajeureperiod = ?, projectextexsionperiod = ? WHERE id = ?";
        const [result] = await writeConn.query(sql, [data.completiondate, data.likelycompletiondate, data.delayreason, data.isforcemajeure, data.forcemajeuredesc, data.forcemajeureimpact, data.forcemajeureperiod, data.projectextexsionperiod, data.extensionid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getConstructionProgressForExtension = async (data) => {
    try {
        const sql = "SELECT a.id,a.enddate,b.fielddesc,coalesce(c.work_done,'')work_done,coalesce(c.delay_reason,'')delay_reason,coalesce(c.estimate_completion,'')estimate_completion" +
            "  FROM stage_two_fields_dtl a LEFT JOIN construction_progress c ON a.id=c.stagetwofieldsdtlid AND c.extensionid=? AND c.type=?  AND c.recordtype = 'extension'  AND c.deleted=0,stage_two_fields b" +
            " WHERE a.stagetwofieldid=b.id AND a.projectid=? AND a.releatedgroupid=? AND a.relatedfieldid=? AND a.relatedgrouppos=? AND a.deleted=0 AND a.fieldproposedvalue='Yes' AND b.deleted=0";
        const [result] = await readConn.query(sql, [data.extensionid, data.type, data.projectid, data.groupid, data.fieldid, data.groupposition]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getAmenityProgressForExtension = async (data) => {
    try {
        const sql = "SELECT a.id,a.enddate,b.fielddisplaydesc,coalesce(c.work_done,'')work_done,coalesce(c.delay_reason,'')delay_reason,coalesce(c.estimate_completion,'')estimate_completion  " +
            "FROM stage_two_fields_dtl a LEFT JOIN construction_progress c ON a.id=c.stagetwofieldsdtlid AND c.extensionid=? AND c.type=?  AND c.recordtype = 'extension' AND c.deleted=0,mst_fields b WHERE  " +
            "a.projectid=? AND a.stagetwofieldid=? AND a.relationid=? AND a.relatedgrouppos=? AND a.deleted=0 AND a.fieldid=b.fieldid AND b.deleted=0";
        const [result] = await readConn.query(sql, [data.extensionid, data.type, data.projectid, util.configFieldId.COMMUNITY_ID, util.configFieldId.COMMUNITY_GROUPID, data.groupposition]);
        console.log(result);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.insertConstructionProgress = async (data) => {
    try {
        const sql = "INSERT INTO construction_progress (reraid,stagetwofieldsdtlid,projectid,extensionid,work_done,delay_reason,estimate_completion,userid,type, recordtype) values(?,?,?,?,?,?,?,?,?, ?);";
        const [result] = await writeConn.query(sql, [data.reraid, data.id, data.projectid, data.extensionid, data.work_done, data.delay_reason, data.estimate_completion, data.userid, data.type, 'extension']);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.updateConstructionProgress = async (data, id) => {
    try {
        const sql = "UPDATE construction_progress SET work_done=?,delay_reason=?,estimate_completion=?,userid=? where id=?;";
        const [result] = await writeConn.query(sql, [data.work_done, data.delay_reason, data.estimate_completion, data.userid, id]);
        util.createLog(result)
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.duplicateProgress = async (data) => {
    try {
        const sql = "SELECT id from construction_progress where projectid=? and extensionid=? and stagetwofieldsdtlid=? and type=? and recordtype = 'extension'  and deleted=0";
        const [result] = await readConn.query(sql, [data.projectid, data.extensionid, data.id, data.type]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.getExtensionDocumentNames = async () => {
    try {
        const sql = "SELECT documentid, documentname, stepid, issueofficeid, issuedateid, validitydateid, docfileid, sequence FROM mst_extension_document where deleted=0 ORDER BY sequence";
        const [result] = await readConn.query(sql);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.getExtensionDocumentData = async (data) => {
    try {
        const sql = "SELECT a.id, a.documentid, b.documentname, a.issuingoffice, a.issuedate, a.validitydate, a.docfile FROM project_extension_document a, mst_extension_document b WHERE a.extensionid=? AND a.projectid = ? AND a.deleted = 0 AND a.documentid=b.documentid";
        const [result] = await readConn.query(sql, [data.extensionid, data.projectid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.getValueFromProject = async (data) => {
    try {
        const sql = "SELECT projectfieldvalue FROM mst_entitytype_project_dtl where stepid = ? AND fieldid = ? AND entitytypeprojecthdrid = ? AND groupid IS NULL AND deleted=0";
        const [result] = await readConn.query(sql, [data.stepid, data.fieldid, data.projectid]);
        return result.length > 0 ? result[0].projectfieldvalue : '';
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.insertDocData = async (data) => {
    try {
        const sql = "INSERT INTO project_extension_document (extensionid,projectid, userid, documentid, issuingoffice, issuedate, validitydate, docfile) VALUES (?,?,?,?,?,?,?,?)";
        const [result] = await readConn.query(sql, [data.extensionid,data.projectid, data.userid, data.documentid, data.issuingoffice, data.issuedate, data.validitydate, data.docfile]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.updateDocData = async (data) => {
    try {
        const sql = "UPDATE project_extension_document SET issuingoffice = ?, issuedate = ?, validitydate = ?, docfile = ? WHERE id = ?";
        const [result] = await readConn.query(sql, [data.issuingoffice, data.issuedate, data.validitydate, data.docfile, data.id]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.insertOtherDocData = async (data) => {
    try {
        const sql = "INSERT INTO project_extension_other_document (extensionid,projectid, userid, documentname, reason, docfile) VALUES (?,?,?,?,?,?)";
        const [result] = await writeConn.query(sql, [data.extensionid,data.projectid, data.userid, data.documentname, data.reason, data.docfile]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.updateOtherDocData = async (data) => {
    try {
        const sql = "UPDATE project_extension_other_document SET documentname = ?, reason = ?, docfile = ? WHERE documentid = ?";
        const [result] = await writeConn.query(sql, [data.documentname, data.reason, data.docfile, data.documentid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.deleteOtherDocData = async (data) => {
    try {
        const sql = "UPDATE project_extension_other_document SET deleted = 1 WHERE documentid = ?";
        const [result] = await writeConn.query(sql, [data.documentid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getOtherDocData = async (data) => {
    try {
        const sql = "SELECT documentid, documentname, reason, docfile FROM project_extension_other_document WHERE projectid = ? AND extensionid = ? AND deleted = 0";
        const [result] = await writeConn.query(sql, [data.projectid, data.extensionid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.submitForExtension = async (data) => {
    try {
        const sql = "UPDATE project_extension_hdr SET submitted = 1, signature = ?, submitedtime = ? WHERE id = ?";
        const [result] = await writeConn.query(sql, [data.signature, data.time, data.extensionid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.insertIntoChecklist = async (data) => {
    try {
        const sql = "INSERT INTO mst_workflow_steps_role_user_checklist (reraid, checklistname, projectfieldid, userid, tabid, tabgroupid, fromwhich, sequence, scrutinytype) VALUES (?,?,?,?,?,?,?,?,?)";
        const [result] = await writeConn.query(sql, [1, 'Extension Period', data.extensionid, data.userid, 1, 12, 1, 0, 2]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getEntityTypeByUserId = async (userId) => {
    try {
        const sql = "SELECT a.entitytypeid FROM mst_user a WHERE a.userid = ?";
        const [result] = await readConn.query(sql, [userId]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        const log = util.createLog(e);
        return false;
    }
};

module.exports.getCompanyDetails = async (userId, stepId, fieldIds) => {
    try {
        const sql = "SELECT a.fieldid, a.fieldvalue FROM mst_entity_profile_values_dtl a" +
            " WHERE a.fieldid IN (" + fieldIds + ") AND a.userid=? AND a.stepid=? AND" +
            " a.groupid IS NULL AND a.deleted=0";
        const [result] = await readConn.query(sql, [userId, stepId]);
        return result
    } catch (e) {
        const log = util.createLog(e);
        return [];
    }
};

module.exports.getRegistrationNumber = async (projectid) => {
    try {
        const sql = "SELECT registrationno FROM mst_entitytype_project_hdr WHERE id = ? AND isdelete=0";
        const [result] = await readConn.query(sql, [projectid]);
        return result.length > 0 ? result[0].registrationno : null;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getExtensionDtlById = async (extensionid) => {
    try {
        const sql = "SELECT projectextexsionperiod FROM project_extension_hdr WHERE id = ?";
        const [result] = await readConn.query(sql, [extensionid]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.checkCertificateContent = async (extensionid) => {
    try {
        const sql = "SELECT certificate, crtcontent FROM project_extension_hdr WHERE id = ?";
        const [result] = await readConn.query(sql, [extensionid]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.updateExtensionCertificate = async (data) => {
    try {
        const sql = "UPDATE project_extension_hdr SET certificate = ?, crtcontent = ? WHERE id = ?";
        const [result] = await readConn.query(sql, [data.certificate, data.content, data.extensionid]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.updateProjectValidityEndDate = async (data) => {
    try {
        const sql = "UPDATE mst_entitytype_project_hdr SET validatyenddate = ? WHERE id = ? ";
        const [result] = await readConn.query(sql, [data.endDate, data.projectid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}



