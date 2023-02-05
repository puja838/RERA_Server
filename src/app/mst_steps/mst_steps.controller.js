const express       = require('express');
const router        = express.Router();
const validator     = require('../../utility/validator');
const model     = require('./mst_steps.model');
const validate  = require('./mst_steps.validation');
const util          = require('../../utility/util');



router.post('/v1/mst-step/list', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.listReq(reqData)) {
        const resp = await model.getList(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/mst-step/add', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.addReq(reqData)) {
        const resp = await model.add(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/mst-step/update', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.updateReq(reqData)) {
        const resp = await model.update(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/mst-step/delete', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.deleteReq(reqData)) {
        const resp = await model.delete(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/mst-step/updateSequence', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (reqData.data.length > 0 && validate.updateSequenceReq(reqData.data[0])) {
        const resp = await model.updateSequence(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

module.exports = router;