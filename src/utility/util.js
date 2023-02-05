const uniqid = require('uniqid');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const request = require('request');
const config = require('../config');
const CryptoJS = require("crypto-js");
const axios = require('axios');
const XLSX = require('xlsx');
const token = require('./token');
const HTMLParser = require('node-html-parser');


const GOOGLE_API = config.GOOGLE_API_KEY;

//creaion of transporter object using nodemailer
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || config.SMTP_HOST,
    port: process.env.SMTP_PORT || config.SMTP_PORT,
    secure: false,
    auth: {
        user: process.env.SMTP_USER || config.SMTP_USER,
        pass: process.env.SMTP_PWD || config.SMTP_PWD,
    },
});

const parseHtml = (htmlStr) => {
    try{
        const root = HTMLParser.parse(htmlStr);
        // console.log(root.toString())
        return root.toString()
    } catch (e) {
        console.log(">>>>>>>>>>>>> ", e)
        return htmlStr;
    }
}

//create generate uniqueid
let genUniqueId = async () => {
    let qrString = uniqid();
    return qrString;
}

let genPromoterNo = async (id) => {
    let qrString = 'RERAP' + getCurrentTime(-1);
    const numb = '00000';
    qrString += numb.substring(0, numb.length - id.toString().length) + id;
    return qrString;
};

let genProjectNo = async (userNo, count) => {
    let qrString = userNo + '_';
    const numb = '000';
    qrString += numb.substring(0, numb.length - count.toString().length) + count;
    return qrString;
};


//create salt and encrypt password with salt
let generateHash = async (data) => {
    let saltRound = process.env.SALTROUND || config.SALTROUND;
    const salt = bcrypt.genSaltSync(Number(saltRound));
    const hash = bcrypt.hashSync(data, salt);
    return hash;
}

//remove null value
let nullRemove = async (data) => {
    try {
        let objKeys = Object.keys(data);
        for (let i = 0; i < objKeys.length; i++) {
            if (data[objKeys[i]] == null) {
                data[objKeys[i]] = "";
            }
        }
        return data
    } catch (err) {
        return {}
    }
}


//match user input password and saved password for signin
let comparePass = async (inputPass, savedPass) => {
    let compare = await bcrypt.compare(inputPass, savedPass);
    return compare;
}

const generateSMSTemplate = (type, promoterId, projectId, otp, amount) => {
    let template = '';
    switch(type) {
        case 'verification':
            template = 'OTP for Mobile number verification with RERA Bihar is ' + otp + '. - RERA|1307166253748440385';
            // template = 'Your OTP for Registration with RERA Bihar is ' + otp + '. - Bihar Government';
            break;
        case 'signup':
            template = 'Promoter ID - ' + promoterId + ' -Thank you for sign up in - RERA Bihar Portal.|1307166253744758592';
            break;
        case 'profileUpdate':
            template = 'Promoter ID - ' + promoterId + ' -Your profile has been changed in - RERA Bihar Portal.|1307166253768763292';
            break;
        case 'changePassword':
            template = 'Promoter ID - ' + promoterId + ' -Your password is changed successfully in - RERA Bihar Portal.|1307166253771945814';
            break;
        case 'newProjectSubmit':
            template = 'Promoter ID - ' + promoterId + ' - new project  ' + projectId + ' is submitted successfully in RERA Bihar subject to be payment received. - RERA|1307166253777454638';
            // template = 'Thanks for Project Registration on RERA Bihar. Registration No ' + projectId + ' - RERA';
            break;
        case 'payment':
            template = 'Promoter ID - ' + promoterId + ' - Amount of Rs. ' + amount + ' is received for project ID ' + projectId + ' in - RERA Bihar.|1307166254483131713';
            break;
        case 'checkList':
            template = 'Promoter ID - ' + promoterId + ' - Please submit document  for  project ID ' + projectId + ' in - RERA Bihar.|1307166253780413082';
            break;
        case 'querysubmit':
            template = 'Promoter ID - ' + promoterId + ' - Please submit document/clarification on Query for  project ID ' + projectId + ' in - RERA Bihar.|1307166253799453662';
            break;
        case 'query':
            template = 'Query has been sent for ' + projectId + ' by RERA Bihar, please login at RERA Bihar site and provide clarifications. - RERA|1307166253826623874';
            break;
        case 'projectApproval':
            template = 'Promoter ID - ' + promoterId + ' -  project ID ' + projectId + ' is approved in - RERA Bihar.|1307166253803453851';
            break;
        case 'projectReject':
            template = 'Promoter ID - ' + promoterId + ' - project ID ' + projectId + ' is rejected in - RERA Bihar.|1307166253806504538';
            break;
        default:
            createLog('Not template found');
            break;
    }
    return template;
};

