const util = require('../../utility/util');

module.exports.listReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined) {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.username === undefined || data.username == null) {
        util.createLog("username is missing");
        errcounter++;
    }
    if (data.panno === undefined || data.panno == null) {
        util.createLog("panno is missing");
        errcounter++;
    }
    if (data.fieldid === undefined || data.fieldid == null) {
        util.createLog("fieldid is missing");
        errcounter++;
    }
    if (data.stepid === undefined || data.stepid == null) {
        util.createLog("stepid is missing");
        errcounter++;
    }
    if (data.groupid === undefined || data.groupid == null) {
        util.createLog("groupid is missing");
        errcounter++;
    }
    if (data.groupposition === undefined || data.groupposition == null) {
        util.createLog("groupposition is missing");
        errcounter++;
    }
    if (data.isRegistration === undefined || data.isRegistration == null) {
        util.createLog("isRegistration is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

