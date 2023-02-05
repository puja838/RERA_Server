const dao 			        =    require('./onboarding.dao');
const token 				=   require('../../utility/token');
const util 					=	require('../../utility/util');

module.exports.getOnboardingCountData = async (data) => {
    try{
        let regProjectCount = await dao.getRegisteredProjectCount(data);
        let projectCountDist = await dao.getRegisteredProjectCountDistrictwise(data);
        const resp = {
            regProjectCount: regProjectCount,
            regAgent: 475,
            completedProject: 225,
            complaintsResolved: 2109,
            projectCountDist: projectCountDist
        };
        if (resp) {
            return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(resp)}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
};
module.exports.getAllRegisteredProjectCountDistrictwise = async (data) => {
    try{
        let projectCountDist = await dao.getAllRegisteredProjectCountDistrictwise(data);
        if (projectCountDist) {
            return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(projectCountDist)}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        util.createLog(e);
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
};
module.exports.getProjectLatLong = async (data) => {
    try{
        let projectLocationList = await dao.getProjectLatLong(data);
        if (projectLocationList) {
            return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(projectLocationList)}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        util.createLog(e);
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
};
module.exports.getWhatsNew = async (data) => {
    try{
        let whatsNew = await dao.getWhatsNew(data);
        if (whatsNew) {
            return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(whatsNew)}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        util.createLog(e);
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
};
