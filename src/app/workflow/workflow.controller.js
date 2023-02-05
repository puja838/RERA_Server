const express = require('express');
const router = express.Router();
const validator = require('../../utility/validator');
const model = require('./workflow.model');
const validate = require('./workflow.validation');
const util = require('../../utility/util');
const formdataservice = require('../services/formdata.service');

router.post('/v1/workflow/moveWorkflow', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.addReq(reqData)) {
        const resp = await model.moveWorkflow(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/workflow/workflowStepUserQuery', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.addQuery(reqData)) {
        const resp = await model.workflowStepUserQuery(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/workflow/workflowStepResolvedQuery', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.resolvedQuery(reqData)) {
        const resp = await model.workflowStepResolvedQuery(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/workflow/workflowStepQueryAnswer', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.answerQuery(reqData)) {
        const resp = await model.workflowStepQueryAnswer(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/workflow/workflowStepQueryComment', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.commentQuery(reqData)) {
        const resp = await model.workflowStepQueryComment(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/workflow/workflowStepAttachment', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.commentAttachment(reqData)) {
        const resp = await model.workflowStepQueryComment(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/workflow/workflowStepChecklistComment', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.commentChecklist(reqData)) {
        const resp = await model.workflowStepChecklistComment(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/workflow/workflowStepChecklistPromoterComment', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.commentPromoter(reqData)) {
        const resp = await model.workflowStepChecklistPromoterComment(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/workflow/workflowStepChecklistApprove', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.approveCommentPromoter(reqData)) {
        const resp = await model.workflowStepChecklistApprove(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/workflow/invalidateQuery', async (req, res) => {
    // let reqData = validator.requestFilter(req.body);
    if (validate.invalidateQuery(req.body)) {
        const resp = await model.invalidateQuery(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/workflow/fetchUserFromStep', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.userFromStep(reqData)) {
        const resp = await model.fetchUserFromStep(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/workflow/getProjectHistory', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    // if (validate.userFromStep(reqData)) {
    const resp = await model.getProjectHistory(req.body);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    // } else {
    //     res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    // }
});
router.post('/v1/workflow/hasValidQuery', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    // if (validate.userFromStep(reqData)) {
    const resp = await model.hasValidQuery(req.body);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    // } else {
    //     res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    // }
});
router.post('/v1/workflow/fetchRoleUserInStep', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    const resp = await model.fetchRoleUserInStep(req.body);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
});
router.post('/v1/workflow/changeUserInStep', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    const resp = await model.changeUserInStep(req.body);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
});
router.post('/v1/workflow/workflowStepQueryAnswerMultiple', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    const resp = await model.workflowStepQueryAnswerMultiple(req.body);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
});
router.post('/v1/workflow/updateExtensionStatus', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    const resp = await model.updateExtensionStatus(req.body);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
});
router.post('/v1/workflow/updateAgentStatus', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    const resp = await model.updateAgentStatus(req.body);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
});
router.post('/v1/workflow/workflowStepQueryAnswerComment', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    const resp = await model.workflowStepQueryAnswerComment(req.body);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
});
router.post('/v1/workflow/fileupload', async (req, res) => {
    const reqbody = await formdataservice.handelFormData(req, 'file');
    res.json({success: true, status: 200, message: '', response: reqbody});
});

module.exports = router;
