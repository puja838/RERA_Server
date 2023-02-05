const readConn = require('../../dbconnection').readPool
const writeConn = require('../../dbconnection').writePool
const util = require('../../utility/util');

module.exports.getList  = async(data) => {
    try {
        const sql = "SELECT cityId,cityName, createdAt from cities where isActive = '1' AND deleted = '0' AND stateId = ?";
        const [result] = await  readConn.query(sql,[data.stateId]);
        return result;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}