const util = require('../../utility/util');

module.exports.listReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }

    if (data.workflowid === undefined || data.workflowid == null) {
        util.createLog("workflowid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.getWorkFlow = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.workflowid === undefined || data.workflowid == null) {
        util.createLog("workflowid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.getworkflowid = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.getworkflowstepid = (data) => {
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
    
    if (data.fromstepid === undefined || data.fromstepid === null || data.fromstepid === 0) {
        util.createLog("fromstepid is missing");
        errcounter++;
    }

    if (data.tostepid === undefined || data.tostepid === null || data.tostepid === 0) {
        util.createLog("tostepid is missing");
        errcounter++;
    }

    if (data.stepworkid === undefined || data.stepworkid === null || data.stepworkid === 0) {
        util.createLog("stepworkid is missing");
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
    if (data.fromstepid === undefined || data.fromstepid === null || data.fromstepid === 0) {
        util.createLog("fromstepid is missing");
        errcounter++;
    }

    if (data.tostepid === undefined || data.tostepid === null || data.tostepid === 0) {
        util.createLog("tostepid is missing");
        errcounter++;
    }

    if (data.stepworkid === undefined || data.stepworkid === null || data.stepworkid === 0) {
        util.createLog("stepworkid is missing");
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