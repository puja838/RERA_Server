const util = require('../../utility/util');

module.exports.listReq = (data) => {
    let errcounter = 0;
    if (data.userpan === undefined || data.userpan == null || data.userpan == "") {
        util.createLog("userpan is missing");
        errcounter++;
    }
    if (data.userpassword === undefined || data.userpassword == null || data.userpassword == "") {
        util.createLog("userpassword is missing");
        errcounter++;
    }
    if (data.reraid === undefined || data.reraid == null || data.reraid == "") {
        util.createLog("reraid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}