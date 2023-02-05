const express       = require('express');
const router        = express.Router();
const validator     = require('../../utility/validator');
const model         = require('./mst_checklist_tab_map.model');
const validate      = require('./mst_checklist_tab_map.validation');
const util          = require('../../utility/util');


router.post('/v1/checklist/gettabentitymap', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getTabEntityMap(reqData)) {
        const resp = await model.getTabEntityMap(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/checklist/addtabentitymap', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.addTabEntityMap(reqData)) {
        const resp = await model.addTabEntityMap(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/checklist/updatetabentitymap', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.updateTabEntityMap(reqData)) {
        const resp = await model.updateTabEntityMap(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});


router.post('/v1/checklist/deletetabentitymap', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.deleteTabEntityMap(reqData)) {
        const resp = await model.deleteTabEntityMap(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});


module.exports = router;