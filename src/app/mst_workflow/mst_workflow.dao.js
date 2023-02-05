const readConn = require('../../dbconnection').readPool
const writeConn = require('../../dbconnection').writePool
const util = require('../../utility/util');


module.exports.getList = async (data) => {
    try {
        const sql = "SELECT id,workflowname,defaultflg,userid,fromdate" +
            " from mst_workflow " +
            " WHERE reraid = ? AND deleted='0'";
        const [result] = await readConn.query(sql, [data.reraid]);
        util.createLog(result)
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.add = async (data) => {
    try {

        if(data.defaultflg == '')
        {
            defaulfFlag = 0
        }
        else{
            defaulfFlag = 1
        }
        const sql = "INSERT INTO mst_workflow (workflowname,defaultflg,userid,fromdate,reraid)" +
            " values (?,?,?,?,?)";

        data.workflowname = data.workflowname == '' ? null : data.workflowname;
        data.userid = data.userid == 0 ? null : data.userid;
        data.fromdate = data.fromdate == '' ? null : data.fromdate;
        const [result] = await writeConn.query(sql,[data.workflowname, defaulfFlag, data.userid, data.fromdate , data.reraid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.check = async (data) => {
    try {
        const sql = "SELECT id from mst_workflow where deleted='0' AND reraid = ? AND workflowname = ? AND defaultflg =?";
        const [result] = await  readConn.query(sql,[data.reraid,data.workflowname, data.defaultflg]);
        util.createLog(result.length);
        return result.length > 0;
    } catch (e) {
        util.createLog(e);
        return false;
    }
    
}

module.exports.updateDefaultFlg = async (data) => {
    try {
        const sql = "UPDATE mst_workflow SET defaultflg = '0' WHERE defaultflg = 1";
        const [result] = await  readConn.query(sql);
        util.createLog(sql);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
    
}

module.exports.update = async (data) => {
    try {
        if(data.defaultflg == '')
        {
            defaulfFlag = 0
        }
        else{
            defaulfFlag = 1
        }
        util.createLog(data);
        const sql = "UPDATE mst_workflow SET workflowname = ?,defaultflg = ?,fromdate =?  WHERE id = ?";
        const [result] = await writeConn.query(sql, [data.workflowname, defaulfFlag, data.fromdate, data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.delete = async (data) => {
    try {
        const sql = "UPDATE mst_workflow SET deleted = '1' WHERE id = ?";
        const [result] = await writeConn.query(sql, [data.id]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}