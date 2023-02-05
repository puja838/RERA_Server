const dao 			        =   require('./location.dao');
const token 				=   require('../../utility/token');
const util 					=	require('../../utility/util');

module.exports.getlatlong = async (data) => {
    try {
        // const resp = await util.getLocationDescription(data.address);
        const resp = {"lat":22.572646,"lng":88.36389500000001,"placename":"Kolkata"};
        console.log(resp);
        if (resp) {
            return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(resp)}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch(e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}
