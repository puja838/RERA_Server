const express       = require('express');
const router        = express.Router();
const validator     = require('../../utility/validator');
const model     = require('./mstunit.model');
const validate  = require('./mstunit.validation');
const util          = require('../../utility/util');

module.exports = router;

router.get('/v1/mst-unit/list', async (req, res) => {
    const resp = await model.getList(req.body);
    res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
});