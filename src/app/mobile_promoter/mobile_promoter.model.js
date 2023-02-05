const dao 			        =    require('./mobile_promoter.dao');
const token 				=   require('../../utility/token');
const util 					=	require('../../utility/util');
const projectDao            =   require('../project/project.dao');


const getRegisterProjectList = async (data, fieldFor= 'M') => {
    try {
        data.isRegister = true;
        data.isMobile = true;
        const projectList = await projectDao.getProjectList(data);
        if (projectList.length > 0) {
            for (const [index, obj] of projectList.entries()) {
                const valueList = await dao.getProjectValueList({projectid: obj.id, fieldFor: fieldFor});
                if(valueList) {
                    for (const d of valueList) {
                        obj[d.fielddesc] = d.projectfieldvalue;
                    }
                }
                if (index === (projectList.length - 1)) {
                    return projectList;
                }
            }
        } else {
            return projectList;
        }
    } catch (e) {
        util.createLog(e);
        return false
    }
}

module.exports.getProjectDashboardData = async (data) => {
    try {
        // const totalProjectCount = await projectDao.getCountOfTotalProject(data);
        data.isMobile = true;
        const totalWorkflowProjectCount = await projectDao.getCountOfTotalProjectInWorkflow(data);
        const countOfTotalProjectQPR = await projectDao.getCountOfTotalProjectStageQPR(data);
        const registerProjectList = await getRegisterProjectList(data);
        // const countOfTotalProjectStageTwo = await projectDao.getCountOfTotalProjectStageTwo(data);
        const getCountOfTotalRegisteredProjects = await projectDao.getCountOfTotalProject(data);
        // const getCountOfTotalRegistrationApplications = await projectDao.getCountOfTotalRegistrationApplications(data);
        return {
            success: true,
            status: util.statusCode.SUCCESS,
            message: '',
            response: await util.encryptResponse({
                totalProjectCount: getCountOfTotalRegisteredProjects,
                pendingQueries: totalWorkflowProjectCount,
                countOfTotalProjectQPR: countOfTotalProjectQPR,
                // countOfTotalProjectStageTwo: countOfTotalProjectStageTwo,
                // countOfTotalRegisteredProjects: getCountOfTotalRegisteredProjects,
                // getCountOfTotalRegistrationApplications: getCountOfTotalRegistrationApplications,
                registerProject: registerProjectList
            })
        }
    } catch (e) {
        const log = util.createLog(e);
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        }
    }
};

