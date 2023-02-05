const express       = require('express');
const router        = express.Router();
const validator     = require('../../utility/validator');
const aadhaarmodel  = require('./aadhar_validation.model');
const validate      = require('./aadhar_validation.validation');
const util          = require('../../utility/util');

const cors = require("cors");
const crypto = require("crypto");
const { off } = require("process");
// const SMSmgov  = require("./smsmgov")
// const AadhaarOTPmgov  = require("./aadhaarotp")
// const port = process.env.PORT || 3000;



router.post('/v1/aadhaar/generateAadhaarOTP', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.listReq(reqData)) {
        const aadhaarOTPmgov = new aadhaarmodel.AadhaarOTPmgov();
        const resp = await aadhaarOTPmgov.generateAadhaarOTP(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});


router.post('/v1/aadhaar/submitAadhaarOTP', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.submitAadhaar(reqData)) {
        const aadhaarOTPmgov = new aadhaarmodel.AadhaarOTPmgov();
        const resp = await aadhaarOTPmgov.submitAadhaarOTP(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});


module.exports = router;
