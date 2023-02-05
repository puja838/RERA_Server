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
    if (data.businessunittypecode === undefined || data.businessunittypecode === null || data.businessunittypecode === '') {
        util.createLog("businessunittypecode is missing");
        errcounter++;
    }
    if (data.businessunittypedesc === undefined || data.businessunittypedesc === null || data.businessunittypedesc === '') {
        util.createLog("businessunittypedesc is missing");
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
    if (data.businessunittypecode === undefined || data.businessunittypecode === null || data.businessunittypecode === '') {
        util.createLog("businessunittypecode is missing");
        errcounter++;
    }
    if (data.businessunittypedesc === undefined || data.businessunittypedesc === null || data.businessunittypedesc === '') {
        util.createLog("businessunittypedesc is missing");
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