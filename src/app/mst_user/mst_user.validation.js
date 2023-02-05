const util = require('../../utility/util');

module.exports.login = (data) => {
    let errcounter = 0;
    if (data.username === undefined || data.username == null) {
        util.createLog("username is missing");
        errcounter++;
    }
    if (data.password === undefined || data.password == null) {
        util.createLog("password is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.listReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.getUserReq = (data) => {
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
module.exports.addReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.username === undefined || data.username === null || data.username === '') {
        util.createLog("username is missing");
        errcounter++;
    }
    if (data.password === undefined || data.password === null || data.password === '') {
        util.createLog("password is missing");
        errcounter++;
    }
    if (data.roleid === undefined || data.roleid === null || data.roleid === '') {
        util.createLog("roleid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.updateReq = (data) => {
    console.log(data);
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.userid === undefined || data.userid === null || data.userid === '') {
        util.createLog("userid is missing");
        errcounter++;
    }
    if (data.username === undefined || data.username === null || data.username === '') {
        util.createLog("username is missing");
        errcounter++;
    }
    if (data.roleid === undefined || data.roleid === null || data.roleid === '') {
        util.createLog("roleid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.deleteReq = (data) => {
    let errcounter = 0;
    if (data.userid === undefined || data.userid == null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.changeRoleName = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null) {
        util.createLog("reraid is missing");
        errcounter++;
    }
    if (data.roleName === undefined || data.roleName == null) {
        util.createLog("rolename is missing");
        errcounter++;
    }
    if (data.roleid === undefined || data.roleid == null) {
        util.createLog("roleid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}