const express       = require('express');
const router        = express.Router();
const validator     = require('../../utility/validator');
const model         = require('./login_info.model');
const validate      = require('./login_info.validation');
const util          = require('../../utility/util');
const formdataservice = require('../services/formdata.service');


router.post('/v1/login/userLoginInfo', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.listReq(reqData)) {
        const resp = await model.userLoginInfo(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

module.exports = router;