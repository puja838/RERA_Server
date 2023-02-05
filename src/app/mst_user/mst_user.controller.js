const express       = require('express');
const router        = express.Router();
const validator     = require('../../utility/validator');
const model         = require('./mst_user.model');
const validate      = require('./mst_user.validation');
const util          = require('../../utility/util');
const common = require('../services/common.service');


router.post('/v1/mst_user/login', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.login(reqData)) {
        const resp = await model.login(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/token/generateToken', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getUserReq(reqData)) {
        const resp = await model.generateToken(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/mst_user/list', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.listReq(reqData)) {
        const resp = await model.getList(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/mst_user/generateToken', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.listReq(reqData)) {
        const resp = await common.generateToken(req.body);
        res.json({success: true, status: 200, message: '', response: JSON.parse(resp)});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/mst_user/add', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.addReq(reqData)) {
        const resp = await model.add(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/mst_user/getUserDetails', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getUserReq(reqData)) {
        const resp = await model.getUserDetails(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/mst_user/update', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.updateReq(reqData)) {
        const resp = await model.update(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/mst_user/delete', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.deleteReq(reqData)) {
        const resp = await model.delete(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/mst_user/rolelist', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.listReq(reqData)) {
        const resp = await model.rolelist(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/mst_user/changeRoleName', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.changeRoleName(reqData)) {
        const resp = await model.changeRoleName(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
module.exports = router;