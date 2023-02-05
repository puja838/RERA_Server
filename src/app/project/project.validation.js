const util = require('../../utility/util');

module.exports.listReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.deleteFromTempByIdReq = (data) => {
    let errcounter = 0;
    if (data.projectid === undefined || data.projectid == null || data.projectid === '') {
        util.createLog("projectid is missing");
        errcounter++;
    }
    if (data.groupid === undefined || data.groupid == null || data.groupid === '') {
        util.createLog("groupid is missing");
        errcounter++;
    }
    if (data.position === undefined || data.position == null || data.position === '') {
        util.createLog("position is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.createNewTempProjectReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null || data.reraid == '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.entityid === undefined || data.entityid == null || data.entityid == '') {
        util.createLog("entityid is missing");
        errcounter++;
    }
    if (data.entitytypeid === undefined || data.entitytypeid == null || data.entitytypeid == '') {
        util.createLog("entitytypeid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid == null || data.userid == '') {
        util.createLog("userid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.storeFieldInfoIntoTempReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null || data.reraid == '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.projectid === undefined || data.projectid == null || data.projectid == '') {
        util.createLog("projectid is missing");
        errcounter++;
    }
    if (data.groupid === undefined) {
        util.createLog("groupid is missing");
        errcounter++;
    }
    if (data.fieldid === undefined || data.fieldid == null || data.fieldid == '') {
        util.createLog("fieldid is missing");
        errcounter++;
    }
    if (data.fieldvalue === undefined || data.fieldvalue == null) {
        util.createLog("fieldvalue is missing");
        errcounter++;
    }
    if (data.tempid === undefined) {
        util.createLog("tempid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.submitReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid === null || data.reraid === '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid === null || data.userid === '') {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.entityid === undefined || data.entityid === null || data.entityid === '') {
        util.createLog("entityid is missing");
        errcounter++;
    }
    if (data.entitytypeid === undefined || data.entitytypeid === null || data.entitytypeid === '') {
        util.createLog("entitytypeid is missing");
        errcounter++;
    }
    if (data.projectid === undefined || data.projectid === null || data.projectid === '') {
        util.createLog("projectid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.getProjectListReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid === null || data.reraid === '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid === null || data.userid === '') {
        util.createLog("userid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.getSystemVerificationFieldsReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid === null || data.reraid === '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.getRegistrationCertificateFieldsReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid === null || data.reraid === '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid === null || data.userid === '') {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.projectid === undefined || data.projectid === null || data.projectid === '') {
        util.createLog("projectid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.updateApprovalCommentsReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid === null || data.reraid === '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid === null || data.userid === '') {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.projectid === undefined || data.projectid === null || data.projectid === '') {
        util.createLog("projectid is missing");
        errcounter++;
    }
    if (data.comment === undefined || data.comment === null || data.comment === '') {
        util.createLog("comment is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.isChairmanApproveReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid === null || data.reraid === '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.projectid === undefined || data.projectid === null || data.projectid === '') {
        util.createLog("projectid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.getProjectDashboardDataReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid === null || data.reraid === '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid === null || data.userid === '') {
        util.createLog("userid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};
module.exports.addAllFieldDetailsReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null || data.reraid == '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.projectid === undefined || data.projectid == null || data.projectid == '') {
        util.createLog("projectid is missing");
        errcounter++;
    }
    if (data.obj === undefined || data.obj == null || data.obj == '') {
        util.createLog("obj is missing");
        errcounter++;
    }
    if (data.stepid === undefined || data.stepid == null) {
        util.createLog("stepid is missing");
        errcounter++;
    }
    if (data.groupid === undefined || data.groupid == null) {
        util.createLog("groupid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};

module.exports.listDist = (data) => {
    let errcounter = 0;
    if (data.stateid === undefined || data.stateid == null || data.stateid == 0) {
        util.createLog("stateid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};

module.exports.deleteDraftProjectReq = (data) => {
    let errcounter = 0;
    if (data.projectid === undefined || data.projectid == null || data.projectid == 0) {
        util.createLog("projectid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};

module.exports.isPaymentCompleteReq = (data) => {
    let errcounter = 0;
    if (data.projectid === undefined || data.projectid == null || data.projectid == 0) {
        util.createLog("projectid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};

module.exports.uploadSignatureReq = (data) => {
    let errcounter = 0;
    if (data.projectid === undefined || data.projectid == null || data.projectid == 0) {
        util.createLog("projectid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};

module.exports.getFinancialYearListReq = (data) => {
    let errcounter = 0;
    if (data.projectid === undefined || data.projectid == null || data.projectid == 0) {
        util.createLog("projectid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};

module.exports.fetchUpdateProjectDetailsForUserReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null || data.reraid === '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid == null || data.userid === '') {
        util.createLog("userid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};

module.exports.saveCertificateContentReq = (data) => {
    let errcounter = 0;
        if (data.reraid === undefined || data.reraid == null || data.reraid === '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid == null || data.userid === '') {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.projectid === undefined || data.projectid == null || data.projectid === '') {
        util.createLog("projectid is missing");
        errcounter++;
    }
    if (data.content === undefined || data.content == null || data.content === '') {
        util.createLog("content is missing");
        errcounter++;
    }
    return errcounter <= 0;
};

module.exports.getNewLunchedProjectsReq = (data) => {
    let errcounter = 0;
        if (data.reraid === undefined || data.reraid == null || data.reraid === '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid == null || data.userid === '') {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.limit === undefined || data.limit == null || data.limit === '') {
        util.createLog("limit is missing");
        errcounter++;
    }
    if (data.offset === undefined || data.offset == null || data.offset === '') {
        util.createLog("offset is missing");
        errcounter++;
    }
    return errcounter <= 0;
};

module.exports.getProjectsStatusByApplicationNoReq = (data) => {
    let errcounter = 0;
        if (data.applno === undefined || data.applno == null || data.applno === '') {
        util.createLog("applno is missing");
        errcounter++;
    }
    return errcounter <= 0;
};
