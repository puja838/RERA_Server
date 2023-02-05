const axios = require("axios");
class CIN {
    constructor() {
        this.cinURL =
            "https://kyc-api.aadhaarkyc.io/api/v1/corporate/company-details";
        this.token =
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY1NjkzMTE1OCwianRpIjoiYmNiZGJiZTYtZjMzOS00NGMzLTk4MWUtMjcwMjI3YzY1YjFhIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmlmaXh0ZWNoZ2xvYmFsQHN1cmVwYXNzLmlvIiwibmJmIjoxNjU2OTMxMTU4LCJleHAiOjE5NzIyOTExNTgsInVzZXJfY2xhaW1zIjp7InNjb3BlcyI6WyJ3YWxsZXQiXX19.qZNDggknhoFfZJNdgiaJa8hi6o-TK2TWYHSlJc8s3E4";
    }
    //call method and pass value to generate Aadhaar OTP
    async verifyCINNumber(cinno) {
        let resReturn = {
            success: false
        };

        const data = {
            id_number: cinno.trim(),
        };

        await axios
            .post(this.cinURL, data, {
                headers: {
                    "content-type": "application/json",
                    Authorization: "Bearer " + this.token,
                },
            })
            .then((res) => {
                console.log("Response:", JSON.stringify(res.data));
                resReturn = {
                    client_id: res.data.data.client_id,
                    company_id: res.data.data.company_id,
                    company_type: res.data.data.company_type,
                    company_name: res.data.data.company_name,
                    success: true
                };
            })
            .catch((err) => {
                console.error(err);
            });
        return resReturn;
    }
}

class DIN {
    constructor() {
        this.dinURL = "https://kyc-api.aadhaarkyc.io/api/v1/corporate/din";
        this.token =
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY1NjkzMTE1OCwianRpIjoiYmNiZGJiZTYtZjMzOS00NGMzLTk4MWUtMjcwMjI3YzY1YjFhIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmlmaXh0ZWNoZ2xvYmFsQHN1cmVwYXNzLmlvIiwibmJmIjoxNjU2OTMxMTU4LCJleHAiOjE5NzIyOTExNTgsInVzZXJfY2xhaW1zIjp7InNjb3BlcyI6WyJ3YWxsZXQiXX19.qZNDggknhoFfZJNdgiaJa8hi6o-TK2TWYHSlJc8s3E4";
    }

    //call method and pass value to generate Aadhaar OTP
    async verifyDINNumber(dinno) {
        let resReturn = {
            success: false
        };

        const data = {
            id_number: dinno.trim(),
        };

        await axios
            .post(this.dinURL, data, {
                headers: {
                    "content-type": "application/json",
                    Authorization: "Bearer " + this.token,
                },
            })
            .then((res) => {
                console.log("Response:", res.data);
                resReturn = {
                    din_number: res.data.data.din_number,
                    full_name: res.data.data.full_name,
                    father_name: res.data.data.father_name,
                    dob: res.data.data.dob,
                    permanent_address: res.data.data.permanent_address,
                    present_address: res.data.data.present_address,
                    nationality: res.data.data.nationality,
                    client_id: res.data.data.client_id,
                    email: res.data.data.email,
                    success: true
                };
            })
            .catch((err) => {
                console.error(err);
            });
        return resReturn;
    }
}

class GSTIN {
    constructor() {
        this.gstinURL =
            "https://kyc-api.aadhaarkyc.io/api/v1/corporate/gstin";
        this.token =
            "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTY1NjkzMTE1OCwianRpIjoiYmNiZGJiZTYtZjMzOS00NGMzLTk4MWUtMjcwMjI3YzY1YjFhIiwidHlwZSI6ImFjY2VzcyIsImlkZW50aXR5IjoiZGV2LmlmaXh0ZWNoZ2xvYmFsQHN1cmVwYXNzLmlvIiwibmJmIjoxNjU2OTMxMTU4LCJleHAiOjE5NzIyOTExNTgsInVzZXJfY2xhaW1zIjp7InNjb3BlcyI6WyJ3YWxsZXQiXX19.qZNDggknhoFfZJNdgiaJa8hi6o-TK2TWYHSlJc8s3E4";
    }

    //call method and pass value to generate Aadhaar OTP
    async verifyGSTINNumber(gstinno,filing_status) {
        let resReturn = {
            success: false
        };

        const data = {
            id_number: gstinno.trim(),
            filing_status_get:filing_status
        };

        await axios
            .post(this.gstinURL, data, {
                headers: {
                    "content-type": "application/json",
                    Authorization: "Bearer " + this.token,
                },
            })
            .then((res) => {
                console.log("Response:", res.data);
                if (res.data.success) {
                    resReturn = {
                        legal_name: res.data.data.legal_name,
                        field_visit_conducted: res.data.data.field_visit_conducted,
                        gstin_status: res.data.data.gstin_status,
                        state_jurisdiction: res.data.data.state_jurisdiction,
                        constitution_of_business: res.data.data.constitution_of_business,
                        gstin: res.data.data.gstin,
                        address: res.data.data.address,
                        date_of_registration: res.data.data.date_of_registration,
                        center_jurisdiction: res.data.data.center_jurisdiction,
                        taxpayer_type: res.data.data.taxpayer_type,
                        client_id: res.data.data.client_id,
                        success: true
                    };
                }
            })
            .catch((err) => {
                util.createLog(err);
            });
        return resReturn;
    }
}




module.exports.CIN = CIN;
module.exports.DIN = DIN;
module.exports.GSTIN = GSTIN;
