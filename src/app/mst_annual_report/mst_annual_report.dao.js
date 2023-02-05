const readConn = require('../../dbconnection').readPool;
const writeConn = require('../../dbconnection').writePool;
const common = require('../services/common.service');
const util = require('../../utility/util');
const axios = require("axios");
const config = require('../../config');


module.exports.getList = async (data) => {
    try {
        const sql = "SELECT *,id as reportId FROM `mst_annual_report`" +
            " WHERE userid= ? and isactive=1 and deleted=0";
        const [result] = await readConn.query(sql, [data.userid]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.add = async (data,userid) => {
    try {
       // console.log(data)
        const sql = "INSERT INTO mst_annual_report (userid,financial_report_year, sub_doc, file_name)" +
            " values (?,?,?,?)";
        const [result] = await writeConn.query(sql,
            [userid, data.financial_report_year, data.sub_doc, data.file_name]);
        //console.log(result)
        return true;
    } catch (e) {
        console.log(data)
        util.createLog(e);
        return false;
    }
}


module.exports.update = async (data) => {
    try {
        util.createLog(data);
        const sql = "UPDATE mst_annual_report SET financial_report_year = ?,sub_doc=?,file_name=? WHERE id = ?";
        const [result] = await writeConn.query(sql, [data.financial_report_year,data.sub_doc,data.file_name,data.reportId]);

       
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.delete = async (data) => {
    try {
        const sql = "UPDATE mst_annual_report SET deleted = 1 WHERE id = ?";
        const [result] = await writeConn.query(sql, [data.reportId]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

