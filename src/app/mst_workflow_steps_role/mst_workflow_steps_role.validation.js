const util = require('../../utility/util');

module.exports.listReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.getRole = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.getstepid = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.workflowid === undefined || data.workflowid === null || data.workflowid === 0) {
        util.createLog("workflowid is missing");
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
    if (data.workflowid === undefined || data.workflowid === null || data.workflowid === 0) {
        util.createLog("workflowid is missing");
        errcounter++;
    }

    if (data.stepid === undefined || data.stepid === null || data.stepid === 0) {
        util.createLog("stepid is missing");
        errcounter++;
    }

    if (data.workflowstepsworksid === undefined || data.workflowstepsworksid === null || data.workflowstepsworksid === 0) {
        util.createLog("workflowstepsworksid is missing");
        errcounter++;
    }

    if (data.roleid === undefined || data.roleid === null || data.roleid === 0) {
        util.createLog("roleid is missing");
        errcounter++;
    }

    if (data.userid === undefined || data.userid == null) {
        util.createLog("userid is missing");
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
    if (data.workflowid === undefined || data.workflowid === null || data.workflowid === 0) {
        util.createLog("workflowid is missing");
        errcounter++;
    }

    if (data.stepid === undefined || data.stepid === null || data.stepid === 0) {
        util.createLog("stepid is missing");
        errcounter++;
    }

    if (data.workflowstepsworksid === undefined || data.workflowstepsworksid === null || data.workflowstepsworksid === 0) {
        util.createLog("workflowstepsworksid is missing");
        errcounter++;
    }

    if (data.roleid === undefined || data.roleid === null || data.roleid === 0) {
        util.createLog("roleid is missing");
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