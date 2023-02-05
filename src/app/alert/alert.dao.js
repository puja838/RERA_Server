const readConn = require('../../dbconnection').readPool
const writeConn = require('../../dbconnection').writePool
const util = require('../../utility/util');

module.exports.getProjectListForExtension  = async(data) => {
    try {
        const sql = "SELECT a.id, a.projectuid, a.projectfieldvalue as projectName, a.validatyenddate, a.registrationno, a.certificate" +
            "  FROM mst_entitytype_project_hdr" +
            " a WHERE a.particularprofileid = ? AND TIMESTAMPDIFF(MONTH, DATE(a.validatyenddate), CURDATE()) <= 3 AND a.isdelete = 0";
        const [result] = await readConn.query(sql,[data.userid]);
        return result
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.getProjectListForUpdateDetails  = async(data) => {
    try {
        const sql = "SELECT a.id, a.projectuid, a.iscomplete, a.entityid, a.entitytypeid, a.submitiontime, a.registrationno, a.projectfieldvalue as projectName " +
            " FROM mst_entitytype_project_hdr a" +
            " WHERE a.isdelete = 0 AND a.reraid = ? AND a.particularprofileid = ? AND a.isapproved = 3 AND a.afterapprovestatus = 0";
        const [result] = await readConn.query(sql,[data.reraid, data.userid]);
        return result
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.getProjectCountForExtension  = async(data) => {
    try {
        const sql = "SELECT COUNT(a.id) as totalCount" +
            "  FROM mst_entitytype_project_hdr" +
            " a WHERE a.particularprofileid = ? AND TIMESTAMPDIFF(MONTH, DATE(a.validatyenddate), CURDATE()) <= 3 AND a.isdelete = 0";
        const [result] = await readConn.query(sql,[data.userid]);
        return result.length > 0 ? result[0].totalCount : 0;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.getProjectCountForUpdateDetails  = async(data) => {
    try {
        const sql = "SELECT COUNT(a.id) as totalCount " +
            " FROM mst_entitytype_project_hdr a" +
            " WHERE a.isdelete = 0 AND a.reraid = ? AND a.particularprofileid = ? AND a.isapproved = 3 AND a.afterapprovestatus = 0";
        const [result] = await readConn.query(sql,[data.reraid, data.userid]);
        return result.length > 0 ? result[0].totalCount : 0;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
