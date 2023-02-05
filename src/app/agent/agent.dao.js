const readConn = require('../../dbconnection').readPool;
const writeConn = require('../../dbconnection').writePool;
const util = require('../../utility/util');

module.exports.checkCertificateContent  = async(agentId) => {
    try {
        const sql = "SELECT certificate, crtcontent FROM agent_registration_certificate WHERE userid = ? AND deleted = 0";
        const [result] = await  readConn.query(sql,[agentId]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.getAgentDetails  = async(agentId) => {
    try {
        const sql = "SELECT username, userno FROM mst_user WHERE userid = ?";
        const [result] = await  readConn.query(sql,[agentId]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.getAgentQueryCount  = async(data) => {
    try {
        const sql = "SELECT count(b.id) total FROM trn_workflow_steps_latest_project a,mst_user d, workflow_steps_role_user_query b right join workflow_steps_role_user_query_answer c on b.id=c.workflowstepsroleuserqueryid where a.reraid=? and a.workflowuserid =? and a.agentid =d.userid and a.agentid=b.agentid and b.isvalidquery=1 and d.deleted=0";
        const [result] = await  readConn.query(sql,[data.reraid, data.userid]);
        return result.length > 0 ? result[0].total : null;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.getAgentRenualCount  = async(data) => {
    try {

        const sql = "SELECT count(id) as total  FROM agent_registration_certificate WHERE reraid =? AND userid = ? AND"+
                    " TIMESTAMPDIFF(MONTH, DATE(validityenddate), CURDATE()) <= 3 AND deleted = 0"
        const [result] = await  readConn.query(sql,[data.reraid,data.userid]);
        return result.length > 0 ? result[0].total : null;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.updateRegistrationCertificate  = async(data) => {
    try {
        const sql = "INSERT INTO  agent_registration_certificate (reraid, certificate, crtcontent, validitystartdate, validityenddate, userid) VALUES (?,?,?,?,?,?)";
        const [result, err] = await  writeConn.query(sql,[data.reraid, data.certificate, data.content, data.startDate, data.endDate, data.agentid]);
        return !err;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.updateCertificateContent  = async(agentid, filename, content) => {
    try {
        const sql = "UPDATE agent_registration_certificate SET certificate = ?, crtcontent = ? WHERE userid = ?";
        const [result] = await  writeConn.query(sql,[filename, content, agentid]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getAgentRegDetails  = async(agentId) => {
    try {
        const sql = "SELECT a.username, a.userno, a.isApproved, b.registrationno, b.certificate, b.validitystartdate, b.validityenddate FROM mst_user a LEFT JOIN agent_registration_certificate b ON a.userid = b.userid WHERE a.userid = ?";
        const [result] = await  readConn.query(sql,[agentId]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

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

module.exports.getDashboardAlert  = async(data) => {
    try {
        const sql = "SELECT id,userid,registrationno,certificate,validityenddate  FROM agent_registration_certificate WHERE reraid =? AND userid = ? AND"+
                    " TIMESTAMPDIFF(MONTH, DATE(validityenddate), CURDATE()) <= 3 AND deleted = 0"
        const [result] = await  readConn.query(sql,[data.reraid,data.userid]);
        return result.length > 0 ? result : null;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}