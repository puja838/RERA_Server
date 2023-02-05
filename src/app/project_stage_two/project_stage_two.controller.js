const express           =   require('express');
const router            =   express.Router();
const validator         =   require('../../utility/validator');
const model             =   require('./project_stage_two.model');
const validate          =   require('./project_stage_two.validation');
const util              =   require('../../utility/util');
const formdataservice   =   require('../services/formdata.service');


router.post('/v1/project-stage-two/form-info', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.listReq(reqData)) {
        const resp = await model.getFieldListWithStep(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response, sign: resp.sign});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/project-stage-two/store-temp', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.storeTempReq(reqData)) {
        const resp = await model.storeTemp(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response, sign: resp.sign});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/project-stage-two/submitForm', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.submitFormReq(reqData)) {
        const resp = await model.submitForm(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response, sign: resp.sign});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});


router.post('/v1/project-stage-two/getBuildingListOfProject', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getBuildingListOfProjectReq(reqData)) {
        const resp = await model.getBuildingListOfProject(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response, sign: resp.sign});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});


router.post('/v1/project-stage-two/getInformationUpdateData', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getBuildingListOfProjectReq(reqData)) {
        const resp = await model.getInformationUpdateData(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response, sign: resp.sign});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/project-stage-two/saveInformationUpdateData', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.saveInformationUpdateDataReq(reqData)) {
        const resp = await model.saveInformationUpdateData(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response, sign: resp.sign});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/project-stage-two/getStageTwoHdr', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getStageTwoHdrReq(reqData)) {
        const resp = await model.getStageTwoHdr(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response, sign: resp.sign});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/project-stage-two/getInventoryDetails', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getStageTwoHdrReq(reqData)) {
        const resp = await model.getInventoryDetails(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response, sign: resp.sign});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/project-stage-two/saveInventoryData', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.saveInventoryDataReq(reqData)) {
        const resp = await model.saveInventoryData(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response, sign: resp.sign});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

module.exports = router;
