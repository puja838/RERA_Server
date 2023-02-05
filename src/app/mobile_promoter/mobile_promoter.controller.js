const express = require('express');
const router = express.Router();
const validator = require('../../utility/validator');
const model = require('./mobile_promoter.model');
const validate = require('./mobile_promoter.validation');
const util = require('../../utility/util');
const formdataservice = require('../services/formdata.service');


router.post('/v1/m-promoter/dashboard', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.dashboardReq(reqData)) {
        const resp = await model.getProjectDashboardData(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/m-promoter/projectList', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.projectListReq(reqData)) {
        const resp = await model.getProjectList(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/m-promoter/getProjectDetails', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getProjectDetailsReq(reqData)) {
        const resp = await model.getProjectDetails(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/m-promoter/getQprProjects', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getQprProjectsReq(reqData)) {
        const resp = await model.getQprProjects(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/m-promoter/getProjectDetailsLatLong', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getProjectDetailsLatLong(reqData)) {
        const resp = await model.getProjectDetailsLatLong(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/m-promoter/getProfileDetails', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getProfileDetailsReq(reqData)) {
        const resp = await model.getProfileDetails(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/m-promoter/getSiteLocationImg', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getSiteLocationImgReq(reqData)) {
        const resp = await model.getSiteLocationImg(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/m-promoter/deleteSiteLocationImg', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.deleteSiteLocationImgReq(reqData)) {
        const resp = await model.deleteSiteLocationImg(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/m-promoter/uploadSiteLocationImg', async (req, res) => {
    const reqbody = await formdataservice.handelFormData(req, 'file');
    if (reqbody.success) {
        if (validate.uploadSiteLocationImgReq(reqbody)) {
            const resp = await model.uploadSiteLocationImg(reqbody);
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
module.exports = router;