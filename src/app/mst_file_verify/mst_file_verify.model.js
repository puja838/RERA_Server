const dao = require('./mst_file_verify.dao');
const token = require('../../utility/token');
const util = require('../../utility/util');


module.exports.getList = async (data) => {
    try {
        data1 = {
            fromwhich: 1,
            reraid: data.reraid
        };
        data2 = {
            fromwhich: 2,
            reraid: data.reraid
        };
        resp1 = await dao.getListForProject(data1)
        var seenNames = {};
        
        resp2 = await dao.getListForProfile(data2)
        varificationresp = resp1.concat(resp2)
        array = varificationresp.filter(function (currentObject) {
            if (currentObject.vefificationid in seenNames && currentObject.vefificationid != null) {
                return false;
            } else {
                seenNames[currentObject.vefificationid] = true;
                return true;
            }
        });
        if (array) {

            return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(array) }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

module.exports.getFieldNameForProject = async (data) => {
    try {
        let resp = await dao.getFieldNameForProject(data)
        if (resp) {
            return { success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(resp) }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }
    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}


module.exports.getFieldNameForProfile = async (data) => {
    try {
        let resp = await dao.getFieldNameForProfile(data)
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
        let resp
        let keywordArey = data.keyword.split(",")
        for (let i = 0; i < keywordArey.length; i++) {
            data.filekeyword = keywordArey[i]
            let isExists = await dao.checkwithoutfile(data);
            let isExists1 = await dao.checkwithfile(data);
            util.createLog(isExists)
            if (!isExists && !isExists1) {
                resp = await dao.addwithoutfile(data);
                const resp1 = await dao.addwithfile(data)
            } else {
                return { success: false, status: util.statusCode.NAME_EXISTS, message: 'File Verify with same details already exists', response: null }
            }

        }
        if (resp) {
            return { success: true, status: util.statusCode.SUCCESS, message: 'Entity added successfully', response: null }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }

    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}
module.exports.update = async (data) => {
    try {
        let resp
        let keywordArey = data.keyword.split(",")
        for (let i = 0; i < keywordArey.length; i++) {
            data.filekeyword = keywordArey[i]
            let isExists = await dao.checkwithoutfile(data);
            let isExists1 = await dao.checkwithfile(data);
            console.log("EXIST", isExists, isExists1)
            util.createLog(isExists)
            if (!isExists && !isExists1) {
                resp = await dao.updatewithfile(data);
                const resp1 = await dao.updatewithoutfile(data);
            } else {
                return { success: false, status: util.statusCode.NAME_EXISTS, message: 'File Verify with same details already exists', response: null }
            }
        }
        if (resp) {
            return { success: true, status: util.statusCode.SUCCESS, message: 'Entity updated successfully', response: null }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }


    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}


module.exports.delete = async (data) => {
    try {

        const resp = await dao.deletewithoutfile(data);
        const resp1 = await dao.deletewithfile(data);
        if (resp) {
            return { success: true, status: util.statusCode.SUCCESS, message: 'Entity updated successfully', response: null }
        } else {
            return { success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null }
        }

    } catch (e) {
        return { success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null }
    }
}

