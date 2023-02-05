const express       = require('express');
const router        = express.Router();
const validator     = require('../../utility/validator');
const panmodel  = require('./pan_validation.model');
const validate      = require('./pan_validation.validation');
const util          = require('../../utility/util');

router.post('/v1/verification/verifypan', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.listReq(reqData)) {
        // const pancard = new Pancard();
        // resReturn = await pancard.verifyPanNumber(panno);
        const pancard = new panmodel.Pancard();
        const resReturn = await pancard.verifyPanNumber(req.body);
        res.json({success: resReturn.success, status: resReturn.status, message: resReturn.message, response: resReturn.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

module.exports = router;
  
