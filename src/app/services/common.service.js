const readConn = require('../../dbconnection').readPool
const writeConn = require('../../dbconnection').writePool
const util = require('../../utility/util');
const axios = require("axios");
const config = require('../../config');
let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");
let fs = require("fs");
const SMSmgov = require('../../utility/smsmgov');
const notificationDao = require('../notification/notification.dao');

module.exports.checkLast24HourHit = async (fieldvalue) => {
    try {
        const sql = "SELECT fieldvalue, createdat FROM field_validation WHERE fieldvalue = ? AND createdat >= now() - INTERVAL 1 DAY;";
        const [result] = await  readConn.query(sql,[fieldvalue]);
        util.createLog(result.length);
        return result.length;
    } catch (e) {
        util.createLog(e);
        return false;
    }

}

module.exports.getMobileEmailByUserId = async (userId) => {
    try {
        const sql = "SELECT useremail, usermobile, userno FROM mst_user WHERE userid = ? AND deleted = 0";
        const [result] = await readConn.query(sql,[userId]);
        return result.length > 0 ? result[0] : null
    } catch (e) {
        util.createLog(e);
        return null;
    }
}

module.exports.getNameByUserId = async (userId) => {
    try {
        const sql = "SELECT username FROM mst_user WHERE userid = ? AND deleted = 0";
        const [result] = await readConn.query(sql,[userId]);
        return result.length > 0 ? result[0] : null
    } catch (e) {
        util.createLog(e);
        return null;
    }
}

