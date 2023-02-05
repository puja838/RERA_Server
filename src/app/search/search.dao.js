const readConn = require('../../dbconnection').readPool;
const writeConn = require('../../dbconnection').writePool;
const util = require('../../utility/util');

const PROJECT_LOCATION_FIELD_ID = 387;
const PROJECT_CATEGORY_FIELD_ID = 1;

module.exports.searchProject = async (data) => {
    // console.log(data)
    try {
        data.projectOffset = data.projectOffset === '' ? 0 : data.projectOffset;
        let sql = "SELECT distinct a.projectuid,a.projectfieldvalue projectname,b.projectfieldvalue,d.projectfieldvalue Address_Line_one FROM mst_entitytype_project_hdr a,mst_entitytype_project_dtl b,mst_entitytype_project_dtl d ";
        for (let i = 0; i < data.queries.length; i++) {
            sql = sql + ",mst_entitytype_project_dtl c" + i;
        }
        sql = sql + " where a.reraid=? ";
        if (data.keyword && data.keyword !== '') {
            sql = sql + "   and a.projectfieldvalue like ? ";
        }
        sql = sql + " and a.isapproved not in (2,4)  and a.isdelete=0 and a.id=b.entitytypeprojecthdrid and b.fieldid=" + PROJECT_CATEGORY_FIELD_ID + " and b.deleted=0 and a.id=d.entitytypeprojecthdrid and d.fieldid=" + PROJECT_LOCATION_FIELD_ID + " and d.deleted=0 ";
        for (let i = 0; i < data.queries.length; i++) {
            if (data.queries[i].key === 'carpet') {
                sql = sql + " and a.id=c" + i + ".entitytypeprojecthdrid and c" + i + ".stepid=? and c" + i + ".fieldid=? and c" + i + ".projectfieldvalue >=? and c" + i + ".projectfieldvalue <=? and c" + i + ".deleted=0";
            } else if (data.queries[i].key === 'category') {
                sql = sql + " and a.id=c" + i + ".entitytypeprojecthdrid and c" + i + ".stepid=? and c" + i + ".fieldid=? and c" + i + ".projectfieldvalue like ? and c" + i + ".deleted=0";
            } else {
                sql = sql + " and a.id=c" + i + ".entitytypeprojecthdrid and c" + i + ".stepid=? and c" + i + ".fieldid=? and c" + i + ".projectfieldvalue in (?) and c" + i + ".deleted=0";
            }
        }
        sql = sql + " limit ?,?;";
        let params = [data.reraid];
        if (data.keyword && data.keyword !== '') {
            params.push('%' + data.keyword + '%')
        }
        for (let i = 0; i < data.queries.length; i++) {
            params.push(data.queries[i].stepid);
            params.push(data.queries[i].fieldid);
            if (data.queries[i].key === 'carpet') {
                params.push(data.queries[i].value);
                params.push(data.queries[i].value1);
            } else if (data.queries[i].key === 'category') {
                params.push("%" + data.queries[i].value + "%");
            } else {
                params.push(data.queries[i].value);
            }
        }
        params.push(Number(data.projectOffset), Number(data.limit));
        const [result] = await readConn.query(sql, params);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.searchProjectCount = async (data) => {
    // console.log(data)
    try {
        let sql = "SELECT count(distinct a.id) projectcount FROM mst_entitytype_project_hdr a,mst_entitytype_project_dtl b,mst_entitytype_project_dtl d ";
        for (let i = 0; i < data.queries.length; i++) {
            sql = sql + ",mst_entitytype_project_dtl c" + i;
        }
        sql = sql + " where a.reraid=? ";
        if (data.keyword && data.keyword !== '') {
            sql = sql + "   and a.projectfieldvalue like ? ";
        }
        sql = sql + " and a.isapproved not in (2,4)  and a.isdelete=0 and a.id=b.entitytypeprojecthdrid and b.fieldid=" + PROJECT_CATEGORY_FIELD_ID + " and b.deleted=0 and a.id=d.entitytypeprojecthdrid and d.fieldid=" + PROJECT_LOCATION_FIELD_ID + " and d.deleted=0 ";
        for (let i = 0; i < data.queries.length; i++) {
            if (data.queries[i].key === 'carpet') {
                sql = sql + " and a.id=c" + i + ".entitytypeprojecthdrid and c" + i + ".stepid=? and c" + i + ".fieldid=? and c" + i + ".projectfieldvalue >=? and c" + i + ".projectfieldvalue <=? and c" + i + ".deleted=0";
            } else if (data.queries[i].key === 'category') {
                sql = sql + " and a.id=c" + i + ".entitytypeprojecthdrid and c" + i + ".stepid=? and c" + i + ".fieldid=? and c" + i + ".projectfieldvalue like ? and c" + i + ".deleted=0";
            } else {
                sql = sql + " and a.id=c" + i + ".entitytypeprojecthdrid and c" + i + ".stepid=? and c" + i + ".fieldid=? and c" + i + ".projectfieldvalue in (?) and c" + i + ".deleted=0";
            }
        }
        let params = [data.reraid];
        if (data.keyword && data.keyword !== '') {
            params.push('%' + data.keyword + '%')
        }
        for (let i = 0; i < data.queries.length; i++) {
            params.push(data.queries[i].stepid);
            params.push(data.queries[i].fieldid);
            if (data.queries[i].key === 'carpet') {
                params.push(data.queries[i].value);
                params.push(data.queries[i].value1);
            } else if (data.queries[i].key === 'category') {
                params.push("%" + data.queries[i].value + "%");
            } else {
                params.push(data.queries[i].value);
            }
        }
        const [result] = await readConn.query(sql, params);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.searchPromoter = async (data) => {
    // console.log(data)
    try {
        data.promoterOffset = data.promoterOffset === '' ? 0 : data.promoterOffset;
        let sql = "SELECT distinct a.userno,a.username,a.useremail,a.usermobile,b.entitytypedesc FROM mst_user a,mst_entity_type b ";
        for (let i = 0; i < data.promqueries.length; i++) {
            sql = sql + ",mst_entity_profile_values_dtl c" + i;
        }
        sql = sql + " where a.reraid=?  ";
        if (data.keyword && data.keyword !== '') {
            sql=sql+" and a.username like ? "
        }
        sql = sql +   " and a.userno is not null and a.entitytypeid is not null and a.userpan is not null and a.isactive=1 and a.entitytypeid=b.entitytypeid and a.deleted=0 and b.deleted=0 ";
        for (let i = 0; i < data.promqueries.length; i++) {
            sql = sql + " and a.userid=c" + i + ".userid and c" + i + ".stepid=? and c" + i + ".fieldid=? and c" + i + ".fieldvalue in (?) and c" + i + ".deleted=0";
        }
        sql = sql + " limit ?,?;";
        let params = [data.reraid];
        if (data.keyword && data.keyword !== '') {
            params.push('%' + data.keyword + '%')
        }
        for (let i = 0; i < data.promqueries.length; i++) {
            params.push(data.promqueries[i].stepid);
            params.push(data.promqueries[i].fieldid);
            params.push(data.promqueries[i].value);
        }
        params.push(Number(data.promoterOffset), Number(data.limit));
        const [result] = await readConn.query(sql, params);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.searchPromoterCount = async (data) => {
    // console.log(data)
    try {
        let sql = "SELECT Count(distinct a.userid) usercount FROM mst_user a,mst_entity_type b ";
        for (let i = 0; i < data.promqueries.length; i++) {
            sql = sql + ",mst_entity_profile_values_dtl c" + i;
        }
        sql = sql + " where a.reraid=?  ";
        if (data.keyword && data.keyword !== '') {
            sql=sql+" and a.username like ? "
        }
        sql = sql +   " and a.userno is not null and a.entitytypeid is not null and a.userpan is not null and a.isactive=1 and a.entitytypeid=b.entitytypeid and a.deleted=0 and b.deleted=0 ";
        for (let i = 0; i < data.promqueries.length; i++) {
            sql = sql + " and a.userid=c" + i + ".userid and c" + i + ".stepid=? and c" + i + ".fieldid=? and c" + i + ".fieldvalue in (?) and c" + i + ".deleted=0";
        }
        // sql = sql + " limit ?,?;";
        let params = [data.reraid];
        if (data.keyword && data.keyword !== '') {
            params.push('%' + data.keyword + '%')
        }
        for (let i = 0; i < data.promqueries.length; i++) {
            params.push(data.promqueries[i].stepid);
            params.push(data.promqueries[i].fieldid);
            params.push(data.promqueries[i].value);
        }
        // params.push(Number(data.promoterOffset), Number(data.limit));
        const [result] = await readConn.query(sql, params);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchProjectType = async (data) => {
    // console.log(data)
    try {
        const sql = "SELECT controlvalue FROM mst_fields where reraid=? and fieldid=1 and deleted=0 ;";
        const [result] = await readConn.query(sql, [data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.maxFieldValue = async (data) => {
    // console.log(data)
    try {
        const sql = "select max(projectfieldvalue) maximum from mst_entitytype_project_dtl where reraid=? and stepid =? and fieldid =? and deleted=0;";
        const [result] = await readConn.query(sql, [data.reraid, data.stepid, data.fieldid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchProjectValueDetails = async (data) => {
    // console.log(data)
    try {
        let sql = "select projectfieldvalue,fieldid,groupposition from mst_entitytype_project_dtl where reraid=? and entitytypeprojecthdrid=? and stepid =? and fieldid in(?)";
        if (data.groupid) {
            sql = sql + " and groupid=? ";
        }
        sql = sql + " and deleted=0 ";
        if (data.groupid) {
            sql = sql + " order by groupposition"
        }
        let params = [data.reraid, data.projectid, data.stepid, data.fieldid];
        if (data.groupid) {
            params.push(data.groupid)
        }
        const [result] = await readConn.query(sql, params);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchProfileValueDetails = async (data) => {
    // console.log(data)
    try {
        let sql = "select fieldvalue projectfieldvalue,fieldid from mst_entity_profile_values_dtl where reraid=? and userid=? and stepid =? and fieldid in(?)";
        if (data.groupid) {
            sql = sql + " and groupid=? "
        }
        sql = sql + " and deleted=0;";
        let params = [data.reraid, data.promoterid, data.stepid, data.fieldid];
        if (data.groupid) {
            params.push(data.groupid)
        }
        const [result] = await readConn.query(sql, params);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchProjectDetails = async (data) => {
    try {
        const sql = "select a.id,a.registrationno,a.projectfieldvalue,a.particularprofileid,coalesce(a.certificate,'') certificate,coalesce(a.approvaltime,'') approvaltime,b.entitytypeid ,c.entitytypedesc from mst_entitytype_project_hdr a,mst_user b,mst_entity_type c where a.reraid=? and a.projectuid =? and a.particularprofileid=b.userid and b.entitytypeid=c.entitytypeid and  a.isdelete=0 and  c.deleted=0;";
        const [result] = await readConn.query(sql, [data.reraid, data.projectuid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchCommonAmenities = async (data) => {
    try {
        const sql = "SELECT a.fieldid,b.fielddisplaydesc FROM mst_entitytype_project_dtl a,mst_fields b where a.reraid=? and a.fieldid=b.fieldid and a.entitytypeprojecthdrid =? and a.stepid =?  and a.groupid =? and a.projectfieldvalue='Yes' and a.deleted=0 and b.deleted=0;;";
        const [result] = await readConn.query(sql, [data.reraid, data.projectid, data.stepid, data.groupid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchEngineerDetails = async (data) => {
    try {
        const sql = "select a.projectfieldvalue,b.fielddisplaydesc from mst_entitytype_project_dtl a,mst_fields b where a.reraid=? and a.entitytypeprojecthdrid=? and a.stepid =? and groupid=? and a.fieldid in (?) and a.fieldid=b.fieldid  and a.deleted=0 and b.deleted=0  order by a.groupposition,a.fieldid ;";
        const [result] = await readConn.query(sql, [data.reraid, data.projectid, data.stepid, data.groupid, data.fieldid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchAvailableUnit = async (data) => {
    try {
        let sql = "SELECT bookedunit FROM project_inventory_dtl where projectid =? and ";
        if (data.quoterid) {
            sql = sql + " quoterid=? and ";
        }
        sql = sql + "deleted=0 ;";
        let params = [data.projectid];
        if (data.quoterid) {
            params.push(data.quoterid)
        }
        const [result] = await readConn.query(sql, params);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchMaxQuarterId = async (data) => {
    try {
        const sql = "SELECT max(quoterid) quoterid FROM project_inventory_dtl where projectid=? and deleted=0;";
        const [result] = await readConn.query(sql, [data.projectid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchDocuments = async (data) => {
    try {
        let sql = "select a.fieldid,a.projectfieldvalue,b.fielddisplaydesc,a.groupposition from mst_entitytype_project_dtl a,mst_fields b where a.reraid=? and a.entitytypeprojecthdrid=? and a.stepid =?";
        if (data.groupid) {
            sql = sql + " and a.groupid =? "
        }
        if (data.fieldid) {
            sql = sql + " and a.fieldid in (?) "
        }
        sql = sql + " and a.fieldid=b.fieldid and b.fieldtype=5 and a.deleted=0 and b.deleted=0";
        if (data.groupid) {
            sql = sql + " order by groupposition ";
        }
        let params = [data.reraid, data.projectid, data.stepid];
        if (data.groupid) {
            params.push(data.groupid)
        }
        if (data.fieldid) {
            params.push(data.fieldid)
        }
        const [result] = await readConn.query(sql, params);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchPromoterDetails = async (data) => {
    // console.log(data)
    try {
        let sql = "SELECT distinct a.userid,a.username,a.useremail,a.usermobile,b.entitytypedesc,a.entitytypeid FROM mst_user a,mst_entity_type b where a.reraid=? and a.userno = ? and a.isactive=1 and a.entitytypeid=b.entitytypeid and a.deleted=0 and b.deleted=0";
        const [result] = await readConn.query(sql, [data.reraid, data.userno]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchProjectByStatus = async (data) => {
    // console.log(data)
    try {
        let sql = "SELECT distinct a.projectuid,a.projectfieldvalue projectname,b.projectfieldvalue,d.projectfieldvalue Address_Line_one FROM mst_entitytype_project_hdr a,mst_entitytype_project_dtl b,mst_entitytype_project_dtl d  where a.reraid=? and a.particularprofileid=? and a.progressstatus in(?)  and a.isapproved not in (2,4)  and a.isdelete=0 and a.id=b.entitytypeprojecthdrid and b.fieldid=" + PROJECT_CATEGORY_FIELD_ID + " and b.deleted=0 and a.id=d.entitytypeprojecthdrid and d.fieldid=" + PROJECT_LOCATION_FIELD_ID + " and d.deleted=0 limit ?,?;";

        const [result] = await readConn.query(sql, [data.reraid, data.promoterid, data.status, Number(data.offset), Number(data.limit)]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.fetchProjectCountByStatus = async (data) => {
    // console.log(data)
    try {
        let sql = "SELECT count(distinct a.id) projectcount FROM mst_entitytype_project_hdr a,mst_entitytype_project_dtl b,mst_entitytype_project_dtl d  where a.reraid=? and a.particularprofileid=? and a.progressstatus in(?)  and a.isapproved not in (2,4)  and a.isdelete=0 and a.id=b.entitytypeprojecthdrid and b.fieldid=" + PROJECT_CATEGORY_FIELD_ID + " and b.deleted=0 and a.id=d.entitytypeprojecthdrid and d.fieldid=" + PROJECT_LOCATION_FIELD_ID + " and d.deleted=0";

        const [result] = await readConn.query(sql, [data.reraid, data.promoterid, data.status]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.fetchProfileValueGroupWise = async (data) => {
    // console.log(data)
    if (data.groupid) {
        try {
            let sql = "SELECT fieldvalue,groupposition,fieldid FROM mst_entity_profile_values_dtl where userid=? and stepid=? and groupid= ? and fieldid in(?)  order by groupposition";
            const [result] = await readConn.query(sql, [data.userid, data.stepid, data.groupid, data.fieldid]);
            return result;
        } catch (e) {
            util.createLog(e);
            return false;
        }
    } else {
        return [];
    }
};
module.exports.getPastProjectByUser = async (data) => {
    try {
        let sql = "SELECT projectfieldvalue,progressstatus,id FROM mst_entitytype_project_hdr where reraid=? and particularprofileid=? and id !=? and projectfieldvalue is not null and isdelete= 0";
        const [result] = await readConn.query(sql, [data.reraid, data.userid, data.projectid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.getProjectValueByFieldPosition = async (data) => {
    try {
        let sql = "SELECT projectfieldvalue,fieldid,groufieldpposition FROM mst_entitytype_project_dtl where reraid=? and entitytypeprojecthdrid=? and stepid=? and groupid=? and fieldid in (?) and groupposition=? and fieldgroupid=? and deleted=0 order by groupposition,groufieldpposition;";
        const [result] = await readConn.query(sql, [data.reraid, data.projectid, data.stepid, data.groupid, data.fieldid, data.groupposition, data.fieldgroupid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};
module.exports.getInventoryDetailsForUnit = async (data) => {
    try {
        let sql = "SELECT bookedunit,soldunit FROM project_inventory_dtl where reraid=? and projectid=? and groupid=?  and grouppos=? and fieldgroupid=? and fieldgrouppos=? and deleted=0 order by id desc limit 1;";
        const [result] = await readConn.query(sql, [data.reraid, data.projectid, data.groupid, data.groupposition, data.fieldgroupid, data.fieldgrouppos]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
};