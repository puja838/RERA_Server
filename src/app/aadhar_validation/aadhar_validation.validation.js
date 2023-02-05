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
    if (data.aadhaarno === undefined || data.aadhaarno == null) {
        util.createLog("aadhaarno is missing");
        errcounter++;
    }
    if (data.fieldid === undefined || data.fieldid == null || data.fieldid == '') {
        util.createLog("fieldid is missing");
        errcounter++;
    }
    if (data.stepid === undefined || data.stepid == null || data.stepid == '') {
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
    return errcounter <= 0;
}




module.exports.submitAadhaar = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null || data.reraid == '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid == null || data.userid == '') {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.aadhaarOTP === undefined || data.aadhaarOTP == null || data.aadhaarOTP == '') {
        util.createLog("aadhaarOTP is missing");
        errcounter++;
    }
    if (data.fieldid === undefined || data.fieldid == null || data.fieldid == '') {
        util.createLog("fieldid is missing");
        errcounter++;
    }
    if (data.stepid === undefined || data.stepid == null || data.stepid == '') {
        util.createLog("stepid is missing");
        errcounter++;
    }
    if (data.id === undefined || data.id == null || data.id == '') {
        util.createLog("id is missing");
        errcounter++;
    }
    if (data.clientid === undefined || data.clientid == null || data.clientid == '') {
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
    return errcounter <= 0;
}
