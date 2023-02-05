const readConn = require('../../dbconnection').readPool
const writeConn = require('../../dbconnection').writePool
const util = require('../../utility/util');

module.exports.getListForProject = async (data) => {
    try {
        const sql = "SELECT distinct(d.id) as vefificationid, a.id,a.strfieldid,c.fielddisplaydesc as strfieldname, a.filefieldid,"+
                    " b.fielddisplaydesc as filefieldname,a.fromwhich,a.onlyfile,d.keywords  FROM systemvefificationfields a LEFT JOIN mst_fields c"+
                    " ON a.strfieldid = c.fieldid LEFT JOIN vefificationfieldkeywords d ON a.filefieldid= d.fieldid,mst_fields b  WHERE a.reraid = ? "+
                    "AND a.deleted = 0 AND a.filefieldid = b.fieldid AND a.fromwhich = ? order by a.id;";
        const [result] = await readConn.query(sql, [data.reraid,data.fromwhich]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getListForProfile = async (data) => {
    try {
        const sql = "SELECT distinct(d.id) as vefificationid, a.id,a.strfieldid,c.fielddisplaydesc as strfieldname,"+
                    " a.filefieldid, b.fielddisplaydesc as filefieldname,a.fromwhich,a.onlyfile,d.keywords  FROM"+
                    " systemvefificationfields a LEFT JOIN mst_entity_profile_fields c ON a.strfieldid = c.fieldid LEFT JOIN"+
                    " vefificationfieldkeywords d ON a.filefieldid= d.fieldid,mst_entity_profile_fields b  WHERE a.reraid = ? AND a.deleted = 0"+
                    " AND a.filefieldid = b.fieldid AND a.fromwhich = ? order by a.id;"
        const [result] = await readConn.query(sql, [data.reraid,data.fromwhich]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.getFieldNameForProject = async (data) => {
    try {
        const sql = "SELECT fieldid,fielddisplaydesc FROM mst_fields  WHERE reraid=? AND deleted =0;";
        const [result] = await readConn.query(sql, [data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.getFieldNameForProfile = async (data) => {
    try {
        const sql = "SELECT fieldid,fielddisplaydesc FROM mst_entity_profile_fields  WHERE reraid=? AND deleted =0;";
        const [result] = await readConn.query(sql, [data.reraid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.addwithfile = async (data)=>{
    try {
        console.log("addwithfile",data)
        const sql = "INSERT INTO vefificationfieldkeywords (fieldid,keywords,reraid) values (?,?,?);"
        data.filefieldid = data.filefieldid == 0 ? null : data.filefieldid;
        data.keyword = data.keyword == '' ? null : data.keyword;
        const [result] = await writeConn.query(sql,[data.filefieldid, data.filekeyword, data.reraid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.addwithoutfile = async (data) => {
    try {
        const sql = "INSERT INTO systemvefificationfields (strfieldid,filefieldid,fromwhich,onlyfile,reraid) values (?,?,?,?,?);"
        data.strfieldid = data.strfieldid == 0 ? null : data.strfieldid;
        data.filefieldid = data.filefieldid == 0 ? null : data.filefieldid;
        data.fromwhich = data.fromwhich == 0 ? null : data.fromwhich;
        data.onlyfile = data.onlyfile == 0 ? null : data.onlyfile;
        const [result] = await writeConn.query(sql,[data.strfieldid, data.filefieldid, data.fromwhich, data.onlyfile, data.reraid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.checkwithoutfile = async (data) => {
    try {
        // let where = '';
        // if (data.id !== 0) {
        //     where += " AND id != " + data.id;
        // }
        const sql = "SELECT id FROM systemvefificationfields WHERE deleted = 0 AND strfieldid = ? AND filefieldid = ? AND fromwhich=?;";
        const [result] = await  readConn.query(sql,[data.strfieldid, data.filefieldid, data.fromwhich]);
        util.createLog(result.length);
        return result.length > 0;
    } catch (e) {
        util.createLog(e);
        return false;
    }
    
}

module.exports.checkwithfile = async (data) => {
    try {
       console.log('checkwithfile',data)
        const sql = "SELECT id FROM vefificationfieldkeywords WHERE deteted = 0 AND fieldid = ? AND keywords = ?;";
        const [result] = await  readConn.query(sql,[data.filefieldid, data.filekeyword]);
        util.createLog(result.length);
        return result.length > 0;
    } catch (e) {
        util.createLog(e);
        return false;
    }
    
}

module.exports.updatewithfile = async (data) => {
    try {
        util.createLog(data);
        const sql = "UPDATE vefificationfieldkeywords SET fieldid = ?,keywords = ?  WHERE id = ?";
        const [result] = await writeConn.query(sql, [data.filefieldid, data.filekeyword, data.vefificationid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.updatewithoutfile = async (data) => {
    try {
        util.createLog(data);
        const sql = "UPDATE systemvefificationfields SET strfieldid = ?,filefieldid = ?,fromwhich = ?,onlyfile = ? WHERE id = ?";
        console.log(data.strfieldid, data.filefieldid, data.fromwhich, data.onlyfile, data.id)
        const [result] = await writeConn.query(sql, [data.strfieldid, data.filefieldid, data.fromwhich, data.onlyfile, data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.deletewithfile = async (data) => {
    try {
        const sql = "UPDATE vefificationfieldkeywords SET deteted = '1' WHERE id = ?";
        const [result] = await writeConn.query(sql, [data.vefificationid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.deletewithoutfile = async (data) => {
    try {
        const sql = "UPDATE systemvefificationfields SET deleted = '1' WHERE id = ?";
        const [result] = await writeConn.query(sql, [data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}