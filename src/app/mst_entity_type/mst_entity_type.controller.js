const express       = require('express');
const router        = express.Router();
const validator     = require('../../utility/validator');
const model     = require('./mst_entity_type.model');
const validate  = require('./mst_entity_type.validation');
const util          = require('../../utility/util');


router.post('/v1/mst-entity-type/list', async (req, res) => {
    const resp = await model.getList(req.body);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
});
router.post('/v1/mst-entity-type/getEntityTypeByEntity', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getEntityTypeByEntityReq(reqData)) {
        const resp = await model.getEntityTypeByEntity(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/mst-entity-type/add', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.addReq(reqData)) {
        const resp = await model.add(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/mst-entity-type/update', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.updateReq(reqData)) {
        const resp = await model.update(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/mst-entity-type/delete', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.deleteReq(reqData)) {
        const resp = await model.delete(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});


module.exports = router;