const express = require('express');
const router = express.Router();
const validator = require('../../utility/validator');
const model = require('./project_execution.model');
const validate = require('./project_execution.validation');
const util = require('../../utility/util');
const formdataservice = require('../services/formdata.service');


router.post('/v1/project-execution/getProjectDetail', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getProjectDetailReq(reqData)) {
        const resp = await model.getProjectDetail(req.body);
        res.json({
            success: resp.success,
            status: resp.status,
            message: resp.message,
            response: resp.response,
            sign: resp.sign
        });
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/project-execution/getSubmittedQuoterList', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getQuoterListReq(reqData)) {
        const resp = await model.getSubmittedQuoterList(req.body);
        res.json({
            success: resp.success,
            status: resp.status,
            message: resp.message,
            response: resp.response,
            sign: resp.sign
        });
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/project-execution/getPendingQuoterList', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getQuoterListReq(reqData)) {
        const resp = await model.getPendingQuoterList(req.body);
        res.json({
            success: resp.success,
            status: resp.status,
            message: resp.message,
            response: resp.response,
            sign: resp.sign
        });
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/project-execution/getInventoryData', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getInventoryDataReq(reqData)) {
        const resp = await model.getInventoryData(req.body);
        res.json({
            success: resp.success,
            status: resp.status,
            message: resp.message,
            response: resp.response,
            sign: resp.sign
        });
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/project-execution/getConstructionProgress', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getConstructionProgress(reqData)) {
        const resp = await model.getConstructionProgress(req.body);
        res.json({
            success: resp.success,
            status: resp.status,
            message: resp.message,
            response: resp.response,
            sign: resp.sign
        });
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/project-execution/upsertConstructionProgress', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.upsertConstructionProgressReq(reqData)) {
        const resp = await model.upsertConstructionProgress(reqData);
        res.json({
            success: resp.success,
            status: resp.status,
            message: resp.message,
            response: resp.response,
            sign: resp.sign
        });
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

////Sayan

router.post('/v1/project-execution/getFinancial_details', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.listReq(reqData)) {
        const resp = await model.getList(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/project-execution/addFinancial_details', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.addReq(reqData)) {
        const resp = await model.addFinancial_details(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/project-execution/updateFinancial_details', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.updateReq(reqData)) {
        const resp = await model.updateFinancial_details(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/project-execution/addLegalCase', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.addLegalCase(reqData)) {
        const resp = await model.addLegalCase(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/project-execution/getLegalCase', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getLegalCase(reqData)) {
        const resp = await model.getLegalCase(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/project-execution/getBuildingPhotograph', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getBuildingPhotographReq(reqData)) {
        const resp = await model.getBuildingPhotograph(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
/*router.post('/v1/project-execution/updateLegalCase', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.updateLegalCase(reqData)) {
        const resp = await model.updateLegalCase(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});*/

router.get('/v1/project-execution/getPhotoParticulars', async (req, res) => {
    const resp = await model.getPhotoParticulars();
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
});

router.post('/v1/project-execution/uploadPhotoParticulars', async (req, res) => {
    const reqbody = await formdataservice.handelFormData(req, 'file');
    if (reqbody.success) {
        if (validate.uploadPhotoParticularsReq(reqbody)) {
            const resp = await model.uploadPhotoParticulars(reqbody);
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
router.post('/v1/project-execution/deleteBuildingPhoto', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.deleteBuildingPhotoReq(reqData)) {
        const resp = await model.deleteBuildingPhoto(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});


module.exports = router;
