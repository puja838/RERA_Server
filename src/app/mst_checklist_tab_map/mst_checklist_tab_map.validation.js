const util = require('../../utility/util');

module.exports.getTabEntityMap = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null || data.reraid == '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.addTabEntityMap = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null || data.reraid == '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid == null || data.userid == '') {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.entitytypeid === undefined || data.entitytypeid == null || data.entitytypeid == '') {
        util.createLog("entitytypeid is missing");
        errcounter++;
    }
    if (data.tabid === undefined || data.tabid == null || data.tabid == '') {
        util.createLog("tabid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.updateTabEntityMap = (data) => {
    let errcounter = 0;
    if (data.id === undefined || data.id == null || data.id == '') {
        util.createLog("id is missing");
        errcounter++;
    }
    if (data.reraid === undefined || data.reraid == null || data.reraid == '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.entitytypeid === undefined || data.entitytypeid == null || data.entitytypeid == '') {
        util.createLog("entitytypeid is missing");
        errcounter++;
    }
    if (data.tabid === undefined || data.tabid == null || data.tabid == '') {
        util.createLog("tabid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.deleteTabEntityMap = (data) => {
    let errcounter = 0;
    if (data.id === undefined || data.id == null || data.id == '') {
        util.createLog("id is missing");
        errcounter++;
    }
    if (data.reraid === undefined || data.reraid == null || data.reraid == '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


