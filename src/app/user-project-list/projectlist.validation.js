const util = require('../../utility/util');

module.exports.fetchProjectDetails = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.roleid === undefined || data.roleid === null ) {
        util.createLog("roleid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};
module.exports.fetchUpdateProjectDetailsForUserReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.roleid === undefined || data.roleid === null ) {
        util.createLog("roleid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid === null ) {
        util.createLog("userid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};
module.exports.fetchProjectDetailsbyapprove = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.isapproved === undefined || data.isapproved === null ) {
        util.createLog("isapproved is missing");
        errcounter++;
    }
    return errcounter <= 0;
};
module.exports.tabEntity = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.entitytypeid === undefined || data.entitytypeid === null ) {
        util.createLog("entitytypeid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};
module.exports.tabChecklist = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.tabid === undefined || data.tabid === null ) {
        util.createLog("tabid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};
module.exports.getNextStepDetails = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.workflowid === undefined || data.workflowid === null ) {
        util.createLog("workflowid is missing");
        errcounter++;
    }
    if (data.fromstepid === undefined || data.fromstepid === null ) {
        util.createLog("fromstepid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};
module.exports.fetchProjectDetailsbyId = (data) => {
    let errcounter = 0;
    // if (data.projectid === undefined || data.projectid == null) {
    //     util.createLog("projectid is missing");
    //     errcounter++;
    // }
    return errcounter <= 0;
};
module.exports.projectQueryComment = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.type === undefined || data.type === null ) {
        util.createLog("projectid is missing");
        errcounter++;
    }
    if (data.projectid === undefined || data.projectid === null ) {
        util.createLog("projectid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};
module.exports.getStepidBytype = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.type === undefined || data.type === null ) {
        util.createLog("projectid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};
module.exports.getOfficerQuestion = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};
