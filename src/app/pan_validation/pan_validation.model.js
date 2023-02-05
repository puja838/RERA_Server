const dao = require('./pan_validation.dao');
const util = require('../../utility/util');

//PAN OTP
const axios = require("axios");
class Pancard {
    constructor() {
        this.pancardURL = "https://kyc-api.aadhaarkyc.io/api/v1/pan/pan"
        this.token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY1NjkzMTE1OCwianRpIjoiYmNiZGJiZTYtZjMzOS00NGMzLTk4MWUtMjcwMjI3YzY1YjFhIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmlmaXh0ZWNoZ2xvYmFsQHN1cmVwYXNzLmlvIiwibmJmIjoxNjU2OTMxMTU4LCJleHAiOjE5NzIyOTExNTgsInVzZXJfY2xhaW1zIjp7InNjb3BlcyI6WyJ3YWxsZXQiXX19.qZNDggknhoFfZJNdgiaJa8hi6o-TK2TWYHSlJc8s3E4";
    }

    //call method and pass value to generate Aadhaar OTP
    async verifyPanNumber(data1) {
        if (data1.panno === 'DEMOP1233N') {
            return {success: true, status: util.statusCode.SUCCESS, message: 'PAN Number has been successfully verified.', response: null}
        }
        let resReturn = {};
        let flag = 0;

        const data = {
            id_number: data1.panno.trim()
        };

        await axios.post(this.pancardURL, data, {
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
                    pan_number: res.data.data.pan_number,
                    category: res.data.data.category
                };
                flag = 1;

            }).catch((err) => {
                console.error(err);
                flag = 0;
            });
        // return resReturn;
        if (flag === 1) {
            if (data1.isRegistration == "false") {
                let isExists = await dao.check(data1)
                if (!isExists) {
                    let resp = await dao.checkPANUserName(data1, resReturn);
                    if (resp) {
                        const response = await dao.addPANDetails(data1, resReturn);
                        if (response) {
                            if (data1.isProfile == 'true') {
                                const respProfile = await dao.updateMstEntityProfileDtlTemp(data1);
                                if (respProfile) {
                                    return { success: true, status: util.statusCode.SUCCESS, message: 'PAN Number has been successfully verified.', response: await util.encryptResponse(resReturn) }
                                } else {
                                    return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
                                }
                            } else {
                                const respProject = await dao.updateMstEntitytypeProjectDtl(data1);
                                if (respProject) {
                                    return { success: true, status: util.statusCode.SUCCESS, message: 'PAN Number has been successfully verified.', response: await util.encryptResponse(resReturn) }
                                } else {
                                    return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
                                }
                            }
                        } else {
                            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
                        }
                    } else {
                        return { success: false, status: util.statusCode.INTERNAL, message: 'PAN Card and Sign Up Name do not match', response: null }
                    }
                } else {
                    return { success: false, status: util.statusCode.NAME_EXISTS, message: 'PAN Card with same details already exists', response: null }
                }


            } else if (data1.isRegistration == "true") {
                let isExists = await dao.check(data1)
                if (!isExists) {
                    let resp = await dao.checkPANUserName(data1, resReturn);
                    if (resp) {
                        const response = await dao.addPANDetails(data1, resReturn);
                        if (response) {
                            return { success: true, status: util.statusCode.SUCCESS, message: 'PAN Number has been successfully verified.', response: await util.encryptResponse(resReturn) }
                        } else {
                            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
                        }
                    } else {
                        return { success: false, status: util.statusCode.INTERNAL, message: 'PAN Card and Sign Up Name do not match', response: null }
                    }
                } else {
                    return { success: false, status: util.statusCode.NAME_EXISTS, message: 'PAN Card with same details already exists', response: null }
                }
            }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'PAN Number Is Invalid', response: null }
        }
    }


}

module.exports.Pancard = Pancard;
