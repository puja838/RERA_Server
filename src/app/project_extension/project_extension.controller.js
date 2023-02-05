const express           =   require('express');
const router            =   express.Router();
const validator         =   require('../../utility/validator');
const model             =   require('./project_extension.model');
const validate          =   require('./project_extension.validation');
const util              =   require('../../utility/util');


router.post('/v1/project-extension/projectList', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.listReq(reqData)) {
        const resp = await model.getProjectListForExtension(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/project-extension/generateProjectExtensionId', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.generateProjectExtensionIdReq(reqData)) {
        const resp = await model.generateProjectExtensionId(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});


router.post('/v1/project-extension/getExtensionList', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getExtensionListReq(reqData)) {
        const resp = await model.getExtensionList(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/project-extension/saveProjectExtensionInfo', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.saveProjectExtensionInfoReq(reqData)) {
        const resp = await model.saveProjectExtensionInfo(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/project-extension/getDevelopmentPlan', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getDevelopmentPlanReq(reqData)) {
        const resp = await model.getDevelopmentPlan(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/project-extension/upsertDevelopmentPlan', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.upsertDevelopmentPlanReq(reqData)) {
        const resp = await model.upsertDevelopmentPlan(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/project-extension/getDocuments', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getDocumentsReq(reqData)) {
        const resp = await model.getDocuments(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/project-extension/upsertDocumentData', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.upsertDocumentDataReq(reqData)) {
        const resp = await model.upsertDocumentData(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/project-extension/deleteOtherDocData', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.deleteOtherDocDataReq(reqData)) {
        const resp = await model.deleteOtherDocData(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/project-extension/submitForExtension', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.submitForExtensionReq(reqData)) {
        const resp = await model.submitForExtension(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/project-extension/getExtensionCertificate', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getExtensionCertificateReq(reqData)) {
        const resp = await model.getExtensionCertificate(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/project-extension/saveCertificateContent', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.saveCertificateContentReq(reqData)) {
        const resp = await model.saveCertificateContent(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

module.exports = router;
