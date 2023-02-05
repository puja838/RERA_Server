const dao 			        =    require('./login_info.dao');
const token 				=   require('../../utility/token');
const util 					=	require('../../utility/util');

module.exports.userLoginInfo = async (data) => {
    try {
        let result;
        const checkLoginResult = await dao.getUserLoginInfo(data);
        if (checkLoginResult) {
            result = checkLoginResult;
        } else {
            result = null;
        }
        if (result) {
            return {success: true, status: util.statusCode.SUCCESS, message: 'You are successfully logged in', response: await util.encryptResponse({projectid: result})}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Sorry...Invalid Credentials', response: null}
        }
    } catch(e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}
