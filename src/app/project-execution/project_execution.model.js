const dao = require('./project_execution.dao');
const executionConf = require('./project_execution_config');
const token = require('../../utility/token');
const util = require('../../utility/util');
const config = require('../../config');
const common = require('../services/common.service');

module.exports.getProjectDetail = async (data) => {
    try {
        const result = await dao.getProjectDetail(data);
        if (result) {
            const user = await common.getNameByUserId(data.userid);
            result.promoterName = user.username;
            result.copromoterName = '';
            if (data.quoterid) {
                result.quarterDtl = await dao.getQuarterDtlById(data);
            }
            for (const [index, obj] of executionConf.projectDetails.entries()) {
                obj.projectid = data.projectid;
                const value = await dao.getProjectInfoFromDtl(obj);
                if (value) {
                    result[obj.fieldName] = value.fieldvalue;
                } else {
                    result[obj.fieldName] = '';
                }
                if (index === (executionConf.projectDetails.length - 1)) {
                    return {
                        success: true,
                        status: util.statusCode.SUCCESS,
                        message: '',
                        response: await util.encryptResponse(result)
                    }
                }
            }
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        util.createLog(e);
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}

module.exports.getSubmittedQuoterList = async (data) => {
    try {
        const result = await dao.getSubmittedQuoterList(data);
        if (result) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(result)
            }
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        util.createLog(e);
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}

module.exports.getPendingQuoterList = async (data) => {
    try {
        const result = await dao.getPendingQuoterList(data);
        // console.log(result)
        if (result) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(result)
            }
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        util.createLog(e);
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}

module.exports.getInventoryData = async (data) => {
    try {
        let result = await dao.getInventoryDataByQuoter(data);
        if (result) {
            if (result.length === 0) {
                result = await dao.getLastInventoryData(data);
            }
            let building = [], garage = [], commercial = [];
            for (const obj of result) {
                if (obj.type === 'residential') {
                    building.push({
                        build: obj.buildingname,
                        utype: obj.unittype,
                        care: obj.coverarea,
                        sapart: obj.unitno,
                        sprom: obj.promoterunit,
                        groupposition: obj.grouppos,
                        groupid: obj.groupid,
                        fieldgroupid: obj.fieldgroupid,
                        groufieldpposition: obj.fieldgrouppos,
                        bookedunit: obj.bookedunit,
                        soldunit: obj.soldunit
                    });
                } else if (obj.type === 'commercial') {
                    commercial.push({
                        build: obj.buildingname,
                        utype: obj.unittype,
                        care: obj.coverarea,
                        sapart: obj.unitno,
                        sprom: obj.promoterunit,
                        groupposition: obj.grouppos,
                        groupid: obj.groupid,
                        fieldgroupid: obj.fieldgroupid,
                        groufieldpposition: obj.fieldgrouppos,
                        bookedunit: obj.bookedunit,
                        soldunit: obj.soldunit
                    });
                } else {
                    garage.push({
                        build: obj.buildingname,
                        garage: obj.unitno,
                        gprom: obj.promoterunit,
                        groupposition: obj.grouppos,
                        groupid: obj.groupid,
                        bookedunit: obj.bookedunit,
                        soldunit: obj.soldunit
                    });
                }
            }
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse({building: building, commercial: commercial, garage: garage})
            }
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        util.createLog(e);
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}

module.exports.getConstructionProgress = async (data) => {
    try {
        const quarterresult = await dao.getQuarterIdByProject(data);
        if (!quarterresult) {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        } else {
            if (quarterresult.length > 0) {
                let matched = false;
                for (let i = 0; i < quarterresult.length; i++) {
                    // console.log(quarterresult[i].quarterid,data.quoterid)
                    if (quarterresult[i].quarterid === Number(data.quoterid)) {
                        matched = true;
                        break;
                    }
                }
                if (!matched) {
                    data.quoterid = quarterresult[0].quarterid;
                }
            }
            try {
                let result;
                if(data.type==='construct') {
                    result = await dao.getConstructionProgress(data);
                }else if(data.type==='amenity'){
                    result = await dao.getAmenityProgress(data);
                }
                if (!result) {
                    return {
                        success: false,
                        status: util.statusCode.INTERNAL,
                        message: 'Internal server error',
                        response: null
                    }
                } else {
                    return {
                        success: true,
                        status: util.statusCode.SUCCESS,
                        message: '',
                        response: await util.encryptResponse(result)
                    }
                }
            } catch (e) {
                util.createLog(e);
                return {
                    success: false,
                    status: util.statusCode.SOME_ERROR_OCCURRED,
                    message: 'Some error occurred',
                    response: null
                }
            }
        }

    } catch (e) {
        util.createLog(e);
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}

module.exports.upsertConstructionProgress = async (data) => {
    try {
        let count = 0;
        for (let i = 0; i < data.progressData.length; i++) {
            data.progressData[i].projectid = data.projectid;
            data.progressData[i].reraid = data.reraid;
            data.progressData[i].quoterid = data.quoterid;
            data.progressData[i].userid = data.userid;
            data.progressData[i].type = data.type;
            const dupresult = await dao.duplicateProgress(data.progressData[i]);
            if (dupresult) {
                if (dupresult.length > 0) {
                    try {
                        const upresult = await dao.updateConstructionProgress(data.progressData[i], dupresult[0].id);
                        if (!upresult) {
                            count++;
                        }
                    } catch (e) {
                        count++;
                        util.createLog(e);
                    }
                } else {
                    try {
                        const upresult = await dao.insertConstructionProgress(data.progressData[i]);
                        if (!upresult) {
                            count++;
                        }
                    } catch (e) {
                        count++;
                        util.createLog(e);

                    }
                }

            } else {
                count++;
            }
            if (i === (data.progressData.length - 1)) {
                if (count === data.progressData.length) {
                    return {
                        success: false,
                        status: util.statusCode.INTERNAL,
                        message: 'Internal server error',
                        response: null
                    }
                } else {
                    return {
                        success: true,
                        status: util.statusCode.SUCCESS,
                        message: 'Details updated successfully',
                        response: null
                    }
                }
            }
        }
    } catch (e) {
        util.createLog(e);
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
}


////Sayan


module.exports.getList = async (data) => {
    try{
        let resp = await dao.getList(data);
        let projectAccount = await dao.getProjectAccountNo(data.projectid);
        if (resp) {
            let financialDetails;
            if (resp.length > 0 && projectAccount) {
                resp[0].projectaccountno = projectAccount.projectfieldvalue;
                financialDetails = resp[0];
            } else if (projectAccount) {
                financialDetails = {
                    projectaccountno: projectAccount.projectfieldvalue,
                    estimatedcost: '',
                    amtrecquoter: '',
                    actiualcost: '',
                    netamount: '',
                    totalexpenditure: '',
                    mortgagecharge: ''
                };
            }
            return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(financialDetails)}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}
module.exports.addFinancial_details = async (data) => {
    try{
        let resp;
        const checkRes = await dao.duplicateFinancialDetails(data);
        if (checkRes) {
            data.financialUpdateId = checkRes;
            resp = await dao.updateFinancial_details(data);
        } else {
            resp = await dao.addFinancial_details(data);
        }
        if (resp) {
            return {success: true, status: util.statusCode.SUCCESS, message: 'Financial details updated successfully', response: null}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }

    } catch (e) {
        console.log(e)
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
};
module.exports.updateFinancial_details = async (data) => {
    try{
        var resp = await dao.updateFinancial_details(data);
        if (resp) {
            return {success: true, status: util.statusCode.SUCCESS, message: 'Entity updated successfully', response: null}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }

    } catch (e) {
        console.log(e)
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}
module.exports.addLegalCase = async (data) => {
    try{
        const resp = await dao.addLegalCase(data.legalCase,data.projectid,data.userid,data.quoterid);
        if (resp) {
            const salesDocExistId = await dao.checkSaleAgreementByQuoterId(data.projectid,data.userid,data.quoterid);
            let sale_agreement;
            if (salesDocExistId) {
                sale_agreement = await dao.updateSaleAgreement(data.saledeed,data.saleagreement,salesDocExistId);
            } else {
                sale_agreement = await dao.addSaleAgreement(data.saledeed,data.saleagreement,data.projectid,data.userid,data.quoterid);
            }
            if(sale_agreement){
                const execution_hdr = await dao.updateExecutionHdr(data.submitPersonName,data.signatureFile,data.userid,data.projectid,data.quoterid);
                if(execution_hdr){
                    return {success: true, status: util.statusCode.SUCCESS, message: 'Quarter details submitted successfully', response: null}
                }else{
                    return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
                }

            }else{
                return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
            }

        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }

    } catch (e) {
        console.log(e)
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}
module.exports.getLegalCase = async (data) => {
    try{
        let legalResp = await dao.getLegalCase(data);
        let saleResp = await dao.getSaleAgreement(data);
        let hdrResp = await dao.getExecutionHdr(data);
        if (legalResp && saleResp && hdrResp) {
            return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse({legalResp: legalResp, saleResp: saleResp, hdrResp: hdrResp})}
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}
module.exports.getPhotoParticulars = async () => {
    try{
        let result = await dao.getPhotoParticulars();
        if (result) {
            return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(result)};
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}
module.exports.uploadPhotoParticulars = async (data) => {
    try{
        let insertedId = await dao.savePhotoParticulars(data);
        if (insertedId) {
            return {success: true, status: util.statusCode.SUCCESS, message: 'Photograph uploaded successfully', response: await util.encryptResponse({fileName: data.fileName, insertedId: insertedId})};
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}
module.exports.deleteBuildingPhoto = async (data) => {
    try{
        let result = await dao.deleteBuildingPhoto(data);
        if (result) {
            return {success: true, status: util.statusCode.SUCCESS, message: 'Photograph deleted successfully', response: null};
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}
module.exports.getBuildingPhotograph = async (data) => {
    try{
        let result = await dao.getBuildingPhotograph(data);
        if (result) {
            return {success: true, status: util.statusCode.SUCCESS, message: '', response: await util.encryptResponse(result)};
        } else {
            return {success: false, status: util.statusCode.INTERNAL, message: 'Internal server error', response: null}
        }
    } catch (e) {
        return {success: false, status: util.statusCode.SOME_ERROR_OCCURRED, message: 'Some error occurred', response: null}
    }
}
////Sayan


