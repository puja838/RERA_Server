const express       = require('express');
const router        = express.Router();
const validator     = require('../../utility/validator');
const model         = require('./past_project_details.model');
const validate      = require('./past_project_details.validation');
const util          = require('../../utility/util');

router.post('/v1/project/past-projects', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.listReq(reqData)) {
        const resp = await model.pastProjectsInfo(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/project/getPastProjectOutsideCaseDtl', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getPastProjectOutsideCaseDtlReq(reqData)) {
        const resp = await model.getPastProjectOutsideCaseDtl(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

module.exports = router;