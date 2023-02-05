const util = require('../../utility/util');

module.exports.listReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.getFieldNameForProfile = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.getFieldNameForProject = (data) => {
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
    // if (data.strfieldid === undefined || data.strfieldid === null || data.strfieldid === 0) {
    //     util.createLog("strfieldid is missing");
    //     errcounter++;
    // }
    
    if (data.filefieldid === undefined || data.filefieldid === null || data.filefieldid === 0) {
        util.createLog("filefieldid is missing");
        errcounter++;
    }

    if (data.fromwhich === undefined || data.fromwhich === null || data.fromwhich === 0) {
        util.createLog("fromwhich is missing");
        errcounter++;
    }

    if (data.onlyfile === undefined || data.onlyfile === null || data.onlyfile === 0) {
        util.createLog("onlyfile is missing");
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
    // if (data.vefificationid === undefined || data.vefificationid === null || data.vefificationid === 0) {
    //     util.createLog("vefificationid is missing");
    //     errcounter++;
    // }
    
    if (data.filefieldid === undefined || data.filefieldid === null || data.filefieldid === 0) {
        util.createLog("filefieldid is missing");
        errcounter++;
    }

    if (data.fromwhich === undefined || data.fromwhich === null || data.fromwhich === 0) {
        util.createLog("fromwhich is missing");
        errcounter++;
    }

    if (data.onlyfile === undefined || data.onlyfile === null || data.onlyfile === 0) {
        util.createLog("onlyfile is missing");
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