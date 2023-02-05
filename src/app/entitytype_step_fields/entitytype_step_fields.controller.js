const express       = require('express');
const router        = express.Router();
const validator     = require('../../utility/validator');
const model         = require('./entitytype_step_fields.model');
const validate      = require('./entitytype_step_fields.validation');
const util          = require('../../utility/util');



router.post('/v1/entitytype-step-fields/landingData', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.listReq(reqData)) {
        const resp = await model.landingData(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/entitytype-step-fields/list', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.listReq(reqData)) {
        const resp = await model.getList(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/entitytype-step-fields/getFieldList', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getFieldListReq(reqData)) {
        const resp = await model.getFieldList(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/entitytype-step-fields/add', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.addReq(reqData)) {
        const resp = await model.add(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/entitytype-step-fields/update', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.updateReq(reqData)) {
        const resp = await model.update(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/entitytype-step-fields/delete', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.deleteReq(reqData)) {
        const resp = await model.delete(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});


module.exports = router;