const dao = require('./mst_workflow_steps_works.dao');
const token = require('../../utility/token');
const util = require('../../utility/util');


module.exports.getList = async (data) => {
    try {
        let resp = await dao.getList(data)
        if (resp) {
            return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(resp) }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

module.exports.getWorkFlow = async (data) => {
    try {
        let resp = await dao.getWorkFlow(data)
        if (resp) {
            return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(resp) }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}


module.exports.getworkflowid = async (data) => {
    try {
        let resp = await dao.getworkflowid(data)
        if (resp) {
            return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(resp) }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

module.exports.getworkflowstepid = async (data) => {
    try {
        let resp = await dao.getworkflowstepid(data)
        if (resp) {
            return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(resp) }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

module.exports.getstepid = async (data) => {
    try {
        let resp = await dao.getstepid(data)
        if (resp) {
            return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(resp) }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}


module.exports.add = async (data) => {
    try {
        let isExists = await dao.check(data);
        util.createLog(isExists)
        if (!isExists) {
            const resp = await dao.add(data);
            if (resp) {
                return { success: true, status: util.statusCode.SUCCESS, message: 'Entity added successfully', response: null }
            } else {
                return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
            }
        } else {
            return { success: false, status: util.statusCode.NAME_EXISTS, message: 'Workflow steps with same details already exists', response: null }
        }

    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}
module.exports.update = async (data) => {
    try {
        let isExists = await dao.updatecheck(data);
        util.createLog(isExists)
        if (!isExists) {
            const resp = await dao.update(data);
            if (resp) {
                return { success: true, status: util.statusCode.SUCCESS, message: 'Data updated successfully', response: null }
            } else {
                return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
            }
        } else {
            return { success: false, status: util.statusCode.NAME_EXISTS, message: 'Workflow steps with same details already exists', response: null }
        }

    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}


module.exports.delete = async (data) => {
    try {
        const resp = await dao.delete(data);
        if (resp) {
            return { success: true, status: util.statusCode.SUCCESS, message: 'Entity updated successfully', response: null }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }

    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}