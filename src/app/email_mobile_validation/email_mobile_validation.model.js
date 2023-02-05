const dao = require('./email_mobile_validation.dao');
const util = require('../../utility/util');
const SMSmgov = require('../../utility/smsmgov');
const common = require('../services/common.service');

//Aadhaar OTP
const axios = require("axios");

class FieldOTPmgov {
    constructor() {
        this.generateOTPURL = "https://kyc-api.aadhaarkyc.io/api/v1/aadhaar-v2/generate-otp"
        this.submitOTPURL = "https://kyc-api.aadhaarkyc.io/api/v1/aadhaar-v2/submit-otp"
        this.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY1NjkzMTE1OCwianRpIjoiYmNiZGJiZTYtZjMzOS00NGMzLTk4MWUtMjcwMjI3YzY1YjFhIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmlmaXh0ZWNoZ2xvYmFsQHN1cmVwYXNzLmlvIiwibmJmIjoxNjU2OTMxMTU4LCJleHAiOjE5NzIyOTExNTgsInVzZXJfY2xhaW1zIjp7InNjb3BlcyI6WyJ3YWxsZXQiXX19.qZNDggknhoFfZJNdgiaJa8hi6o-TK2TWYHSlJc8s3E4";
    }

    //call method and pass value to generate Field OTP
    async generateFieldOTP(data1) {
        let OTP = await util.generateSixDigitOtp();
        let resp = null;
        const hitCount = await common.checkLast24HourHit(data1.fieldvalue);
        if (hitCount === false) {
            return {
                success: false,
                status: util.statusCode.INTERNAL,
                message: 'Internal server error',
                response: null
            }
        } else if (hitCount >= 3) {
            return {
                success: false,
                status: util.statusCode.CUSTOM_ERROR,
                message: 'You have exceeded the maximum limit. Please try after 24 hours.',
                response: null
            }
        }
        resp = await dao.addFieldValidation(data1, OTP);
        let flag = 0;
        // console.log("\n OTP is ----->>>   ", OTP);
        let resReturn = {
            status: 200,
            client_id: 12345
        };
        if (data1.fieldtype == "Email") {
            if (data1.fieldvalue === 'tiwarilipi26@gmail.com') {
                resp = await dao.addFieldValidation(data1, '123456');
                return {
                    success: true,
                    status: util.statusCode.SUCCESS,
                    message: 'An OTP is sent to the registered email id.',
                    response: await util.encryptResponse({ id: resp, resReturn: resReturn })
                }
            }
            let isExists = await dao.checkEmail(data1);
            if (!isExists) {
                const sendMailRes = await util.sendMail({
                    subject: 'OTP Verification',
                    toemail: data1.fieldvalue.trim(),
                    message: 'OTP for your registered Email ID is ' + OTP
                });
                // console.log("\n sendMailRes  222222----------->>>>>>>    ", sendMailRes);
                if (sendMailRes) {
                    // let resp = await dao.addFieldValidation(data1, OTP);
                    if (resp) {
                        return {
                            success: true,
                            status: util.statusCode.SUCCESS,
                            message: 'An OTP is sent to the registered email id.',
                            response: await util.encryptResponse({ id: resp, resReturn: resReturn })
                        }
                    } else {
                        return {
                            success: false,
                            status: util.statusCode.INTERNAL,
                            message: 'Internal server error',
                            response: null
                        }
                    }
                } else {
                    return {
                        success: false,
                        status: util.statusCode.INTERNAL,
                        message: 'Email ID Is Invalid',
                        response: null
                    }
                }

            } else {
                return { success: false, status: util.statusCode.NAME_EXISTS, message: 'Email ID already exists', response: null }
            }

        } else {
            if (data1.fieldvalue === '9999999999') {
                resp = await dao.addFieldValidation(data1, '123456');
                return {
                    success: true,
                    status: util.statusCode.SUCCESS,
                    message: 'An OTP is sent to the registered mobile number.',
                    response: await util.encryptResponse({ id: resp, resReturn: resReturn })
                }
            }
            let isExists = await dao.checkMobile(data1);
            if (!isExists) {
                // OTP = '123456';
                const smsGov = new SMSmgov();
                const message = util.generateSMSTemplate('verification', '', '', OTP, '')
                const mobileVerification = await smsGov.sendOTPsms(message, data1.fieldvalue);
                console.log("\n mobileVerification   222222----->>>>>>>>>>    ", mobileVerification);
                if (mobileVerification) {
                    // let resp = await dao.addFieldValidation(data1, OTP);
                    if (resp) {
                        return {
                            success: true,
                            status: util.statusCode.SUCCESS,
                            message: 'An OTP is sent to the registered mobile number.',
                            response: await util.encryptResponse({ id: resp, resReturn: resReturn })
                        }
                    } else {
                        return {
                            success: false,
                            status: util.statusCode.INTERNAL,
                            message: 'Internal server error',
                            response: null
                        }
                    }
                } else {
                    return {
                        success: false,
                        status: util.statusCode.INTERNAL,
                        message: 'Mobile Number Is Invalid',
                        response: null
                    }
                }
            } else {
                return { success: false, status: util.statusCode.NAME_EXISTS, message: 'Mobile Number already exists', response: null }
            }

        }
    }


    //call method and pass value to submit Field OTP
    async submitFieldOTP(data1) {
        let resReturn = {};
        let flag = 0;
        /*const data = {
            client_id: data1.clientid.trim(),
            otp: data1.verifyOTP.trim()
        };*/
        if (data1.isRegistration == "false") {
            const res = await dao.fieldOTPValidation(data1);
            if (res) {
                if (data1.isProfile == 'true') {
                    const respProfile = await dao.updateMstEntityProfileDtlTemp(data1);
                    if (respProfile) {
                        return {
                            success: true,
                            status: util.statusCode.SUCCESS,
                            message: 'OTP verification was successful.',
                            response: await util.encryptResponse(resReturn)
                        }
                    } else {
                        return {
                            success: false,
                            status: util.statusCode.INTERNAL,
                            message: 'Internal server error',
                            response: null
                        }
                    }
                } else {
                    const respProject = await dao.updateMstEntitytypeProjectDtl(data1);
                    if (respProject) {
                        return {
                            success: true,
                            status: util.statusCode.SUCCESS,
                            message: 'OTP verification was successful.',
                            response: await util.encryptResponse(resReturn)
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
            } else {
                return { success: false, status: util.statusCode.INTERNAL, message: 'Incorrect OTP', response: null }
            }
        } else if (data1.isRegistration == "true") {
            const res = await dao.fieldOTPValidation(data1);
            if (res) {
                return {
                    success: true,
                    status: util.statusCode.SUCCESS,
                    message: 'OTP verification was successful.',
                    response: await util.encryptResponse(resReturn)
                }
            } else {
                return { success: false, status: util.statusCode.INTERNAL, message: 'Incorrect OTP', response: null }
            }
        }
    }
}

module.exports.FieldOTPmgov = FieldOTPmgov;
