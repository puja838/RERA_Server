const express       = require('express');
const router        = express.Router();
const validator     = require('../../utility/validator');
const model     = require('./mstfields.model');
const validate  = require('./mstfields.validation');
const util          = require('../../utility/util');

module.exports = router;

router.post('/v1/mst-fields/list', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.addReq(reqData)) {
        const resp = await model.getList(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});