module.exports.getProjectShortDtl = async (projectid) => {
    try {
        const sql = "SELECT projectfieldvalue as projectName, projectuid  FROM mst_entitytype_project_hdr WHERE id = ?";
        const [result] = await readConn.query(sql,[projectid]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return null;
    }
}

module.exports.getProjectIdUserIdByRegNo = async (regNo) => {
    try {
        const sql = "SELECT id, particularprofileid as userid FROM mst_entitytype_project_hdr WHERE isdelete='0' AND projectuid=?";
        const [result] = await readConn.query(sql,[regNo]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return null;
    }
}

module.exports.updateVerificationFieldInProfile = async (data) => {
    console.log('updateVerificationFieldInProfile')
    try {
        let result;
        let result2;
        if(data.groupposition && data.groupposition === ''){
            data.groupposition = 0;
        }
        if(data.groupid === undefined || data.groupid === ''){
            console.log('updateVerificationFieldInProfile 111')
            const sql = "UPDATE mst_entity_profile_dtl_temp SET isverified = '1' WHERE userid = ? AND stepid = ? AND fieldid = ?";
            const sql2 = "UPDATE mst_entity_profile_values_dtl SET isverified = '1' WHERE userid = ? AND stepid = ? AND fieldid = ?";
            result = await  writeConn.query(sql,[data.userid, data.stepid, data.fieldid]);
            result2 = await  writeConn.query(sql2,[data.userid, data.stepid, data.fieldid]);
        } else {
            const sql = "UPDATE mst_entity_profile_dtl_temp SET isverified = '1' WHERE userid = ? AND stepid = ? AND fieldid = ? AND groupid = ? AND groupposition = ?";
            const sql2 = "UPDATE mst_entity_profile_values_dtl SET isverified = '1' WHERE userid = ? AND stepid = ? AND fieldid = ? AND groupid = ? AND groupposition = ?";
            result = await  writeConn.query(sql,[data.userid, data.stepid, data.fieldid, data.groupid, data.groupposition]);
            result2 = await  writeConn.query(sql2,[data.userid, data.stepid, data.fieldid, data.groupid, data.groupposition]);
        }
        return true;
    } catch (e) {
        util.createLog(e);
        return false;
    }
}


module.exports.addUserCustomized= async(data)=>  {
    try {
        const params = {
            clientId: 18,
            name: data.username,
            mobile: data.usermobile,
            email: data.useremail,
            password: data.passkey,
            roleSelected1:89,
            SptgrpSelected:data.SptgrpSelected,
            login_name:data.useremail,
            user_id:758738,
            address:data.address,
            isNotEncrypted:true,
            APIType:'Insert',
        };
        await axios.post(config.CREATEUSER_CUSTOMIZED, JSON.stringify(params), {
            headers: {
                'content-type': 'application/json',
                'UserAgent': "Mozilla/4.0 (compatible; MSIE 5.0; Windows 98; DigExt)"
            }
        })
            .then((res) => {
                console.log(res)
                util.createLog(res.data);
            }).catch((err) => {
                console.log(err)
                util.createLog(err);
            });
    } catch (e) {
        util.createLog(e)
    }
}
module.exports.updateUserCustomized= async(data)=>  {
    try {
        const params = {
            clientId: 18,
            name: data.username,
            mobile: data.usermobile,
            email: data.useremail,
            password: '12345',
            roleSelected1:89,
            SptgrpSelected:data.SptgrpSelected,
            login_name:data.useremail,
            user_id:758738,
            address:data.address,
            isNotEncrypted:true,
            APIType:'Update',
        };
        // console.log("Update params >>> ", params);
        await axios.post(config.CREATEUSER_CUSTOMIZED, JSON.stringify(params), {
            headers: {
                'content-type': 'application/json',
                'UserAgent': "Mozilla/4.0 (compatible; MSIE 5.0; Windows 98; DigExt)"
            }
        })
            .then((res) => {
                console.log(res)
                util.createLog(res.data);
            }).catch((err) => {
                console.log(err)
                util.createLog(err);
            });
    } catch (e) {
        util.createLog(e)
    }
}

module.exports.generateToken= async(data)=>  {
    try{
        const URL = await config.API_GENERATEURL;
        const resp = await axios.get(URL+''+data.name+'');
        return JSON.stringify(resp.data);
    } catch (e) {
        util.createLog(e);
    }
};

module.exports.insertProjectStatusLog = async (data) => {
    try {
        const sql = "INSERT INTO project_status_audit (projectid, userid, reraid, status) VALUES (?, ?, ?, ?)";
        const [result] = await writeConn.query(sql,[data.projectid, data.userid, data.reraid, data.status]);
    } catch (e) {
        console.log(e);
    }
}

module.exports.sendSMS = async (userid, projectid, templateType) => {
    try {
        let mailSubject = '';
        /*if (templateType === 'checkList') {
            mailSubject = 'Document require';
        }*/
        const userContactDtl = await common.getMobileEmailByUserId(userid);
        const projectDtl = await common.getProjectShortDtl(projectid);
        if (userContactDtl && projectDtl) {
            const smsGov = new SMSmgov();
            const message = util.generateSMSTemplate(templateType, userContactDtl.userno, projectDtl.projectuid, '', '')
            const smsResp = await smsGov.sendOTPsms(message, userContactDtl.usermobile);
            /*const sendMailRes = await util.sendMail({
                subject: templateType,
                toemail: userContactDtl.useremail,
                message: message
            });*/
            const notiRest = await notificationDao.saveNotification({
                userid: data.userid,
                projectid: data.projectid,
                ntype: templateType,
                content: message.split('|')[0],
                sendby: null
            })
            return true
        } else {
            return false
        }
    } catch (e) {
        console.log(e);
        return false
    }
}


module.exports.generateCertificate_v2 = (data, type = 'A') => {
    return new Promise((resolve, reject) => {
        try {
            let htmlString = '';
            let fileName = '';
            if (type === 'A') {
                fileName = 'Registration_Certificate_';
                htmlString = fs.readFileSync(config.FILEOPPATH + "template/registrationCertificate_v2.ejs").toString();
            } else if (type === 'Agent') {
                fileName = 'Registration_Certificate_';
                htmlString = fs.readFileSync(config.FILEOPPATH + "template/agetRegistrationCertificate.ejs").toString();
            } else {
                fileName = 'Rejection_Certificate_';
                htmlString = fs.readFileSync(config.FILEOPPATH + "template/rejectionCertificate.ejs").toString();
            }
            let options = {
                format: 'A3', orientation: "portrait", childProcessOptions: {
                    env: {
                        OPENSSL_CONF: '/dev/null',
                    },
                }
            };
            const ejsData = ejs.render(htmlString, data);
            const timestamp = new Date().getTime();
            pdf.create(ejsData, options).toFile(config.FILEOPPATH + 'certificate/' + fileName + timestamp + '.pdf', async (err1, response1) => {
                if (err1) return console.log(err1);
                resolve({success: true, filename: fileName + timestamp + '.pdf', content: ejsData})
            });
        } catch (e) {
            console.log(e)
            reject({success: false})
        }
    })
};

module.exports.generateCertificateFromContent = (content, fileName = 'Registration_Certificate') => {
    return new Promise((resolve, reject) => {
        try {
            let options = {
                format: 'A3', orientation: "portrait", childProcessOptions: {
                    env: {
                        OPENSSL_CONF: '/dev/null',
                    },
                }
            };
            const timestamp = new Date().getTime();
            pdf.create(content, options).toFile(config.FILEOPPATH + 'certificate/' + fileName + '_' + timestamp + '.pdf', async (err1, response1) => {
                if (err1) return console.log(err1);
                resolve({success: true, filename: fileName + '_' + timestamp + '.pdf'})
            });
        } catch (e) {
            console.log(e);
            reject({success: false})
        }
    })
};