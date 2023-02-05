const dao 			        =    require('./mst_checklist_tab_master.dao');
const util 					=	 require('../../utility/util');
const async                 =    require("async");

module.exports.getTabName = async (data) => {
    try{
        let resp = await dao.getTabName(data)
        if (resp) {
            return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(resp)}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}

module.exports.addTabName = async (data) => {
    try{
        let result;
        const checkDuplicateTab = await dao.checkTabDuplication(data);
        if (checkDuplicateTab) {
            result = null
        } else {
            result = await dao.addTabName(data);
        }
        if (result) {
            return {success: true, status: util.statusCode.SUCCESS, message: 'Tab name added successfully', response: await util.encryptResponse(result)}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'This tab name already exists', response: null}
        }
    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}

module.exports.updateTabName = async (data) => {
    try{
        let result;
        const checkDuplicateTabForUpdate = await dao.checkTabDuplicationForUpdate(data);
        if (checkDuplicateTabForUpdate) {
            result = null
        } else {
            result = await dao.updateTabName(data);
        }
        if (result) {
            return {success: true, status: util.statusCode.SUCCESS, message: 'Tab name updated successfully', response: await util.encryptResponse(result)}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'This tab name already exists', response: null}
        }
    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}

module.exports.deleteTabName = async (data) => {
    try{
        let resp = await dao.deleteTabName(data)
        if (resp) {
            return {success: true, status: util.statusCode.SUCCESS, message: 'Deleted successfully', response: await util.encryptResponse(resp)}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}
