const util = require('../../utility/util');

module.exports.getProjectDetailReq = (data) => {
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
};

module.exports.getQuoterListReq = (data) => {
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
};

module.exports.getInventoryDataReq = (data) => {
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
    if (data.quoterid === undefined || data.quoterid == null) {
        util.createLog("quoterid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};

module.exports.getConstructionProgress = (data) => {
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
    if (data.groupid === undefined || data.groupid == null) {
        util.createLog("groupid is missing");
        errcounter++;
    }
    if (data.fieldid === undefined || data.fieldid == null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.groupposition === undefined || data.groupposition == null) {
        util.createLog("projectid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.upsertConstructionProgressReq = (data) => {
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
    if (data.quoterid === undefined || data.quoterid == null) {
        util.createLog("quoterid is missing");
        errcounter++;
    }
    if (data.progressData === undefined || data.progressData == null) {
        util.createLog("progressData is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

////Sayan

module.exports.listReq = (data) => {
    let errcounter = 0;
    if (data.projectid === undefined || data.projectid == null) {
        util.createLog("projectid is missing");
        errcounter++;
    }else if(data.userid  === undefined || data.userid == null){
        util.createLog("userid is missing");
        errcounter++;
    }else if(data.quoterid  === undefined || data.quoterid == null){
        util.createLog("groupid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.addReq = (data) => {
    let errcounter = 0;
    if (data.projectid === undefined || data.projectid == null) {
        util.createLog("projectid is missing");
        errcounter++;
    }else if(data.userid  === undefined || data.userid == null){
        util.createLog("userid is missing");
        errcounter++;
    }else if(data.quoterid  === undefined || data.quoterid == null){
        util.createLog("groupid is missing");
        errcounter++;
    }else if(data.projectaccountno  === undefined || data.projectaccountno == null){
        util.createLog("projectaccountno is missing");
        errcounter++;
    }else if(data.estimatedcost  === undefined || data.estimatedcost == null){
        util.createLog("estimatedcost is missing");
        errcounter++;
    }else if(data.amtrecquoter  === undefined || data.amtrecquoter == null){
        util.createLog("amtrecquoter is missing");
        errcounter++;
    }else if(data.actiualcost  === undefined || data.actiualcost == null){
        util.createLog("actiualcost is missing");
        errcounter++;
    }else if(data.netamount  === undefined || data.netamount == null){
        util.createLog("netamount is missing");
        errcounter++;
    }else if(data.totalexpenditure  === undefined || data.totalexpenditure == null){
        util.createLog("totalexpenditure is missing");
        errcounter++;
    }else if(data.mortgagecharge  === undefined || data.mortgagecharge == null){
        util.createLog("mortgagecharge is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.updateReq = (data) => {
    let errcounter = 0;
    if (data.financialUpdateId === undefined || data.financialUpdateId == null) {
        util.createLog("financialUpdateId is missing");
        errcounter++;
    }else if(data.projectaccountno  === undefined || data.projectaccountno == null){
        util.createLog("projectaccountno is missing");
        errcounter++;
    }else if(data.estimatedcost  === undefined || data.estimatedcost == null){
        util.createLog("estimatedcost is missing");
        errcounter++;
    }else if(data.amtrecquoter  === undefined || data.amtrecquoter == null){
        util.createLog("amtrecquoter is missing");
        errcounter++;
    }else if(data.actiualcost  === undefined || data.actiualcost == null){
        util.createLog("actiualcost is missing");
        errcounter++;
    }else if(data.netamount  === undefined || data.netamount == null){
        util.createLog("netamount is missing");
        errcounter++;
    }else if(data.totalexpenditure  === undefined || data.totalexpenditure == null){
        util.createLog("totalexpenditure is missing");
        errcounter++;
    }else if(data.mortgagecharge  === undefined || data.mortgagecharge == null){
        util.createLog("mortgagecharge is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.addLegalCase = (data) => {
    let errcounter = 0;
    if (data.projectid === undefined || data.projectid == null) {
        util.createLog("projectid is missing");
        errcounter++;
    }else if(data.userid  === undefined || data.userid == null){
        util.createLog("userid is missing");
        errcounter++;
    }else if(data.quoterid  === undefined || data.quoterid == null){
        util.createLog("groupid is missing");
        errcounter++;
    }else if(data.legalCase  === undefined || data.legalCase == null){
        util.createLog("legalCase is missing");
        errcounter++;
    }else if(data.saledeed  === undefined || data.saledeed == null){
        util.createLog("saledeed is missing");
        errcounter++;
    }else if(data.saleagreement  === undefined || data.saleagreement == null){
        util.createLog("saleagreement is missing");
        errcounter++;
    }else if(data.signatureFile  === undefined || data.signatureFile == null){
        util.createLog("signatureFile is missing");
        errcounter++;
    }else if(data.submitPersonName  === undefined || data.submitPersonName == null){
        util.createLog("submitPersonName is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.getLegalCase = (data) => {
    let errcounter = 0;
    if (data.projectid === undefined || data.projectid == null) {
        util.createLog("projectid is missing");
        errcounter++;
    }else if(data.userid  === undefined || data.userid == null){
        util.createLog("userid is missing");
        errcounter++;
    }else if(data.quoterid  === undefined || data.quoterid == null){
        util.createLog("groupid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.updateLegalCase = (data) => {
    let errcounter = 0;
    if (data.projectid === undefined || data.projectid == null) {
        util.createLog("projectid is missing");
        errcounter++;
    }else if(data.userid  === undefined || data.userid == null){
        util.createLog("userid is missing");
        errcounter++;
    }else if(data.quoterid  === undefined || data.quoterid == null){
        util.createLog("groupid is missing");
        errcounter++;
    }else if(data.legalCase  === undefined || data.legalCase == null){
        util.createLog("legalCase is missing");
        errcounter++;
    }else if(data.saledeed  === undefined || data.saledeed == null){
        util.createLog("saledeed is missing");
        errcounter++;
    }else if(data.saleagreement  === undefined || data.saleagreement == null){
        util.createLog("saleagreement is missing");
        errcounter++;
    }else if(data.signatureFile  === undefined || data.signatureFile == null){
        util.createLog("signatureFile is missing");
        errcounter++;
    }else if(data.submitPersonName  === undefined || data.submitPersonName == null){
        util.createLog("submitPersonName is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.getConstructionProgress = (data) => {
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
    if (data.type === undefined || data.type == null) {
        util.createLog("type is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.uploadPhotoParticularsReq = (data) => {
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
    if (data.groupid === undefined || data.groupid == null) {
        util.createLog("groupid is missing");
        errcounter++;
    }
    if (data.groupposition === undefined || data.groupposition == null) {
        util.createLog("groupposition is missing");
        errcounter++;
    }
    if (data.fileName === undefined || data.fileName == null) {
        util.createLog("fileName is missing");
        errcounter++;
    }
    if (data.particularid === undefined || data.particularid == null) {
        util.createLog("particularid is missing");
        errcounter++;
    }
    if (data.executionhdrid === undefined || data.executionhdrid == null) {
        util.createLog("executionhdrid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};

module.exports.getBuildingPhotographReq = (data) => {
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
    if (data.groupid === undefined || data.groupid == null) {
        util.createLog("groupid is missing");
        errcounter++;
    }
    if (data.groupposition === undefined || data.groupposition == null) {
        util.createLog("groupposition is missing");
        errcounter++;
    }
    if (data.executionhdrid === undefined || data.executionhdrid == null) {
        util.createLog("executionhdrid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};


module.exports.deleteBuildingPhotoReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid == null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.id === undefined || data.id == null) {
        util.createLog("id is missing");
        errcounter++;
    }
    return errcounter <= 0;
};
