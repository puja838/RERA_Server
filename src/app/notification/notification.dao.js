const readConn = require('../../dbconnection').readPool;
const writeConn = require('../../dbconnection').writePool;
const util = require('../../utility/util');


module.exports.getNotificationList = async (data) => {
    try {
        const sql = "SELECT notificationid, userid, projectid, ntype, content, createdat FROM notifications WHERE userid = ? AND deleted = 0 ORDER BY createdat DESC LIMIT ? OFFSET ?";
            const [result] = await readConn.query(sql, [data.userid, data.limit, data.offset]);
        return result
    } catch (e) {
        const log = util.createLog(e);
        return false;
    }
};

module.exports.getNotificationCount = async (data) => {
    try {
        const sql = "SELECT COUNT(notificationid) notificationCount FROM notifications WHERE userid = ? AND deleted = 0";
        const [result] = await readConn.query(sql, [data.userid]);
        return result.length > 0 ? result[0].notificationCount : 0
    } catch (e) {
        const log = util.createLog(e);
        return false;
    }
};

module.exports.saveNotification = async (data) => {
    try{
        let sql = "INSERT INTO notifications (userid, projectid, ntype, content, sendby) VALUES (?, ?, ?, ?, ?)";
        const [result] = await writeConn.query(sql, [data.userid, data.projectid, data.ntype, data.content, data.sendby]);
        return result
    } catch (e) {
        const log = util.createLog(e);
        return false;
    }
}