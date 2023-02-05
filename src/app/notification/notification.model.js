const dao 			        =    require('./notification.dao');
const token 				=   require('../../utility/token');
const util 					=	require('../../utility/util');


module.exports.getNotificationList = async (data) => {
    try {
        if(data.offset === '' || data.offset === null) {
            data.offset = 0;
        } else {
            data.offset = Number(data.offset);
        }
        data.limit = Number(data.limit);
        const notificationList = await dao.getNotificationList(data);
        if (notificationList) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(notificationList)
            }
        } else {
            return {
                success: false,
                status: util.statusCode.SOME_ERROR_OCCURRED,
                message: '',
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
module.exports.getNotificationCount = async (data) => {
    try {
        const notificationCount = await dao.getNotificationCount(data);
        if (notificationCount) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse({notificationCount: notificationCount})
            }
        } else {
            return {
                success: false,
                status: util.statusCode.SOME_ERROR_OCCURRED,
                message: '',
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