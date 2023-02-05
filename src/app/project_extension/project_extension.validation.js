const util = require('../../utility/util');

module.exports.listReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid == null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};
module.exports.getExtensionListReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid == null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.generateProjectExtensionIdReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid == null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.projectid === undefined || data.projectid == null) {
        util.createLog("projectid is missing");
        errcounter++;
    }
    if (data.projectstatus === undefined || data.projectstatus == null) {
        util.createLog("projectstatus is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.saveProjectExtensionInfoReq = (data) => {
    let errcounter = 0;
    if (data.userid === undefined || data.userid == null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.projectid === undefined || data.projectid == null) {
        util.createLog("projectid is missing");
        errcounter++;
    }
    if (data.completiondate === undefined || data.completiondate == null) {
        util.createLog("completiondate is missing");
        errcounter++;
    }
    if (data.likelycompletiondate === undefined || data.likelycompletiondate == null) {
        util.createLog("likelycompletiondate is missing");
        errcounter++;
    }
    if (data.delayreason === undefined || data.delayreason == null) {
        util.createLog("delayreason is missing");
        errcounter++;
    }
    if (data.isforcemajeure === undefined || data.isforcemajeure == null) {
        util.createLog("isforcemajeure is missing");
        errcounter++;
    }
    if (data.forcemajeuredesc === undefined || data.forcemajeuredesc == null) {
        util.createLog("forcemajeuredesc is missing");
        errcounter++;
    }
    if (data.forcemajeureimpact === undefined || data.forcemajeureimpact == null) {
        util.createLog("forcemajeureimpact is missing");
        errcounter++;
    }
    if (data.forcemajeureperiod === undefined || data.forcemajeureperiod == null) {
        util.createLog("forcemajeureperiod is missing");
        errcounter++;
    }
    if (data.projectextexsionperiod === undefined || data.projectextexsionperiod == null) {
        util.createLog("projectextexsionperiod is missing");
        errcounter++;
    }
    if (data.extensionid === undefined || data.extensionid == null) {
        util.createLog("extensionid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.getDevelopmentPlanReq = (data) => {
    let errcounter = 0;
    if (data.userid === undefined || data.userid == null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.projectid === undefined || data.projectid == null) {
        util.createLog("projectid is missing");
        errcounter++;
    }
    if (data.extensionid === undefined || data.extensionid == null) {
        util.createLog("extensionid is missing");
        errcounter++;
    }
    if (data.groupid === undefined || data.groupid == null) {
        util.createLog("groupid is missing");
        errcounter++;
    }
    if (data.fieldid === undefined || data.fieldid == null) {
        util.createLog("fieldid is missing");
        errcounter++;
    }
    if (data.groupposition === undefined || data.groupposition == null) {
        util.createLog("groupposition is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.upsertDevelopmentPlanReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid == null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.projectid === undefined || data.projectid == null) {
        util.createLog("projectid is missing");
        errcounter++;
    }
    if (data.extensionid === undefined || data.extensionid == null) {
        util.createLog("extensionid is missing");
        errcounter++;
    }
    if (data.progressData === undefined || data.progressData == null) {
        util.createLog("progressData is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.getDocumentsReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid == null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.projectid === undefined || data.projectid == null) {
        util.createLog("projectid is missing");
        errcounter++;
    }
    if (data.extensionid === undefined || data.extensionid == null) {
        util.createLog("extensionid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.upsertDocumentDataReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid == null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.projectid === undefined || data.projectid == null) {
        util.createLog("projectid is missing");
        errcounter++;
    }
    if (data.extensionid === undefined || data.extensionid == null) {
        util.createLog("extensionid is missing");
        errcounter++;
    }
    if (data.docList === undefined || data.docList == null) {
        util.createLog("docList is missing");
        errcounter++;
    }
    if (data.otherDocList === undefined || data.otherDocList == null) {
        util.createLog("otherDocList is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.deleteOtherDocDataReq = (data) => {
    let errcounter = 0;
    if (data.documentid === undefined || data.documentid == null) {
        util.createLog("documentid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.submitForExtensionReq = (data) => {
    let errcounter = 0;
    if (data.signature === undefined || data.signature == null) {
        util.createLog("signature is missing");
        errcounter++;
    }
    if (data.ischeck === undefined || data.ischeck == null) {
        util.createLog("ischeck is missing");
        errcounter++;
    }
    if (data.extensionid === undefined || data.extensionid == null) {
        util.createLog("extensionid is missing");
        errcounter++;
    }
    if (data.projectid === undefined || data.projectid == null) {
        util.createLog("projectid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid == null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.time === undefined || data.time == null) {
        util.createLog("time is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.getExtensionCertificateReq = (data) => {
    let errcounter = 0;
    if (data.extensionid === undefined || data.extensionid == null) {
        util.createLog("extensionid is missing");
        errcounter++;
    }
    if (data.projectid === undefined || data.projectid == null) {
        util.createLog("projectid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid == null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.type === undefined || data.type == null) {
        util.createLog("type is missing");
        errcounter++;
    }
    if (data.reason === undefined || data.reason == null) {
        util.createLog("reason is missing");
        errcounter++;
    }
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.saveCertificateContentReq = (data) => {
    let errcounter = 0;
    if (data.extensionid === undefined || data.extensionid == null) {
        util.createLog("extensionid is missing");
        errcounter++;
    }
    if (data.projectid === undefined || data.projectid == null) {
        util.createLog("projectid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid == null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.content === undefined || data.content == null || data.content === '') {
        util.createLog("type is missing");
        errcounter++;
    }
    if (data.reraid === undefined || data.reraid == null || data.reraid === '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
