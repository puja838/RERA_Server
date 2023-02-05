const dao = require('./ifsc_validation.dao');
const util = require('../../utility/util');
const common = require('../services/common.service');

//PAN OTP
const axios = require("axios");

class IFSC {
    constructor() {
        this.ifscURL = "https://kyc-api.aadhaarkyc.io/api/v1/bank-verification/"
        this.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY1NjkzMTE1OCwianRpIjoiYmNiZGJiZTYtZjMzOS00NGMzLTk4MWUtMjcwMjI3YzY1YjFhIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmlmaXh0ZWNoZ2xvYmFsQHN1cmVwYXNzLmlvIiwibmJmIjoxNjU2OTMxMTU4LCJleHAiOjE5NzIyOTExNTgsInVzZXJfY2xhaW1zIjp7InNjb3BlcyI6WyJ3YWxsZXQiXX19.qZNDggknhoFfZJNdgiaJa8hi6o-TK2TWYHSlJc8s3E4";
    }

    //call method and pass value to generate IFSC OTP
    async verifyIfsc(data1) {
        const hitCount = await common.checkLast24HourHit(data1.ifsc);
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
        // console.log(" 1111111  >>>>>>>   ",data1.accountno);
        // console.log("  222222  >>>>>>>>>    ", data1.ifsc);

        const data = {
            id_number: data1.accountno.trim(),
            ifsc: data1.ifsc.trim()
        };

        await axios.post(this.ifscURL, data, {
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Bearer ' + this.token
            }
        })
            .then((res) => {
                resReturn = {
                    status: res.data.status_code,
                    message_code: res.data.message_code,
                    client_id: res.data.data.client_id,
                    full_name: res.data.data.full_name,
                    account_exists: res.data.data.account_exists
                };
                flag = 1;
            }).catch((err) => {
                console.error("\n ERROR  ---------------->>>>>>>>>>>>>>>>>>>   ", err);
                flag = 0;
            });
        console.log('\n resReturn   :--------------------->>>>>>>>>>>>>>>>   ', resReturn);
        // return resReturn;
        if (flag === 1) {
            if (data1.isRegistration == "false") {
                let resp = await dao.checkIFSCAccountExists(data1, resReturn);
                if (resp) {
                    const response = await dao.addIFSCDetails(data1, resReturn);
                    if (response) {
                        return {
                            success: true,
                            status: util.statusCode.SUCCESS,
                            message: 'IFSC Code has been successfully verified.',
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
                    return {
                        success: false,
                        status: util.statusCode.INTERNAL,
                        message: 'Account Number does not exist',
                        response: null
                    }
                }

            } else if (data1.isRegistration == "true") {
                let resp = await dao.checkIFSCAccountExists(data1, resReturn);
                if (resp) {
                    const response = await dao.addIFSCDetails(data1, resReturn);
                    if (response) {
                        return {
                            success: true,
                            status: util.statusCode.SUCCESS,
                            message: 'IFSC Code has been successfully verified.',
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
                    return {
                        success: false,
                        status: util.statusCode.INTERNAL,
                        message: 'Account Number does not exist',
                        response: null
                    }
                }
            }
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'IFSC Code Is Invalid', response: null}
        }
    }
}

module.exports.IFSC = IFSC;
