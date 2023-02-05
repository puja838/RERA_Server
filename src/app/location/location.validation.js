const util = require('../../utility/util');

module.exports.getlatlongReq = (data) => {
    let errcounter = 0;
    if (data.userid === undefined || data.userid == null || data.userid == "") {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.address === undefined || data.address == null || data.address == "") {
        util.createLog("address is missing");
        errcounter++;
    }
    return errcounter <= 0;
};