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
    if (data.fieldvalue === undefined || data.fieldvalue == null) {
        util.createLog("fieldvalue is missing");
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




module.exports.submitField = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined) {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.verifyOTP === undefined || data.verifyOTP == null) {
        util.createLog("verifyOTP is missing");
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
    if (data.id === undefined || data.id == null) {
        util.createLog("id is missing");
        errcounter++;
    }
    if (data.clientid === undefined || data.clientid == null) {
        util.createLog("clientid is missing");
        errcounter++;
    }
    if (data.isProfile === undefined || data.isProfile == null) {
        util.createLog("isProfile is missing");
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
