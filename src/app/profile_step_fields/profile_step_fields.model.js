const dao 			        =    require('./profile_step_fields.dao');
const entitydao 			=    require('../mst_entity/mst_entity.dao');
const fieldsdao 			=    require('../mst_entity_profile_fields/mst_entity_profile_fields.dao');
const groupdao 			    =    require('../mst_profile_fields_group/mst_profile_field_group.dao');
const stepdao 			    =    require('../mst_steps/mst_steps.dao');
const token 				=    require('../../utility/token');
const util 					=	 require('../../utility/util');
const async                 =    require("async");


module.exports.landingData = async (data) => {
    try{
        const entityList = await entitydao.getList(data);
        const fieldList  =  await fieldsdao.getList(data);
        const groupList  =  await groupdao.getList(data);
        data.steptype = 2;
        const stepList  =  await stepdao.getList(data);
        if (entityList && fieldList && groupList) {
            const resp = {entity: entityList, field: fieldList, group: groupList, step: stepList}
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
        let resp = await dao.getList(data);
        if (resp) {
            return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(resp)}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}

module.exports.getFieldList = async (data) => {
    try{
        let resp = await dao.getFieldList(data)
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
        const resp = await dao.add(data);
        if (resp) {
            return {success: true, status: util.statusCode.SUCCESS, message: 'Entity added successfully', response: null}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }

    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}
module.exports.update = async (data) => {
    try{
        // let isExists = await dao.checkModuleExistance(data);
        let isExists = false;
        if (!isExists) {
            const resp = await dao.update(data);
            if (resp) {
                return {success: true, status: util.statusCode.SUCCESS, message: 'Field info updated successfully', response: null}
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