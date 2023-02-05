const express = require('express');
const router = express.Router();
const validator = require('../../utility/validator');
const model = require('./render_profile.model');
const validate = require('./render_profile.validation');
const util = require('../../utility/util');
const formdataservice = require('../services/formdata.service');


router.post('/v1/render-profile/form-info', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.listReq(reqData)) {
        const resp = await model.formInfo(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response,signature:resp.signature});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null,signature:null});
    }
});
router.post('/v1/render-profile/store-temp', async (req, res) => {
    const reqbody = await formdataservice.handelFormData(req, 'file');
    if (reqbody.success) {
        if (validate.storeFieldInfoIntoTempReq(reqbody)) {
            const resp = await model.storeFieldInfoIntoTemp(reqbody);
            res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
        } else {
            res.json({
                success: false,
                status: util.statusCode.PARAM_MISSING,
                message: "Parameter missing",
                response: null
            });
        }
    } else {
        res.json({
            success: false,
            status: util.statusCode.CUSTOM_ERROR,
            message: reqbody.message,
            response: null
        });
    }
});
router.post('/v1/render-profile/delete-temp', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.deleteFromTempByIdReq(reqData)) {
        const resp = await model.deleteFromGroup(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/render-profile/submit', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.submitReq(reqData)) {
        const resp = await model.submitForm(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/render-profile/getFormSubmitInfo', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getFormSubmitInfo(reqData)) {
        const resp = await model.getFormSubmitInfo(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/render-profile/uploadSignature', async (req, res) => {
    const reqbody = await formdataservice.handelFormData(req, 'file');
    if (reqbody.success) {
        if (validate.uploadSignatureReq(reqbody)) {
            const resp = await model.uploadSignature(reqbody);
            res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
        } else {
            res.json({
                success: false,
                status: util.statusCode.PARAM_MISSING,
                message: "Parameter missing",
                response: null
            });
        }
    } else {
        res.json({
            success: false,
            status: util.statusCode.CUSTOM_ERROR,
            message: reqbody.message,
            response: null
        });
    }
});


router.post('/v1/render-profile/renewal', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.submitReq(reqData)) {
        const resp = await model.renewalForm(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

module.exports = router;