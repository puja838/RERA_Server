const util = require('../../utility/util');

module.exports.getTabName = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null || data.reraid == '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.addTabName = (data) => {
    let errcounter = 0;
    if (data.tabname === undefined || data.tabname == null || data.tabname == '') {
        util.createLog("tabname is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.updateTabName = (data) => {
    let errcounter = 0;
    if (data.id === undefined || data.id == null || data.id == '') {
        util.createLog("id is missing");
        errcounter++;
    }
    if (data.tabname === undefined || data.tabname == null || data.tabname == '') {
        util.createLog("tabname is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.deleteTabName = (data) => {
    let errcounter = 0;
    if (data.id === undefined || data.id == null || data.id == '') {
        util.createLog("id is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


