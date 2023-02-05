const util = require('../../utility/util');

module.exports.listReq = (data) => {
    let errcounter = 0;
    // if (data.userid === undefined || data.userid == null) {
    //     util.createLog("userid is missing");
    //     errcounter++;
    // }
    return errcounter <= 0;
}
module.exports.getNotices = (data) => {
    let errcounter = 0;
    if (data.type === undefined || data.type == null) {
        util.createLog("type is missing");
        errcounter++;
    }
    if(data.start == undefined || data.start == null){
        util.createLog("start is missing");
        errcounter++;
    }
    if(data.limit == undefined || data.limit == null){
        util.createLog("limit is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.addReq = (data) => {
    let errcounter = 0;
    if (data.userid === undefined || data.userid == null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.subject === undefined || data.subject === null || data.subject === '') {
        util.createLog("subject is missing");
        errcounter++;
    }
    if (data.dateofnotice === undefined || data.dateofnotice === null || data.dateofnotice === '') {
        util.createLog("dateofnotice is missing");
        errcounter++;
    }
    if (data.bannarimage === undefined || data.bannarimage === null || data.bannarimage === '') {
        util.createLog("bannarimage is missing");
        errcounter++;
    }
    if (data.document === undefined || data.document === null || data.document === '') {
        util.createLog("document is missing");
        errcounter++;
    }
    if (data.type === undefined || data.type === null || data.type === '') {
        util.createLog("type is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.updateReq = (data) => {
    console.log(data);
    let errcounter = 0;
    if (data.noticeid === undefined || data.noticeid == null) {
        util.createLog("noticeid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid == null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.subject === undefined || data.subject === null || data.subject === '') {
        util.createLog("subject is missing");
        errcounter++;
    }
    if (data.dateofnotice === undefined || data.dateofnotice === null || data.dateofnotice === '') {
        util.createLog("dateofnotice is missing");
        errcounter++;
    }
    if (data.bannarimage === undefined || data.bannarimage === null || data.bannarimage === '') {
        util.createLog("bannarimage is missing");
        errcounter++;
    }
    if (data.document === undefined || data.document === null || data.document === '') {
        util.createLog("document is missing");
        errcounter++;
    }
    if (data.type === undefined || data.type === null || data.type === '') {
        util.createLog("type is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.deleteReq = (data) => {
    let errcounter = 0;
    if (data.noticeid === undefined || data.noticeid == null) {
        util.createLog("noticeid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}