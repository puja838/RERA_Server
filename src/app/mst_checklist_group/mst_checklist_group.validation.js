const util = require('../../utility/util');

module.exports.addGroupName = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null || data.reraid == '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid == null || data.userid == '') {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.groupname === undefined || data.groupname == null || data.groupname == '') {
        util.createLog("groupname is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.updateGroupName = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null || data.reraid == '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.id === undefined || data.id == null || data.id == '') {
        util.createLog("id is missing");
        errcounter++;
    }
    if (data.groupname === undefined || data.groupname == null || data.groupname == '') {
        util.createLog("groupname is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.deleteGroupName = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null || data.reraid == '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.id === undefined || data.id == null || data.id == '') {
        util.createLog("id is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


