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
    if (data.projectid === undefined || data.projectid == null) {
        util.createLog("projectid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.storeTempReq = (data) => {
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
    if (data.stagetwofieldid === undefined || data.stagetwofieldid == null) {
        util.createLog("stagetwofieldid is missing");
        errcounter++;
    }
    if (data.relationid === undefined) {
        util.createLog("relationid is missing");
        errcounter++;
    }
    if (data.fieldid === undefined) {
        util.createLog("fieldid is missing");
        errcounter++;
    }
    if (data.fieldproposedvalue === undefined) {
        util.createLog("fieldproposedvalue is missing");
        errcounter++;
    }
    if (data.startdate === undefined) {
        util.createLog("startdate is missing");
        errcounter++;
    }
    if (data.enddate === undefined) {
        util.createLog("enddate is missing");
        errcounter++;
    }
    if (data.releatedgroupid === undefined) {
        util.createLog("releatedgroupid is missing");
        errcounter++;
    }
    if (data.relatedfieldid === undefined) {
        util.createLog("relatedfieldid is missing");
        errcounter++;
    }
    if (data.relatedgrouppos === undefined) {
        util.createLog("relatedgrouppos is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.submitFormReq = (data) => {
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
    if (data.isAcceptDeclaration === undefined || data.isAcceptDeclaration == null) {
        util.createLog("isAcceptDeclaration is missing");
        errcounter++;
    }
    if (data.submitPersonName === undefined || data.submitPersonName == null) {
        util.createLog("submitPersonName is missing");
        errcounter++;
    }
    if (data.signature === undefined || data.signature == null) {
        util.createLog("signature is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.getBuildingListOfProjectReq = (data) => {
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
    return errcounter <= 0;
}

module.exports.getStageTwoHdrReq = (data) => {
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
    return errcounter <= 0;
}

module.exports.saveInventoryDataReq = (data) => {
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
    if (data.inventoryData === undefined || data.inventoryData == null) {
        util.createLog("inventoryData is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.saveInformationUpdateDataReq = (data) => {
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
    if (data.webpagelink === undefined || data.webpagelink == null) {
        util.createLog("webpagelink is missing");
        errcounter++;
    }
    if (data.projProspectus === undefined || data.projProspectus == null) {
        util.createLog("projProspectus is missing");
        errcounter++;
    }
    if (data.projectDesignImg === undefined || data.projectDesignImg == null) {
        util.createLog("projectDesignImg is missing");
        errcounter++;
    }
    if (data.groupFields === undefined || data.groupFields == null) {
        util.createLog("groupFields is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
