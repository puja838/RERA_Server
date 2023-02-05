const dao 			        =    require('./mst_entity_map.dao');
const entitydao 			=    require('../mst_entity/mst_entity.dao');
const entitytypedao 		=    require('../mst_entity_type/mst_entity_type.dao');
const token 				=   require('../../utility/token');
const util 					=	require('../../utility/util');


module.exports.getLandingData = async (data) => {
    try{
        let entityList = await entitydao.getList(data);
        let entityTypeList = await entitytypedao.getList(data);
        if (entityList && entityTypeList) {
            return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse({entity: entityList, entityType: entityTypeList})}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        console.log(e)
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
        let isExists = await dao.check(data.reraid, data.entitytypeid, data.entityid, 0);
        if (!isExists) {
            const resp = await dao.add(data);
            if (resp) {
                return {success: true, status: util.statusCode.SUCCESS, message: 'Entity added successfully', response: null}
            } else {
                return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
            }
        } else {
            return {success: false, status: util.statusCode.NAME_EXISTS, message: 'An mapping with same details already exists', response: null}
        }

    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}
module.exports.update = async (data) => {
    try{
        let isExists = await dao.check(data.reraid, data.entitytypeid, data.entityid, data.id);
        if (!isExists) {
            const resp = await dao.update(data);
            if (resp) {
                return {success: true, status: util.statusCode.SUCCESS, message: 'Entity updated successfully', response: null}
            } else {
                return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
            }
        } else {
            return {success: false, status: util.statusCode.NAME_EXISTS, message: 'An mapping with same details already exists', response: null}
        }

    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}

module.exports.delete = async (data) => {
    try{
        const resp = await dao.delete(data);
        if (resp) {
            return {success: true, status: util.statusCode.SUCCESS, message: 'Entity updated successfully', response: null}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }

    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}