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
    if (data.entitydesc === undefined || data.entitydesc === null || data.entitydesc === '') {
        util.createLog("entitydesc is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.updateReq = (data) => {
    let errcounter = 0;
    if (data.entityid === undefined || data.entityid == null) {
        util.createLog("entityid is missing");
        errcounter++;
    }
    if (data.entitydesc === undefined || data.entitydesc === null || data.entitydesc === '') {
        util.createLog("entitydesc is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.deleteReq = (data) => {
    let errcounter = 0;
    if (data.entityid === undefined || data.entityid == null) {
        util.createLog("entityid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}