const express       = require('express');
const router        = express.Router();
const validator     = require('../../utility/validator');
const model         = require('./location.model');
const validate      = require('./location.validation');
const util          = require('../../utility/util');


router.post('/v1/location/getlatlong', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getlatlongReq(reqData)) {
        const resp = await model.getlatlong(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

module.exports = router;