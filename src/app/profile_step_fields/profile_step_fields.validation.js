const util = require('../../utility/util');

module.exports.listReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.getFieldListReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null || data.reraid == '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.stepid === undefined || data.stepid == null || data.stepid == '') {
        util.createLog("stepid is missing");
        errcounter++;
    }
    if (data.entitytypeid === undefined || data.entitytypeid == null || data.entitytypeid == '') {
        util.createLog("entitytypeid is missing");
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
    if (data.entityid === undefined || data.entityid === null || data.entityid === '') {
        util.createLog("entityid is missing");
        errcounter++;
    }
    if (data.entitytypeid === undefined || data.entitytypeid === null || data.entitytypeid === '') {
        util.createLog("entitytypeid is missing");
        errcounter++;
    }
    if (data.stepid === undefined || data.stepid === null || data.stepid === '') {
        util.createLog("stepid is missing");
        errcounter++;
    }
    if (data.fieldList === undefined || data.fieldList === null) {
        util.createLog("fieldList is missing");
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
    if (data.sequence === undefined || data.sequence === null || data.sequence === '') {
        util.createLog("sequence is missing");
        errcounter++;
    }
    if (data.isRequired === undefined || data.isRequired === null || data.isRequired === '') {
        util.createLog("isRequired is missing");
        errcounter++;
    }
    if (data.isApproval === undefined || data.isApproval === null || data.isApproval === '') {
        util.createLog("isApproval is missing");
        errcounter++;
    }
    if (data.fieldId === undefined || data.fieldId === '') {
        util.createLog("fieldId is missing");
        errcounter++;
    }
    if (data.groupId === undefined || data.groupId === '') {
        util.createLog("groupId is missing");
        errcounter++;
    }
    if (data.rowname === undefined) {
        util.createLog("rowname is missing");
        errcounter++;
    }
    if (data.width === undefined || data.width === null || data.width === '') {
        util.createLog("width is missing");
        errcounter++;
    }
    if (data.fieldType === undefined || data.fieldType === null || data.fieldType === '') {
        util.createLog("fieldType is missing");
        errcounter++;
    }
    if (data.parentFieldId === undefined) {
        util.createLog("parentFieldId is missing");
        errcounter++;
    }
    if (data.parentValue === undefined) {
        util.createLog("parentValue is missing");
        errcounter++;
    }
    if (data.stepId === undefined || data.stepId === null || data.stepId === '') {
        util.createLog("stepId is missing");
        errcounter++;
    }
    if (data.reraId === undefined || data.reraId === null || data.reraId === '') {
        util.createLog("reraId is missing");
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