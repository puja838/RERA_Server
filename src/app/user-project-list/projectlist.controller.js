const express = require('express');
const router = express.Router();
const validator = require('../../utility/validator');
const model = require('./projectlist.model');
const validate = require('./projectlist.validation');
const util = require('../../utility/util');


router.post('/v1/userprojectlist/fetchProjectDetailsForUser', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.fetchProjectDetails(reqData)) {
        const resp = await model.fetchProjectDetailsForUser(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/userprojectlist/fetchProjectDetailsbyisApprove', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.fetchProjectDetailsbyapprove(reqData)) {
        const resp = await model.fetchProjectDetailsbyisApprove(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/userprojectlist/fetchProjectDetailsById', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.fetchProjectDetailsbyId(reqData)) {
        const resp = await model.fetchProjectDetailsById(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/userprojectlist/fetchTabbyEntityType', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.tabEntity(reqData)) {
        const resp = await model.fetchTabbyEntityType(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/userprojectlist/fetchChecklistByTab', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.tabChecklist(reqData)) {
        const resp = await model.fetchChecklistByTab(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/userprojectlist/getNextStepDetails', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getNextStepDetails(reqData)) {
        const resp = await model.getNextStepDetails(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/userprojectlist/getQueryCommentsByProject', async (req, res) => {
    // let reqData = validator.requestFilter(req.body);
    if (validate.projectQueryComment(req.body)) {
        const resp = await model.getQueryCommentsByProject(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/userprojectlist/getStepidBytype', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getStepidBytype(reqData)) {
        const resp = await model.getStepidBytype(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/userprojectlist/getOfficerQuestion', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getOfficerQuestion(reqData)) {
        const resp = await model.getOfficerQuestion(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/userprojectlist/insertOfficerAnswer', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    const resp = await model.insertOfficerAnswer(req.body);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});

});
router.post('/v1/userprojectlist/insertInternalNotes', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    const resp = await model.insertInternalNotes(req.body);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});

});
router.post('/v1/userprojectlist/getInternalNotes', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    const resp = await model.getInternalNotes(req.body);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});

});
router.post('/v1/userprojectlist/getSingleQueryAnswer', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    const resp = await model.getSingleQueryAnswer(req.body);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});

});
router.post('/v1/userprojectlist/getApprovalTypes', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    const resp = await model.getApprovalTypes(req.body);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});

});
router.post('/v1/userprojectlist/insertApprovalNotes', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    const resp = await model.insertApprovalNotes(req.body);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});

});
router.post('/v1/userprojectlist/getApprovalNotes', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    const resp = await model.getApprovalNotes(req.body);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});

});
router.post('/v1/userprojectlist/getChairmanApprovalTypes', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    const resp = await model.getChairmanApprovalTypes(req.body);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});

});
router.post('/v1/userprojectlist/getPromoterQueryDashboard', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    const resp = await model.getPromoterQueryDashboard(req.body);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});

});
router.post('/v1/userprojectlist/getQueryById', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    const resp = await model.getQueryById(req.body);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});

});
router.post('/v1/userprojectlist/fetchProjectDetailsForUserCount', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    const resp = await model.fetchProjectDetailsForUserCount(req.body);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});

});
router.post('/v1/userprojectlist/fetchProjectRegisterCount', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    const resp = await model.fetchProjectRegisterCount(req.body);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});

});

router.post('/v1/userprojectlist/fetchRevenue', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    const resp = await model.fetchRevenue(req.body);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});

});
router.post('/v1/userprojectlist/fetchChecklistByTabExtension', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    const resp = await model.fetchChecklistByTabExtension(req.body);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});

});
router.post('/v1/userprojectlist/getPromoterAnswer', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    const resp = await model.getPromoterAnswer(req.body);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});

});
router.post('/v1/userprojectlist/fetchProjectRegisterDetails', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    const resp = await model.fetchProjectRegisterDetails(req.body);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});

});
module.exports = router;
