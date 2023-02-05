const dao 			        =    require('./mst_checklist_group.dao');
const util 					=	 require('../../utility/util');
const async                 =    require("async");

module.exports.addGroupName = async (data) => {
    try{
        let result;
        const checkDuplicateData = await dao.checkDataDuplication(data);
        if (checkDuplicateData) {
            result = null
        } else {
            result = await dao.addGroupName(data);
        }
        if (result) {
            return {success: true, status: util.statusCode.SUCCESS, message: 'Group name added successfully', response: await util.encryptResponse(result)}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'This group name already exists', response: null}
        }
    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}

module.exports.updateGroupName = async (data) => {
    try{
        let result;
        const checkDuplicateDataForUpdate = await dao.checkDataDuplicationForUpdate(data);
        if (checkDuplicateDataForUpdate) {
            result = null
        } else {
            result = await dao.updateGroupName(data);
        }
        if (result) {
            return {success: true, status: util.statusCode.SUCCESS, message: 'Group name updated successfully', response: await util.encryptResponse(result)}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'This group name already exists', response: null}
        }
    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}

module.exports.deleteGroupName = async (data) => {
    try{
        let resp = await dao.deleteGroupName(data)
        if (resp) {
            return {success: true, status: util.statusCode.SUCCESS, message: 'Deleted successfully', response: await util.encryptResponse(resp)}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}
