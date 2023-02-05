const util = require('../../utility/util');

module.exports.createNewSignUpInfoReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null || data.reraid == '') {
        util.createLog("reraid type is missing");
        errcounter++;
    }
    if (data.username === undefined || data.username == null || data.username == '') {
        util.createLog("username is missing");
        errcounter++;
    }
    if (data.userpassword === undefined || data.userpassword == null || data.userpassword == '') {
        util.createLog("userpassword is missing");
        errcounter++;
    }
    if (data.userpan === undefined || data.userpan == null || data.userpan == '') {
        util.createLog("userpan is missing");
        errcounter++;
    }
    if (data.useremail === undefined || data.useremail == null || data.useremail == '') {
        util.createLog("useremail is missing");
        errcounter++;
    }
    if (data.usermobile === undefined || data.usermobile == null || data.usermobile == '') {
        util.createLog("usermobile is missing");
        errcounter++;
    }
    if (data.usertype === undefined || data.usertype == null || data.usertype == '') {
        util.createLog("usertype is missing");
        errcounter++;
    }
    if (data.promotertype === undefined || data.promotertype == null || data.promotertype == '') {
        util.createLog("promotertype is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.getSignUpInfoReq = (data) => {
    let errcounter = 0;
    if (data.reraid === undefined || data.reraid == null || data.reraid == '') {
        util.createLog("reraid type is missing");
        errcounter++;
    }
    if (data.userpan === undefined || data.userpan == null || data.userpan == '') {
        util.createLog("userpan is missing");
        errcounter++;
    }
    if (data.userpassword === undefined || data.userpassword == null || data.userpassword == '') {
        util.createLog("userpassword is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


module.exports.updateSignUpInfoReq = (data) => {
    let errcounter = 0;
    if (data.userid === undefined || data.userid == null || data.userid == '') {
        util.createLog("userid type is missing");
        errcounter++;
    }
    if (data.reraid === undefined || data.reraid == null || data.reraid == '') {
        util.createLog("reraid type is missing");
        errcounter++;
    }
    if (data.username === undefined || data.username == null || data.username == '') {
        util.createLog("username is missing");
        errcounter++;
    }
    if (data.userpassword === undefined || data.userpassword == null || data.userpassword == '') {
        util.createLog("userpassword is missing");
        errcounter++;
    }
    if (data.userpan === undefined || data.userpan == null || data.userpan == '') {
        util.createLog("userpan is missing");
        errcounter++;
    }
    if (data.useremail === undefined || data.useremail == null || data.useremail == '') {
        util.createLog("useremail is missing");
        errcounter++;
    }
    if (data.usermobile === undefined || data.usermobile == null || data.usermobile == '') {
        util.createLog("usermobile is missing");
        errcounter++;
    }
    if (data.usertype === undefined || data.usertype == null || data.usertype == '') {
        util.createLog("usertype is missing");
        errcounter++;
    }
    if (data.promotertype === undefined || data.promotertype == null || data.promotertype == '') {
        util.createLog("promotertype is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


module.exports.deleteSignUpInfoReq = (data) => {
    let errcounter = 0;
    if (data.userid === undefined || data.userid == null || data.userid == '') {
        util.createLog("userid type is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.storeUserInfo = (data) => {
    let errcounter = 0;
    if (data.userid === undefined || data.userid == null || data.userid == '') {
        util.createLog("userid  is missing");
        errcounter++;
    }
    if (data.fieldvalue === undefined || data.fieldvalue == null || data.fieldvalue == '') {
        util.createLog("fieldvalue is missing");
        errcounter++;
    }
    if (data.stepid === undefined || data.stepid == null || data.stepid == '') {
        util.createLog("stepid is missing");
        errcounter++;
    }
    if (data.fieldid === undefined || data.fieldid == null || data.fieldid == '') {
        util.createLog("fieldid  is missing");
        errcounter++;
    }
    if (data.isverified === undefined || data.isverified == null ) {
        util.createLog("isverified is missing");
        errcounter++;
    }
    return errcounter <= 0;
}


