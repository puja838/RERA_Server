const util = require('../../utility/util');

module.exports.listReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.deleteFromTempByIdReq = (data) => {
    let errcounter = 0;
    if (data.userid === undefined || data.userid == null || data.userid === '') {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.groupid === undefined || data.groupid == null || data.groupid === '') {
        util.createLog("groupid is missing");
        errcounter++;
    }
    if (data.position === undefined || data.position == null || data.position === '') {
        util.createLog("position is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.createNewTempProjectReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null || data.reraid == '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.entityid === undefined || data.entityid == null || data.entityid == '') {
        util.createLog("entityid is missing");
        errcounter++;
    }
    if (data.entitytypeid === undefined || data.entitytypeid == null || data.entitytypeid == '') {
        util.createLog("entitytypeid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid == null || data.userid == '') {
        util.createLog("userid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.storeFieldInfoIntoTempReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null || data.reraid === '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid == null || data.userid === '') {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.groupid === undefined) {
        util.createLog("groupid is missing");
        errcounter++;
    }
    if (data.fieldid === undefined || data.fieldid == null || data.fieldid === '') {
        util.createLog("fieldid is missing");
        errcounter++;
    }
    if (data.fieldvalue === undefined || data.fieldvalue == null) {
        util.createLog("fieldvalue is missing");
        errcounter++;
    }
    if (data.tempid === undefined) {
        util.createLog("tempid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.submitReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid === null || data.reraid === '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid === null || data.userid === '') {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.entityid === undefined || data.entityid === null || data.entityid === '') {
        util.createLog("entityid is missing");
        errcounter++;
    }
    if (data.entitytypeid === undefined || data.entitytypeid === null || data.entitytypeid === '') {
        util.createLog("entitytypeid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};

module.exports.getProjectListReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid === null || data.reraid === '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid === null || data.userid === '') {
        util.createLog("userid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.getFormSubmitInfo = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid === null || data.reraid === '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid === null || data.userid === '') {
        util.createLog("userid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};

module.exports.uploadSignatureReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid === null || data.reraid === '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid === null || data.userid === '') {
        util.createLog("userid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};