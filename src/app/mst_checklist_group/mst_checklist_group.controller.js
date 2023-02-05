const express       = require('express');
const router        = express.Router();
const validator     = require('../../utility/validator');
const model         = require('./mst_checklist_group.model');
const validate      = require('./mst_checklist_group.validation');
const util          = require('../../utility/util');


router.post('/v1/checklist/addgroupname', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.addGroupName(reqData)) {
        const resp = await model.addGroupName(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/checklist/updategroupname', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.updateGroupName(reqData)) {
        const resp = await model.updateGroupName(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});


router.post('/v1/checklist/deletegroupname', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.deleteGroupName(reqData)) {
        const resp = await model.deleteGroupName(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});


module.exports = router;