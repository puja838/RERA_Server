const readConn = require('../../dbconnection').readPool;
const writeConn = require('../../dbconnection').writePool;
const util = require('../../utility/util');


module.exports.getStepList = async (data) => {
    try {
        const sql = "SELECT a.stepid, a.stepdesc, a.istableview FROM mst_steps a WHERE a.deleted = 0 AND a.steptype = 3 ORDER BY a.sequenceno ASC";
        const [result] = await readConn.query(sql, [data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getFieldListWithStep = async (data) => {
    try {
        const sql = "SELECT b.fielddesc, b.fielddisplaydesc, b.isrelated, b.relationtype, b.relationid, b.isproposed, b.daterange, b.sequence, b.id as stagetwofieldid" +
            " FROM stage_two_fields b WHERE b.stepid = ? " +
            " ORDER BY b.sequence ASC";
        const [result] = await readConn.query(sql, [data.stepid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.getFieldListByGroup = async (groupid, projectid) => {
    try {
        const sql = "SELECT a.groupid, a.groupname, b.id as groupmappingid, c.fieldid, c.fielddesc, c.fielddisplaydesc, c.controltype, c.controlvalue, b.sequence, b.rowname" +
            " FROM mst_fields_group a, mst_fields_group_map b, mst_fields c" +
            " WHERE a.groupid=? AND a.groupid=b.groupid AND b.fieldid = c.fieldid" +
            " AND b.fieldid in (SELECT fieldid FROM mst_entitytype_project_dtl WHERE groupid=? and entitytypeprojecthdrid = ? and projectfieldvalue = 'Yes')";
        const [result] = await readConn.query(sql, [groupid, groupid, projectid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getFieldValue = async (data) => {
    try {
        const tablename = data.updatestatus == 0 ? 'stage_two_fields_dtl_temp' : 'stage_two_fields_dtl';
        let sql = "SELECT fieldproposedvalue, startdate, enddate FROM " + tablename +
            " WHERE projectid = ? AND userid = ? AND stagetwofieldid = ? AND deleted = 0";
        if (data.relationid) {
            sql += " AND relationid = " + data.relationid;
        }
        if (data.fieldid) {
            sql += " AND fieldid = " + data.fieldid;
        }
        if (data.releatedgroupid) {
            sql += " AND releatedgroupid = " + data.releatedgroupid;
        }
        if (data.relatedfieldid) {
            sql += " AND relatedfieldid = " + data.relatedfieldid;
        }
        if (data.relatedgrouppos !== null && data.relatedgrouppos !== undefined) {
            sql += " AND relatedgrouppos = " + data.relatedgrouppos;
        }
        const [result] = await readConn.query(sql, [data.projectid, data.userid, data.stagetwofieldid]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return null;
    }
};

const checkExistance = async (data, flag='temp') => {
    try {
        let where = '';
        if (data.relationid) {
            where += " AND relationid = " + data.relationid;
        }
        if (data.fieldid) {
            where += " AND fieldid = " + data.fieldid;
        }
        if (data.releatedgroupid) {
            where += " AND releatedgroupid = " + data.releatedgroupid;
        }
        if (data.relatedfieldid && data.relatedgrouppos) {
            where += " AND relatedfieldid = " + data.relatedfieldid + " AND relatedgrouppos = " + data.relatedgrouppos;
        }
        let tableName = 'stage_two_fields_dtl_temp';
        if (flag === 'main') {
            tableName = 'stage_two_fields_dtl';
        }
        let sql = "SELECT id FROM " + tableName + " WHERE reraid = ? AND projectid = ? AND userid = ? AND stagetwofieldid = ? " + where;
        const [result] = await readConn.query(sql, [data.reraid, data.projectid, data.userid, data.stagetwofieldid]);
        return result.length > 0 ? result[0].id : 0;
    } catch (e) {
        util.createLog(e);
        return 0;
    }
}

module.exports.storeTemp = async (data) => {
    try {
        data.fieldproposedvalue = data.fieldproposedvalue !== ''? data.fieldproposedvalue : null;
        data.startdate = data.startdate !== ''? data.startdate : null;
        data.enddate = data.enddate !== ''? data.enddate : null;
        data.relationid = data.relationid !== ''? data.relationid : null;
        data.fieldid = data.fieldid !== ''? data.fieldid : null;
        data.releatedgroupid = data.releatedgroupid !== ''? data.releatedgroupid : null;
        data.relatedfieldid = data.relatedfieldid !== ''? data.relatedfieldid : null;
        data.relatedgrouppos = data.relatedgrouppos === ''? 0 : data.relatedgrouppos;
        const existId = await checkExistance(data);
        if (existId !== 0) {
            const sql = "UPDATE stage_two_fields_dtl_temp SET fieldproposedvalue = ?, startdate = ?, enddate = ? WHERE id = ?";
            const [result] = await readConn.query(sql,[data.fieldproposedvalue, data.startdate, data.enddate, existId]);
            return result;
        } else {
            let sql = "INSERT INTO stage_two_fields_dtl_temp (reraid, projectid, userid, stagetwofieldid, relationid, fieldid, fieldproposedvalue, startdate, enddate, releatedgroupid, relatedfieldid, relatedgrouppos)" +
                " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            const [result] = await readConn.query(sql, [data.reraid, data.projectid, data.userid, data.stagetwofieldid, data.relationid, data.fieldid, data.fieldproposedvalue, data.startdate, data.enddate, data.releatedgroupid, data.relatedfieldid, data.relatedgrouppos]);
            return result;
        }
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.submitForm = async (data) => {
    try {
        const sql = "SELECT * FROM stage_two_fields_dtl_temp where projectid = ?";
        const [fieldList] = await readConn.query(sql, [data.projectid]);
        for (const [index, obj] of fieldList.entries()) {
            const existId = await checkExistance(obj, 'main');
            if (existId !== 0) {
                const sql = "UPDATE stage_two_fields_dtl SET fieldproposedvalue = ?, startdate = ?, enddate = ? WHERE id = ?";
                const [result] = await writeConn.query(sql,[obj.fieldproposedvalue, obj.startdate, obj.enddate, existId]);
            } else {
                let sql = "INSERT INTO stage_two_fields_dtl (reraid, projectid, userid, stagetwofieldid, relationid, fieldid, fieldproposedvalue, startdate, enddate, releatedgroupid, relatedfieldid, relatedgrouppos)" +
                    " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
                const [result] = await writeConn.query(sql, [obj.reraid, obj.projectid, obj.userid, obj.stagetwofieldid, obj.relationid, obj.fieldid, obj.fieldproposedvalue, obj.startdate, obj.enddate, obj.releatedgroupid, obj.relatedfieldid, obj.relatedgrouppos]);
            }
            if (index === (fieldList.length - 1)) {
                return true;
            }
        }
        if (fieldList.length > 0) {
            return true;
        }
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getBuildingListOfProject = async (data) => {
    try {
        const sql = "SELECT groupid, fieldid, groupposition, projectfieldvalue as buildingName FROM mst_entitytype_project_dtl WHERE entitytypeprojecthdrid = ? AND fieldid = 44 AND groupid = 13";
        const [result] = await readConn.query(sql, [data.projectid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return [];
    }
}

module.exports.setProjectUpdationStatus = async (data) => {
    try {
        const sql = "UPDATE mst_entitytype_project_hdr SET afterapprovestatus=2 WHERE id = ?";
        const [result] = await writeConn.query(sql, [data.projectid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return [];
    }
}

module.exports.getProjectUpdationStatus = async (data) => {
    try {
        const sql = "SELECT afterapprovestatus FROM mst_entitytype_project_hdr WHERE id = ?";
        const [result] = await readConn.query(sql, [data.projectid]);
        return result.length > 0 ? result[0].afterapprovestatus : 0;
    } catch (e) {
        util.createLog(e);
        return 0;
    }
}

module.exports.getProjectStartEndDate = async (data) => {
    try {
        const sql = "SELECT fieldid, projectfieldvalue FROM mst_entitytype_project_dtl WHERE fieldid IN (496,497) AND stepid=1 AND entitytypeprojecthdrid=?";
        const [result] = await readConn.query(sql, [data.projectid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return [];
    }
}

module.exports.getProjectWebPageInfo = async (data) => {
    try {
        const sql = "SELECT webpagelink, projectprospectus, projectdesignimg FROM mst_entitytype_project_hdr WHERE id=?";
        const [result] = await readConn.query(sql, [data.projectid]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return null;
    }
}

module.exports.getQuoterList = async () => {
    try {
        const sql = "SELECT id, name, startmonth, endmonth FROM quater_mst WHERE deleted = 0";
        const [result] = await readConn.query(sql);
        return result;
    } catch (e) {
        util.createLog(e);
        return [];
    }
}

module.exports.insertQuoterListOfProject = async (data, quoterList) => {
    try {
        const sql = "INSERT INTO project_execution_hdr (userid, projectid, quoterid, quoterstartdate, quoterenddate) VALUES (?,?,?,?,?)";
        for(const [index, obj] of quoterList.entries()) {
            const [result] = await writeConn.query(sql, [data.userid, data.projectid, obj.quoterId, obj.startDate, obj.endDate]);
            if ((quoterList.length - 1) === index) {
                return true;
            }
        }
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.updateProjectWebPageInfo = async (data) => {
    try {
        const sql = "UPDATE mst_entitytype_project_hdr SET webpagelink = ?, projectprospectus = ?, projectdesignimg = ? WHERE id=?";
        const [result] = await readConn.query(sql, [data.webpagelink, data.projProspectus, data.projectDesignImg, data.projectid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return null;
    }
}

module.exports.insertStageTwoHdr = async (data) => {
    try {
        const sql = "INSERT INTO stage_two_hdr (reraid, projectid, isdeclarationaccept, submitpersonname, signature, submitedby) VALUES (?, ?, ?, ?, ?, ?)";
        const [result] = await readConn.query(sql, [data.reraid, data.projectid, data.isAcceptDeclaration, data.submitPersonName, data.signature, data.userid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getStageTwoHdr = async (data) => {
    try {
        const sql = "SELECT isdeclarationaccept, submitpersonname, signature FROM stage_two_hdr WHERE projectid = ?";
        const [result] = await readConn.query(sql, [data.projectid]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return null;
    }
};
module.exports.getBuildingGarageDetails = async (data,fieldid) => {
    try {
        const sql = "SELECT projectfieldvalue,groupposition,fieldid FROM mst_entitytype_project_dtl where stepid =16 and entitytypeprojecthdrid =? and groupid =13 and fieldid in(?) and deleted=0  order by groupposition";
        const [result] = await readConn.query(sql, [data.projectid,fieldid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return null;
    }
};

module.exports.getApartmentDetails = async (data,fieldgroupid,groupposition,fieldid) => {
    try {
        const sql = "SELECT projectfieldvalue,fieldid,groufieldpposition FROM mst_entitytype_project_dtl where stepid =16 and entitytypeprojecthdrid =? and groupid =13 and fieldgroupid =? and groupposition=? and fieldid in (?) and deleted=0  order by groufieldpposition;";
        const [result] = await readConn.query(sql, [data.projectid,fieldgroupid,groupposition,fieldid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return null;
    }
};
module.exports.getMixedDetails = async (data,groupposition) => {
    try {
        const sql = "SELECT projectfieldvalue,fieldid FROM mst_entitytype_project_dtl where stepid =16 and entitytypeprojecthdrid =? and groupid =13 and fieldgroupid=29 and groupposition=? and fieldid in(872) and deleted=0  order by groufieldpposition;";
        const [result] = await readConn.query(sql, [data.projectid,groupposition]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.getBookedDetails = async (data,fieldgroupid,groupposition,fieldgrouppos,groupid) => {
    try {
        const sql = "SELECT bookedunit,soldunit FROM project_inventory_dtl where projectid =? and  groupid =? and fieldgroupid =? and grouppos=? and fieldgrouppos =? and deleted=0  ;";
        const [result] = await readConn.query(sql, [data.projectid,groupid,fieldgroupid,groupposition,fieldgrouppos]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.getBookedGarageDetails = async (data,groupposition,groupid) => {
    try {
        const sql = "SELECT bookedunit,soldunit FROM project_inventory_dtl where projectid =? and  groupid =?  and grouppos=? and deleted=0  ;";
        const [result] = await readConn.query(sql, [data.projectid,groupid,groupposition]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

const getInsertInventoryData = async (projectId, groupId, groupPos, fieldgroupid, fieldgrouppos, buildingname, unittype, coverarea, unitno, quoterId) => {
    try {
        let where = '';
        if (fieldgroupid) {
            where += ' AND fieldgroupid = ' + fieldgroupid
        }
        if (fieldgrouppos) {
            where += ' AND fieldgrouppos = ' + fieldgrouppos
        }
        if (unittype) {
            where += " AND unittype = '" + unittype + "'"
        }
        if (coverarea) {
            where += " AND coverarea = " + coverarea
        }
        if (quoterId) {
            where += " AND quoterid = " + quoterId
        }
        const sql = "SELECT id FROM project_inventory_dtl WHERE projectid = ? AND groupid = ? AND grouppos = ? AND buildingname = ? AND unitno = ? " + where;
        const [result] = await readConn.query(sql, [projectId, groupId, groupPos, buildingname, unitno]);
        return result.length > 0 ? result[0].id : null;
    } catch (e) {
        util.createLog(e);
        return null;
    }
}

module.exports.saveInventoryBuildingData = async (buildings, reraId, projectId, userId, quoterId, type) => {
    try {
        const sql = "INSERT INTO project_inventory_dtl (reraid, projectid, userid, quoterid, groupid, grouppos, fieldgroupid, fieldgrouppos, buildingname, unittype, coverarea, unitno, promoterunit, bookedunit, soldunit, type)" +
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const usql = "UPDATE project_inventory_dtl SET bookedunit = ?, soldunit = ? WHERE id = ?";
        for (const [index, obj] of buildings.entries()) {

            const rowId = await getInsertInventoryData(projectId, obj.groupid, obj.groupposition, obj.fieldgroupid, obj.groufieldpposition, obj.build, obj.utype, obj.care, obj.sapart, quoterId);
            if (rowId) {
                const [result] = await writeConn.query(usql, [obj.bookedunit, obj.soldunit, rowId]);
            } else {
                const [result] = await writeConn.query(sql, [reraId, projectId, userId, quoterId, obj.groupid, obj.groupposition, obj.fieldgroupid, obj.groufieldpposition, obj.build, obj.utype, obj.care, obj.sapart, obj.sprom, obj.bookedunit, obj.soldunit, type]);
            }
            if (index === (buildings.length - 1)) {
                return true;
            }
        }
    } catch (e) {
        util.createLog(e);
        return null;
    }
}

module.exports.saveInventoryGarageData = async (buildings, reraId, projectId, userId, quoterId, type) => {
    try {
        const sql = "INSERT INTO project_inventory_dtl (reraid, projectid, userid, quoterid, groupid, grouppos, fieldgroupid, fieldgrouppos, buildingname, unitno, promoterunit, bookedunit, soldunit, type)" +
            " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const usql = "UPDATE project_inventory_dtl SET bookedunit = ?, soldunit = ? WHERE id = ?";
        for (const [index, obj] of buildings.entries()) {
            const rowId = await getInsertInventoryData(projectId, obj.groupid, obj.groupposition, obj.fieldgroupid, obj.groufieldpposition, obj.build, null, null, obj.garage, quoterId);
            if (rowId) {
                const [result] = await writeConn.query(usql, [obj.bookedunit, obj.soldunit, rowId]);
            } else {
                const [result] = await writeConn.query(sql, [reraId, projectId, userId, quoterId, obj.groupid, obj.groupposition, obj.fieldgroupid, obj.groufieldpposition, obj.build, obj.garage, obj.gprom, obj.bookedunit, obj.soldunit, type]);
            }
            if (index === (buildings.length - 1)) {
                return true;
            }
        }
    } catch (e) {
        util.createLog(e);
        return null;
    }
}
