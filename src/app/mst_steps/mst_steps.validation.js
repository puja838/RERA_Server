const util = require('../../utility/util');

module.exports.listReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.addReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.stepdesc === undefined || data.stepdesc === null || data.stepdesc === '') {
        util.createLog("stepdesc is missing");
        errcounter++;
    }
    if (data.istableview === undefined || data.istableview === null || data.istableview === '') {
        util.createLog("istableview is missing");
        errcounter++;
    }
    if (data.steptype === undefined || data.steptype === null || data.steptype === '') {
        util.createLog("steptype is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.updateReq = (data) => {
    let errcounter = 0;
    if (data.stepdesc === undefined || data.stepdesc === null || data.stepdesc === '') {
        util.createLog("stepdesc is missing");
        errcounter++;
    }
    if (data.istableview === undefined || data.istableview === null || data.istableview === '') {
        util.createLog("istableview is missing");
        errcounter++;
    }
    if (data.stepid === undefined || data.stepid === null || data.stepid === '') {
        util.createLog("stepid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.deleteReq = (data) => {
    let errcounter = 0;
    if (data.stepid === undefined || data.stepid == null || data.stepid == '') {
        util.createLog("stepid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.updateSequenceReq = (data) => {
    let errcounter = 0;
    if (data.stepid === undefined || data.stepid == null || data.stepid == '') {
        util.createLog("stepid is missing");
        errcounter++;
    }
    if (data.sequenceno === undefined || data.sequenceno == null || data.sequenceno == '') {
        util.createLog("sequenceno is missing");
        errcounter++;
    }
    return errcounter <= 0;
}