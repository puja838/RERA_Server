const util = require('../../utility/util');

module.exports.getlatlongReq = (data) => {
    let errcounter = 0;
    if (data.userid === undefined || data.userid == null || data.userid == "") {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.projectid === undefined || data.projectid == null) {
        util.createLog("projectid is missing");
        errcounter++;
    }
    if (data.reraid === undefined || data.reraid == null || data.reraid == "") {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.mid === undefined || data.mid == null || data.mid == "") {
        util.createLog("mid is missing");
        errcounter++;
    }
    if (data.meTransReqType === undefined || data.meTransReqType == null || data.meTransReqType == "") {
        util.createLog("meTransReqType is missing");
        errcounter++;
    }
    if (data.Remarks === undefined || data.Remarks == null || data.Remarks == "") {
        util.createLog("Remarks is missing");
        errcounter++;
    }
    if (data.currencyName === undefined || data.currencyName == null || data.currencyName == "") {
        util.createLog("currencyName is missing");
        errcounter++;
    }
    if (data.amount === undefined || data.amount == null || data.amount == "") {
        util.createLog("amount is missing");
        errcounter++;
    }
    if (data.OrderId === undefined || data.OrderId == null || data.OrderId == "") {
        util.createLog("OrderId is missing");
        errcounter++;
    }
    if (data.totalLandArea === undefined || data.totalLandArea == null) {
        util.createLog("totalLandArea is missing");
        errcounter++;
    }
    if (data.projectCategory === undefined || data.projectCategory == null) {
        util.createLog("projectCategory is missing");
        errcounter++;
    }
    return errcounter <= 0;
};

module.exports.getAxisPaymentReq = (data) => {
    let errcounter = 0;
    if (data.userid === undefined || data.userid == null || data.userid == "") {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.projectid === undefined || data.projectid == null) {
        util.createLog("projectid is missing");
        errcounter++;
    }
    if (data.reraid === undefined || data.reraid == null || data.reraid == "") {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.AMT === undefined || data.AMT == null || data.AMT == "") {
        util.createLog("AMT is missing");
        errcounter++;
    }
    if (data.CID === undefined || data.CID == null || data.CID == "") {
        util.createLog("CID is missing");
        errcounter++;
    }
    if (data.RID === undefined || data.RID == null || data.RID == "") {
        util.createLog("RID is missing");
        errcounter++;
    }
    if (data.CRN === undefined || data.CRN == null || data.CRN == "") {
        util.createLog("CRN is missing");
        errcounter++;
    }
    if (data.totalLandArea === undefined || data.totalLandArea == null) {
        util.createLog("totalLandArea is missing");
        errcounter++;
    }
    if (data.projectCategory === undefined || data.projectCategory == null) {
        util.createLog("projectCategory is missing");
        errcounter++;
    }
    return errcounter <= 0;
};
