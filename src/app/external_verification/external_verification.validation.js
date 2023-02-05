const util = require('../../utility/util');

module.exports.cinReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid === null || data.userid === '') {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.cinno === undefined || data.cinno === null || data.cinno === '') {
        util.createLog("cinno is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.dinReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid === null || data.userid === '') {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.dinno === undefined || data.dinno === null || data.dinno === '') {
        util.createLog("dinno is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.gstinReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid === null || data.userid === '') {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.gstinno === undefined || data.gstinno === null || data.gstinno === '') {
        util.createLog("gstinno is missing");
        errcounter++;
    }
    if (data.filing_status === undefined || data.filing_status === null || data.filing_status === '') {
        util.createLog("filing_status is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

