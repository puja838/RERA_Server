const express       = require('express');
const router        = express.Router();
const validator     = require('../../utility/validator');
const model         = require('./mst_checklist_tab_master.model');
const validate      = require('./mst_checklist_tab_master.validation');
const util          = require('../../utility/util');


router.post('/v1/checklist/gettabname', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getTabName(reqData)) {
        const resp = await model.getTabName(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/checklist/addtabname', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.addTabName(reqData)) {
        const resp = await model.addTabName(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/checklist/updatetabname', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.updateTabName(reqData)) {
        const resp = await model.updateTabName(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});


router.post('/v1/checklist/deletetabname', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.deleteTabName(reqData)) {
        const resp = await model.deleteTabName(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});


module.exports = router;