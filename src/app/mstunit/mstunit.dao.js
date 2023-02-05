const readConn              = require('../../dbconnection').readPool
const writeConn             = require('../../dbconnection').writePool
const util                  = require('../../utility/util');

module.exports.getList  = async() => {
    try {
        const sql = "SELECT reraid,reradesc from mst_rera_unit where 1";
        const [result] = await  readConn.query(sql);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}