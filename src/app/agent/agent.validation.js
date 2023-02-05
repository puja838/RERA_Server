const util = require('../../utility/util');

module.exports.getRegistrationCertificateFieldsReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.agentid === undefined || data.agentid == null || data.agentid === '') {
        util.createLog("agentid is missing");
        errcounter++;
    }
    if (data.type === undefined || data.type == null || data.type === '') {
        util.createLog("type is missing");
        errcounter++;
    }
    if (data.entitytypeid === undefined || data.entitytypeid == null || data.entitytypeid === '') {
        util.createLog("entitytypeid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.saveCertificateContentReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null || data.reraid === '') {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.agentid === undefined || data.agentid == null || data.agentid === '') {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.content === undefined || data.content == null || data.content === '') {
        util.createLog("content is missing");
        errcounter++;
    }
    return errcounter <= 0;
};

module.exports.getDashboardDataReq = (data) => {
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