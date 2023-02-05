const readConn = require('../../dbconnection').readPool
const writeConn = require('../../dbconnection').writePool
const util = require('../../utility/util');

module.exports.getUserLoginInfo  = async(data) => {
    try {
        const sql = "SELECT userid FROM mst_user WHERE reraid = ? AND userpassword = ? AND userpan = ? AND deleted = 0";
        const [result] = await readConn.query(sql,[data.reraid, data.userpassword, data.userpan]);
        return result.length > 0 ? result[0].userid : null
    } catch (e) {
        util.createLog(e);
        return false;
    }
};

module.exports.initiatePayment = async (data, flag = 'panjab') => {
    try{
        if (data.totalLandArea === '') {
            data.totalLandArea = null;
        }
        if (data.projectCategory === '') {
            data.projectCategory = null;
        }
        if (data.projectid === '') {
            data.projectid = null;
        }
        if (data.paymentFor === undefined) {
            data.paymentFor = 'project';
        }
        if (flag === 'panjab') {
            const sql = "INSERT INTO payment_mst (projectid, userid, reraid, orderid, amount, currencyName, Remarks, meTransReqType, mid, reqstring, returnurl,totallandarea, projecttype, paymentfor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
            const [result] = await writeConn.query(sql, [data.projectid, data.userid, data.reraid, data.OrderId, data.amount, data.currencyName, data.Remarks, data.meTransReqType, data.mid, data.reqstring, data.returnurl, data.totalLandArea, data.projectCategory, data.paymentFor]);
        } else if (flag === 'axis') {
            const sql = "INSERT INTO payment_mst (projectid, userid, reraid, orderid, amount, reqstring, returnurl, CID, RID, CRN, totallandarea, projecttype, paymentfor) VALUES (?,?,?,?,?,?,?, ?,?,?,?, ?, ?)";
            const [result] = await writeConn.query(sql,[data.projectid, data.userid, data.reraid, data.RID, data.AMT, data.reqstring, data.returnurl, data.CID, data.RID, data.CRN, data.totalLandArea, data.projectCategory, data.paymentFor]);
        }
        return true;
    } catch(e) {
        console.log(e);
        return false;
    }
};

module.exports.getReturnUrl = async (OrderId) => {
    try {
        const sql = "SELECT returnurl,projectid, userid, amount, paymentfor FROM payment_mst WHERE orderid = ?";
        const [result] = await readConn.query(sql, [OrderId]);
        return result.length > 0 ? result[0] : null;
    } catch (e) {
        util.createLog(e);
        return null;
    }
}

module.exports.updatePaymentInfo = async (data, flag = 'panjab') => {
    try{
        if (flag === 'panjab') {
            const sql = "UPDATE payment_mst SET transactionno = ?, responsecode = ?, statuscode = ?, statusdesc = ?, rrn = ?, transactionrequestdate = ? WHERE orderid = ?";
            const [result] = await writeConn.query(sql,[data.transactionno,data.responsecode, data.statuscode, data.statusdesc, data.rrn, data.transactionrequestdate, data.OrderId]);
        } else if (flag === 'axis') {
            const sql = "UPDATE payment_mst SET transactionno = ?, statuscode = ?, statusdesc = ?, transactionrequestdate = ?, brn=?, pmd=?, ver=?, meTransReqType = ?, currencyName = ?, checksum = ? WHERE orderid = ?";
            const [result] = await writeConn.query(sql,[data.TRN, data.STC, data.RMK, data.TET, data.BRN, data.PMD, data.VER, data.TYP, data.CNY, data.CKS, data.RID]);
        }
        return true;
    } catch(e) {
        console.log(e);
        return false;
    }
};
