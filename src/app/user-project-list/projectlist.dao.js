const readConn = require('../../dbconnection').readPool;
const writeConn = require('../../dbconnection').writePool;
const util = require('../../utility/util');
const config = require('../../config');
var AGENT_ROLE_SEQ = 6;
var PROMOTER_ROLE_SEQ = 1;

module.exports.getworkflowstepbyrole = async (data) => {
    try {
        let sql = '';
        if (Number(data.type) == config.REGISTRATION_TYPE) {
            sql = "SELECT c.username,b.projectfieldvalue,a.uniqueprojectid,a.extensionid, b.isapproved,b.particularprofileid,b.approvalcomment,b.submitiontime,b.projectuid,d.roledesc FROM trn_workflow_steps_latest_project a,mst_entitytype_project_hdr b ,mst_user c, mst_role d where a.reraid=? and a.extensionid is null and a.roleid =? and (a.workflowuserid is null || a.workflowuserid =0 || a.workflowuserid ='' )  and a.uniqueprojectid =b.id and  b.particularprofileid=c.userid and a.roleid = d.roleid and  b.isdelete=0 and c.deleted=0 order by b.submitiontime asc;";
        } else if (Number(data.type) == config.EXTENSION_TYPE) {
            sql = "SELECT c.username,b.projectfieldvalue,a.uniqueprojectid,a.extensionid,e.approvalstatus,b.particularprofileid,b.approvalcomment,e.submitedtime submitiontime,b.projectuid,d.roledesc FROM trn_workflow_steps_latest_project a,mst_entitytype_project_hdr b ,mst_user c, mst_role d,project_extension_hdr e where a.reraid=? and a.extensionid is not null and a.roleid =? and (a.workflowuserid is null || a.workflowuserid =0 || a.workflowuserid ='' )  and a.uniqueprojectid =b.id AND a.extensionid=e.id and  b.particularprofileid=c.userid and a.roleid = d.roleid and  b.isdelete=0 and c.deleted=0 order by e.submitedtime asc;";
        } else {
            sql = "SELECT c.username,a.agentid,c.userno,d.roledesc,c.submission_time submitiontime,c.isApproved isapproved FROM trn_workflow_steps_latest_project a,mst_user c, mst_role d where a.reraid=?  and a.roleid =? and (a.workflowuserid is null || a.workflowuserid =0 || a.workflowuserid ='' )  and a.agentid =c.userid and a.roleid = d.roleid and c.deleted=0 order by c.submission_time asc;";
        }
        const [result] = await readConn.query(sql, [data.reraid, data.roleid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.fetchProjectRegisterCount = async (data) => {
    try {
        let sql = '';
        let today = new Date()

        let day = Number(today.getDate()) < 10 ? "0" + String(today.getDate()) : String(today.getDate());
        let month = Number(today.getMonth() + 1) < 10 ? "0" + String(today.getMonth() + 1) : String(today.getMonth() + 1);
        var newDate = today.getFullYear() + '-' + month + '-' + day + ' 23:59:59'

        let smonth
        let emonth
        if (month >= 1 && month <= 3) {
            smonth = '01'
        } else if (month >= 4 && month <= 6) {
            smonth = '04'
        } else if (month >= 7 && month <= 9) {
            smonth = '07'
        } else if (month >= 10 && month <= 12) {
            smonth = '10'
        }
        var startDate = today.getFullYear() + '-' + smonth + '-' + '01' + ' 00:00:00'
        var endDate = today.getFullYear() + '-' + month + '-' + day + ' 23:59:59'
        
        if (Number(data.type) == config.Register_Project) {
            sql = "SELECT count(id) as total FROM mst_entitytype_project_hdr WHERE  isapproved = 3 AND reraid = ?;";
        } else if (Number(data.type) == config.Register_Agent) {
            sql = "SELECT count(a.userid) as total FROM mst_role_user a,mst_user b WHERE a.reraid = ? AND a.roleid =12 AND b.userid=a.userid AND b.isApproved = 3;";
        } else if (Number(data.type) == config.Pending_QPRS) {
            sql = "SELECT count(id) as total FROM project_execution_hdr WHERE quoterenddate <= '" + newDate + "' and issubmited = 0";
        } else if (Number(data.type) == config.Register_Project_Quater) {
            sql = "SELECT count(id) as total FROM mst_entitytype_project_hdr WHERE  isapproved = 3 AND reraid = ? AND" +
                " approvaltime BETWEEN ? AND ?";
        } else if (Number(data.type) == config.Register_Agent_Quater) {
            sql = "SELECT count(a.userid) as total FROM mst_role_user a,mst_user b WHERE a.reraid = ? AND a.roleid =12 AND b.userid=a.userid AND" +
                " b.isApproved = 3 AND b.approvaltime BETWEEN ? AND  ?;";
        }

        const [result] = await readConn.query(sql, [data.reraid, data.roleid,startDate,endDate,]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.fetchProjectRegisterDetails = async (data) => {
    try {
        let sql = '';
        let today = new Date()

        let day = Number(today.getDate()) < 10 ? "0" + String(today.getDate()) : String(today.getDate());
        let month = Number(today.getMonth() + 1) < 10 ? "0" + String(today.getMonth() + 1) : String(today.getMonth() + 1);
        var newDate = today.getFullYear() + '-' + month + '-' + day + ' 23:59:59'


       
        if (Number(data.type) == config.Register_Project) {
            sql = "SELECT projectfieldvalue,registrationno,certificate,approvaltime FROM mst_entitytype_project_hdr WHERE  isapproved = 3 AND reraid = ?;";
        } else if (Number(data.type) == config.Register_Agent) {
            sql = "SELECT b.username,c.registrationno,c.certificate,b.approvaltime FROM mst_role_user a,mst_user b,agent_registration_certificate c"+
                  " WHERE a.reraid = ? AND a.roleid =12 AND b.userid=a.userid AND b.isApproved = 3 AND c.userid = a.userid;";
        } else if (Number(data.type) == config.Pending_QPRS) {
            sql = "SELECT a.id,a.projectid,a.quoterid,b.projectfieldvalue,b.registrationno,c.name FROM project_execution_hdr a,mst_entitytype_project_hdr b,"+
                  "quater_mst c WHERE a.quoterenddate <= '" + newDate + "' and a.issubmited = 0 AND b.reraid = ? AND b.id = a.projectid AND c.id = a.quoterid order by a.id desc";
        } 

        const [result] = await readConn.query(sql, [data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.fetchRevenue = async (data) => {
    try {
        let sql = '';
        let today = new Date()

        let day = Number(today.getDate()) < 10 ? "0" + String(today.getDate()) : String(today.getDate());
        let month = Number(today.getMonth() + 1) < 10 ? "0" + String(today.getMonth() + 1) : String(today.getMonth() + 1);
        let smonth
        let emonth
        if (month >= 1 && month <= 3) {
            smonth = '01'
        } else if (month >= 4 && month <= 6) {
            smonth = '04'
        } else if (month >= 7 && month <= 9) {
            smonth = '07'
        } else if (month >= 10 && month <= 12) {
            smonth = '10'
        }
        var startDate = today.getFullYear() + '-' + smonth + '-' + '01' + ' 00:00:00'
        var endDate = today.getFullYear() + '-' + month + '-' + day + ' 23:59:59'
        console.log("startDate", startDate, "endDate", endDate)

        if (Number(data.type) === config.Revenue_Total) {
            sql = "SELECT amount FROM payment_mst WHERE statuscode = 'S'";
        } else if (Number(data.type) == config.Revenue_Total_Quaret) {
            sql = "SELECT amount FROM payment_mst WHERE statuscode = 'S' AND createdat BETWEEN ? AND ?";
        }
        const [result] = await readConn.query(sql, [startDate, endDate]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getworkflowstepbyuser = async (data) => {
    try {
        let sql = '';
        if (Number(data.type) == config.REGISTRATION_TYPE) {
            sql = "SELECT c.username,b.projectfieldvalue,a.uniqueprojectid,a.extensionid,b.isapproved,b.particularprofileid,b.approvalcomment,b.submitiontime,b.projectuid,d.roledesc, e.username as workflowusername FROM trn_workflow_steps_latest_project a,mst_entitytype_project_hdr b ,mst_user c,mst_role d,mst_user e where a.reraid=? and a.extensionid is null and a.roleid =? and a.workflowuserid=?  and a.uniqueprojectid =b.id  and b.particularprofileid=c.userid and a.roleid = d.roleid and a.workflowuserid = e.userid  and b.isdelete=0 and c.deleted=0 and e.deleted=0 order by b.submitiontime asc;";
        } else if (Number(data.type) == config.EXTENSION_TYPE) {
            sql = "SELECT c.username,b.projectfieldvalue,a.uniqueprojectid,a.extensionid,f.approvalstatus,b.particularprofileid,b.approvalcomment,f.submitedtime submitiontime,b.projectuid,d.roledesc, e.username as workflowusername FROM trn_workflow_steps_latest_project a,mst_entitytype_project_hdr b ,mst_user c,mst_role d,mst_user e,project_extension_hdr f where a.reraid=? and a.extensionid is not null and a.roleid =? and a.workflowuserid=?  and a.uniqueprojectid =b.id AND a.extensionid=f.id  and b.particularprofileid=c.userid and a.roleid = d.roleid and a.workflowuserid = e.userid  and b.isdelete=0 and c.deleted=0 and e.deleted=0 order by f.submitedtime asc;";
        } else {
            sql = "SELECT c.username,a.agentid,c.userno,d.roledesc,c.submission_time submitiontime,c.isApproved isapproved, e.username as workflowusername FROM trn_workflow_steps_latest_project a,mst_user c, mst_role d,mst_user e where a.reraid=?  and a.roleid =? and  a.workflowuserid = ?  and a.agentid =c.userid and a.roleid = d.roleid and a.workflowuserid = e.userid and c.deleted=0 and e.deleted=0 order by c.submission_time asc;";
        }
        const [result] = await readConn.query(sql, [data.reraid, data.roleid, data.userid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getworkflowstepbyisapproverole = async (data) => {
    try {
        const sql = "SELECT c.username,b.projectfieldvalue,a.uniqueprojectid,b.isapproved,b.particularprofileid,b.approvalcomment,b.submitiontime,b.projectuid,d.roledesc FROM trn_workflow_steps_latest_project a,mst_entitytype_project_hdr b ,mst_user c,mst_role d where a.reraid=? and b.isapproved = ? and a.uniqueprojectid =b.id and a.roleid = d.roleid  and b.particularprofileid=c.userid and b.isdelete=0 and c.deleted=0 order by submitiontime ASC;";
        const [result] = await readConn.query(sql, [data.reraid, data.isapproved]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.getworkflowstepbyisapprove = async (data) => {
    try {
        let sql = '';
        if (Number(data.type) == config.REGISTRATION_TYPE) {
            sql = "SELECT c.username,b.projectfieldvalue,a.uniqueprojectid,a.extensionid,b.isapproved,b.particularprofileid,b.approvalcomment,b.submitiontime,b.projectuid,d.roledesc, e.username as workflowusername FROM trn_workflow_steps_latest_project a left join mst_user e on a.workflowuserid = e.userid ,mst_entitytype_project_hdr b ,mst_user c,mst_role d where b.reraid=? and a.extensionid is null and b.isapproved = ?  and a.uniqueprojectid =b.id  and b.particularprofileid=c.userid and a.roleid = d.roleid and  b.isdelete=0 and c.deleted=0 order by b.submitiontime ASC;";
        } else if (Number(data.type) == config.EXTENSION_TYPE) {
            sql = "SELECT c.username,b.projectfieldvalue,a.uniqueprojectid,a.extensionid,f.approvalstatus,b.particularprofileid,b.approvalcomment,b.submitiontime,b.projectuid,d.roledesc, e.username as workflowusername FROM trn_workflow_steps_latest_project a left join mst_user e on a.workflowuserid = e.userid ,mst_entitytype_project_hdr b ,mst_user c,mst_role d,project_extension_hdr f where b.reraid=? and a.extensionid is not null   and a.uniqueprojectid =b.id AND a.extensionid=f.id and f.approvalstatus = ? and b.particularprofileid=c.userid and a.roleid = d.roleid and  b.isdelete=0 and c.deleted=0 order by f.submitedtime ASC;";
        } else {
            sql = "SELECT c.username,a.agentid,c.userno,c.submission_time submitiontime,d.roledesc, e.username as workflowusername,c.isApproved isapproved FROM trn_workflow_steps_latest_project a left join mst_user e on a.workflowuserid = e.userid ,mst_user c,mst_role d where c.reraid=? and c.isApproved = ?    and a.agentid=c.userid and a.roleid = d.roleid and c.deleted=0 order by c.submission_time ASC;";
        }
        const [result] = await readConn.query(sql, [data.reraid, data.isapproved]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.fetchProjectDetailsById = async (data) => {
    try {
        let sql = '';
        if (data.extensionid) {
            sql = "SELECT c.username,b.projectfieldvalue,e.stepworkid,b.entitytypeid,b.particularprofileid,b.submitiontime,b.projectuid,e.id,f.seqno stepseqno,b.certificate,g.workflowtype,b.registrationno FROM mst_entitytype_project_hdr b ,mst_user c,trn_workflow_steps_latest_project a,mst_workflow_steps_works e,mst_workflow_steps f,mst_workflow g where b.id=?  and b.particularprofileid=c.userid and b.id =a.uniqueprojectid and a.workflowstepsworksid=e.id and a.workflowid=g.id and a.extensionid =? and e.tostepid=f.id and b.isdelete=0 and c.deleted=0 and e.deleted=0 and f.deleted=0 and g.deleted=0;";
        } else {
            sql = "SELECT c.username,b.projectfieldvalue,e.stepworkid,b.entitytypeid,b.particularprofileid,b.submitiontime,b.projectuid,e.id,f.seqno stepseqno,b.certificate,g.workflowtype,b.registrationno FROM mst_entitytype_project_hdr b ,mst_user c,trn_workflow_steps_latest_project a,mst_workflow_steps_works e,mst_workflow_steps f,mst_workflow g where b.id=?  and b.particularprofileid=c.userid and b.id =a.uniqueprojectid and a.workflowstepsworksid=e.id and a.workflowid=g.id and a.extensionid is null and e.tostepid=f.id and b.isdelete=0 and c.deleted=0 and e.deleted=0 and f.deleted=0 and g.deleted=0;";
        }
        let params = [data.projectid];
        if (data.extensionid) {
            params.push(data.extensionid)
        }
        const [result] = await readConn.query(sql, params);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchAgentDetailsById = async (data) => {
    try {
        const sql = "SELECT c.username,b.username agentname,e.stepworkid,b.entitytypeid,b.submission_time submitiontime,b.userno,e.id,f.seqno stepseqno,g.workflowtype FROM mst_user b ,mst_user c,trn_workflow_steps_latest_project a,mst_workflow_steps_works e,mst_workflow_steps f,mst_workflow g where b.userid=?   and b.userid =a.agentid and a.workflowstepsworksid=e.id and a.workflowid=g.id and e.tostepid=f.id and b.deleted=0 and c.deleted=0 and e.deleted=0 and f.deleted=0 and g.deleted=0;";
        let params = [data.agentid];
        const [result] = await readConn.query(sql, params);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchWorkflowHistoryId = async (data) => {
    try {
        let sql = '';
        if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
            sql = "SELECT a.id,a.tostepid,a.workflowid,b.submitedtime,b.certificate FROM trn_workflow_steps_role_user_project a,project_extension_hdr b where a.uniqueprojectid=? and a.extensionid =? and a.extensionid=b.id order by a.id desc limit 1;";
        } else if (Number(data.workflowtype) === config.REGISTRATION_TYPE) {
            sql = "SELECT id,tostepid,workflowid FROM trn_workflow_steps_role_user_project where uniqueprojectid=? and extensionid is null order by id desc limit 1;";
        } else {
            sql = "SELECT id,tostepid,workflowid FROM trn_workflow_steps_role_user_project where agentid=? order by id desc limit 1;";
        }
        let params = [];
        if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
            params = [data.projectid, data.extensionid];
        } else if (Number(data.workflowtype) === config.REGISTRATION_TYPE) {
            params = [data.projectid];
        } else {
            params = [data.agentid];
        }
        const [result] = await readConn.query(sql, params);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchTabbyEntityType = async (data) => {
    try {
        const sql = "SELECT b.id,b.tabname from mst_checklist_tab_map a,mst_checklist_tab_master b where a.reraid=? and a.entitytypeid=? and a.tabid=b.id and a.deleted=0 ;";
        const [result] = await readConn.query(sql, [data.reraid, data.entitytypeid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchDocumentTabGroupByTab = async (data) => {
    try {
        const sql = "select distinct b.id entitytypedtlid,b.docfile projectfieldvalue,a.checklistname,c.groupname,a.id,b.issystemverified,c.isgrouping from mst_workflow_steps_role_user_checklist a LEFT JOIN project_extension_document b on a.projectfieldid=b.documentid AND b.extensionid=?,mst_checklist_group c where a.reraid=? and a.tabid=? and  a.scrutinytype=? and  a.tabgroupid=c.id  and a.deleted=0 and b.deleted=0 and c.deleted=0 ";
        const [result] = await readConn.query(sql, [data.extensionid, data.reraid, data.tabid, data.workflowtype]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchApplicationTabGroupByTab = async (data) => {
    try {
        const sql = "select distinct b.id entitytypedtlid,b.projectextexsionperiod projectfieldvalue,a.checklistname,c.groupname,a.id,0 as issystemverified,c.isgrouping from mst_workflow_steps_role_user_checklist a ,project_extension_hdr b ,mst_checklist_group c where a.reraid=? and a.tabid=? and  a.scrutinytype=? and  a.projectfieldid=b.id AND b.id=? and  a.tabgroupid=c.id  and a.deleted=0  and c.deleted=0 ";
        const [result] = await readConn.query(sql, [data.reraid, data.tabid, data.workflowtype, data.extensionid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchTabGroupByTab = async (data) => {
    try {
        const sql = "select distinct b.id entitytypedtlid,b.projectfieldvalue,a.checklistname,c.groupname,a.id,b.issystemverified,b.groupid,b.groupposition,c.isgrouping from mst_workflow_steps_role_user_checklist a LEFT JOIN mst_entitytype_project_dtl b on a.projectfieldid=b.fieldid and a.stepid=b.stepid AND b.entitytypeprojecthdrid=?,mst_checklist_group c where a.reraid=? and a.tabid=? and a.fromwhich=1 and a.scrutinytype=? and  a.tabgroupid=c.id  and a.deleted=0 and b.deleted=0 and c.deleted=0 ";
        const [result] = await readConn.query(sql, [data.projectid, data.reraid, data.tabid, data.workflowtype]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchTabGroupByTab2 = async (data) => {
    try {
        const sql = "select distinct b.id entitytypedtlid,b.fieldvalue projectfieldvalue,a.checklistname,c.groupname,a.id,b.issystemverified,b.groupid,b.groupposition,c.isgrouping from mst_workflow_steps_role_user_checklist a left join mst_entity_profile_values_dtl b on a.projectfieldid=b.fieldid and a.stepid=b.stepid   ,mst_checklist_group c where a.reraid=? and a.tabid=? and a.fromwhich=2 and a.scrutinytype=? and  a.tabgroupid=c.id AND b.userid=? and a.deleted=0 and b.deleted=0 and c.deleted=0";
        const [result] = await readConn.query(sql, [data.reraid, data.tabid, data.workflowtype, data.promoterid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchChecklistValueNotCurrent = async (data) => {

    try {
        let sql = '';
        if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
            sql = "select  a.comment,a.checklistcommentchecked,c.roledesc from workflow_steps_role_user_checklist_conversation a ,mst_role_user b,mst_role c  where a.reraid=? and a.uniqueprojectid=? and a.mstworkflowstepsroleuserchecklistid=? and a.entitytypedtlid=? and a.workflowstepsroleuserprojectid !=? and a.extensionid=? and a.userid=b.userid  and b.roleid=c.roleid and b.deleted=0 and c.deleted=0;";
        } else if (Number(data.workflowtype) === config.REGISTRATION_TYPE) {
            sql = "select  a.comment,a.checklistcommentchecked,c.roledesc from workflow_steps_role_user_checklist_conversation a ,mst_role_user b,mst_role c  where a.reraid=? and a.uniqueprojectid=? and a.mstworkflowstepsroleuserchecklistid=? and a.entitytypedtlid =? and a.workflowstepsroleuserprojectid !=? and a.extensionid is  null and a.userid=b.userid  and b.roleid=c.roleid and b.deleted=0 and c.deleted=0;";

        } else {
            sql = "select  a.comment,a.checklistcommentchecked,c.roledesc from workflow_steps_role_user_checklist_conversation a ,mst_role_user b,mst_role c  where a.reraid=? and a.agentid=? and a.mstworkflowstepsroleuserchecklistid=? and a.entitytypedtlid =? and a.workflowstepsroleuserprojectid !=?  and a.userid=b.userid  and b.roleid=c.roleid and b.deleted=0 and c.deleted=0;";
        }
        let params = [];
        if (Number(data.workflowtype) === config.AGENT_TYPE) {
            params = [data.reraid, data.promoterid, data.id, data.entitytypedtlid, data.workflowstepsroleuserprojectid];
        } else {
            params = [data.reraid, data.projectid, data.id, data.entitytypedtlid, data.workflowstepsroleuserprojectid];
            if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
                params.push(data.extensionid)
            }
        }
        const [result] = await readConn.query(sql, params);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchChecklistValueCurrent = async (data) => {
    // console.log(data)
    try {
        let sql = '';
        if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
            sql = "select a.id,a.comment,a.checklistcommentchecked,c.roledesc from workflow_steps_role_user_checklist_conversation a ,mst_role_user b,mst_role c where a.reraid=? and a.uniqueprojectid=? and a.mstworkflowstepsroleuserchecklistid=? and a.entitytypedtlid=? and a.workflowstepsroleuserprojectid =? and a.extensionid=? and a.userid=b.userid   and b.roleid=c.roleid and b.deleted=0 and c.deleted=0;";
        } else if (Number(data.workflowtype) === config.REGISTRATION_TYPE) {
            sql = "select a.id,a.comment,a.checklistcommentchecked,c.roledesc from workflow_steps_role_user_checklist_conversation a ,mst_role_user b,mst_role c where a.reraid=? and a.uniqueprojectid=? and a.mstworkflowstepsroleuserchecklistid=? and a.entitytypedtlid =? and a.workflowstepsroleuserprojectid =? and a.extensionid is  null and a.userid=b.userid   and b.roleid=c.roleid and b.deleted=0 and c.deleted=0;";
        } else {
            sql = "select a.id,a.comment,a.checklistcommentchecked,c.roledesc from workflow_steps_role_user_checklist_conversation a ,mst_role_user b,mst_role c where a.reraid=? and a.agentid=? and a.mstworkflowstepsroleuserchecklistid=? and a.entitytypedtlid =? and a.workflowstepsroleuserprojectid =? and a.userid=b.userid   and b.roleid=c.roleid and b.deleted=0 and c.deleted=0;";
        }
        let params = [];
        if (Number(data.workflowtype) === config.AGENT_TYPE) {
            params = [data.reraid, data.promoterid, data.id, data.entitytypedtlid, data.workflowstepsroleuserprojectid]
        } else {
            params = [data.reraid, data.projectid, data.id, data.entitytypedtlid, data.workflowstepsroleuserprojectid];
            if (data.extensionid) {
                params.push(data.extensionid)
            }
        }
        const [result] = await readConn.query(sql, params);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.getNextStepDetails = async (data) => {
    try {
        const sql = "select b.id,b.stepname,b.seqno from mst_workflow_steps_works a,mst_workflow_steps b where a.reraid=? and a.workflowid=? and a.fromstepid=? and a.tostepid=b.id and a.deleted=0 and b.deleted=0";
        const [result] = await readConn.query(sql, [data.reraid, data.workflowid, data.fromstepid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.getQueryByProject = async (data) => {
    // console.log(data)
    try {
        const sql = "SELECT a.dateofquery,a.id,a.isvalidquery,a.queryresolved,IF(a.docrequired =1,'Yes','No') docrequired,a.query,a.comments,c.roledesc,a.permissibletime,e.username  FROM workflow_steps_role_user_query a,trn_workflow_steps_role_user_project b,mst_role c, mst_user e where a.reraid=? and a.uniqueprojectid=? and a.isvalidquery in (?) and a.workflowstepsroleuserprojectid=b.id and e.userid = a.userid and b.roleid=c.roleid and c.deleted=0;";
        const [result] = await readConn.query(sql, [data.reraid, data.projectid, data.type]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.getCommentsByQuery = async (data) => {
    try {
        const sql = "SELECT a.dateofanswer,a.answer,b.filedesc,b.filepath,d.roledesc,d.type,e.username FROM workflow_steps_role_user_query_answer a , workflow_steps_role_user_query_answer_attachment b,mst_role_user c ,mst_role d, mst_user e where a.reraid=? and a.workflowstepsroleuserqueryid =? and a.id=b.workflowstepsroleuserqueryanswerid and a.userid=c.userid and e.userid = a.userid  and c.roleid=d.roleid and c.deleted=0 and d.deleted=0;";
        const [result] = await readConn.query(sql, [data.reraid, data.id]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.getStepidBytype = async (data) => {
    try {
        const sql = "SELECT distinct b.stepid FROM mst_role a,mst_workflow_steps_role b where a.reraid=? and a.type=? and a.roleid=b.roleid and a.deleted=0 and b.deleted=0;";
        const [result] = await readConn.query(sql, [data.reraid, data.type]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.getOfficerQuestion = async (data) => {
    try {
        const sql = "SELECT id,question FROM mst_officer_question where reraid=? and workflowtype=?  and deleted=0 order by id desc;";
        const [result] = await readConn.query(sql, [data.reraid, data.workflowtype]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.insertOfficerAnswer = async (data) => {
    try {
        let sql = '';
        if (Number(data.workflowtype) === config.REGISTRATION_TYPE) {
            sql = "INSERT into map_officer_answer(reraid,projectid,questionid,answer,userid) values(?,?,?,?,?);";
        } else if (Number(data.workflowtype) === config.AGENT_TYPE) {
            sql = "INSERT into map_officer_answer(reraid,agentid,questionid,answer,userid) values(?,?,?,?,?);";
        } else {
            sql = "INSERT into map_officer_answer(reraid,projectid,questionid,answer,userid,extensionid) values(?,?,?,?,?,?);";
        }
        let params = [];
        if (Number(data.workflowtype) === config.AGENT_TYPE) {
            params = [data.reraid, data.agentid, data.id, data.answer, data.userid];
        } else {
            params = [data.reraid, data.projectid, data.id, data.answer, data.userid];
            if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
                params.push(data.extensionid);
            }
        }
        const [result] = await writeConn.query(sql, params);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.insertInternalNotes = async (data) => {
    try {
        let sql = '';
        if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
            sql = "INSERT into map_internal_notes(reraid,projectid,notes,userid,type,extensionid) values(?,?,?,?,?,?);";
        } else if (Number(data.workflowtype) === config.REGISTRATION_TYPE) {
            sql = "INSERT into map_internal_notes(reraid,projectid,notes,userid,type) values(?,?,?,?,?);";
        } else {
            sql = "INSERT into map_internal_notes(reraid,agentid,notes,userid,type) values(?,?,?,?,?);";
        }
        let params = [];
        if (Number(data.workflowtype) === config.AGENT_TYPE) {
            params = [data.reraid, data.agentid, data.notes, data.userid, data.type];
        } else {
            params = [data.reraid, data.projectid, data.notes, data.userid, data.type];
            if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
                params.push(data.extensionid)
            }
        }
        const [result] = await writeConn.query(sql, params);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.getApprovalTypes = async (data, id = 0) => {
    try {
        const sql = "SELECT id,type FROM mst_approval_type  where reraid=? and id >= ? and deleted=0;";
        const [result] = await readConn.query(sql, [data.reraid, id]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.getInternalNotes = async (data) => {
    try {
        let sql = '';
        if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
            sql = "SELECT a.notes,b.username FROM map_internal_notes a,mst_user b where a.reraid=? and a.projectid=? and a.type=? and a.extensionid=? and a.userid=b.userid  and a.deleted=0 and b.deleted=0;";
        } else if (Number(data.workflowtype) === config.REGISTRATION_TYPE) {
            sql = "SELECT a.notes,b.username FROM map_internal_notes a,mst_user b where a.reraid=? and a.projectid=? and a.type=? and a.extensionid is null and a.userid=b.userid  and a.deleted=0 and b.deleted=0;";
        } else {
            sql = "SELECT a.notes,b.username FROM map_internal_notes a,mst_user b where a.reraid=? and a.agentid=? and a.type=?  and a.userid=b.userid  and a.deleted=0 and b.deleted=0;";
        }
        let params = [];
        if (Number(data.workflowtype) === config.AGENT_TYPE) {
            params = [data.reraid, data.agentid, data.type];
        } else {
            params = [data.reraid, data.projectid, data.type];
            if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
                params.push(data.extensionid)
            }
        }
        const [result] = await readConn.query(sql, params);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.getApprovalNotes = async (data) => {
    try {
        let sql = '';
        if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
            sql = "SELECT a.comment,b.username,c.type,a.userid,a.roleseq,c.id FROM map_approval_notes a,mst_user b,mst_approval_type c where a.reraid=? and a.projectid=? and a.extensionid=? and a.userid=b.userid and a.approvaltypeid=c.id and a.deleted=0 and b.deleted=0 and c.deleted=0;";
        } else if (Number(data.workflowtype) === config.REGISTRATION_TYPE) {
            sql = "SELECT a.comment,b.username,c.type,a.userid,a.roleseq,c.id FROM map_approval_notes a,mst_user b,mst_approval_type c where a.reraid=? and a.projectid=? and a.extensionid is null and a.userid=b.userid and a.approvaltypeid=c.id and a.deleted=0 and b.deleted=0 and c.deleted=0;";
        } else {
            sql = "SELECT a.comment,b.username,c.type,a.userid,a.roleseq,c.id FROM map_approval_notes a,mst_user b,mst_approval_type c where a.reraid=? and a.agentid=?  and a.userid=b.userid and a.approvaltypeid=c.id and a.deleted=0 and b.deleted=0 and c.deleted=0;";
        }

        let params = [];
        if (Number(data.workflowtype) === config.AGENT_TYPE) {
            params = [data.reraid, data.agentid];
        } else {
            params = [data.reraid, data.projectid];
            if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
                params.push(data.extensionid)
            }
        }
        const [result] = await readConn.query(sql, params);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.getMinApprovalType = async (data) => {
    try {
        let sql = '';
        if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
            sql = "SELECT MIN(approvaltypeid) approvaltypeid FROM map_approval_notes where reraid=? and projectid=? and extensionid=? and deleted=0;";
        } else if (Number(data.workflowtype) === config.REGISTRATION_TYPE) {
            sql = "SELECT MIN(approvaltypeid) approvaltypeid FROM map_approval_notes where reraid=? and projectid=? and extensionid is null and deleted=0;";
        } else {
            sql = "SELECT MIN(approvaltypeid) approvaltypeid FROM map_approval_notes where reraid=? and agentid=? and deleted=0;";
        }
        let params = [];
        if (Number(data.workflowtype) === config.AGENT_TYPE) {
            params = [data.reraid, data.agentid];
        } else {
            params = [data.reraid, data.projectid];
            if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
                params.push(data.extensionid)
            }
        }
        const [result] = await readConn.query(sql, params);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.getSingleQueryAnswer = async (data) => {
    try {
        let sql = "SELECT a.dateofquery,a.id,a.permissibletime,a.isvalidquery,IF(a.isvalidquery =1,'Yes','No') accepted,a.query,a.comments,c.roledesc,a.permissibletime,e.username,coalesce(d.answer,'') answer  FROM   workflow_steps_role_user_query a left join workflow_steps_role_user_query_answer d on a.id=d.workflowstepsroleuserqueryid and d.userid in (select h.userid from mst_role_user h,mst_role i where h.reraid=? and h.roleid=i.roleid and i.type=2 and h.deleted=0 and i.deleted =0),trn_workflow_steps_role_user_project b,mst_role c, mst_user e where a.reraid=?  ";
        if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
            sql = sql + " and a.uniqueprojectid=? and b.extensionid = ? ";
        } else if (Number(data.workflowtype) === config.REGISTRATION_TYPE) {
            sql = sql + " and a.uniqueprojectid=? and b.extensionid is null ";
        } else {
            sql = sql + " and a.agentid=?"
        }
        if (data.type) {
            sql = sql + " and a.isvalidquery in (?) ";
        }

        sql = sql + "  and a.workflowstepsroleuserprojectid=b.id and e.userid = a.userid and b.roleid=c.roleid and c.deleted=0 order by a.id";
        let params = [];
        if (Number(data.workflowtype) === config.AGENT_TYPE) {
            params = [data.reraid, data.reraid, data.agentid];
        } else {
            params = [data.reraid, data.reraid, data.projectid];
            if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
                params.push(data.extensionid);
            }
        }
        if (data.type) {
            params.push(data.type);
        }

        const [result] = await readConn.query(sql, params);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchPromoterAnswerDetails = async (data) => {
    try {
        let sql = "SELECT a.id,coalesce(a.answer,'') answer,a.dateofanswer,b.filepath,b.filedesc ,coalesce(c.comments,'') comments,coalesce(c.id,0) commentid FROM   workflow_steps_role_user_query_answer a left join workflow_steps_role_user_query_answer_attachment b on a.id=b.workflowstepsroleuserqueryanswerid left join workflow_steps_role_user_answer_comment c on a.id=c.workflowstepsroleuseranswerid where a.workflowstepsroleuserqueryid=? and a.userid in (select h.userid from mst_role_user h,mst_role i where h.reraid=? and h.roleid=i.roleid and i.type=? and h.deleted=0 and i.deleted =0) ";

        let params = [data.queryid, data.reraid];
        if (Number(data.workflowtype) === config.AGENT_TYPE) {
            params.push(AGENT_ROLE_SEQ);
        } else {
            params.push(PROMOTER_ROLE_SEQ)
        }
        const [result] = await readConn.query(sql, params);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.insertApprovalNotes = async (data) => {
    try {
        let sql = "";
        if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
            sql = "INSERT into map_approval_notes(reraid,projectid,approvaltypeid,comment,roleseq,userid,extensionid) values(?,?,?,?,?,?,?);";
        } else if (Number(data.workflowtype) === config.REGISTRATION_TYPE) {
            sql = "INSERT into map_approval_notes(reraid,projectid,approvaltypeid,comment,roleseq,userid) values(?,?,?,?,?,?);";
        } else {
            sql = "INSERT into map_approval_notes(reraid,agentid,approvaltypeid,comment,roleseq,userid) values(?,?,?,?,?,?);";
        }
        let params = [];
        if (Number(data.workflowtype) === config.AGENT_TYPE) {
            params = [data.reraid, data.agentid, data.approvaltypeid, data.comment, data.roleseq, data.userid];
        } else {
            params = [data.reraid, data.projectid, data.approvaltypeid, data.comment, data.roleseq, data.userid];
            if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
                params.push(data.extensionid)
            }
        }
        const [result] = await writeConn.query(sql, params);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.getPromoterQueryDashboard = async (data) => {
    try {
        let sql = "";
        if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
            sql = "SELECT a.uniqueprojectid,count(b.id)total,d.projectfieldvalue,d.projectuid,a.extensionid FROM trn_workflow_steps_latest_project a,mst_entitytype_project_hdr d, workflow_steps_role_user_query b  where a.reraid=? and a.workflowuserid =? and a.extensionid is not null and a.uniqueprojectid =d.id and a.extensionid=b.extensionid and a.uniqueprojectid=b.uniqueprojectid and b.isvalidquery=1 and d.isdelete=0 group by b.uniqueprojectid;";
        } else if (Number(data.workflowtype) === config.REGISTRATION_TYPE) {
            sql = "SELECT a.uniqueprojectid,count(b.id)total,d.projectfieldvalue,d.projectuid,a.extensionid FROM trn_workflow_steps_latest_project a,mst_entitytype_project_hdr d, workflow_steps_role_user_query b  where a.reraid=? and a.workflowuserid =? and a.extensionid is  null and a.uniqueprojectid =d.id and a.uniqueprojectid=b.uniqueprojectid and b.isvalidquery=1 and d.isdelete=0 group by b.uniqueprojectid;";
        } else {
            sql = "SELECT a.agentid,count(b.id)total,d.userno projectuid FROM trn_workflow_steps_latest_project a,mst_user d, workflow_steps_role_user_query b  where a.reraid=? and a.workflowuserid =? and a.agentid =d.userid and a.agentid=b.agentid and b.isvalidquery=1 and d.deleted=0 ;";
        }
        const [result] = await readConn.query(sql, [data.reraid, data.userid]);

        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.getQueryById = async (data) => {
    try {
        const sql = "SELECT query,comments,uniquepromoterid FROM workflow_steps_role_user_query where reraid=? and id =? ";
        const [result] = await readConn.query(sql, [data.reraid, data.id]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.getPromoterAnswer = async (data) => {
    try {
        let sql = "";
        if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
            sql = "SELECT a.answer,a.dateofanswer,coalesce(b.comments,'') comments FROM workflow_steps_role_user_query_answer a left join workflow_steps_role_user_answer_comment b on a.id=b.workflowstepsroleuseranswerid where a.reraid=? and workflowstepsroleuserqueryid=? and a.userid =? and a.uniqueprojectid =? and a.extensionid =? ;";
        } else if (Number(data.workflowtype) === config.REGISTRATION_TYPE) {
            sql = "SELECT a.answer,a.dateofanswer,coalesce(b.comments,'') comments FROM workflow_steps_role_user_query_answer a left join workflow_steps_role_user_answer_comment b on a.id=b.workflowstepsroleuseranswerid where a.reraid=? and workflowstepsroleuserqueryid=? and a.userid =? and a.uniqueprojectid =? ;";
        } else {
            sql = "SELECT a.answer,a.dateofanswer,coalesce(b.comments,'') comments FROM workflow_steps_role_user_query_answer a left join workflow_steps_role_user_answer_comment b on a.id=b.workflowstepsroleuseranswerid where a.reraid=? and workflowstepsroleuserqueryid=? and a.agentid =?  ;";
        }
        let params = [data.reraid, data.id, data.userid];
        if (Number(data.workflowtype) !== config.AGENT_TYPE) {
            params.push(data.projectid)
            if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
                params.push(data.extensionid)
            }
        }
        const [result] = await readConn.query(sql, params);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};


module.exports.getworkflowstepbyrolecount = async (data) => {
    try {
        let sql = '';
        if (Number(data.type) == config.REGISTRATION_TYPE) {
            sql = "SELECT count(a.id) total FROM trn_workflow_steps_latest_project a,mst_entitytype_project_hdr b ,mst_user c, mst_role d where a.reraid=? and a.extensionid is null and a.roleid =? and (a.workflowuserid is null || a.workflowuserid =0 || a.workflowuserid ='' )  and a.uniqueprojectid =b.id and  b.particularprofileid=c.userid and a.roleid = d.roleid and  b.isdelete=0 and c.deleted=0 order by b.submitiontime asc;";
        } else if (Number(data.type) == config.EXTENSION_TYPE) {
            sql = "SELECT count(a.id) total FROM trn_workflow_steps_latest_project a,mst_entitytype_project_hdr b ,mst_user c, mst_role d,project_extension_hdr e where a.reraid=? and a.extensionid is not null and a.roleid =? and (a.workflowuserid is null || a.workflowuserid =0 || a.workflowuserid ='' )  and a.uniqueprojectid =b.id AND a.extensionid=e.id and  b.particularprofileid=c.userid and a.roleid = d.roleid and  b.isdelete=0 and c.deleted=0 order by e.submitedtime asc;";
        } else if (Number(data.type) == config.AGENT_TYPE) {
            sql = "SELECT count(a.id) total FROM trn_workflow_steps_latest_project a,mst_user c, mst_role d where a.reraid=?  and a.roleid =? and (a.workflowuserid is null || a.workflowuserid =0 || a.workflowuserid ='' ) and agentrenewalid is null and a.agentid =c.userid and a.roleid = d.roleid and c.deleted=0 order by c.submission_time asc;";
        }else if (Number(data.type) == config.AGENT_RENEWAL_TYPE) {
            sql = "SELECT count(a.id) total FROM trn_workflow_steps_latest_project a,mst_user c, mst_role d where a.reraid=?  and a.roleid =? and (a.workflowuserid is null || a.workflowuserid =0 || a.workflowuserid ='' ) and agentrenewalid is not null and a.agentid =c.userid and a.roleid = d.roleid and c.deleted=0 order by c.submission_time asc;";
        }
        const [result] = await readConn.query(sql, [data.reraid, data.roleid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.getworkflowstepbyusercount = async (data) => {
    try {
        let sql = '';
        if (Number(data.type) == config.REGISTRATION_TYPE) {
            sql = "SELECT count(a.id) total FROM trn_workflow_steps_latest_project a,mst_entitytype_project_hdr b ,mst_user c,mst_role d,mst_user e where a.reraid=? and a.extensionid is null and a.roleid =? and a.workflowuserid=?  and a.uniqueprojectid =b.id  and b.particularprofileid=c.userid and a.roleid = d.roleid and a.workflowuserid = e.userid  and b.isdelete=0 and c.deleted=0 order by b.submitiontime asc;";
        } else if (Number(data.type) == config.EXTENSION_TYPE) {
            sql = "SELECT count(a.id) total FROM trn_workflow_steps_latest_project a,mst_entitytype_project_hdr b ,mst_user c,mst_role d,mst_user e,project_extension_hdr f where a.reraid=? and a.extensionid is not null and a.roleid =? and a.workflowuserid=?  and a.uniqueprojectid =b.id AND a.extensionid=f.id  and b.particularprofileid=c.userid and a.roleid = d.roleid and a.workflowuserid = e.userid  and b.isdelete=0 and c.deleted=0 order by f.submitedtime asc;";
        } else if (Number(data.type) == config.AGENT_TYPE){
            sql = "SELECT count(a.id) total FROM trn_workflow_steps_latest_project a,mst_user c, mst_role d,mst_user e where a.reraid=?  and a.roleid =? and  a.workflowuserid = ? and a.agentrenewalid is null and a.agentid =c.userid and a.roleid = d.roleid and a.workflowuserid = e.userid and c.deleted=0 and e.deleted=0 order by c.submission_time asc;";
        }else if (Number(data.type) == config.AGENT_RENEWAL_TYPE){
            sql = "SELECT count(a.id) total FROM trn_workflow_steps_latest_project a,mst_user c, mst_role d,mst_user e where a.reraid=?  and a.roleid =? and  a.workflowuserid = ? and a.agentrenewalid is not null  and a.agentid =c.userid and a.roleid = d.roleid and a.workflowuserid = e.userid and c.deleted=0 and e.deleted=0 order by c.submission_time asc;";
        }
        const [result] = await readConn.query(sql, [data.reraid, data.roleid, data.userid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
