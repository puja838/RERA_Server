const dao 			        =   require('./alert.dao');
const token 				=   require('../../utility/token');
const util 					=	require('../../utility/util');

module.exports.getAlert = async (data) => {
    try {
        const extensionList = await dao.getProjectListForExtension(data);
        const updateProjectList = await dao.getProjectListForUpdateDetails(data);
        if (extensionList && updateProjectList) {
            const resultArr = [];
            for (const obj of updateProjectList) {
                const dayObj = util.diffDate(new Date(), new Date(obj.submitiontime));
                const remaining = 15 - dayObj.daysAll;
                obj.isDelay = remaining < 0;
                obj.remaining = Math.abs(remaining);
                obj.type = 'update';
                obj.content = util.alertMessage.UPDATE;
                resultArr.push(obj);
            }
            for (const obj of extensionList) {
                const dayObj = util.diffDate(new Date(), new Date(obj.validatyenddate));
                const remaining = dayObj.daysAll;
                obj.isDelay = remaining < 0;
                obj.remaining = Math.abs(remaining);
                obj.type = 'extension';
                obj.content = util.alertMessage.EXTENSION;
                resultArr.push(obj);
            }
            return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(resultArr)}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch(e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}
