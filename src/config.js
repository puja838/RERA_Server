var path = require('path');

const local = true;

const REGISTRATION_TYPE=1;
const EXTENSION_TYPE=2;
const AGENT_TYPE=3;

// const CGM_URL = 'https://cgm.rerabiharonline.com:9006'; // Prod
const CGM_URL = 'http://poc.ifixcloud.co:9005'; // Staging

const SMS_VERIFICATION_URL = "http://www.smsjust.com/blank/sms/user/urlsms.php?dltentityid=1601100000000006739&dltheaderid=1205159169945331626&";
const PROJECT_REG_API = CGM_URL + "/insertProjectMasterFromPRM";
const PROJECT_STATUS_UPDATE_API = CGM_URL + "/updateProjectMasterFromPRM";
const CREATEUSER_CUSTOMIZED = CGM_URL + "/createuser_customized";
const API_GENERATEURL = CGM_URL + '/generateToken?clientId=18&Logintype=prmLogin&login_name=';

//for mode of execution
const EXECUTION_MODE = "stag";

//get root directoty of the location where source code is uploaded
const BASEPATH = path.resolve(__dirname, '..');

//configure enviroment file so source code can be executed from any location
require('dotenv').config({path: BASEPATH + '/src/.env'});

//url of the server
const URL = local ? 'http://localhost:8091/' : "https://prmapi.rerabiharonline.com/";

const controllerPath = BASEPATH + '/src/app/';
//location where files will be stored
const FILEPATH = BASEPATH + '/public/uploadedFiles/';
const FILEOPPATH = BASEPATH + '/public/';

//defining en variables if env variable is not accessable
//LOCAL
// const MYSQL_HOST = 'localhost';
// const MYSQL_USER = 'root' ;
// const MYSQL_PASSWORD =  'password';
// const MYSQL_DB = 'rera';

//PROD
const MYSQL_HOST = 'localhost';
const MYSQL_USER = 'root' ;
const MYSQL_PASSWORD = 'password';
const MYSQL_DB = 'rera_migration';

//token validity in seconds
const TOKEN_VALIDITY = 3000;
//JWT details
const JWTSECRET = "rera@2022@angular@node";
const JWTSECRETDECRYPT = "rera@202e@node@angular";
const JWT_ALGO = 'HS256';
const PAYLOAD_ENC_DEC = "2e35f242a46d67eeb74aabc37d5e5d05";
//server port where application will accept request
const PORT = 8091;

//mysql config for
const MYSQL_CONFIG = {
    connectionLimit: 25,
    host: process.env.MYSQL_HOST || MYSQL_HOST,
    user: process.env.MYSQL_USER || MYSQL_USER,
    password: process.env.MYSQL_PASSWORD || MYSQL_PASSWORD,
    database: process.env.MYSQL_DB || MYSQL_DB,
    multipleStatements: true
};

//Redis config 
// const REDIS_CONFIG = {
//     host: process.env.REDIS_HOST || REDIS_HOST,
//     password: process.env.REDIS_PASSWORD || REDIS_PASSWORD,
//     port: process.env.REDIS_PORT || REDIS_PORT
// };
// public routes that don't require authentication
const omitTokenAPiPath = [
    '/api/hc',
    '/api/v1/mst_user/login',
    '/api/v1/signup/userSignUpInfo',
    '/api/v1/onboarding/getOnboardingCountData',
    '/api/v1/onboarding/getProjectLatLong',
    '/api/v1/onboarding/getAllRegisteredProjectCountDistrictwise',
    '/api/v1/mst_notice/getNotices',
    '/api/v1/search/search',
    '/api/v1/search/fetchProjectDetails',
    '/api/v1/search/fetchProjectValueDetails',
    '/api/v1/search/fetchCommonAmenities',
    '/api/v1/search/fetchBuildingDetails',
    '/api/v1/search/fetchDirectorDetails',
    '/api/v1/search/fetchPastProject',
    '/api/v1/search/fetchProfileValueDetails',
    '/api/v1/search/fetchEngineerDetails',
    '/api/v1/search/fetchFullBuildingDetails',
    '/api/v1/search/fetchDocuments',
    '/api/v1/search/fetchFinancialDocuments',
    '/api/v1/mst-entity-type/getEntityTypeByEntity',
    '/api/v1/validation/generateFieldOTP',
    '/api/v1/validation/submitFieldOTP',
    '/api/v1/verification/verifypan',
    '/api/v1/project/getState',
    '/api/v1/search/fetchProjectByStatus',
    '/api/v1/search/fetchPromoterDetails',
    '/api/v1/search/fetchProjectType',
    '/api/v1/search/maxFieldValue',
    '/api/v1/project/getFinancialYearList',
    '/api/v1/project/getDistricts',
    '/api/v1/aadhaar/generateAadhaarOTP',
    '/api/v1/onboarding/getWhatsNew',
    '/api/v1/search/project'
];

