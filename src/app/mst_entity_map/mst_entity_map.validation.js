const util = require('../../utility/util');

module.exports.listReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null || data.reraid == '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.addReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null || data.reraid == '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.entitytypeid === undefined || data.entitytypeid === null || data.entitytypeid === '') {
        util.createLog("entitytypeid is missing");
        errcounter++;
    }
    if (data.entityid === undefined || data.entityid === null || data.entityid === '') {
        util.createLog("entityid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.updateReq = (data) => {
    let errcounter = 0;
    if (data.entityid === undefined || data.entityid == null || data.entityid == '') {
        util.createLog("entityid is missing");
        errcounter++;
    }
    if (data.entitytypeid === undefined || data.entitytypeid === null || data.entitytypeid === '') {
        util.createLog("entitydesc is missing");
        errcounter++;
    }
    if (data.id === undefined || data.id === null || data.id === '') {
        util.createLog("id is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.deleteReq = (data) => {
    let errcounter = 0;
    if (data.id === undefined || data.id == null) {
        util.createLog("id is missing");
        errcounter++;
    }
    return errcounter <= 0;
}