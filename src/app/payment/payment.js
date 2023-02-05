//Payment
const CryptoJS = require("crypto-js");
const hex2ascii = require('hex2ascii')
const config = require('../../config')
class Payment {
  constructor() {
    this.paymentURL = "https://cgt.in.worldline.com/ipg/doMEPayRequest";
    this.enckey = "531de28df0a2eee2f38a3221b134783e";
  }
  async makePayment(mid, datastring) {
    let block = 16;
    let pad = block - (datastring.length % block);
    datastring += String.fromCharCode(pad).repeat(pad);
    let _key = CryptoJS.enc.Hex.parse(this.enckey);
    let _iv = CryptoJS.enc.Hex.parse(this.enckey);
    let encrypted = CryptoJS.AES.encrypt(datastring, _key, {
      keySize: 16,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.ZeroPadding,
    });
    let aencrypted = encrypted.ciphertext.toString();
    return aencrypted;
  }

  async paymentResponse(merchantResponse) {
    try {
      console.log('in paymentResponse')
      let _key = CryptoJS.enc.Hex.parse(this.enckey);
      let _iv = CryptoJS.enc.Hex.parse(this.enckey);
      console.log('11111111111111111')
      var decrypted = CryptoJS.AES.decrypt(merchantResponse, _key, {
        keySize: 16,
        iv: _iv,
        mode: CryptoJS.mode.ECB,
        format: CryptoJS.format.Hex,
        padding: CryptoJS.pad.ZeroPadding,
      });
      console.log('222222222222222222222')
      var decryptedtext = hex2ascii(decrypted.toString());
      console.log('decryptedtext >>> ', decryptedtext)
      return decryptedtext;
    } catch (e) {
      console.log(e)
    }
  }
}

class AxisBankPayment {
  constructor() {this.enckey = "axisbank12345678";}
  async makePayment(CID, RID, CRN, AMT) {
    const CheckSumString = CID + RID + CRN + AMT + "axis";
    const datetime = new Date();
    let ndatetime = datetime.toISOString().slice(0, 10);
    let checksum = CryptoJS.SHA256(CheckSumString).toString();
    // tests
    let plainText = "CID=" + CID + "&RID=" + RID + "&CRN=" + CRN + "&AMT=" + AMT + "&VER=1.0&TYP=TEST&CNY=INR&RTU=" + config.URL + "api/v1/payment/axisPaymentResponse/&PPI=123|" + CID + "|" + ndatetime + "|" + AMT + "|1|1&RE1=MN&RE2=&RE3=&RE4=&RE5=&CKS=" + checksum;
    plainText = CryptoJS.enc.Utf8.parse(plainText);
    let _key = CryptoJS.enc.Utf8.parse(this.enckey);
    let _iv = CryptoJS.enc.Utf8.parse(this.enckey);
    let encryptedstring = CryptoJS.AES.encrypt(plainText, _key, {
      keySize: 8,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
    });
    encryptedstring = encryptedstring.toString();
    return encryptedstring;
  }

  async paymentResponse(resp) {
    // let response = CryptoJS.enc.Utf8.parse(resp);
    let _key = CryptoJS.enc.Utf8.parse(this.enckey);
    let _iv = CryptoJS.enc.Utf8.parse(this.enckey);
    let decrypted = CryptoJS.AES.decrypt(resp, _key, {
      keySize: 8,
      iv: _iv,
      mode: CryptoJS.mode.ECB,
      // format: CryptoJS.format.Utf8,
    });
    decrypted = decrypted.toString(CryptoJS.enc.Utf8);
    // console.log(decrypted);
    return decrypted;
  }
}

module.exports.Payment = Payment;
module.exports.AxisBankPayment = AxisBankPayment;
