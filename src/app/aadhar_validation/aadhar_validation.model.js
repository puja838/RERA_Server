const dao = require('./aadhar_validation.dao');
const util = require('../../utility/util');
const common = require('../services/common.service');

//Aadhaar OTP
const axios = require("axios");

class AadhaarOTPmgov {
    constructor() {
        this.generateOTPURL = "https://kyc-api.aadhaarkyc.io/api/v1/aadhaar-v2/generate-otp"
        this.submitOTPURL = "https://kyc-api.aadhaarkyc.io/api/v1/aadhaar-v2/submit-otp"
        this.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY1NjkzMTE1OCwianRpIjoiYmNiZGJiZTYtZjMzOS00NGMzLTk4MWUtMjcwMjI3YzY1YjFhIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmlmaXh0ZWNoZ2xvYmFsQHN1cmVwYXNzLmlvIiwibmJmIjoxNjU2OTMxMTU4LCJleHAiOjE5NzIyOTExNTgsInVzZXJfY2xhaW1zIjp7InNjb3BlcyI6WyJ3YWxsZXQiXX19.qZNDggknhoFfZJNdgiaJa8hi6o-TK2TWYHSlJc8s3E4";
    }

    //call method and pass value to generate Aadhaar OTP
    async generateAadhaarOTP(data1) {
        const hitCount = await common.checkLast24HourHit(data1.aadhaarno);
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
        let resReturn = {};
        let flag = 0;
        const data = {
            id_number: data1.aadhaarno.trim()
        };

        await axios.post(this.generateOTPURL, data, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + this.token
            }
        })
            .then((res) => {
                // var resData = JSON.parse(res.data);
                resReturn = {
                    status: res.status,
                    client_id: res.data.data.client_id,
                    message: res.data.message,
                    success: res.data.success
                };
                flag = 1;
            }).catch((err) => {
                // console.error(JSON.stringify(err));
                // console.log(err)
                flag = 0;
                resReturn = {
                    status: err.response.data.status_code,
                    client_id: 0,
                    message: err.response.data.message,
                    success: false
                };
            });
        // flag = 1;
        if (flag === 1) {
            let resp = await dao.addAadhaar(data1);
            if (resp) {
                return {
                    success: true,
                    status: util.statusCode.SUCCESS,
                    message: resReturn.message,
                    response: await util.encryptResponse({id: resp, resReturn: resReturn})
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
                success: resReturn.success,
                status: util.statusCode.INTERNAL,
                message: resReturn.message,
                response: null
            }
        }
    }


    //call method and pass value to submit Aadhaar OTP
    async submitAadhaarOTP(data1) {
        let resReturn = {};
        let flag = 0;
        const data = {
            client_id: data1.clientid.trim(),
            otp: data1.aadhaarOTP.trim()
        };

        await axios.post(this.submitOTPURL, data, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + this.token
            }
        })
            .then((res) => {
                resReturn = {
                    status: res.status,
                    body: res.data
                }
                flag = 1;
            }).catch((err) => {
                console.error(err);
                flag = 0;
            });
        //   flag = 1;
        if (flag === 1) {
            let resp = await dao.updateAadhaarVarification(data1.id);
            if (resp) {
                if (data1.isProfile === 'true') {
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
                return {
                    success: false,
                    status: util.statusCode.INTERNAL,
                    message: 'Internal server error',
                    response: null
                }
            }
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Invalid OTP', response: null}
        }
    }
}

module.exports.AadhaarOTPmgov = AadhaarOTPmgov;
