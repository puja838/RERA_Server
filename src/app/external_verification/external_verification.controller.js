const express       = require('express');
const router        = express.Router();
const validator     = require('../../utility/validator');
const model  = require('./external_verification.model');
const validate      = require('./external_verification.validation');
const util          = require('../../utility/util');

router.post('/v1/verify/cin', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.cinReq(reqData)) {
        const resReturn = await model.verifyCIN(req.body);
        res.json({success: resReturn.success, status: resReturn.status, message: resReturn.message, response: resReturn.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/verify/din', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.dinReq(reqData)) {
        const resReturn = await model.verifyDIN(req.body);
        res.json({success: resReturn.success, status: resReturn.status, message: resReturn.message, response: resReturn.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/verify/gstin', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.gstinReq(reqData)) {
        const resReturn = await model.verifyGSTIN(req.body);
        res.json({success: resReturn.success, status: resReturn.status, message: resReturn.message, response: resReturn.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

module.exports = router;
  
