const util = require('../../utility/util');

module.exports.getFieldListByGroupReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
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
    if (data.groupname === undefined || data.groupname == null) {
        util.createLog("groupname is missing");
        errcounter++;
    }
    if (data.filedIds === undefined || data.filedIds === null || data.filedIds.length === 0) {
        util.createLog("filedIds is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.updateReq = (data) => {
    let errcounter = 0;
    if (data.id === undefined || data.id == null) {
        util.createLog("id is missing");
        errcounter++;
    }
    if (data.reraid === undefined || data.reraid === null || data.reraid === '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.fieldid === undefined || data.fieldid === null || data.fieldid === '') {
        util.createLog("fieldid is missing");
        errcounter++;
    }
    if (data.parentfieldid === undefined) {
        util.createLog("parentfieldid is missing");
        errcounter++;
    }
    if (data.parentfieldvalue === undefined) {
        util.createLog("parentfieldvalue is missing");
        errcounter++;
    }
    if (data.fieldgroupid === undefined) {
        util.createLog("fieldgroupid is missing");
        errcounter++;
    }
    if (data.fieldwidth === undefined || data.fieldwidth === null || data.fieldwidth === '') {
        util.createLog("fieldwidth is missing");
        errcounter++;
    }
    if (data.fontsize === undefined || data.fontsize === null || data.fontsize === '') {
        util.createLog("fontsize is missing");
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
module.exports.addFieldsInGroupReq = (data) => {
    let errcounter = 0;
    if (data.filedIds === undefined || data.filedIds == null) {
        util.createLog("filedIds is missing");
        errcounter++;
    }
    if (data.groupid === undefined || data.groupid == null || data.groupid == '') {
        util.createLog("groupid is missing");
        errcounter++;
    }
    if (data.reraid === undefined || data.reraid == null || data.reraid == '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.updateSequenceReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null || data.reraid === '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.groupid === undefined || data.groupid == null || data.groupid === '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}