const util = require('../../utility/util');

module.exports.listReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.getEntityTypeByEntityReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.entityid === undefined || data.entityid == null || data.entityid == '') {
        util.createLog("entityid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.addReq = (data) => {
    let errcounter = 0;
    if (data.entitytypedesc === undefined || data.entitytypedesc === null || data.entitytypedesc === '') {
        util.createLog("entitytypedesc is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.updateReq = (data) => {
    let errcounter = 0;
    if (data.entitytypeid === undefined || data.entitytypeid == null) {
        util.createLog("entitytypeid is missing");
        errcounter++;
    }
    if (data.entitytypedesc === undefined || data.entitytypedesc === null || data.entitytypedesc === '') {
        util.createLog("entitytypedesc is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.deleteReq = (data) => {
    let errcounter = 0;
    if (data.entitytypeid === undefined || data.entitytypeid == null) {
        util.createLog("entitytypeid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}