const express       = require('express');
const router        = express.Router();
const validator     = require('../../utility/validator');
const model         = require('./mst_workflow_steps.model');
const validate      = require('./mst_workflow_steps.validation');
const util          = require('../../utility/util');


router.post('/v1/mst_workflow_steps/list', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.listReq(reqData)) {
        const resp = await model.getList(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/mst_workflow_steps/add', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.addReq(reqData)) {
        const resp = await model.add(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/mst_workflow_steps/update', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.updateReq(reqData)) {
        const resp = await model.update(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/mst_workflow_steps/delete', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.deleteReq(reqData)) {
        const resp = await model.delete(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});


module.exports = router;