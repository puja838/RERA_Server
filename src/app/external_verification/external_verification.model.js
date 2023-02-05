const dao = require('./external_verification.dao');
const external = require('./external_verification');
const util = require('../../utility/util');
const common = require('../services/common.service');

module.exports.verifyCIN = async (data) => {
    try {
        const cinObj = new external.CIN();
        const resReturn = await cinObj.verifyCINNumber(data.cinno);
        if (resReturn.success) {
            if (resReturn.company_name.toLowerCase() === data.companyName.toLowerCase()) {
                common.updateVerificationFieldInProfile(data);
                return {
                    success: true,
                    status: util.statusCode.SUCCESS,
                    message: 'CIN number verified successfully',
                    response: await util.encryptResponse(resReturn)
                }
            } else {
                return {
                    success: false,
                    status: util.statusCode.CUSTOM_ERROR,
                    message: 'Company name not matched.',
                    response: null
                }
            }
        } else {
            return {
                success: false,
                status: util.statusCode.INTERNAL,
                message: 'Internal server error',
                response: await util.encryptResponse(resReturn)
            }
        }
    } catch (e) {
        util.createLog(e);
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}


/*module.exports.verifyDIN = async (data) => {
    try {
        const dinObj = new external.DIN();
        const resReturn = await dinObj.verifyDINNumber(data.dinno);
        return {
            success: true,
            status: util.statusCode.SUCCESS,
            message: '',
            response: await util.encryptResponse(resReturn)
        }
    } catch (e) {
        util.createLog(e);
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}*/


module.exports.verifyDIN = async (data) => {
    try {
        const dinObj = new external.DIN();
        const resReturn = await dinObj.verifyDINNumber(data.dinno);
        if (resReturn.success) {
            if (resReturn.full_name.toLowerCase() === data.directorName.toLowerCase()) {
                common.updateVerificationFieldInProfile(data);
                return {
                    success: true,
                    status: util.statusCode.SUCCESS,
                    message: 'Din number verified successfully',
                    response: await util.encryptResponse(resReturn)
                }
            } else {
                return {
                    success: false,
                    status: util.statusCode.CUSTOM_ERROR,
                    message: 'Director name not matched',
                    response: null
                }
            }
        } else {
            return {
                success: false,
                status: util.statusCode.SOME_ERROR_OCCURRED,
                message: 'Some error occurred',
                response: null
            }
        }
    } catch (e) {
        util.createLog(e);
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}


module.exports.verifyGSTIN = async (data) => {
    try {
        const gstinObj = new external.GSTIN();
        const resReturn = await gstinObj.verifyGSTINNumber(data.gstinno, data.filing_status);
        if (resReturn.success) {
            if (resReturn.legal_name.toLowerCase() === data.companyName.toLowerCase()) {
                if (resReturn.gstin_status === 'Active') {
                    common.updateVerificationFieldInProfile(data);
                }
                return {
                    success: resReturn.gstin_status === 'Active',
                    status: util.statusCode.SUCCESS,
                    message: resReturn.gstin_status === 'Active' ? 'GSTIN verified successfully' : 'GSTIN is deactivated',
                    response: await util.encryptResponse(resReturn)
                }
            } else {
                return {
                    success: false,
                    status: util.statusCode.CUSTOM_ERROR,
                    message: 'Company name not matched.',
                    response: null
                }
            }
        } else {
            return {
                success: false,
                status: util.statusCode.INTERNAL,
                message: 'Internal server error',
                response: await util.encryptResponse(resReturn)
            }
        }
    } catch (e) {
        util.createLog(e);
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}
