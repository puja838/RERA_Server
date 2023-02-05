const dao 			        =    require('./mst_user.dao');
const token 				=   require('../../utility/token');
const util 					=	require('../../utility/util');

module.exports.login = async (data) => {
    try {
        let resp = await dao.login(data)
        if (resp) {
            const isMatch = await util.comparePass(data.password, resp.userpassword);
            if (isMatch) {
                delete resp['userpassword'];
                resp.token = await token.createJWTToken({userid: resp.userid});
                return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(resp) }
            } else {
                return { success: false, status: util.statusCode.AUTH_ERR, message: 'Incorrect Password', response: null }
            }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Wrong Credentials', response: null }
        }
    } catch (e) {
        util.createLog(e)
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}
module.exports.generateToken = async (data) => {
    try {
        let resp = await token.createJWTToken({userid: data.userid});
        if (resp) {
            return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse({token: resp}) }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Wrong Credentials', response: null }
        }
    } catch (e) {
        util.createLog(e)
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
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

module.exports.getUserDetails = async (data) => {
    try{
        let resp = await dao.getUserDetails(data)
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
        let isExists = await dao.check(data);
        util.createLog(isExists);
        if (!isExists) {
            data.passkey =  data.password;
            data.password = await util.generateHash(data.password);
            const resp = await dao.add(data);
            if (resp) {
                return {success: true, status: util.statusCode.SUCCESS, message: 'Entity added successfully', response: null}
            } else {
                return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
            }
        } else {
            return {success: false, status: util.statusCode.NAME_EXISTS, message: 'User name already exists', response: null}
        }
       

    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}
module.exports.update = async (data) => {
    try{
        const resp = await dao.update(data);
        if (resp) {
            return {success: true, status: util.statusCode.SUCCESS, message: 'Data updated successfully', response: null}
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
            return {success: true, status: util.statusCode.SUCCESS, message: 'Entity updated successfully', response: null}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }

    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}
module.exports.rolelist = async (data) => {
    try{
        let resp = await dao.rolelist(data)
        if (resp) {
            return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(resp)}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}
module.exports.changeRoleName = async (data) => {
    try{
        const resp = await dao.changeRoleName(data);
        if (resp) {
            return {success: true, status: util.statusCode.SUCCESS, message: 'Data updated successfully', response: null}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }

    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
   
}