const util = require('../../utility/util');

module.exports.mstSearchDetails = (data) => {
    let errcounter = 0;
    // if (data.reraid === undefined || data.reraid == null || data.reraid == '') {
    //     util.createLog("reraid type is missing");
    //     errcounter++;
    // }
    if (data.search === undefined || data.search == null || data.search == '') {
        util.createLog("searched data is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.projectRespondentReq = (data) => {
    let errcounter = 0;
    if (data.projRegNo === undefined || data.projRegNo == null || data.projRegNo == '') {
        util.createLog("projRegNo is missing");
        errcounter++;
    }
    if (data.type === undefined || data.type == null || data.type == '') {
        util.createLog("type is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
