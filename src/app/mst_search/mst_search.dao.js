const readConn = require('../../dbconnection').readPool
const writeConn = require('../../dbconnection').writePool
const util = require('../../utility/util');
const config 			    =    require('./mst_search.config');

module.exports.mstSearchByRegistrationNo = async (data) => {
    try {
        const sql = "SELECT a.projectuid, a.particularprofileid, b.id, b.projectfieldvalue, b.userid, b.entertime, b.approve, b.approvedatetime, b.approvalremarks, b.approveuserid, " +
        "b.reraid, b.entityid, b.entitytypeid, b.stepid, b.entitytypeprojecthdrid, b.fieldid, b.groupid, b.groupposition, b.fieldgroupid, b.groufieldpposition, " +
        "b.issystemverified, b.isverified FROM mst_entitytype_project_hdr a, mst_entitytype_project_dtl b where " +
        "a.projectuid=? and a.particularprofileid=b.userid and a.id=b.entitytypeprojecthdrid and a.projectfieldvalue=b.projectfieldvalue and " +
        "a.isdelete='0'";
        const [result] = await readConn.query(sql,[data.search]);
        return result.length>0?result:null;
    } catch (e) {
        util.createLog(e);
        return null;
    }
}

module.exports.mstSearchByProjectName = async (data, projectFieldId) => {
    try {
        const sql = "SELECT id, projectfieldvalue, userid as particularprofileid, reraid, entityid, entitytypeid, stepid, entitytypeprojecthdrid, " +
        "fieldid, groupid, groupposition, fieldgroupid, groufieldpposition FROM mst_entitytype_project_dtl WHERE projectfieldvalue like ? AND fieldid = ? AND groupid is null AND deleted = '0'";
        const [result] = await readConn.query(sql,['%'+data.search+'%', projectFieldId]);
        return result.length>0?result:null;
    } catch (e) {
        util.createLog(e);
        return null;
    }
}

module.exports.mstSearchByProjectNameFromProjectHdr = async (data, projectFieldId) => {
    try {
        const sql = "SELECT * FROM mst_entitytype_project_hdr WHERE projectfieldvalue like ? AND isdelete = '0'";
        const [result] = await readConn.query(sql,['%'+data.search+'%', projectFieldId]);
        return result.length>0?result:null;
    } catch (e) {
        util.createLog(e);
        return null;
    }
}

module.exports.getPromoterName = async (userid) => {
    try {
        const sql = "SELECT username as username FROM mst_user WHERE userid=?";
        const [result] = await readConn.query(sql,[userid]);
        return result.length>0?result[0].username:null;
    } catch (e) {
        util.createLog(e);
        return null;
    }
}



module.exports.mstSearchByPromoterName = async (data, profileFieldId) => {
    try {
        const sql = "SELECT * FROM mst_entity_profile_values_dtl where fieldid=? and fieldvalue like ? and groupid is null and deleted='0'";
        const [result] = await readConn.query(sql,[profileFieldId, "%"+data.search+"%"]);
        return result.length>0?result:null;
    } catch (e) {
        util.createLog(e);
        return null;
    }
}

module.exports.getSearchProjectDetails = async (data, result1, fieldID) => {
    try {
        const sql = "SELECT a.id, a.projectfieldvalue, a.userid, a.entitytypeprojecthdrid, d.projectuid, b.userid, b.username, b.useremail, b.usermobile "
        +"FROM mst_entitytype_project_dtl a, mst_user b, mst_entitytype_project_hdr d WHERE a.projectfieldvalue like ? AND a.userid=b.userid "
        +"AND a.entitytypeprojecthdrid=d.id AND a.fieldid = ? AND a.groupid is null AND a.deleted = 0";
        const [result] = await readConn.query(sql,[data.search, fieldID]);
        return result.length>0?result:null;
    } catch (e) {
        util.createLog(e);
        return null;
    }
}

// module.exports.getSearchProfileDetails = async (data) => {
//     try {
//         const sql = "SELECT userid FROM mst_user WHERE userpan = ? AND deleted = 0";
//         const [result] = await readConn.query(sql,[data.userpan]);
//         return result.length > 0
//     } catch (e) {
//         util.createLog(e);
//         return false;
//     }
// }

