const dao 			        =    require('./mstfields.dao');
const token 				=   require('../../utility/token');
const util 					=	require('../../utility/util');

module.exports.getList = async (data) => {
    try{
        let cityData = await dao.getList(data)
        if (cityData) {
            return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(cityData)}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}

