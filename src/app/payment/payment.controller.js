const express       = require('express');
const router        = express.Router();
const validator     = require('../../utility/validator');
const model         = require('./payment.model');
const validate      = require('./payment.validation');
const util          = require('../../utility/util');
const cors = require("cors");
const corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200,
};
router.post('/v1/payment/makePayment', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getlatlongReq(reqData)) {
        const resp = await model.makePayment(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.post('/v1/payment/paymentResponse', cors(corsOptions), async (req, res) => {
    const resp = await model.paymentResponse(req.body);
    // res.send(resp);
    res.render(resp.page, resp.data);
});

/*router.get('/v1/payment/check', cors(corsOptions), async (req, res) => {
    console.log(req.body)
    // const resp = await model.paymentResponse(req.body);
    // res.send(resp);
    res.render('/home/santanu/Official/Project/Rera/reraserver/public/template/paymentSuccess.ejs', {
        OrderId: '938r732987329',
        returnUrl: 'http://localhost:4200'
    });
});*/

router.post('/v1/payment/makeAxisPayment', async (req, res) => {
    let reqData = validator.requestFilter(req.body);
    if (validate.getAxisPaymentReq(reqData)) {
        const resp = await model.makeAxisPayment(req.body);
        res.json({success: resp.success, status: resp.status, message: resp.message, response: resp.response});
    } else {
        res.json({success: false, status: util.statusCode.PARAM_MISSING, message: "Parameter missing", response: null});
    }
});

router.get('/v1/payment/axisPaymentResponse', cors(corsOptions), async (req, res) => {
    const resp = await model.axisPaymentResponse(req.query);
    // res.send(resp);
    res.render(resp.page, resp.data);
});
module.exports = router;
