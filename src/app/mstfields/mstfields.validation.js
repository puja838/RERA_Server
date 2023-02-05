const util = require('../../utility/util');

module.exports.addReq = (data) => {
    let errcounter = 0;
    if (data.stateId === undefined || data.stateId == null) {
        util.createLog("stateId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}