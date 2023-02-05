const express       = require('express');
const router        = express.Router();
const validator     = require('../../utility/validator');
const fieldmodel  = require('./email_mobile_validation.model');
const validate      = require('./email_mobile_validation.validation');
const util          = require('../../utility/util');

const cors = require("cors");
const crypto = require("crypto");
const { off } = require("process");
// const SMSmgov  = require("./smsmgov")
// const AadhaarOTPmgov  = require("./aadhaarotp")
// const port = process.env.PORT || 3000;



router.post('/v1/validation/generateFieldOTP', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.listReq(reqData)) {
        const fieldOTPmgov = new fieldmodel.FieldOTPmgov();
        const resp = await fieldOTPmgov.generateFieldOTP(req.body);
        console.log(JSON.stringify(resp));
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});


router.post('/v1/validation/submitFieldOTP', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.submitField(reqData)) {
        const fieldOTPmgov = new fieldmodel.FieldOTPmgov();
        const resp = await fieldOTPmgov.submitFieldOTP(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});


module.exports = router;
