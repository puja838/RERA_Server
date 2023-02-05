const readConn = require('../../dbconnection').readPool;
const writeConn = require('../../dbconnection').writePool;
const common = require('../services/common.service');
const util = require('../../utility/util');
const axios = require("axios");
const config = require('../../config');

module.exports.getRegisteredProjectCount = async () => {
    try {
        const sql = "SELECT count(id) as pcount FROM mst_entitytype_project_hdr WHERE iscomplete=1 AND isapproved IN (3, 4, 5) AND isdelete=0";
        const [result] = await readConn.query(sql);
        return result.length > 0 ? result[0].pcount : 0;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.getWhatsNew = async () => {
    try {
        const sql = "SELECT a.projectfieldvalue as projectName, b.username as promoterName, a.isapproved, a.approvaltime FROM mst_entitytype_project_hdr a, mst_user b WHERE a.particularprofileid=b.userid AND a.iscomplete=1 AND a.isapproved IN (3, 4) AND a.isdelete=0 ORDER BY a.approvaltime DESC LIMIT 20";
        const [result] = await readConn.query(sql);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.getRegisteredProjectCountDistrictwise = async () => {
    try {
        const sql = "SELECT COUNT(entitytypeprojecthdrid) as totalCount, projectfieldvalue FROM mst_entitytype_project_dtl WHERE stepid = ? AND fieldid = ? GROUP BY projectfieldvalue ORDER BY totalCount DESC LIMIT 5";
        const [result] = await readConn.query(sql, [util.configFieldId.projDist.stepid, util.configFieldId.projDist.fieldid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getAllRegisteredProjectCountDistrictwise = async () => {
    try {
        const sql = "SELECT COUNT(entitytypeprojecthdrid) as totalCount, projectfieldvalue FROM mst_entitytype_project_dtl WHERE stepid = ? AND fieldid = ? GROUP BY projectfieldvalue";
        const [result] = await readConn.query(sql, [util.configFieldId.projDist.stepid, util.configFieldId.projDist.fieldid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getProjectLatLong = async () => {
    try {
        const sql = "SELECT loc.projectid, a.projectfieldvalue, loc.latitude, loc.longitude, (SELECT projectfieldvalue FROM mst_entitytype_project_dtl WHERE entitytypeprojecthdrid = loc.projectid AND fieldid = 514 AND stepid = 1) as district" +
            " FROM mst_project_location loc, mst_entitytype_project_hdr a" +
            " WHERE loc.projectid = a.id AND loc.deleted = 0 AND a.isdelete = 0";
        const [result] = await readConn.query(sql);
        return result
    } catch (e) {
        const log = util.createLog(e);
        return [];
    }
};
