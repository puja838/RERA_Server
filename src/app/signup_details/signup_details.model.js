const dao = require('./signup_details.dao');
const token = require('../../utility/token');
const util = require('../../utility/util');
const SMSmgov = require('../../utility/smsmgov');

module.exports.createNewSignUpInfo = async (data) => {
    try {
        let result;
        const checkUserPan = await dao.checkUserPan(data);
        if (checkUserPan && data.userpan != 'DEMOP1233N') {
            return {
                success: false,
                status: util.statusCode.INTERNAL,
                message: 'Pan number already exists',
                response: null
            }
        } else {
            const checkUserEmail = await dao.checkUserEmail(data);
            if (checkUserEmail && data.useremail != 'tiwarilipi26@gmail.com') {
                return {
                    success: false,
                    status: util.statusCode.INTERNAL,
                    message: 'Email already exists',
                    response: null
                }
            } else {
                data.userpassword = await util.generateHash(data.userpassword);
                result = await dao.createNewSignUpInfo(data);
                let roleId = 2
                if (data.roleId) {
                    roleId = data.roleId
                }
                const roleRes = await dao.mapUserRole({reraid: data.reraid, insertId: result, roleId: roleId});
                const userNo = await util.genPromoterNo(result);
                const userNoRes = dao.updateUserNo({id: result, userno: userNo});
                const sendMailRes = await util.sendMail({
                    subject: 'Registration',
                    toemail: data.useremail,
                    message: 'Registration successful. Your UID is: ' + userNo
                });
                util.createLog('User email response >> ' + sendMailRes);
                // Send SMS
                // usermobile
                const smsGov = new SMSmgov();
                const message = util.generateSMSTemplate('signup', userNo, '', '', '')
                const smsResp = await smsGov.sendOTPsms(message, data.usermobile);
                // console.log("\n smsResp  >>>>>>>>>>    ", smsResp);
                if (result) {
                    return {
                        success: true,
                        status: util.statusCode.SUCCESS,
                        message: 'You have signed up successfully',
                        response: await util.encryptResponse({
                            userid: result,
                            token: await token.createJWTToken({userid: result})
                        })
                    }
                } else {
                    return {
                        success: false,
                        status: util.statusCode.INTERNAL,
                        message: 'Internal server error',
                        response: null
                    }
                }
            }
        }
    } catch (e) {
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}

module.exports.getSignUpInfo = async (data) => {
    try {
        let result;
        result = await dao.getSignUpInfo(data);
        const mapRes = await dao.mapUserRole({reraid: data.reraid, insertId: result, roleId: 1});
        if (result) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse({userid: result})
            }
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}


module.exports.updateSignUpInfo = async (data) => {
    try {
        let result;
        result = await dao.updateSignUpInfo(data);
        if (result) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Data updated successfully',
                response: await util.encryptResponse({userid: result})
            }
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}


module.exports.deleteSignUpInfo = async (data) => {
    try {
        let result;
        result = await dao.deleteSignUpInfo(data);
        if (result) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Data deleted successfully',
                response: await util.encryptResponse({userid: result})
            }
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}

module.exports.storeFieldDataintemp = async (data) => {
    try {
        let result;
        result = await dao.storeFieldDataintemp(data);
        if (result) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Data inserted successfully',
                response: await util.encryptResponse({userid: result})
            }
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}

module.exports.checkSMS = async (data) => {
    try {
        const smsGov = new SMSmgov();
        const message = util.generateSMSTemplate(data.type, data.promoterId, data.projectId, data.otp, data.amount)
        const smsResp = await smsGov.sendOTPsms(message, data.mobile);
        console.log("\n smsResp  >>>>>>>>>>    ", smsResp);
        return {success: true, status: util.statusCode.SUCCESS, message: 'OKAY', response: null}
    } catch (e) {
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}

module.exports.checkEmail = async (data) => {
    try {
        const res = await util.sendMail(data);
        console.log("\n Email Resp  >>>>>>>>>>    ", res);
        return {success: true, status: util.statusCode.SUCCESS, message: 'OKAY', response: null}
    } catch (e) {
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}

//  const resp = await dao.storeFieldDataintemp(data)

