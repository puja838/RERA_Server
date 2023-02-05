const util = require('../../utility/util');


module.exports.listReq = (data) => {
    let errcounter = 0;
    if (data.userid === undefined || data.userid == null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.limit === undefined || data.limit == null) {
        util.createLog("limit is missing");
        errcounter++;
    }
    if (data.offset === undefined || data.offset == null) {
        util.createLog("offset is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.getNotificationCountReq = (data) => {
    let errcounter = 0;
    if (data.userid === undefined || data.userid == null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}