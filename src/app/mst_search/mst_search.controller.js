const express       = require('express');
const router        = express.Router();
const validator     = require('../../utility/validator');
const model         = require('./mst_search.model');
const validate      = require('./mst_search.validation');
const util          = require('../../utility/util');

router.post('/v1/search/project', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.mstSearchDetails(reqData)) {
        const resp = await model.mstSearchDetails(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/search/project-respondent', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.projectRespondentReq(reqData)) {
        const resp = await model.projectRespondent(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

module.exports = router;