//send sms to targeted user
let sendSms = async (data, OTP) => {
    try{
        const URL = await config.SMS_VERIFICATION_URL;
        const resp = await axios.get(URL, {
            params: {
                username: "stupa",
                pass: "stupa@123",
                senderid: 'iiFIXX',
                dest_mobileno: data.fieldvalue.trim(),
                message: "Hi User,Your Login OTP is : " + OTP,
                response: 'Y'
            }
        });
        // console.log("\n RESPONSE --------   ", resp);
        return true;
    } catch (e) {
        util.createLog(e);
    }
};

//6 digit random numerical otp generation
let generateSixDigitOtp = async()=>{
    let otp = await Math.floor(100000 + Math.random() * 900000);
    return otp;
}

//mail sending function using nodemailer
// let sendMail        =    async(data)=>{
// let message         = "<p>Hi,</p><p></br></br> Your Verification code is <strong>";
//     message         +=    +data.otp+"</strong></p><p>Thanks & Regards<br>7CLINGO TEAM</p>";
//     try{
//         let mailsend =   await transporter.sendMail({
//             from: '"'+process.env.SENDER || config.SENDER+'" <'+process.env.SMTP_USER || config.SMTP_USER+'>', // sender address
//             to: data.toemail, // list of receivers
//             subject: process.env.SUBJECT || config.SUBJECT, // Subject line
//             text: message, // plain text body
//             html: message, // html body
//         })
//         return mailsend;
//     }catch(error){
//         console.log(error);
//         return false;
//     }
// };
let sendMail = async (data) => {
    let subject = process.env.SUBJECT || config.SUBJECT;
    if (data.subject && data.subject !=='') {
        subject = data.subject;
    }
    try {
        // console.log(message)
        let mailsend = await transporter.sendMail({
            from: '"' + process.env.SENDER || config.SENDER + '" <' + process.env.SMTP_USER || config.SMTP_USER + '>', // sender address
            to: data.toemail, // list of receivers
            subject: subject, // Subject line
            text: data.message, // plain text body
            html: data.message, // html body
        });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

//4 digit random numerical otp generation
let generateOtp = async () => {
    let val = await Math.floor(1000 + Math.random() * 9000);
    // let val     =   1234;
    return val;
}

//capitalize first letter of any string
let capitalizeFirstLetter = async (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

let createLog = (data) => {
    if (process.env.EXECUTION_MODE == "prod" || config.EXECUTION_MODE == "prod") {
        return true;
    } else {
        console.log(data)
        return true;
    }
}

let decryptPayload = async (data) => {
    var bytes = await CryptoJS.AES.decrypt(data, process.env.CRYPTO_DECRYPT || config.PAYLOAD_ENC_DEC);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

let encryptPayload = async (data) => {
    var ciphertext = await CryptoJS.AES.encrypt(JSON.stringify(data), process.env.CRYPTO_ENCRYPT || config.PAYLOAD_ENC_DEC).toString();
    return ciphertext;
}

//for autocomplete suggestion of location
// 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+data.place+'&types=geocode&key='+GOOGLE_API
let getLocationDescription = async (address) => {
    const details = [];
    const config = {
        method: 'get',
        url: 'https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + address + '&key=' + GOOGLE_API,
        headers: {}
    };
    try {
        let info = await axios(config);
        if (info.data.predictions.length > 0) {
            // details.push({"description":info.data.predictions[i].description,"placeid":info.data.predictions[i].place_id})
            const resp = await getCoordinateFromPlaceId({placeid: info.data.predictions[0].place_id})
            return resp;
        } else {
            return false;
        }
    } catch (err) {
        console.log(err);
        return false;
    }
};

//get co-ordinate from placeid
let getCoordinateFromPlaceId = async (data) => {
    let coordinateurl = 'https://maps.googleapis.com/maps/api/place/details/json?place_id=' + data.placeid + '&fields=name,geometry&key=' + GOOGLE_API;
    const config = {
        method: 'get',
        url: coordinateurl,
        headers: {}
    };
    try {
        let info = await axios(config);
        return {
            "lat": info.data.result.geometry.location.lat,
            "lng": info.data.result.geometry.location.lng,
            "placename": info.data.result.name
        };
    } catch (err) {
        console.log(err);
        return false;
    }
};

let encryptResponse = async (data) => {
    // const token1 = await token.GetWebToken(data);
    return await encryptPayload(data);
    // return data
}

//create csv file
let createExcelFile = async (data, file) => {
    let reqTime = new Date().getTime();
    let filepath = "/var/www/html/qimages/7clingo/userdata/";
    let filename = "";
    if (file != "") {
        filename = file + "_" + reqTime + ".xlsx";
    } else {
        filename = "userlist_" + reqTime + ".xlsx";
    }
    var ws = XLSX.utils.json_to_sheet(data)
    var wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Responses')
    XLSX.writeFile(wb, filepath + filename)
    let fileUrl = "http://52.201.119.41/qimages/7clingo/userdata/" + filename;
    return fileUrl;
};

let replacer = async (someObj, replaceValue = "") => {
    const replacer = (key, value) =>
        String(value) === "null" || String(value) === "undefined" || String(value) == "" ? replaceValue : value;

    return JSON.stringify(someObj, replacer);
}

let getUserType = (typeId) => {
    return config.USER_TYPE[typeId];
}

const daysInMonth = (month, year) => {
    return new Date(year, month, 0).getDate();
}

let getCurrentTime = (flag = 0, date = '') => {
    let now;
    if (date !== '') {
        now = new Date(date);
    } else {
       now = new Date()
    }
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();
    if (month.toString().length === 1) {
        month = '0' + month;
    }
    if (day.toString().length === 1) {
        day = '0' + day;
    }
    if (hour.toString().length === 1) {
        hour = '0' + hour;
    }
    if (minute.toString().length === 1) {
        minute = '0' + minute;
    }
    if (second.toString().length === 1) {
        second = '0' + second;
    }
    if (flag === 0) {
        return year + '-' + month + '-' + day;
    } else if (flag === -1) {
        return year + month;
    } else {
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    }
}

const getNextDate = (nextYear = 0, flag = 0) => {
    const now = new Date();
    now.setFullYear(now.getFullYear() + nextYear);
    let year = now.getFullYear();
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let hour = now.getHours();
    let minute = now.getMinutes();
    let second = now.getSeconds();
    if (month.toString().length === 1) {
        month = '0' + month;
    }
    if (day.toString().length === 1) {
        day = '0' + day;
    }
    if (hour.toString().length === 1) {
        hour = '0' + hour;
    }
    if (minute.toString().length === 1) {
        minute = '0' + minute;
    }
    if (second.toString().length === 1) {
        second = '0' + second;
    }
    if (flag === 0) {
        return year + '-' + month + '-' + day;
    } else if (flag === -1) {
        return year + month;
    } else {
        return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
    }
};

const getMaxFromJSONArray = async (data, key) => {
    data.sort(function (a, b) {
        return b[key] - a[key]
    });
    return data[0][key];
}

const statusCode = {
    SUCCESS: 200,
    INTERNAL: 500,
    SOME_ERROR_OCCURRED: 500,
    PARAM_MISSING: 1001,
    EMAIL_MISSING: 1002,
    MOBILE_MISSING: 1003,
    AUTH_ERR: 401,
    EMAIL_EXISTS: 1004,
    PHONE_EXISTS: 1004,
    NAME_EXISTS: 1004,
    CUSTOM_ERROR: 1005,
    PAYMENT_NOT_DONE: 1006,
    INVALID_TOKEN: 498
}

const groupBy = (xs, key) => {
    return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
}

const configFieldId = {
    projectAddress: {
        fieldid: 387,
        stepid: 1
    },
    projectAccountNo: {
        fieldid: 214,
        stepid: 14
    },
    latlong: {
        stepid: 1,
        fieldid: '21,347' // lat, long
    },
    projDist: {
        stepid: 1,
        fieldid: 514
    },
    profile: {
        stepid: 9,
        companyDtl: '101,110,18,19,21,116,231,118',
        ProprietorshipFirm: '143,10,146,18,19,21,22,231,16',
        SocietyDtl: '154,157,159,18,19,21,22,231,16',
        PartnershipFirm: '143,248,249,18,19,21,22,231,16',
        LiabilityDtl: '178,181,110,18,19,21,182,231,183',
        TrustDtl: '191,194,196,18,19,21,22,231,16',
        CooperativeDtl: '204,207,209,18,19,21,22,231,16',
        ComponentDtl: '217,220,222,18,19,21,22,231,16',
        authority: '361,280,362,367'
    },
    projectCompletionDate: 497,
    siteLocationImg: {
        groupid: 50,
        fieldid: 18,
        stepid: 1
    },
    COMMUNITY_ID: 1,
    COMMUNITY_GROUPID: 22,
    cmpdtlextension: {
        stepid: 9,
        companyDtl: '101,110',
        ProprietorshipFirm: '143,146',
        SocietyDtl: '154,159',
        PartnershipFirm: '143,249',
        LiabilityDtl: '178,110',
        TrustDtl: '191,196',
        CooperativeDtl: '204,209',
        ComponentDtl: '217,222'
    },
    agentdtl: {
        stepid: 25,
        individualDtl: '423,30,18,19,21',
        companyDtl: '101,110,387,388,21',
        ProprietorshipFirm: '143,146,18,19,21',
        SocietyDtl: '154,159,18,19,21',
        PartnershipFirm: '143,249,18,19,389'
    },
};

let REJECTION_PROJECT_HEADING = 'REGISTRATION OF PROJECT';
let REJECTION_PROJECT_BODY = 'You are hereby informed that your application for registration of your project is rejected.';
let REJECTION_EXTENSION_BODY = 'You are hereby informed that your application for extension of the registration of your project is rejected.';
let REJECTION_EXTENSION_HEADING = 'EXTENSION OF REGISTRATION OF PROJECT';
let REJECTION_AGENT_HEADING = 'REGISTRATION OF AGENT';
let REJECTION_AGENT_BODY = 'You are hereby informed that your application for registration of agent is rejected.';

const alertMessage = {
    EXTENSION: 'Dear Promoter, Please note that your project as registered with RERA Bihar is expiring soon. Kindly check your registration details and apply for extension if required.',
    UPDATE: 'Dear Promoter, Please note that you need to update your project details to allow us to verify and validate the project application. Please do so within 15 days of having submitted the project registration application.',
    RENUAL1: ' Dear Agent, Please note that your application registered with RERA Bihar is expiring with in ',
    RENUAL2:' days. Kindly check your registration details and apply for renew if required.',
    QUERY: 'Please submit document/clarification on Query for  your registration application.'
};

function diffDate(date1, date2) {
    const daysDiff = Math.ceil((Math.abs(date1 - date2)) / (1000 * 60 * 60 * 24));

    const years = Math.floor(daysDiff / 365.25);
    const remainingDays = Math.floor(daysDiff - (years * 365.25));
    const months = Math.floor((remainingDays / 365.25) * 12);
    const days = Math.ceil(daysDiff - (years * 365.25 + (months / 12 * 365.25)));

    return {
        daysAll: daysDiff,
        years: years,
        months: months,
        days:days
    }
}

module.exports = {
    genUniqueId: genUniqueId,
    generateHash: generateHash,
    nullRemove: nullRemove,
    comparePass: comparePass,
    capitalizeFirstLetter: capitalizeFirstLetter,
    sendSms: sendSms,
    sendMail: sendMail,
    generateOtp: generateOtp,
    createLog: createLog,
    decryptPayload: decryptPayload,
    encryptPayload: encryptPayload,
    getLocationDescription: getLocationDescription,
    getCoordinateFromPlaceId: getCoordinateFromPlaceId,
    createExcelFile: createExcelFile,
    replacer: replacer,
    encryptResponse: encryptResponse,
    getUserType: getUserType,
    getCurrentTime: getCurrentTime,
    statusCode: statusCode,
    getMaxFromJSONArray: getMaxFromJSONArray,
    genPromoterNo: genPromoterNo,
    genProjectNo: genProjectNo,
    generateSixDigitOtp: generateSixDigitOtp,
    generateSMSTemplate: generateSMSTemplate,
    groupBy: groupBy,
    getNextDate: getNextDate,
    daysInMonth: daysInMonth,
    configFieldId: configFieldId,
    parseHtml: parseHtml,
    REJECTION_PROJECT_HEADING: REJECTION_PROJECT_HEADING,
    REJECTION_EXTENSION_HEADING: REJECTION_EXTENSION_HEADING,
    REJECTION_PROJECT_BODY: REJECTION_PROJECT_BODY,
    REJECTION_EXTENSION_BODY: REJECTION_EXTENSION_BODY,
    REJECTION_AGENT_HEADING: REJECTION_AGENT_HEADING,
    REJECTION_AGENT_BODY: REJECTION_AGENT_BODY,
    diffDate: diffDate,
    alertMessage: alertMessage
}
