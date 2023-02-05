const express       = require('express');
const router        = express.Router();
const validator     = require('../../utility/validator');
const model         = require('./notification.model');
const validate      = require('./notification.validation');
const util          = require('../../utility/util');


router.post('/v1/notification/list', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.listReq(reqData)) {
        const resp = await model.getNotificationList(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
router.post('/v1/notification/count', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getNotificationCountReq(reqData)) {
        const resp = await model.getNotificationCount(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});
module.exports = router;