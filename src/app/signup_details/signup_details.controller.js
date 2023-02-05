const express       = require('express');
const router        = express.Router();
const validator     = require('../../utility/validator');
const model         = require('./signup_details.model');
const validate      = require('./signup_details.validation');
const util          = require('../../utility/util');
const formdataservice = require('../services/formdata.service');

router.post('/v1/signup/userSignUpInfo', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.createNewSignUpInfoReq(reqData)) {
        const resp = await model.createNewSignUpInfo(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/signup/getSignUpInfo', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getSignUpInfoReq(reqData)) {
        const resp = await model.getSignUpInfo(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});


router.post('/v1/signup/updateSignUpInfo', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.updateSignUpInfoReq(reqData)) {
        const resp = await model.updateSignUpInfo(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});


router.post('/v1/signup/deleteSignUpInfo', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.deleteSignUpInfoReq(reqData)) {
        const resp = await model.deleteSignUpInfo(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/signup/storeUserInfo', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.storeUserInfo(reqData)) {
        const resp = await model.storeFieldDataintemp(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/signup/checkSMS', async (req, res) => {
    const resp = await model.checkSMS(req.body);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
});

router.post('/v1/signup/checkEmail', async (req, res) => {
    const resp = await model.checkEmail(req.body);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
});



module.exports = router;