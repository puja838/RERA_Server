const readConn = require('../../dbconnection').readPool;
const writeConn = require('../../dbconnection').writePool;
const util = require('../../utility/util');
const COMMUNITY_ID = 1;
const COMMUNITY_GROUPID = 22;

module.exports.getProjectDetail = async (data) => {
    try {
        const sql = "SELECT registrationno as projectuid,projectuid as applicationno,progressstatus, DATE(validatyenddate) as validatyenddate FROM mst_entitytype_project_hdr WHERE id = ?";
        const [result] = await readConn.query(sql, [data.projectid]);
        // console.log(result);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return null;
    }
};
module.exports.getQuarterDtlById = async (data) => {
    try {
        const sql = "SELECT b.name, b.startmonth, b.endmonth FROM project_execution_hdr a, quater_mst b WHERE a.quoterid = b.id AND a.id = ?";
        const [result] = await readConn.query(sql, [data.quoterid]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return null;
    }
};


module.exports.getProjectInfoFromDtl = async (data) => {
    try {
        const sql = "SELECT projectfieldvalue as fieldvalue FROM mst_entitytype_project_dtl WHERE entitytypeprojecthdrid = ? AND fieldid = ? AND stepid = ?";
        const [result] = await readConn.query(sql, [data.projectid, data.fieldid, data.stepid]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return null;
    }
};


module.exports.getSubmittedQuoterList = async (data) => {
    try {
        const sql = "SELECT a.id, a.userid, a.projectid, a.quoterid, p.projectfieldvalue as projectName, p.projectuid as projectRegNo, u.username as promoterName, qm.name as quoterName, a.quoterstartdate, a.quoterenddate, a.issubmited, a.submitteddate FROM project_execution_hdr a, mst_entitytype_project_hdr p, mst_user u, quater_mst qm\n" +
            "WHERE a.projectid = ? AND a.userid = ? AND a.projectid = p.id AND a.userid = u.userid AND a.quoterid = qm.id AND a.issubmited = 1";
        const [result] = await readConn.query(sql, [data.projectid, data.userid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return null;
    }
};


module.exports.getPendingQuoterList = async (data) => {
    try {
        const sql = "SELECT a.id, a.userid, a.projectid, a.quoterid, p.projectfieldvalue as projectName, p.projectuid as projectRegNo, u.username as promoterName, qm.name as quoterName, a.quoterstartdate, a.quoterenddate, a.issubmited FROM project_execution_hdr a, mst_entitytype_project_hdr p, mst_user u, quater_mst qm\n" +
            "WHERE a.projectid = ? AND a.userid = ? AND a.projectid = p.id AND a.userid = u.userid AND a.quoterid = qm.id AND a.issubmited = 0 AND DATE(a.quoterstartdate) <= DATE(CURRENT_DATE())";
        const [result] = await readConn.query(sql, [data.projectid, data.userid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return null;
    }
};


module.exports.getInventoryDataByQuoter = async (data) => {
    try {
        const sql = "SELECT groupid, grouppos, fieldgroupid, fieldgrouppos, buildingname, unittype, coverarea, unitno, promoterunit, bookedunit, soldunit, type FROM project_inventory_dtl WHERE projectid = ? AND quoterid = ? AND deleted = 0";
        const [result] = await readConn.query(sql, [data.projectid, data.quoterid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return null;
    }
};

const getMaxQuoterId = async (data) => {
    try {
        const sql = "SELECT max(quoterid) as lastquoter FROM project_inventory_dtl where projectid=?";
        const [result] = await readConn.query(sql, [data.projectid]);
        return result.length > 0 ? result[0].lastquoter : null;
    } catch (e) {
        util.createLog(e);
        return null;
    }
};

module.exports.getLastInventoryData = async (data) => {
    try {
        const lastQuoterId = await getMaxQuoterId(data);
        let sql = "SELECT groupid, grouppos, fieldgroupid, fieldgrouppos, buildingname, unittype, coverarea, unitno, promoterunit, bookedunit, soldunit, type FROM project_inventory_dtl WHERE projectid = ? AND deleted = 0";
        if (lastQuoterId) {
            sql += " AND quoterid = " + lastQuoterId
        } else {
            sql += " AND quoterid IS NULL"
        }
        const [result] = await readConn.query(sql, [data.projectid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return null;
    }
};

module.exports.getConstructionProgress = async (data) => {
    try {
        const sql = "SELECT a.id,a.enddate,b.fielddesc,coalesce(c.work_done,'')work_done,coalesce(c.delay_reason,'')delay_reason,coalesce(c.estimate_completion,'')estimate_completion" +
            "  FROM stage_two_fields_dtl a LEFT JOIN construction_progress c ON a.id=c.stagetwofieldsdtlid AND c.quarterid=? AND c.type=? AND c.deleted=0,stage_two_fields b" +
            " WHERE a.stagetwofieldid=b.id AND a.projectid=? AND a.releatedgroupid=? AND a.relatedfieldid=? AND a.relatedgrouppos=? AND a.deleted=0 AND a.fieldproposedvalue='Yes' AND b.deleted=0";
        const [result] = await readConn.query(sql, [data.quoterid, data.type, data.projectid, data.groupid, data.fieldid, data.groupposition]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.getAmenityProgress = async (data) => {
    try {
        const sql = "SELECT a.id,a.enddate,b.fielddisplaydesc,coalesce(c.work_done,'')work_done,coalesce(c.delay_reason,'')delay_reason,coalesce(c.estimate_completion,'')estimate_completion  " +
            "FROM stage_two_fields_dtl a LEFT JOIN construction_progress c ON a.id=c.stagetwofieldsdtlid AND c.quarterid=? AND c.type=? AND c.deleted=0,mst_fields b WHERE  " +
            "a.projectid=? AND a.stagetwofieldid=? AND a.relationid=? AND a.relatedgrouppos=? AND a.deleted=0 AND a.fieldid=b.fieldid AND b.deleted=0";
        const [result] = await readConn.query(sql, [data.quoterid, data.type, data.projectid, COMMUNITY_ID, COMMUNITY_GROUPID, data.groupposition]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.getQuarterIdByProject = async (data) => {
    try {
        const sql = "SELECT distinct quarterid FROM construction_progress where projectid=? and type=?  and deleted=0 order by quarterid desc;";
        const [result] = await readConn.query(sql, [data.projectid, data.type]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};


module.exports.insertConstructionProgress = async (data) => {
    try {
        const sql = "INSERT INTO construction_progress (reraid,stagetwofieldsdtlid,projectid,quarterid,work_done,delay_reason,estimate_completion,userid,type) values(?,?,?,?,?,?,?,?,?);";
        const [result] = await writeConn.query(sql, [data.reraid, data.id, data.projectid, data.quoterid, data.work_done, data.delay_reason, data.estimate_completion, data.userid, data.type]);
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
        const sql = "SELECT id from construction_progress where projectid=? and quarterid=? and stagetwofieldsdtlid=? and type=?  and deleted=0";
        const [result] = await readConn.query(sql, [data.projectid, data.quoterid, data.id, data.type]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getProjectAccountNo = async (projectId) => {
    try {
        const sql = "SELECT projectfieldvalue FROM mst_entitytype_project_dtl WHERE fieldid=? AND stepid=? AND entitytypeprojecthdrid=?";
        const [result] = await readConn.query(sql, [util.configFieldId.projectAccountNo.fieldid, util.configFieldId.projectAccountNo.stepid, projectId]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

////Sayan
module.exports.getList = async (data) => {
    try {
        const sql = "SELECT *,id as financialUpdateId FROM project_execution_financial_update" +
            " WHERE projectid= ? and userid= ? and quoterid= ?  and deleted=0";
        const [result] = await readConn.query(sql, [data.projectid,data.userid,data.quoterid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.duplicateFinancialDetails = async (data) => {
    try {
        const sql = "SELECT id FROM project_execution_financial_update WHERE projectid = ? AND quoterid = ? AND userid = ?";
        const [result] = await readConn.query(sql, [data.projectid,data.userid,data.quoterid]);
        return result.length > 0 ? result[0].id : null;
    } catch(e) {
        util.createLog(e);
        return false;
    }
}
module.exports.addFinancial_details = async (data) => {
    try {
        const sql = "INSERT INTO project_execution_financial_update (projectid, userid, quoterid, projectaccountno, estimatedcost, amtrecquoter, actiualcost, netamount, totalexpenditure, mortgagecharge)" +
            " values (?,?,?,?,?,?,?,?,?,?)";
        const [result] = await writeConn.query(sql,
            [data.projectid, data.userid, data.quoterid, data.projectaccountno, data.estimatedcost, data.amtrecquoter, data.actiualcost, data.netamount, data.totalexpenditure, data.mortgagecharge]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.updateFinancial_details = async (data) => {
    try {
        util.createLog(data);
        const sql = "UPDATE project_execution_financial_update SET projectaccountno = ?,estimatedcost=?,amtrecquoter=? ,actiualcost=? ,netamount=? ,totalexpenditure=? ,mortgagecharge=?  WHERE id = ?";
        const [result] = await writeConn.query(sql,
            [data.projectaccountno, data.estimatedcost, data.amtrecquoter, data.actiualcost, data.netamount, data.totalexpenditure, data.mortgagecharge, data.financialUpdateId]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.deleteLegalCase = async (projectid,userid,quoterid) => {
    try {
        console.log(projectid,userid,quoterid)
        const sql = "UPDATE project_execution_legal_case SET deleted = 1 WHERE userid = ? and projectid = ? and quoterid = ?";
        const [result] = await writeConn.query(sql,
            [userid, projectid, quoterid]);

        return true;

    } catch (e) {
        console.log(e)
        util.createLog(e);
        return false;
    }
}
module.exports.addLegalCase = async (legalCase,projectid,userid,quoterid) => {
    try {
        for (const [index, obj] of legalCase.entries()) {
            const sql = "INSERT INTO project_execution_legal_case (projectid, userid, quoterid, caseno, partyname)" +
                " values (?,?,?,?,?)";
            const [result] = await writeConn.query(sql,
                [projectid, userid, quoterid, obj.caseno, obj.partyname]);
            if(index === (legalCase.length - 1)) {
                return true;
            }
        }
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.checkSaleAgreementByQuoterId = async (projectid,userid,quoterid) => {
    try {
        const sql = "SELECT id FROM project_execution_sale_agreement WHERE projectid = ? AND userid = ? AND quoterid = ?";
        const [result] = await writeConn.query(sql, [projectid, userid, quoterid]);
        return result.length > 0 ? result[0].id : null;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.addSaleAgreement = async (saledeed,saleagreement,projectid,userid,quoterid) => {
    try {
        // console.log(data)
        const sql = "INSERT INTO project_execution_sale_agreement (projectid, userid, quoterid, saledeed, saleagreement)" +
            " values (?,?,?,?,?)";
        const [result] = await writeConn.query(sql,
            [projectid, userid, quoterid, saledeed, saleagreement]);
        //console.log(result)
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.updateSaleAgreement = async (saledeed,saleagreement,id) => {
    try {
        // console.log(data)
        const sql = "UPDATE project_execution_sale_agreement SET saledeed = ? , saleagreement = ? WHERE id = ?";
        const [result] = await writeConn.query(sql,
            [saledeed,saleagreement,id]);
        //console.log(result)
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.updateExecutionHdr = async (submitedpersonname, signature, userid, projectid, quoterid) => {
    try {
        const currentDate = util.getCurrentTime(0);
        const sql = "UPDATE project_execution_hdr SET issubmited = 1, submitedpersonname = ?,signature=?, submitteddate = ?, submittedby = ? WHERE id = ?";
        const [result] = await writeConn.query(sql,
            [submitedpersonname, signature, currentDate, userid, quoterid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getLegalCase = async (data) => {
    try {
        const sql = "SELECT caseno,partyname FROM project_execution_legal_case" +
            " WHERE projectid= ? and userid= ? and quoterid= ?  and deleted=0";
        const [result] = await readConn.query(sql, [data.projectid,data.userid,data.quoterid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.getSaleAgreement = async (data) => {
    try {
        const sql = "SELECT saledeed,saleagreement FROM project_execution_sale_agreement" +
            " WHERE projectid= ? and userid= ? and quoterid= ?  and deleted=0";
        const [result] = await readConn.query(sql, [data.projectid,data.userid,data.quoterid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.getExecutionHdr = async (data) => {
    try {
        const sql = "SELECT issubmited, submitedpersonname,signature FROM project_execution_hdr" +
            " WHERE projectid= ? and userid= ? and id= ?  and deleted=0";
        const [result] = await readConn.query(sql, [data.projectid,data.userid,data.quoterid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
////Sayan


module.exports.getPhotoParticulars = async () => {
    try {
        const sql = "SELECT id, name FROM project_photo_particulars WHERE deleted=0";
        const [result] = await readConn.query(sql);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.savePhotoParticulars = async (data) => {
    try {
        const sql = "INSERT INTO quoterwise_building_photograph (executionhdrid, userid, projectid, groupid, groupposition, particularsid, imageName) VALUES (?, ?, ?, ?, ?, ?, ?)";
        const [result] = await writeConn.query(sql, [data.executionhdrid, data.userid, data.projectid, data.groupid, data.groupposition, data.particularid, data.fileName]);
        return result.insertId;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.deleteBuildingPhoto = async (data) => {
    try {
        const sql = "UPDATE quoterwise_building_photograph SET deleted = 1 WHERE id = ?";
        const [result] = await writeConn.query(sql, [data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.getBuildingPhotograph = async (data) => {
    try {
        const sql = "SELECT a.id, a.imageName, b.name as particularName FROM quoterwise_building_photograph a, project_photo_particulars b WHERE a.particularsid = b.id AND a.projectid = ? AND a.groupid= ? AND a.groupposition= ?  AND a.executionhdrid= ? AND a.deleted = 0";
        const [result] = await writeConn.query(sql, [data.projectid, data.groupid, data.groupposition, data.executionhdrid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}