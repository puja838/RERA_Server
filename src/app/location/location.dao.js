const readConn = require('../../dbconnection').readPool
const writeConn = require('../../dbconnection').writePool
const util = require('../../utility/util');

module.exports.getUserLoginInfo  = async(data) => {
    try {
        const sql = "SELECT userid FROM mst_user WHERE reraid = ? AND userpassword = ? AND userpan = ? AND deleted = 0";
        const [result] = await readConn.query(sql,[data.reraid, data.userpassword, data.userpan]);
        return result.length > 0 ? result[0].userid : null
    } catch (e) {
        util.createLog(e);
        return false;
    }
}
