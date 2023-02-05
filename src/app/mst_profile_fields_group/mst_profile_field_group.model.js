const dao 			        =    require('./mst_profile_field_group.dao');
const util 					=	require('../../utility/util');

module.exports.getFieldListByGroup = async (data) => {
    try{
        let resp = await dao.getFieldListByGroup(data)
        if (resp) {
            return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(resp)}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}
module.exports.getList = async (data) => {
    try{
        let resp = await dao.getList(data)
        if (resp) {
            return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(resp)}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}
module.exports.add = async (data) => {
    try{
        let isExists = await dao.checkName(data.reraid, data.groupname, 0);
        if (!isExists) {
            const groupId = await dao.add(data);
            if (groupId) {
                const resp = await dao.addMapping(data.filedIds, groupId, data.reraid);
                return {success: true, status: util.statusCode.SUCCESS, message: 'Group added successfully', response: null}
            } else {
                return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
            }
        } else {
            return {success: false, status: util.statusCode.NAME_EXISTS, message: 'An entity withe same name already exists', response: null}
        }

    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}
module.exports.addFieldsInGroup = async (data) => {
    try{
        const resp = await dao.addMapping(data.filedIds, data.groupid, data.reraid);
        if (resp) {
            return {success: true, status: util.statusCode.SUCCESS, message: 'Fields added successfully', response: null}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }

    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}
module.exports.update = async (data) => {
    try{
        const resp = await dao.updateGroupMap(data);
        if (resp) {
            return {success: true, status: util.statusCode.SUCCESS, message: 'Details updated successfully', response: null}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}

module.exports.delete = async (data) => {
    try{
        const resp = await dao.delete(data);
        if (resp) {
            return {success: true, status: util.statusCode.SUCCESS, message: 'Field updated successfully', response: null}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }

    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}

module.exports.updateSequence = async (data) => {
    try{
        const resp = await dao.updateSequence(data.data);
        if (resp) {
            return {success: true, status: util.statusCode.SUCCESS, message: 'Sequence updated successfully', response: null}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }

    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}