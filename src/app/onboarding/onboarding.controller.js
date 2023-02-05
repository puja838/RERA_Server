const express       = require('express');
const router        = express.Router();
const validator     = require('../../utility/validator');
const model         = require('./onboarding.model');
const validate      = require('./onboarding.validation');
const util          = require('../../utility/util');

router.post('/v1/onboarding/getOnboardingCountData', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getOnboardingCountDataReq(reqData)) {
        const resp = await model.getOnboardingCountData(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.get('/v1/onboarding/getAllRegisteredProjectCountDistrictwise', async (req, res) => {
    const resp = await model.getAllRegisteredProjectCountDistrictwise();
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
});
router.get('/v1/onboarding/getProjectLatLong', async (req, res) => {
    const resp = await model.getProjectLatLong();
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
});
router.get('/v1/onboarding/getWhatsNew', async (req, res) => {
    const resp = await model.getWhatsNew();
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
});


module.exports = router;
