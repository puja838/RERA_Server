const express       = require('express');
const router        = express.Router();
const validator     = require('../../utility/validator');
const model         = require('./agent.model');
const validate      = require('./agent.validation');
const util          = require('../../utility/util');


router.post('/v1/agent/getRegistrationCertificate', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getRegistrationCertificateFieldsReq(reqData)) {
        const resp = await model.getRegistrationCertificate_v2(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/agent/saveCertificateContent', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.saveCertificateContentReq(reqData)) {
        const resp = await model.saveCertificateContent(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});



router.post('/v1/agent/getDashboardData', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getDashboardDataReq(reqData)) {
        const resp = await model.getDashboardData(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/agent/getDashboardAlert', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getDashboardDataReq(reqData)) {
        const resp = await model.getDashboardAlert(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
module.exports = router;