module.exports.getProjectList = async (data) => {
    try {
        const projectList = await getRegisterProjectList(data, 'PD');
        if (projectList) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(projectList)
            }
        } else {
            return {
                success: false,
                status: util.statusCode.SOME_ERROR_OCCURRED,
                message: '',
                response: null
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

module.exports.getProjectDetails = async (data) => {
    try {
        let projectDetails = await projectDao.getProjectDetails(data);
        if (projectDetails) {
            const valueList = await dao.getProjectValueList({projectid: data.projectid, fieldFor: 'PD'});
            if(valueList) {
                for (const d of valueList) {
                    projectDetails[d.fielddesc] = d.projectfieldvalue;
                }
            }
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(projectDetails)
            }
        } else {
            return {
                success: false,
                status: util.statusCode.SOME_ERROR_OCCURRED,
                message: '',
                response: null
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

module.exports.getQprProjects = async (data) => {
    try{
        if (data.offset === '') {
            data.offset = 0
        }
        const projectList = await projectDao.fetchUpdateProjectDetailsForUser({reraid: data.reraid, userid: data.userid, flag: 2, limit: data.limit, offset: data.offset})
        if (projectList) {
            if (projectList .length > 0) {
                for (const [index, obj] of projectList.entries()) {
                    const valueList = await dao.getProjectValueList({projectid: obj.id, fieldFor: 'PD'});
                    if(valueList) {
                        for (const d of valueList) {
                            obj[d.fielddesc] = d.projectfieldvalue;
                        }
                    }
                    const qprDtl = await dao.getFirstPendingQuoter({projectid: obj.id, userid: data.userid});
                    obj['quarterDtl'] = null;
                    if (qprDtl && qprDtl.length > 0) {
                        obj['quarterDtl'] = qprDtl[0];
                    }
                    if (index === (projectList.length - 1)) {
                        return {
                            success: true,
                            status: util.statusCode.SUCCESS,
                            message: '',
                            response: await util.encryptResponse(projectList)
                        };
                    }
                }
            } else {
                return {
                    success: true,
                    status: util.statusCode.SUCCESS,
                    message: '',
                    response: await util.encryptResponse(projectList)
                };
            }
        } else {
            return {
                success: false,
                status: util.statusCode.SOME_ERROR_OCCURRED,
                message: '',
                response: null
            };
        }
    } catch (e) {
        util.createLog(e);
        return {
            success: false,
            status: util.statusCode.SOME_ERROR_OCCURRED,
            message: 'Some error occurred',
            response: null
        };
    }
};
module.exports.getProjectDetailsLatLong = async (data) => {
    try {
        let projectDetails = await dao.getProjectDetailsLatLong(data);
        if (projectDetails) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(projectDetails)
            }
        } else {
            return {
                success: false,
                status: util.statusCode.SOME_ERROR_OCCURRED,
                message: '',
                response: null
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
module.exports.getSiteLocationImg = async (data) => {
    try {
        let locationImg = await dao.getSiteLocationImg(data.projectid);
        if (locationImg) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(locationImg)
            }
        } else {
            return {
                success: false,
                status: util.statusCode.SOME_ERROR_OCCURRED,
                message: '',
                response: null
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

module.exports.uploadSiteLocationImg = async (data) => {
    try {
        data.entityid = 1;
        const result = await dao.insertSiteLocationImg(data);
        if (result) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Image uploaded successfully',
                response: await util.encryptResponse({id: result, fileName: data.fileName})
            }
        } else {
            return {
                success: false,
                status: util.statusCode.SOME_ERROR_OCCURRED,
                message: '',
                response: null
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

module.exports.deleteSiteLocationImg = async (data) => {
    try {
        const result = await dao.deleteSiteLocationImg(data);
        if (result) {
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: 'Image deleted successfully',
                response: null
            }
        } else {
            return {
                success: false,
                status: util.statusCode.SOME_ERROR_OCCURRED,
                message: '',
                response: null
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

async function reArrangeDetailsFields(data, fieldList) {
    const newArr = [];
    for (const [index, fieldId] of fieldList.entries()) {
        for (const obj of data) {
            if (obj.fieldid == fieldId) {
                newArr.push(obj);
                break;
            }
        }
        if (index === (fieldList.length - 1)) {
            return newArr;
        }
    }

}

module.exports.getProfileDetails = async (data) => {
    try {
        let profileDetails = await dao.getProfileDetails(data.userid);
        if (profileDetails) {
            profileDetails['details'] = {};
            if (profileDetails.entitytypeid === 2) {
                profileDetails.details['Company Details'] = await dao.getCompanyDetails(data.userid, util.configFieldId.profile.stepid, util.configFieldId.profile.companyDtl);
                profileDetails.details['Company Details'] = await reArrangeDetailsFields(profileDetails.details['Company Details'], util.configFieldId.profile.companyDtl.split(','));
            } else if (profileDetails.entitytypeid === 3) {
                profileDetails.details['Proprietor Firm Details'] = await dao.getCompanyDetails(data.userid, util.configFieldId.profile.stepid, util.configFieldId.profile.ProprietorshipFirm);
                profileDetails.details['Proprietor Firm Details'] = await reArrangeDetailsFields(profileDetails.details['Proprietor Firm Details'], util.configFieldId.profile.ProprietorshipFirm.split(','));
            } else if (profileDetails.entitytypeid === 4) {
                profileDetails.details['Society Details'] = await dao.getCompanyDetails(data.userid, util.configFieldId.profile.stepid, util.configFieldId.profile.SocietyDtl);
                profileDetails.details['Society Details'] = await reArrangeDetailsFields(profileDetails.details['Society Details'], util.configFieldId.profile.SocietyDtl.split(','));
            } else if (profileDetails.entitytypeid === 5) {
                profileDetails.details['Partnership Firm Details'] = await dao.getCompanyDetails(data.userid, util.configFieldId.profile.stepid, util.configFieldId.profile.PartnershipFirm);
                profileDetails.details['Partnership Firm Details'] = await reArrangeDetailsFields(profileDetails.details['Partnership Firm Details'], util.configFieldId.profile.PartnershipFirm.split(','));
            } else if (profileDetails.entitytypeid === 6) {
                profileDetails.details['Limited Liability Partnership Details'] = await dao.getCompanyDetails(data.userid, util.configFieldId.profile.stepid, util.configFieldId.profile.LiabilityDtl);
                profileDetails.details['Limited Liability Partnership Details'] = await reArrangeDetailsFields(profileDetails.details['Limited Liability Partnership Details'], util.configFieldId.profile.LiabilityDtl.split(','));
            } else if (profileDetails.entitytypeid === 7) {
                profileDetails.details['Trust Details'] = await dao.getCompanyDetails(data.userid, util.configFieldId.profile.stepid, util.configFieldId.profile.TrustDtl);
                profileDetails.details['Trust Details'] = await reArrangeDetailsFields(profileDetails.details['Trust Details'], util.configFieldId.profile.TrustDtl.split(','));
            } else if (profileDetails.entitytypeid === 8) {
                profileDetails.details['Cooperative Society Details'] = await dao.getCompanyDetails(data.userid, util.configFieldId.profile.stepid, util.configFieldId.profile.CooperativeDtl);
                profileDetails.details['Cooperative Society Details'] = await reArrangeDetailsFields(profileDetails.details['Cooperative Society Details'], util.configFieldId.profile.CooperativeDtl.split(','));
            } else if (profileDetails.entitytypeid === 9) {
                profileDetails.details['Component Authority Details'] = await dao.getCompanyDetails(data.userid, util.configFieldId.profile.stepid, util.configFieldId.profile.ComponentDtl);
                profileDetails.details['Component Authority Details'] = await reArrangeDetailsFields(profileDetails.details['Component Authority Details'], util.configFieldId.profile.ComponentDtl.split(','));
            }
            profileDetails['Authority Details'] = await dao.getCompanyDetails(data.userid, util.configFieldId.profile.stepid, util.configFieldId.profile.authority);
            return {
                success: true,
                status: util.statusCode.SUCCESS,
                message: '',
                response: await util.encryptResponse(profileDetails)
            }
        } else {
            return {
                success: false,
                status: util.statusCode.SOME_ERROR_OCCURRED,
                message: '',
                response: null
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