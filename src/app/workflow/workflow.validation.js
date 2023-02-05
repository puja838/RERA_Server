
const util = require('../../utility/util');

module.exports.addReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    /*if (data.uniquepromoterid === undefined || data.uniquepromoterid === null ) {
        util.createLog("uniquepromoterid is missing");
        errcounter++;
    }
    if (data.uniqueprojectid === undefined || data.uniqueprojectid === null) {
        util.createLog("uniqueprojectid is missing");
        errcounter++;
    }*/
    if (data.fromstepid === undefined || data.fromstepid === null) {
        util.createLog("fromstepid is missing");
        errcounter++;
    }
    /*if (data.tostepid === undefined || data.tostepid === null) {
        util.createLog("tostepid is missing");
        errcounter++;
    }*/
    if (data.forwardflg === undefined || data.forwardflg === null) {
        util.createLog("forwardflg is missing");
        errcounter++;
    }
    return errcounter <= 0;
};
module.exports.addQuery = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    /*if (data.uniquepromoterid === undefined || data.uniquepromoterid === null ) {
        util.createLog("uniquepromoterid is missing");
        errcounter++;
    }
    if (data.uniqueprojectid === undefined || data.uniqueprojectid === null) {
        util.createLog("uniqueprojectid is missing");
        errcounter++;
    }*/
    if (data.workflowstepsroleuserprojectid === undefined || data.workflowstepsroleuserprojectid === null) {
        util.createLog("workflowstepsroleuserprojectid is missing");
        errcounter++;
    }
    /*if (data.query === undefined || data.query === null) {
        util.createLog("query is missing");
        errcounter++;
    }
    if (data.querybyuserid === undefined || data.querybyuserid === null) {
        util.createLog("querybyuserid is missing");
        errcounter++;
    }*/
    return errcounter <= 0;
};
module.exports.resolvedQuery = (data) => {
    let errcounter = 0;
    if (data.userid === undefined || data.userid == null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.id === undefined || data.id === null ) {
        util.createLog("id is missing");
        errcounter++;
    }
    return errcounter <= 0;
};
module.exports.answerQuery = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    /*if (data.uniquepromoterid === undefined || data.uniquepromoterid === null ) {
        util.createLog("uniquepromoterid is missing");
        errcounter++;
    }
    if (data.uniqueprojectid === undefined || data.uniqueprojectid === null) {
        util.createLog("uniqueprojectid is missing");
        errcounter++;
    }*/
    if (data.workflowstepsroleuserprojectid === undefined || data.workflowstepsroleuserprojectid === null) {
        util.createLog("workflowstepsroleuserprojectid is missing");
        errcounter++;
    }
    // if (data.answer === undefined || data.answer === null) {
    //     util.createLog("answer is missing");
    //     errcounter++;
    // }
    if (data.workflowstepsroleuserqueryid === undefined || data.workflowstepsroleuserqueryid === null) {
        util.createLog("workflowstepsroleuserqueryid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};
module.exports.commentQuery = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.uniquepromoterid === undefined || data.uniquepromoterid === null ) {
        util.createLog("uniquepromoterid is missing");
        errcounter++;
    }
    if (data.uniqueprojectid === undefined || data.uniqueprojectid === null) {
        util.createLog("uniqueprojectid is missing");
        errcounter++;
    }
    if (data.workflowstepsroleuserprojectid === undefined || data.workflowstepsroleuserprojectid === null) {
        util.createLog("workflowstepsroleuserprojectid is missing");
        errcounter++;
    }
    if (data.comment === undefined || data.comment === null) {
        util.createLog("comment is missing");
        errcounter++;
    }
    if (data.workflowstepsroleuserqueryanswerid === undefined || data.workflowstepsroleuserqueryanswerid === null) {
        util.createLog("workflowstepsroleuserqueryid is missing");
        errcounter++;
    }
    if (data.commentbyid === undefined || data.commentbyid === null) {
        util.createLog("commentbyid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};
module.exports.commentAttachment = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.workflowstepsroleuserqueryanswerid === undefined || data.workflowstepsroleuserqueryanswerid === null ) {
        util.createLog("workflowstepsroleuserqueryanswerid is missing");
        errcounter++;
    }
    if (data.workflowstepsroleuserchecklistconversationid === undefined || data.workflowstepsroleuserchecklistconversationid === null) {
        util.createLog("workflowstepsroleuserchecklistconversationid is missing");
        errcounter++;
    }
    if (data.filepath === undefined || data.filepath === null) {
        util.createLog("filepath is missing");
        errcounter++;
    }
    if (data.filedesc === undefined || data.filedesc === null) {
        util.createLog("filedesc is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid === null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};
module.exports.commentChecklist = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    /*if (data.uniqueprojectid === undefined || data.uniqueprojectid === null ) {
        util.createLog("uniqueprojectid is missing");
        errcounter++;
    }*/
    if (data.workflowstepsroleuserprojectid === undefined || data.workflowstepsroleuserprojectid === null) {
        util.createLog("workflowstepsroleuserprojectid is missing");
        errcounter++;
    }
    /*if (data.commentbyuserid === undefined || data.commentbyuserid === null) {
        util.createLog("commentbyuserid is missing");
        errcounter++;
    }*/
    if (data.userid === undefined || data.userid === null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};
module.exports.commentPromoter = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.mstworkflowstepsroleuserchecklistid === undefined || data.mstworkflowstepsroleuserchecklistid === null ) {
        util.createLog("mstworkflowstepsroleuserchecklistid is missing");
        errcounter++;
    }
    if (data.commentbypromoter === undefined || data.commentbypromoter === null) {
        util.createLog("commentbypromoter is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid === null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};

module.exports.approveCommentPromoter = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.mstworkflowstepsroleuserchecklistid === undefined || data.mstworkflowstepsroleuserchecklistid === null ) {
        util.createLog("mstworkflowstepsroleuserchecklistid is missing");
        errcounter++;
    }
    if (data.approve === undefined || data.approve === null) {
        util.createLog("approve is missing");
        errcounter++;
    }
    if (data.approvedatetime === undefined || data.approvedatetime === null) {
        util.createLog("approvedatetime is missing");
        errcounter++;
    }
    if (data.approvebyid === undefined || data.approvebyid === null) {
        util.createLog("approvebyid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid === null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    return errcounter <= 0;
};
module.exports.invalidateQuery = (data) => {
    let errcounter = 0;
    if (data.ids === undefined || data.ids == null) {
        util.createLog("id is missing");
        errcounter++;
    }
    if (data.number === undefined || data.number == null) {
        util.createLog("number is missing");
        errcounter++;
    }

    return errcounter <= 0;
};
module.exports.userFromStep = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.workflowid === undefined || data.workflowid == null) {
        util.createLog("workflowid is missing");
        errcounter++;
    }
    if (data.fromstepid === undefined || data.fromstepid == null) {
        util.createLog("fromstepid is missing");
        errcounter++;
    }
    if (data.tostepid === undefined || data.tostepid == null) {
        util.createLog("tostepid is missing");
        errcounter++;
    }

    return errcounter <= 0;
};
