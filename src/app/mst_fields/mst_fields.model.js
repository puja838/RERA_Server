const dao 			        =    require('./mst_fields.dao');
const util 					=	 require('../../utility/util');

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
        let isExists = await dao.checkName(data.reraid, data.fielddesc, 0);
        if (!isExists) {
            const resp = await dao.add(data);
            if (resp) {
                return {success: true, status: util.statusCode.SUCCESS, message: 'Fields added successfully', response: null}
            } else {
                return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
            }
        } else {
            return {success: false, status: util.statusCode.NAME_EXISTS, message: 'A fields with same name already exists', response: null}
        }

    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}
module.exports.update = async (data) => {
    try{
        let isExists = await dao.checkName(data.reraid, data.fielddesc, data.id);
        if (!isExists) {
            const resp = await dao.update(data);
            if (resp) {
                return {success: true, status: util.statusCode.SUCCESS, message: 'fields details updated successfully', response: null}
            } else {
                return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
            }
        } else {
            return {success: false, status: util.statusCode.NAME_EXISTS, message: 'An fields with same name already exists', response: null}
        }

    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}

module.exports.delete = async (data) => {
    try{
        const resp = await dao.delete(data);
        if (resp) {
            return {success: true, status: util.statusCode.SUCCESS, message: 'Fields details deleted successfully', response: null}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }

    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}