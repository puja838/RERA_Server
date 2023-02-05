const readConn = require('../../dbconnection').readPool;
const writeConn = require('../../dbconnection').writePool;
const util = require('../../utility/util');
const config = require('../../config');

module.exports.addWorkflowHistory = async (data) => {
    // console.log(data)
    try {
        let sql;
        if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
            sql = "INSERT INTO trn_workflow_steps_role_user_project (reraid, workflowid, roleid, workflowuserid,uniquepromoterid,uniqueprojectid,workflowstepsworksid,fromstepid,tostepid,forwardflg,userid,extensionid) values (?,?,?,?,?,?,?,?,?,?,?,?)"
        } else if (Number(data.workflowtype) === config.AGENT_TYPE) {
            sql = "INSERT INTO trn_workflow_steps_role_user_project (reraid, workflowid, roleid, workflowuserid,workflowstepsworksid,fromstepid,tostepid,forwardflg,userid,agentid) values (?,?,?,?,?,?,?,?,?,?)"
        } else {
            sql = "INSERT INTO trn_workflow_steps_role_user_project (reraid, workflowid, roleid, workflowuserid,uniquepromoterid,uniqueprojectid,workflowstepsworksid,fromstepid,tostepid,forwardflg,userid) values (?,?,?,?,?,?,?,?,?,?,?)";
        }
        let params = [];
        if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
            params = [data.reraid, data.workflowid, data.roleid, data.workflowuserid, data.uniquepromoterid, data.uniqueprojectid, data.workflowstepsworksid, data.fromstepid, data.tostepid, data.forwardflg, data.userid, data.extensionid];
        } else if (Number(data.workflowtype) === config.AGENT_TYPE) {
            params = [data.reraid, data.workflowid, data.roleid, data.workflowuserid, data.workflowstepsworksid, data.fromstepid, data.tostepid, data.forwardflg, data.userid, data.agentid];
        } else {
            params = [data.reraid, data.workflowid, data.roleid, data.workflowuserid, data.uniquepromoterid, data.uniqueprojectid, data.workflowstepsworksid, data.fromstepid, data.tostepid, data.forwardflg, data.userid];
        }
        const [result] = await writeConn.query(sql, params);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.addWorkflowLatest = async (data) => {
    // console.log(data)
    try {
        let sql;
        if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
            sql = "INSERT INTO trn_workflow_steps_latest_project (reraid, workflowid, roleid, workflowuserid,uniquepromoterid,uniqueprojectid,workflowstepsworksid,fromstepid,tostepid,forwardflg,userid,extensionid) values (?,?,?,?,?,?,?,?,?,?,?,?)";
        } else if (Number(data.workflowtype) === config.AGENT_TYPE) {
            sql = "INSERT INTO trn_workflow_steps_latest_project (reraid, workflowid, roleid, workflowuserid,workflowstepsworksid,fromstepid,tostepid,forwardflg,userid,agentid) values (?,?,?,?,?,?,?,?,?,?)";
        } else {
            sql = "INSERT INTO trn_workflow_steps_latest_project (reraid, workflowid, roleid, workflowuserid,uniquepromoterid,uniqueprojectid,workflowstepsworksid,fromstepid,tostepid,forwardflg,userid) values (?,?,?,?,?,?,?,?,?,?,?)";
        }
        let params = [];
        if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
            params = [data.reraid, data.workflowid, data.roleid, data.workflowuserid, data.uniquepromoterid, data.uniqueprojectid, data.workflowstepsworksid, data.fromstepid, data.tostepid, data.forwardflg, data.userid, data.extensionid];
        } else if (Number(data.workflowtype) === config.AGENT_TYPE) {
            params = [data.reraid, data.workflowid, data.roleid, data.workflowuserid, data.workflowstepsworksid, data.fromstepid, data.tostepid, data.forwardflg, data.userid, data.agentid];
        } else {
            params = [data.reraid, data.workflowid, data.roleid, data.workflowuserid, data.uniquepromoterid, data.uniqueprojectid, data.workflowstepsworksid, data.fromstepid, data.tostepid, data.forwardflg, data.userid];
        }
        const [result] = await writeConn.query(sql, params);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.updateWorkflowLatest = async (data) => {
    // console.log("updateWorkflowLatest", data.workflowuserid)
    try {
        const sql = "UPDATE trn_workflow_steps_latest_project SET roleid=?,workflowuserid=?,workflowstepsworksid=?,fromstepid=?,tostepid=?,forwardflg=?,userid=? where id =?";
        const [result] = await writeConn.query(sql, [data.roleid, data.workflowuserid, data.workflowstepsworksid, data.fromstepid, data.tostepid, data.forwardflg, data.userid, data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchLatestStepByProject = async (data) => {
    try {
        let sql = '';
        if (Number(data.workflowtype) === config.AGENT_TYPE) {
            sql = "SELECT  * from trn_workflow_steps_latest_project where reraid=? and workflowid=? and agentid=?";
        } else {
            sql = "SELECT  * from trn_workflow_steps_latest_project where reraid=? and workflowid=? and uniqueprojectid=?";
            if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
                sql = sql + " and extensionid =?"
            }
        }
        params = [];
        if (Number(data.workflowtype) === config.AGENT_TYPE) {
            params = [data.reraid, data.workflowid, data.agentid];
        } else {
            params = [data.reraid, data.workflowid, data.uniqueprojectid];
            if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
                params.push(data.extensionid)
            }
        }
        const [result] = await readConn.query(sql, params);
        // console.log(result);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchStepSeqByStepid = async (data) => {
    try {
        const sql = "SELECT  seqno from mst_workflow_steps where reraid=? and id=? and deleted=0";
        const [result] = await readConn.query(sql, [data.reraid, data.tostepid]);
        // console.log(result);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchWorkflowByreraid = async (data) => {
    try {
        const sql = "SELECT  id from mst_workflow where reraid=? and workflowtype=? and defaultflg=1";
        const [result] = await readConn.query(sql, [data.reraid, data.workflowtype]);
        // console.log(result);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchRoleUserInStep = async (data) => {
    // console.log(data);
    try {
        const sql = "SELECT  a.roleid,a.workflowuserid,coalesce(b.username,'')username from mst_workflow_steps_role_user a left join mst_user b on a.workflowuserid=b.userid and b.deleted=0 where a.reraid=? and a.workflowid=? and a.workflowstepsworksid=? and a.deleted=0  ";
        const [result] = await readConn.query(sql, [data.reraid, data.workflowid, data.workflowstepsworksid]);
        // console.log(result)
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchRoleInStep = async (data) => {
    // console.log(data);
    try {
        const sql = "SELECT  roleid from mst_workflow_steps_role where reraid=? and workflowid=? and workflowstepsworksid=? and deleted=0";
        const [result] = await readConn.query(sql, [data.reraid, data.workflowid, data.workflowstepsworksid]);
        // console.log(result)
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchTostepId = async (data) => {
    // console.log(data)
    try {
        const sql = "SELECT  tostepid from mst_workflow_steps_works where reraid=? and workflowid=? and fromstepid=? and deleted=0 ";
        const [result] = await readConn.query(sql, [data.reraid, data.workflowid, data.fromstepid]);
        // console.log(result)
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchTransitionId = async (data) => {
    // console.log(data)
    try {
        const sql = "SELECT  id from mst_workflow_steps_works where reraid=? and workflowid=? and fromstepid=? and tostepid=? and deleted=0";
        const [result] = await readConn.query(sql, [data.reraid, data.workflowid, data.fromstepid, data.tostepid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.workflowStepUserQuery = async (data) => {
    // console.log(data)
    try {
        let sql = '';
        if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
            sql = "INSERT INTO workflow_steps_role_user_query (reraid, workflowstepsroleuserprojectid,uniquepromoterid,uniqueprojectid,query,querybyuserid,permissibletime,userid,docrequired,comments,extensionid) values (?,?,?,?,?,?,?,?,?,?,?)";
        } else if (Number(data.workflowtype) === config.REGISTRATION_TYPE) {
            sql = "INSERT INTO workflow_steps_role_user_query (reraid, workflowstepsroleuserprojectid,uniquepromoterid,uniqueprojectid,query,querybyuserid,permissibletime,userid,docrequired,comments) values (?,?,?,?,?,?,?,?,?,?)";
        } else {
            sql = "INSERT INTO workflow_steps_role_user_query (reraid, workflowstepsroleuserprojectid,agentid,query,querybyuserid,permissibletime,userid,docrequired,comments) values (?,?,?,?,?,?,?,?,?)";
        }
        let params = [];
        if (Number(data.workflowtype) === config.AGENT_TYPE) {
            params = [data.reraid, data.workflowstepsroleuserprojectid, data.agentid, data.query, data.userid, data.time, data.userid, data.docsrequired, data.docs];
        } else {
            params = [data.reraid, data.workflowstepsroleuserprojectid, data.uniquepromoterid, data.uniqueprojectid, data.query, data.userid, data.time, data.userid, data.docsrequired, data.docs];
            if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
                params.push(data.extensionid)
            }
        }
        const [result] = await writeConn.query(sql, params);
        return result.insertId;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.workflowStepResolvedQuery = async (data) => {
    // console.log(data)
    try {
        const sql = "UPDATE workflow_steps_role_user_query SET queryresolved=? , queryresolveddatetime=NOW() , queryresolveduserid=? where id=?";
        const [result] = await writeConn.query(sql, [1, data.userid, data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.workflowStepQueryAnswer = async (data) => {
    // console.log(data)
    try {
        let sql = '';
        if (Number(data.workflowtype) === config.REGISTRATION_TYPE) {
            sql = "INSERT INTO workflow_steps_role_user_query_answer (reraid, workflowstepsroleuserprojectid,uniquepromoterid,uniqueprojectid,workflowstepsroleuserqueryid,answer,dateofanswer,userid) values (?,?,?,?,?,?,NOW(),?)";
        } else if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
            sql = "INSERT INTO workflow_steps_role_user_query_answer (reraid, workflowstepsroleuserprojectid,uniquepromoterid,uniqueprojectid,workflowstepsroleuserqueryid,answer,dateofanswer,userid,extensionid) values (?,?,?,?,?,?,NOW(),?,?)";
        } else {
            sql = "INSERT INTO workflow_steps_role_user_query_answer (reraid, workflowstepsroleuserprojectid,agentid,workflowstepsroleuserqueryid,answer,dateofanswer,userid) values (?,?,?,?,?,NOW(),?)";
        }
        let params = [];
        if (Number(data.workflowtype) === config.AGENT_TYPE) {
            params = [data.reraid, data.workflowstepsroleuserprojectid, data.agentid, data.workflowstepsroleuserqueryid, data.answer, data.userid];
        } else {
            params = [data.reraid, data.workflowstepsroleuserprojectid, data.uniquepromoterid, data.uniqueprojectid, data.workflowstepsroleuserqueryid, data.answer, data.userid]
            if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
                params.push(data.extensionid)
            }
        }
        const [result] = await writeConn.query(sql,params);
        // console.log(result)
        return result.insertId;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.workflowStepQueryComment = async (data) => {
    // console.log(data)
    try {
        const sql = "INSERT INTO workflow_steps_role_user_query_answer (reraid, workflowstepsroleuserprojectid,uniquepromoterid,uniqueprojectid,workflowstepsroleuserqueryid,comment,commentbyid,commentdatetime,userid) values (?,?,?,?,?,?,?,NOW(),?)";
        const [result] = await writeConn.query(sql, [data.reraid, data.workflowstepsroleuserprojectid, data.uniquepromoterid, data.uniqueprojectid, data.workflowstepsroleuserqueryid, data.comment, data.commentbyid, data.userid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.workflowStepQueryAttachment = async (data) => {
    // console.log(data)
    try {
        const sql = "INSERT INTO workflow_steps_role_user_query_answer_attachment (reraid, workflowstepsroleuserqueryid,filepath,filedesc,enterdate,userid) values (?,?,?,?,NOW(),?)";
        const [result] = await writeConn.query(sql, [data.reraid, data.workflowstepsroleuserqueryid, data.filepath, data.filedesc, data.userid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.workflowStepQueryAnswerAttachment = async (data) => {
    // console.log(data)
    try {
        const sql = "INSERT INTO workflow_steps_role_user_query_answer_attachment (reraid, workflowstepsroleuserqueryanswerid,filepath,filedesc,enterdate,userid) values (?,?,?,?,NOW(),?)";
        const [result] = await writeConn.query(sql, [data.reraid, data.workflowstepsroleuserqueryanswerid, data.filepath, data.filedesc, data.userid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.workflowStepAttachment = async (data) => {
    // console.log(data)
    try {
        const sql = "INSERT INTO workflow_steps_role_user_query_answer_attachment (reraid, workflowstepsroleuserchecklistconversationid,filepath,filedesc,enterdate,userid) values (?,?,?,?,NOW(),?)";
        const [result] = await writeConn.query(sql, [data.reraid, data.workflowstepsroleuserchecklistconversationid, data.filepath, data.filedesc, data.userid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.deleteWorkflowStepAttachment = async (data) => {
    // console.log(data)
    if (data.checkid) {
        try {
            const sql = "DELETE from workflow_steps_role_user_query_answer_attachment where workflowstepsroleuserchecklistconversationid=?";
            const [result] = await writeConn.query(sql, [data.checkid]);
            return true;
        } catch (e) {
            util.createLog(e);
            return false;
        }
    } else {
        return true;
    }
};
module.exports.workflowStepChecklistComment = async (data) => {
    try {
        let sql = '';
        if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
            sql = "INSERT INTO workflow_steps_role_user_checklist_conversation (reraid,uniqueprojectid, mstworkflowstepsroleuserchecklistid,workflowstepsroleuserprojectid,comment,commentdate,commentbyuserid,userid,checklistcommentchecked,entitytypedtlid,extensionid) values (?,?,?,?,?,NOW(),?,?,?,?,?)";
        } else if (Number(data.workflowtype) === config.REGISTRATION_TYPE) {
            sql = "INSERT INTO workflow_steps_role_user_checklist_conversation (reraid,uniqueprojectid, mstworkflowstepsroleuserchecklistid,workflowstepsroleuserprojectid,comment,commentdate,commentbyuserid,userid,checklistcommentchecked,entitytypedtlid) values (?,?,?,?,?,NOW(),?,?,?,?)";
        } else {
            sql = "INSERT INTO workflow_steps_role_user_checklist_conversation (reraid,agentid, mstworkflowstepsroleuserchecklistid,workflowstepsroleuserprojectid,comment,commentdate,commentbyuserid,userid,checklistcommentchecked,entitytypedtlid) values (?,?,?,?,?,NOW(),?,?,?,?)";
        }
        let params = [];
        if (Number(data.workflowtype) === config.AGENT_TYPE) {
            params = [data.reraid, data.agentid, data.mstworkflowstepsroleuserchecklistid, data.workflowstepsroleuserprojectid, data.comment, data.userid, data.userid, data.checklistcommentchecked, data.entitytypedtlid];
        } else {
            params = [data.reraid, data.uniqueprojectid, data.mstworkflowstepsroleuserchecklistid, data.workflowstepsroleuserprojectid, data.comment, data.userid, data.userid, data.checklistcommentchecked, data.entitytypedtlid];
            if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
                params.push(data.extensionid)
            }
        }
        const [result] = await writeConn.query(sql, params);
        return result.insertId;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.deleteWorkflowStepChecklistComment = async (data) => {
    if (data.checkid) {
        try {
            const sql = "DELETE from workflow_steps_role_user_checklist_conversation where id =?";
            const [result] = await writeConn.query(sql, [data.checkid]);
            return true;
        } catch (e) {
            util.createLog(e);
            return false;
        }
    } else {
        return true;
    }
};
module.exports.workflowStepChecklistPromoterComment = async (data) => {
    // console.log(data)
    try {
        const sql = "INSERT INTO workflow_steps_role_user_checklist_conversation (reraid,uniqueprojectid, mstworkflowstepsroleuserchecklistid,workflowstepsroleuserprojectid,commentbypromoter,commentbypromoterdate,userid) values (?,?,?,NOW(),?)";
        const [result] = await writeConn.query(sql, [data.reraid, data.uniqueprojectid, data.mstworkflowstepsroleuserchecklistid, data.workflowstepsroleuserprojectid, data.commentbypromoter, data.userid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.workflowStepChecklistApprove = async (data) => {
    // console.log(data)
    try {
        const sql = "INSERT INTO workflow_steps_role_user_checklist_conversation (reraid,uniqueprojectid, mstworkflowstepsroleuserchecklistid,workflowstepsroleuserprojectid,approve,approvedatetime,approvebyid,userid) values (?,?,?,NOW(),?)";
        const [result] = await writeConn.query(sql, [data.reraid, data.uniqueprojectid, data.mstworkflowstepsroleuserchecklistid, data.workflowstepsroleuserprojectid, data.approve, data.approvedatetime, data.approvebyid, data.userid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.invalidateQuery = async (data) => {
    // console.log(data)
    try {
        const sql = "UPDATE workflow_steps_role_user_query SET isvalidquery = ? where id in (?)";
        const [result] = await writeConn.query(sql, [data.number, data.ids]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchUserFromStep = async (data) => {
    // console.log(data)
    try {
        const sql = "SELECT a.roleid,a.workflowuserid,b.username from mst_workflow_steps_role_user a,mst_user b,mst_workflow_steps_works c where a.reraid=? and a.workflowid=? and a.workflowstepsworksid=c.id and c.fromstepid=? and c.tostepid=? and a.workflowuserid= b.userid and a.deleted=0 and b.deleted=0 and c.deleted=0 ";
        const [result] = await readConn.query(sql, [data.reraid, data.workflowid, data.fromstepid, data.tostepid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getparticularprofileid = async (data) => {
    // console.log("getparticularprofileid",data)
    try {
        const sql = "SELECT a.particularprofileid, c.roleid FROM mst_entitytype_project_hdr a, mst_role_user c" +
            " WHERE a.particularprofileid = c.userid AND a.id = ? AND a.isdelete = 0;";
        const [result] = await readConn.query(sql, data.uniqueprojectid);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.getuserrole = async (data) => {
    try {
        const sql = "SELECT roleid FROM mst_role_user where reraid=? and userid=? and deleted=0";
        const [result] = await readConn.query(sql, [data.reraid, data.agentid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.getsenderdetails = async (data) => {
    try {
        let sql = '';
        if (Number(data.workflowtype) === config.REGISTRATION_TYPE) {
            sql = "SELECT roleid,workflowuserid FROM trn_workflow_steps_role_user_project where uniqueprojectid=? and extensionid is null order by id desc limit 2;";
        } else if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
            sql = "SELECT roleid,workflowuserid FROM trn_workflow_steps_role_user_project where uniqueprojectid=? and extensionid=? order by id desc limit 2;";
        } else {
            sql = "SELECT roleid,workflowuserid FROM trn_workflow_steps_role_user_project where agentid=? order by id desc limit 2;";
        }
        let params = [];
        if (Number(data.workflowtype) === config.AGENT_TYPE) {
            params = [data.agentid];
        } else {
            params = [data.uniqueprojectid];
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
module.exports.getProjectHistory = async (data) => {
    if (Number(data.uniqueprojectid) > 0) {
        try {
            const sql = "SELECT b.stepname fromstep,c.stepname tostep,a.dateoftransfer FROM trn_workflow_steps_role_user_project a,mst_workflow_steps b,mst_workflow_steps c where a.uniqueprojectid=? and a.fromstepid=b.id and a.tostepid=c.id and b.deleted=0 and c.deleted=0 ;";
            const [result] = await readConn.query(sql, data.uniqueprojectid);
            return result;
        } catch (e) {
            util.createLog(e);
            return false;
        }
    } else {
        return [];
    }
};
module.exports.hasValidQuery = async (data) => {
    try {
        const sql = "SELECT id FROM workflow_steps_role_user_query where uniqueprojectid=? and isvalidquery=1 ";
        const [result] = await readConn.query(sql, data.projectid);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.updateExtensionStatus = async (data) => {
    // console.log(data)
    try {
        const sql = "UPDATE project_extension_hdr SET approvalstatus = ?,approveby=?,reason=?,extensionno=? where id=?";
        const [result] = await writeConn.query(sql, [data.status, data.userid, data.comment, data.extensionno, data.extensionid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.updateAgentStatus = async (data) => {
    try {
        const sql = "UPDATE mst_user SET approval_comment = ?,isApproved=? where userid=?";
        const [result] = await writeConn.query(sql, [data.comment,data.status,data.agentid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.updateAgentRegno = async (data) => {
    try {
        const sql = "UPDATE agent_registration_certificate SET registrationno=? where userid=?";
        const [result] = await writeConn.query(sql, [data.regno,data.agentid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.workflowStepQueryAnswerComment = async (data) => {
    // console.log(data)
    try {
        let sql = '';
        if (Number(data.workflowtype) === config.REGISTRATION_TYPE) {
            sql = "INSERT INTO workflow_steps_role_user_answer_comment (reraid, workflowstepsroleuseranswerid,uniquepromoterid,uniqueprojectid,comments,dateofquery,userid) values (?,?,?,?,?,NOW(),?)";
        } else if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
            sql = "INSERT INTO workflow_steps_role_user_answer_comment (reraid, workflowstepsroleuseranswerid,uniquepromoterid,uniqueprojectid,comments,dateofquery,userid,extensionid) values (?,?,?,?,?,NOW(),?,?)";
        } else {
            sql = "INSERT INTO workflow_steps_role_user_answer_comment (reraid, workflowstepsroleuseranswerid,agentid,comments,dateofquery,userid) values (?,?,?,?,NOW(),?)";
        }
        let params = [];
        if (Number(data.workflowtype) === config.AGENT_TYPE) {
            params = [data.reraid, data.workflowstepsroleuseranswerid, data.agentid,  data.comment, data.userid];
        } else {
            params = [data.reraid, data.workflowstepsroleuseranswerid, data.uniquepromoterid, data.uniqueprojectid,  data.comment, data.userid]
            if (Number(data.workflowtype) === config.EXTENSION_TYPE) {
                params.push(data.extensionid)
            }
        }
        const [result] = await writeConn.query(sql,params);
        // console.log(result)
        return result.insertId;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
