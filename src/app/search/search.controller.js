const express = require('express');
const router = express.Router();
const util = require('../../utility/util');
const model = require('./search.model');
const validator = require('../../utility/validator');

router.post('/v1/search/search', async (req, res) => {
    // let reqData = validator.requestFilter(req.body);
    // if (validate.userFromStep(reqData)) {
    const resp = await model.search(req.body);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});

});
router.post('/v1/search/fetchProjectType', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    // if (validate.userFromStep(reqData)) {
    const resp = await model.fetchProjectType(reqData);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});

});
router.post('/v1/search/maxFieldValue', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    // if (validate.userFromStep(reqData)) {
    const resp = await model.maxFieldValue(reqData);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});

});
router.post('/v1/search/fetchProjectDetails', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    // if (validate.userFromStep(reqData)) {
    const resp = await model.fetchProjectDetails(reqData);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
});
router.post('/v1/search/fetchProjectValueDetails', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    // if (validate.userFromStep(reqData)) {
    const resp = await model.fetchProjectValueDetails(reqData);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
});
router.post('/v1/search/fetchCommonAmenities', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    // if (validate.userFromStep(reqData)) {
    const resp = await model.fetchCommonAmenities(reqData);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
});
router.post('/v1/search/fetchBuildingDetails', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    // if (validate.userFromStep(reqData)) {
    const resp = await model.fetchBuildingDetails(reqData);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
});
router.post('/v1/search/fetchProfileValueDetails', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    // if (validate.userFromStep(reqData)) {
    const resp = await model.fetchProfileValueDetails(reqData);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
});
router.post('/v1/search/fetchDocuments', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    // if (validate.userFromStep(reqData)) {
    const resp = await model.fetchDocuments(reqData);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
});
router.post('/v1/search/fetchEngineerDetails', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    // if (validate.userFromStep(reqData)) {
    const resp = await model.fetchEngineerDetails(reqData);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
});
router.post('/v1/search/fetchPromoterDetails', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    // if (validate.userFromStep(reqData)) {
    const resp = await model.fetchPromoterDetails(reqData);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
});
router.post('/v1/search/fetchProjectByStatus', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    // if (validate.userFromStep(reqData)) {
    const resp = await model.fetchProjectByStatus(reqData);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
});
router.post('/v1/search/fetchDirectorDetails', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    // if (validate.userFromStep(reqData)) {
    const resp = await model.fetchDirectorDetails(reqData);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
});
router.post('/v1/search/fetchPastProject', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    // if (validate.userFromStep(reqData)) {
    const resp = await model.fetchPastProject(reqData);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
});
router.post('/v1/search/fetchFullBuildingDetails', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    // if (validate.userFromStep(reqData)) {
    const resp = await model.fetchFullBuildingDetails(reqData);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
});
router.post('/v1/search/fetchFinancialDocuments', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    // if (validate.userFromStep(reqData)) {
    const resp = await model.fetchFinancialDocuments(reqData);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
});
module.exports = router;