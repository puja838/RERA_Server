const express = require('express');
const router = express.Router();
const validator = require('../../utility/validator');
const model = require('./mst_notice.model');
const validate = require('./mst_notice.validation');
const util = require('../../utility/util');
const common = require('../services/common.service');
const formdataservice = require('../services/formdata.service');
router.post('/v1/mst_notice/list', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.listReq(reqData)) {
        const resp = await model.getList(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/mst_notice/getNotices', async (req, res) => {
    // let reqData = validator.requestFilter(req.body);
    console.log(req.body)
    if (validate.getNotices(req.body)) {
        const resp = await model.getNotices(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/mst_notice/add', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.addReq(reqData)) {
        const resp = await model.add(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/mst_notice/update', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.updateReq(reqData)) {
        const resp = await model.update(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/mst_notice/delete', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.deleteReq(reqData)) {
        const resp = await model.delete(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/mst_notice/fileupload', async (req, res) => {
    const reqbody = await formdataservice.handelFormData(req, 'news');
    if (reqbody.success) {
        res.json({success: true, status: 200, message: '', response: reqbody});
    } else {
        res.json({
            success: false,
            status: util.statusCode.CUSTOM_ERROR,
            message: reqbody.message,
            response: null
        });
    }
});
module.exports = router;