const omitDecryptPayload = [];


//salt rounds for generate salt and match/create encrypted password
const SALTROUND = 10;

GOOGLE_API_KEY = 'AIzaSyAk5wRD1k4M5Ltf4UOFew6pYI5numCM7A0';

// SENDER = 'Rera Bihar';
// SMTP_USER = 'shomeaditya198@gmail.com';
// SMTP_PWD = 'xoomdbihydljlfcf';
// SMTP_HOST = 'smtp.gmail.com';
// SMTP_PORT = 587;
SENDER = 'Rera Bihar';
SMTP_USER = 'admin@rerabiharonline.com';
SMTP_PWD = 'rera@123';
SMTP_HOST = 'smtp.gmail.com';
SMTP_PORT = 587;


const Register_Project=4;
const Register_Agent = 5
const Pending_QPRS = 6
const Register_Project_Quater=7;
const Register_Agent_Quater=8;
const Revenue_Total=1;
const Revenue_Total_Quaret = 2
const AGENT_RENEWAL_TYPE = 4

module.exports = {
    controllerPath: controllerPath,
    MYSQL_CONFIG: MYSQL_CONFIG,
    FILEPATH: FILEPATH,
    URL: URL,
    MODE: "dev",
    MYSQL_HOST: MYSQL_HOST,
    MYSQL_USER: MYSQL_USER,
    MYSQL_PASSWORD: MYSQL_PASSWORD,
    MYSQL_DB: MYSQL_DB,
    TOKEN_VALIDITY: TOKEN_VALIDITY,
    JWTSECRET: JWTSECRET,
    JWT_ALGO: JWT_ALGO,
    JWTSECRETDECRYPT: JWTSECRETDECRYPT,
    PORT: PORT,
    omitTokenAPiPath: omitTokenAPiPath,
    EXECUTION_MODE: EXECUTION_MODE,
    BASEPATH: BASEPATH,
    SALTROUND: SALTROUND,
    FILEOPPATH: FILEOPPATH,
    GOOGLE_API_KEY: GOOGLE_API_KEY,
    SENDER: SENDER,
    SMTP_USER: SMTP_USER,
    SMTP_PWD: SMTP_PWD,
    SMTP_HOST: SMTP_HOST,
    SMTP_PORT: SMTP_PORT,
    SMS_VERIFICATION_URL: SMS_VERIFICATION_URL,
    PROJECT_REG_API: PROJECT_REG_API,
    PROJECT_STATUS_UPDATE_API: PROJECT_STATUS_UPDATE_API,
    API_GENERATEURL: API_GENERATEURL,
    CREATEUSER_CUSTOMIZED: CREATEUSER_CUSTOMIZED,
    REGISTRATION_TYPE: REGISTRATION_TYPE,
    EXTENSION_TYPE: EXTENSION_TYPE,
    AGENT_TYPE: AGENT_TYPE,
    Register_Project:Register_Project,
    Register_Agent:Register_Agent,
    Pending_QPRS:Pending_QPRS,
    Register_Project_Quater:Register_Project_Quater,
    Register_Agent_Quater:Register_Agent_Quater,
    Revenue_Total:Revenue_Total,
    Revenue_Total_Quaret:Revenue_Total_Quaret,
    PAYLOAD_ENC_DEC: PAYLOAD_ENC_DEC,
    omitDecryptPayload: omitDecryptPayload,
    AGENT_RENEWAL_TYPE,AGENT_RENEWAL_TYPE
};
