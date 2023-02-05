const util = require('../../utility/util');


module.exports.dashboardReq = (data) => {
    let errcounter = 0;
    if (data.userid === undefined || data.userid == null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.projectListReq = (data) => {
    let errcounter = 0;
    if (data.userid === undefined || data.userid == null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.limit === undefined || data.limit == null) {
        util.createLog("limit is missing");
        errcounter++;
    }
    if (data.offset === undefined || data.offset == null) {
        util.createLog("offset is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.getProjectDetailsReq = (data) => {
    let errcounter = 0;
    if (data.userid === undefined || data.userid == null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.projectid === undefined || data.projectid == null) {
        util.createLog("projectid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.getQprProjectsReq = (data) => {
    let errcounter = 0;
    if (data.userid === undefined || data.userid == null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.limit === undefined || data.limit == null) {
        util.createLog("limit is missing");
        errcounter++;
    }
    if (data.offset === undefined || data.offset == null) {
        util.createLog("offset is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.getProjectDetailsLatLong = (data) => {
    let errcounter = 0;
    if (data.latitude === undefined || data.latitude == null) {
        util.createLog("latitude is missing");
        errcounter++;
    }
    if (data.longitude === undefined || data.longitude == null) {
        util.createLog("longitude is missing");
        errcounter++;
    }
    
    return errcounter <= 0;
}

module.exports.getProfileDetailsReq = (data) => {
    let errcounter = 0;
    if (data.userid === undefined || data.userid == null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.getSiteLocationImgReq = (data) => {
    let errcounter = 0;
    if (data.projectid === undefined || data.projectid == null) {
        util.createLog("projectid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.deleteSiteLocationImgReq = (data) => {
    let errcounter = 0;
    if (data.id === undefined || data.id == null || data.id === '') {
        util.createLog("id is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.uploadSiteLocationImgReq = (data) => {
    let errcounter = 0;
    if (data.projectid === undefined || data.projectid == null) {
        util.createLog("projectid is missing");
        errcounter++;
    }
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid == null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.entitytypeid === undefined || data.entitytypeid == null) {
        util.createLog("entitytypeid is missing");
        errcounter++;
    }
    if (data.groupposition === undefined || data.groupposition == null) {
        util.createLog("groupposition is missing");
        errcounter++;
    }
    return errcounter <= 0;
}