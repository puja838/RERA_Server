const readConn = require('../../dbconnection').readPool;
const writeConn = require('../../dbconnection').writePool;
const util = require('../../utility/util');

module.exports.getPastProjectList = async(data) => {
    try {
        const sql = "SELECT * FROM mst_entitytype_project_hdr where reraid=? and particularprofileid=? and isdelete='0' and iscomplete=1 and isapproved=3 and id != ? " +
        " and submitiontime >= now() - interval '5' year";
        const [result] = await  readConn.query(sql,[data.reraid, data.userid, data.projectid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};


module.exports.getPastProjectOutsideCaseDtl = async(data) => {
    try {
        const sql = "SELECT a.fieldid, a.projectfieldvalue as fieldvalue, b.fielddesc, a.groufieldpposition" +
            " FROM mst_entitytype_project_dtl a, mst_fields b" +
            " WHERE a.entitytypeprojecthdrid=? AND a.groupid = 21 AND a.fieldgroupid = 18 AND a.stepid=13 AND a.fieldid = b.fieldid ORDER BY a.groufieldpposition asc";
        const [result] = await  readConn.query(sql,[data.projectid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
