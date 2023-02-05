const dao 			        =   require('./payment.dao');
const token 				=   require('../../utility/token');
const util 					=	require('../../utility/util');
const pymt               =   require('./payment');
const config                = require('../../config');
const common = require('../services/common.service');
const SMSmgov               =       require('../../utility/smsmgov');

module.exports.makePayment = async (data) => {
    try {
        console.log(JSON.stringify(data));
        // const resp = await util.getLocationDescription(data.address);
        const { OrderId, amount, currencyName, Remarks, meTransReqType, mid } = data;
        let recurPeriod = "";
        let recurDay = "";
        let numberRecurring = "";
        // var mid = 'WL0000000065479';
        // let ResponseUrl = "http://rerabiharonline.com:8091/api/v1/payment/paymentResponse";
        let ResponseUrl = config.URL + "api/v1/payment/paymentResponse";
        let AddField1 = "";
        let AddField2 = "";
        let AddField3 = "";
        let AddField4 = "";
        let AddField5 = "";
        let AddField6 = "";
        let AddField7 = "";
        let AddField8 = "";
        let AddField9 = "NA";
        let AddField10 = "NA";

        let datastring =
            mid +
            "|" +
            OrderId +
            "|" +
            amount +
            "|" +
            currencyName +
            "|" +
            Remarks +
            "|" +
            meTransReqType +
            "|" +
            recurPeriod +
            "|" +
            recurDay +
            "|" +
            numberRecurring +
            "|" +
            ResponseUrl +
            "|" +
            AddField1 +
            "|" +
            AddField2 +
            "|" +
            AddField3 +
            "|" +
            AddField4 +
            "|" +
            AddField5 +
            "|" +
            AddField6 +
            "|" +
            AddField7 +
            "|" +
            AddField8 +
            "|" +
            AddField9 +
            "|" +
            AddField10;
        const payment = new pymt.Payment();
        const resp = await payment.makePayment(mid, datastring);
        data.reqstring = resp;
        const initResp = await dao.initiatePayment(data);
        return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(resp)}
    } catch(e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}

module.exports.paymentResponse = async (data) => {
    try {
        console.log(data)
        const { merchantResponse } = data;
        const payment = new pymt.Payment();
        // console.log('merchantResponse >>> ', merchantResponse)
        const res2 = await payment.paymentResponse(merchantResponse);
        // console.log('res2 >>>> ', res2)
        const myarr = res2.split("|");
        const paymentResp = {
            OrderId: myarr[1],
            transactionno: myarr[0],
            responsecode: myarr[8],
            statuscode: myarr[10],
            statusdesc: myarr[11],
            rrn: myarr[6],
            transactionrequestdate: myarr[9]
        };
        // console.log('>>>>>>>>>>>>>>> ', paymentResp);
        const updateResp = await dao.updatePaymentInfo(paymentResp);
        const detail = await dao.getReturnUrl(myarr[1]);
        paymentResp.returnUrl = detail.returnurl;
        if (paymentResp.statuscode == 'S') {
            const userContactDtl = await common.getMobileEmailByUserId(detail.userid);
            const projectDtl = await common.getProjectShortDtl(detail.projectid);
            if (userContactDtl) {
                if (detail.paymentfor === 'project') {
                    const smsGov = new SMSmgov();
                    const message = util.generateSMSTemplate('payment', userContactDtl.userno, projectDtl.projectuid, '', detail.amount)
                    const smsResp = await smsGov.sendOTPsms(message, userContactDtl.usermobile);
                    const sendMailRes = await util.sendMail({
                        subject: 'Payment Successful',
                        toemail: userContactDtl.useremail,
                        message: message
                    });
                }
            }
        }
        // console.log("page name >> ", paymentResp.statuscode)
        const pageName = paymentResp.statuscode === 'S' ? 'template/paymentSuccess.ejs' : 'template/paymentFailure.ejs'
        return {page: config.FILEOPPATH + pageName, data: paymentResp}
    } catch (e) {
        return null
    }
}

module.exports.makeAxisPayment = async (data) => {
    try {
        const { CRN, AMT } = data;
        const CID = '2881';
        const RID = await util.genUniqueId();
        data.CID = CID;
        data.RID = RID;
        const payment = new pymt.AxisBankPayment();
        const encryptedstring = await payment.makePayment(CID, RID, CRN, AMT);
        data.reqstring = encryptedstring;
        const daoResp = await dao.initiatePayment(data, 'axis');
        return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(encryptedstring)}
    } catch (err) {
        console.error(err.message);
    }
}

module.exports.axisPaymentResponse = async (data) => {
    try {
        console.log(data)
        const resp = data.i;
        const payment = new pymt.AxisBankPayment();
        // console.log('merchantResponse >>> ', merchantResponse)
        const res2 = await payment.paymentResponse(resp);
        // console.log('res2 >>>> ', res2)
        const myarr = res2.split("&");
        const respObj = {};
        for (let count = 0; count < myarr.length; count++) {
            const myarr2 = myarr[count].split("=");
            respObj[myarr2[0]] = myarr2[1];
        }
        // console.log('respObj >>>> ', respObj)
        const paymentResp = {
            OrderId: respObj.RID,
            transactionno: respObj.TRN,
            responsecode: '',
            statuscode: respObj.RMK === 'success' ? 'S' : 'R',
            statusdesc: respObj.RMK,
            rrn: respObj.BRN,
            transactionrequestdate: respObj.TET
        };
        // console.log('>>>>>>>>>>>>>>> ', paymentResp);
        const updateResp = await dao.updatePaymentInfo(respObj, 'axis');
        const detail = await dao.getReturnUrl(respObj.RID);
        paymentResp.returnUrl = detail.returnurl;
        if (paymentResp.statuscode == 'S') {
            const userContactDtl = await common.getMobileEmailByUserId(detail.userid);
            const projectDtl = await common.getProjectShortDtl(detail.projectid);
            if (userContactDtl) {
                if (detail.paymentfor === 'project') {
                    const smsGov = new SMSmgov();
                    const message = util.generateSMSTemplate('payment', userContactDtl.userno, projectDtl.projectuid, '', detail.amount)
                    const smsResp = await smsGov.sendOTPsms(message, userContactDtl.usermobile);
                    const sendMailRes = await util.sendMail({
                        subject: 'Payment Successful',
                        toemail: userContactDtl.useremail,
                        message: message
                    });
                }
            }
        }
        const pageName = paymentResp.statuscode === 'S' ? 'template/paymentSuccess.ejs' : 'template/paymentFailure.ejs'
        return {page: config.FILEOPPATH + pageName, data: paymentResp}
    } catch (e) {
        console.log(e)
        return null
    }
}
