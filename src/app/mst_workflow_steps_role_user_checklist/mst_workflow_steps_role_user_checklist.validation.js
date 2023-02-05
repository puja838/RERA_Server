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
    if (data.checklistname === undefined || data.checklistname === null || data.checklistname === '') {
        util.createLog("checklistname is missing");
        errcounter++;
    }

    if (data.projectfieldid === undefined || data.projectfieldid === null || data.projectfieldid === 0) {
        util.createLog("checklistname is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid == null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.updateReq = (data) => {
    console.log(data);
    let errcounter = 0;
    if (data.id === undefined || data.id === null || data.id === '') {
        util.createLog("id is missing");
        errcounter++;
    }
    if (data.checklistname === undefined || data.checklistname === null || data.checklistname === '') {
        util.createLog("checklistname is missing");
        errcounter++;
    }

    if (data.projectfieldid === undefined || data.projectfieldid === null || data.projectfieldid === 0) {
        util.createLog("projectfieldid is missing");
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