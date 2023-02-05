const readConn = require('../../dbconnection').readPool;
const writeConn = require('../../dbconnection').writePool;
const common = require('../services/common.service');
const util = require('../../utility/util');
const axios = require("axios");
const config = require('../../config');

module.exports.getList = async (data) => {
    try {
        let where = '';
        if (data.searchText !== undefined && data.searchText !== '') {
            where += " AND subject LIKE '%" + data.searchText + "%' "
        }
        if (data.searchType !== undefined && data.searchType !== '') {
            where += " AND type LIKE '%" + data.searchType + "%' "
        }
        let limit = '';
        if (data.limit && data.offset) {
            limit +=   "LIMIT " + data.limit + " OFFSET " + data.offset
        }
        const sql = "select *,id as noticeid from noticeboard where deleted=0 "+where+" ORDER BY id DESC "+limit;
        const [result] = await readConn.query(sql, []);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.getNotices = async (data) => {
    try {
        const sql = "select id as noticeid, subject, dateofnotice, bannarimage, document from noticeboard where deleted=0 AND type=? ORDER BY dateofnotice DESC LIMIT ?,?";
        const [result] = await readConn.query(sql, [data.type,data.start,data.limit]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.add = async (data) => {
    try {
        const sql = "INSERT INTO noticeboard (subject, dateofnotice, bannarimage, document, type, userid)" +
            " values (?,?,?,?,?,?)";
        const [result] = await writeConn.query(sql,
            [data.subject, data.dateofnotice, data.bannarimage, data.document, data.type,data.userid]);
    
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
module.exports.update = async (data) => {
    try {
        util.createLog(data);
        const sql = "UPDATE noticeboard SET subject = ?,dateofnotice=?,bannarimage=?,document=?,type=?  WHERE id = ?";
        const [result] = await writeConn.query(sql, [data.subject,data.dateofnotice,data.bannarimage,data.document,data.type,data.noticeid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}

module.exports.delete = async (data) => {
    try {
        const sql = "UPDATE noticeboard SET deleted = 1 WHERE id = ?";
        const [result] = await writeConn.query(sql, [data.noticeid]);
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}