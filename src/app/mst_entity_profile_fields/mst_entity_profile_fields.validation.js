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
    if (data.fielddesc === undefined || data.fielddesc === null || data.fielddesc === '') {
        util.createLog("fielddesc is missing");
        errcounter++;
    }
    if (data.fielddisplaydesc === undefined || data.fielddisplaydesc === null || data.fielddisplaydesc === '') {
        util.createLog("fielddisplaydesc is missing");
        errcounter++;
    }
    if (data.fieldtype === undefined || data.fieldtype === null || data.fieldtype === '') {
        util.createLog("fieldtype is missing");
        errcounter++;
    }
    if (data.controltype === undefined || data.controltype === null || data.controltype === '') {
        util.createLog("controltype is missing");
        errcounter++;
    }
    if (data.controlvalue === undefined) {
        util.createLog("controlvalue is missing");
        errcounter++;
    }
    if (data.isuniqueid === undefined || data.isuniqueid === null || data.isuniqueid === '') {
        util.createLog("isuniqueid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.updateReq = (data) => {
    let errcounter = 0;
    if (data.id === undefined || data.id === null || data.id === '') {
        util.createLog("id is missing");
        errcounter++;
    }
    if (data.fielddesc === undefined || data.fielddesc === null || data.fielddesc === '') {
        util.createLog("fielddesc is missing");
        errcounter++;
    }
    if (data.fielddisplaydesc === undefined || data.fielddisplaydesc === null || data.fielddisplaydesc === '') {
        util.createLog("fielddisplaydesc is missing");
        errcounter++;
    }
    if (data.fieldtype === undefined || data.fieldtype === null || data.fieldtype === '') {
        util.createLog("fieldtype is missing");
        errcounter++;
    }
    if (data.controltype === undefined || data.controltype === null || data.controltype === '') {
        util.createLog("controltype is missing");
        errcounter++;
    }
    if (data.controlvalue === undefined) {
        util.createLog("controlvalue is missing");
        errcounter++;
    }
    if (data.isuniqueid === undefined || data.isuniqueid === null || data.isuniqueid === '') {
        util.createLog("isuniqueid is missing");
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