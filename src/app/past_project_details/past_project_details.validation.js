const util = require('../../utility/util');

module.exports.listReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid == null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


module.exports.getPastProjectOutsideCaseDtlReq = (data) => {
    let errcounter = 0;
    if (data.projectid === undefined || data.projectid == null) {
        util.createLog("projectid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}