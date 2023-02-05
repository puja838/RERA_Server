const express       = require('express');
const router        = express.Router();
const validator     = require('../../utility/validator');
const ifscmodel  = require('./ifsc_validation.model');
const validate      = require('./ifsc_validation.validation');
const util          = require('../../utility/util');

router.post('/v1/verification/verifyifsc', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.listReq(reqData)) {
        const ifscObject = new ifscmodel.IFSC();
        const resReturn = await ifscObject.verifyIfsc(req.body);
        res.json({success: resReturn.success, status: resReturn.status, message: resReturn.message, response: resReturn.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

module.exports = router;
  
