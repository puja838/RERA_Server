const express = require('express');
const router = express.Router();
const validator = require('../../utility/validator');
const model = require('./project.model');
const validate = require('./project.validation');
const util = require('../../utility/util');
const formdataservice = require('../services/formdata.service');


router.post('/v1/project/form-info', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.listReq(reqData)) {
        const resp = await model.formInfo(req.body);
        res.json({
            success: resp.success,
            status: resp.status,
            message: resp.message,
            response: resp.response,
            sign: resp.sign,
            amt: resp.amt
        });
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/project/create-new-temp-project', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.createNewTempProjectReq(reqData)) {
        const resp = await model.createNewTempProject(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/project/store-temp', async (req, res) => {
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
router.post('/v1/project/delete-temp', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.deleteFromTempByIdReq(reqData)) {
        const resp = await model.deleteFromGroup(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/project/submit', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.submitReq(reqData)) {
        const resp = await model.submitForm(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/project/getProjectList', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getProjectListReq(reqData)) {
        const resp = await model.getProjectList(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});


router.post('/v1/project/getSystemVerificationFields', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getSystemVerificationFieldsReq(reqData)) {
        const resp = await model.getSystemVerificationFields(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/project/getRegistrationCertificate', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getRegistrationCertificateFieldsReq(reqData)) {
        const resp = await model.getRegistrationCertificate(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/project/getRegistrationCertificate_v2', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getRegistrationCertificateFieldsReq(reqData)) {
        const resp = await model.getRegistrationCertificate_v2(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/project/updateApprovalComments', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.updateApprovalCommentsReq(reqData)) {
        const resp = await model.updateApprovalComments(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/project/isChairmanApprove', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.isChairmanApproveReq(reqData)) {
        const resp = await model.isChairmanApprove(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/project/getProjectDashboardData', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getProjectDashboardDataReq(reqData)) {
        const resp = await model.getProjectDashboardData(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/project/addallfielddetails', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.addAllFieldDetailsReq(reqData)) {
        const resp = await model.addAllFieldDetails(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/project/getState', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.listReq(reqData)) {
        const resp = await model.getState(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/project/getDistricts', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.listDist(reqData)) {
        const resp = await model.getDistricts(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/project/deleteDraftProject', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.deleteDraftProjectReq(reqData)) {
        const resp = await model.deleteDraftProject(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/project/isPaymentComplete', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.isPaymentCompleteReq(reqData)) {
        const resp = await model.isPaymentComplete(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/project/uploadSignature', async (req, res) => {
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
router.post('/v1/project/fetchUpdateProjectDetailsForUser', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.fetchUpdateProjectDetailsForUserReq(reqData)) {
        const resp = await model.fetchUpdateProjectDetailsForUser(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/project/getFinancialYearList', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getFinancialYearListReq(reqData)) {
        const resp = await model.getFinancialYearList(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/project/saveCertificateContent', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.saveCertificateContentReq(reqData)) {
        const resp = await model.saveCertificateContent(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/project/getNewLunchedProjects', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getNewLunchedProjectsReq(reqData)) {
        const resp = await model.getNewLunchedProjects(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/project/getProjectsStatusByApplicationNo', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getProjectsStatusByApplicationNoReq(reqData)) {
        const resp = await model.getProjectsStatusByApplicationNo(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});


module.exports = router;