module.exports.getProjectDetailsUsingUserId = async (userId) => {
    try {
        const sql = "SELECT projectfieldvalue FROM mst_entitytype_project_hdr where particularprofileid=? and isdelete='0' and iscomplete='1'";
        const [result] = await readConn.query(sql,[userId]);
        return result.length>0?result:null;
    } catch (e) {
        util.createLog(e);
        return null;
    }
}

module.exports.mstSearchByPastProjects = async (data, pastproject) => {
    try {
        const sql = "SELECT entitytypeprojecthdrid as id, projectfieldvalue, userid as particularprofileid, reraid, entityid, entitytypeid, stepid, " +
        "fieldid, groupid, groupposition, fieldgroupid, groufieldpposition FROM mst_entitytype_project_dtl WHERE projectfieldvalue like ? AND fieldid=? AND groupid=? AND deleted = '0'";
        const [result] = await readConn.query(sql,['%'+data.search+'%', pastproject.fieldid, pastproject.groupid]);
        return result.length>0?result:null;
    } catch (e) {
        util.createLog(e);
        return null;
    }
}

module.exports.getProjectRespondentPositions = async (data) => {
    try {
        const sql = "SELECT fieldvalue, groupposition FROM mst_entitytype_project_dtl_temp WHERE groupid=30 AND fieldid = 693 AND entitytypeprojecthdrid=? AND fieldvalue = ?";
        const [result] = await readConn.query(sql,[data.projectid, data.type]);
        return result;
    } catch (e) {
        util.createLog(e);
        return [];
    }
}

module.exports.getProjectLandOwnerShipTitleGroup = async (data) => {
    try {
        const sql = "SELECT fieldvalue, groupposition FROM mst_entitytype_project_dtl_temp WHERE groupid=30 AND fieldid = 694 AND entitytypeprojecthdrid=? AND groupposition=?";
        const [result] = await readConn.query(sql,[data.projectid, data.groupposition]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return [];
    }
}

module.exports.getFieldGroupDetails = async (data) => {
    try {
        const sql = "SELECT a.fieldid, b.fielddesc, a.fieldvalue, a.groupposition, a.groufieldpposition" +
            " FROM mst_entitytype_project_dtl_temp a, mst_fields b" +
            " WHERE a.groupid=30 AND a.fieldgroupid = ? AND a.entitytypeprojecthdrid=? AND a.groupposition=? AND a.fieldid=b.fieldid";
        const [result] = await readConn.query(sql,[data.fieldgroupid, data.projectid, data.groupposition]);
        // console.log(result);
        return result;
    } catch (e) {
        util.createLog(e);
        return [];
    }
}

module.exports.getDirectorDetails = async (data) => {
    try {
        const sql = "SELECT a.fieldid, b.fielddesc, a.fieldvalue, a.groupposition" +
            " FROM mst_entity_profile_values_dtl a, mst_entity_profile_fields b" +
            " WHERE a.userid = ? AND a.groupid = 8 AND a.fieldid=b.fieldid";
        const [result] = await readConn.query(sql,[data.userid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return [];
    }
};

module.exports.getLandownerDetails = async (projectId) => {
    try {
        const sql = "select fieldid, projectfieldvalue as fieldvalue, groupid, fieldgroupid, CONCAT(groupposition, groufieldpposition) as pos from mst_entitytype_project_dtl where stepid=6 and fieldid IN (973, 764, 373) and entitytypeprojecthdrid=? AND groupid = 47 AND fieldgroupid = 48";
        const [result] = await readConn.query(sql, [projectId]);
        return result;
    } catch (e) {
        util.createLog(e);
        return [];
    }
};

module.exports.getGroupValueDetails = async (data) => {
    try {
        const sql = "SELECT a.fieldid, a.fieldvalue, a.groupposition " +
            " FROM mst_entity_profile_values_dtl a " +
            " WHERE a.userid = ? AND a.groupid = ?";
        const [result] = await readConn.query(sql,[data.userid, data.groupid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return [];
    }
};

