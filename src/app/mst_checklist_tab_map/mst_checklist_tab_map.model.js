const dao 			        =    require('./mst_checklist_tab_map.dao');
const util 					=	 require('../../utility/util');
const async                 =    require("async");

module.exports.getTabEntityMap = async (data) => {
    try{
        let resp = await dao.getTabEntityMap(data)
        if (resp) {
            return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(resp)}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}

module.exports.addTabEntityMap = async (data) => {
    try{
        let result;
        const checkDuplicateTabEntityMap = await dao.checkTabEntityMapDuplication(data);
        if (checkDuplicateTabEntityMap) {
            result = null
        } else {
            result = await dao.addTabEntityMap(data);
        }
        if (result) {
            return {success: true, status: util.statusCode.SUCCESS, message: 'Added successfully', response: await util.encryptResponse(result)}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Data already exists', response: null}
        }
    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}

module.exports.updateTabEntityMap = async (data) => {
    try{
        let result;
        const checkDuplicateTabEntityMapForUpdate = await dao.checkTabEntityMapDuplicationForUpdate(data);
        if (checkDuplicateTabEntityMapForUpdate) {
            result = null
        } else {
            result = await dao.updateTabEntityMap(data);
        }
        if (result) {
            return {success: true, status: util.statusCode.SUCCESS, message: 'Updated successfully', response: await util.encryptResponse(result)}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Data already exists', response: null}
        }
    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}

module.exports.deleteTabEntityMap = async (data) => {
    try{
        let resp = await dao.deleteTabEntityMap(data)
        if (resp) {
            return {success: true, status: util.statusCode.SUCCESS, message: 'Deleted successfully', response: await util.encryptResponse(resp)}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}
