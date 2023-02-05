const readConn = require('../../dbconnection').readPool;
const writeConn = require('../../dbconnection').writePool;
const common = require('../services/common.service');
const util = require('../../utility/util');
const config = require('../../config');


module.exports.getProjectValueList = async (data) => {
    try {
        const sql = "SELECT a.fieldid, f.fielddesc, pd.projectfieldvalue" +
            " FROM project_list_fields a, mst_fields f, mst_entitytype_project_dtl pd" +
            " WHERE a.deleted = 0 AND a.fieldfor = ? AND a.fieldid = f.fieldid AND a.fieldid=pd.fieldid AND a.stepid = pd.stepid AND pd.entitytypeprojecthdrid=?";
        const [result] = await readConn.query(sql, [data.fieldFor, data.projectid]);
        return result
    } catch (e) {
        const log = util.createLog(e);
        return [];
    }
};
module.exports.getFirstPendingQuoter = async (data) => {
    try {
        const sql = "SELECT a.id, qm.name as quoterName, a.quoterstartdate, a.quoterenddate, a.issubmited" +
            " FROM project_execution_hdr a, quater_mst qm" +
            " WHERE a.projectid = ? AND a.userid = ? AND a.quoterid = qm.id AND a.issubmited = 0" +
            " AND DATE(a.quoterstartdate) <= DATE(CURRENT_DATE()) ORDER BY a.id ASC LIMIT 1";
        const [result] = await readConn.query(sql, [data.projectid, data.userid]);
        console.log(result)
        return result
    } catch (e) {
        const log = util.createLog(e);
        return [];
    }
};


module.exports.getProjectDetailsLatLong = async (data) => {
    try {
        const sql = "SELECT loc.projectid, a.projectfieldvalue, loc.latitude, loc.longitude, SQRT(" +
            "POW(69.1 * (loc.latitude - ?), 2) +" +
            "POW(69.1 * (? - loc.longitude) * COS(loc.latitude / 57.3), 2)) AS distance" +
            " FROM mst_entitytype_project_hdr a, mst_project_location loc" +
            " WHERE a.id = loc.projectid AND loc.deleted = 0" +
            " HAVING distance < 10 ORDER BY distance";
        const [result] = await readConn.query(sql, [data.latitude, data.longitude]);
        return result
    } catch (e) {
        const log = util.createLog(e);
        return [];
    }
};

module.exports.getCompanyDetails = async (userId, stepId, fieldIds) => {
    try {
        const sql = "SELECT a.fieldid, b.fielddisplaydesc, a.fieldvalue FROM mst_entity_profile_values_dtl a, mst_entity_profile_fields b" +
            " WHERE a.fieldid=b.fieldid AND a.fieldid IN (" + fieldIds + ") AND a.userid=? AND a.stepid=? AND" +
            " a.groupid IS NULL AND a.deleted=0";
        const [result] = await readConn.query(sql, [userId, stepId]);
        return result
    } catch (e) {
        const log = util.createLog(e);
        return [];
    }
};

module.exports.getProfileDetails = async (userId) => {
    try {
        const sql = "SELECT a.userno,a.username,a.useremail,a.usermobile,a.entitytypeid, b.entitytypedesc FROM mst_user a, mst_entity_type b WHERE a.userid = ? AND a.entitytypeid=b.entitytypeid";
        const [result] = await readConn.query(sql, [userId]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        const log = util.createLog(e);
        return false;
    }
};

module.exports.getSiteLocationImg = async (projectId) => {
    try {
        const sql = "SELECT id, projectfieldvalue, groupposition FROM mst_entitytype_project_dtl WHERE entitytypeprojecthdrid = ? AND fieldid = ? AND  groupid = ? AND deleted = 0";
        const [result] = await readConn.query(sql, [projectId, util.configFieldId.siteLocationImg.fieldid, util.configFieldId.siteLocationImg.groupid]);
        return result;
    } catch (e) {
        const log = util.createLog(e);
        return false;
    }
};

module.exports.insertSiteLocationImg = async (obj) => {
    try {
        const sql = "INSERT INTO mst_entitytype_project_dtl" +
            " (projectfieldvalue, userid, reraid, entityid, entitytypeid, stepid, entitytypeprojecthdrid, fieldid, groupid, groupposition)" +
            " VALUES (?,?,?,?,?,?,?,?,?,?)";
        const [result] = await writeConn.query(sql, [obj.fileName, obj.userid, obj.reraid, obj.entityid, obj.entitytypeid, util.configFieldId.siteLocationImg.stepid, obj.projectid, util.configFieldId.siteLocationImg.fieldid, util.configFieldId.siteLocationImg.groupid, obj.groupposition]);
        return result.insertId;
    } catch (e) {
        const log = util.createLog(e);
        return false;
    }
};

module.exports.deleteSiteLocationImg = async (obj) => {
    try {
        const sql = "UPDATE mst_entitytype_project_dtl SET deleted = 1 WHERE id = ?";
        const [result] = await writeConn.query(sql, [obj.id]);
        return true;
    } catch (e) {
        const log = util.createLog(e);
        return false;
    }
};