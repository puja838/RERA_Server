const dao 			        =    require('./mst_annual_report.dao');
const token 				=   require('../../utility/token');
const util 					=	require('../../utility/util');


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
        console.log(data.annualReport)
        for(let arr of data.annualReport){
            var resp = await dao.add(arr,data.userid);
        }
        
        if (resp) {
            return {success: true, status: util.statusCode.SUCCESS, message: 'Entity added successfully', response: null}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }

    } catch (e) {
        console.log(e)
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
