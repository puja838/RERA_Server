const util = require('../../utility/util');


module.exports.listReq = (data) => {
    let errcounter = 0;
    if (data.userid === undefined || data.userid == null) {
        util.createLog("userid is missing");
        errcounter++;
    }
    return errcounter <= 0;
}

module.exports.addReq = (data) => {
    let errcounter = 0;
    if (data.userid === undefined || data.userid == null) {
        util.createLog("Userid is missing");
        errcounter++;
    }
    if(data.annualReport === undefined || data.annualReport == null || data.annualReport.length==0){
        util.createLog("Annual Report is missing");
        errcounter++;
    }
    // if (data.financial_report_year === undefined || data.financial_report_year === null || data.financial_report_year === '') {
    //     util.createLog("Financial report year is missing");
    //     errcounter++;
    // }
    // if (data.sub_doc === undefined || data.sub_doc === null || data.sub_doc === '') {
    //     util.createLog("Subject document is missing");
    //     errcounter++;
    // }
    // if (data.file_name === undefined || data.file_name === null || data.file_name === '') {
    //     util.createLog("File name is missing");
    //     errcounter++;
    // }
    return errcounter <= 0;
}
module.exports.updateReq = (data) => {
    console.log(data);
    let errcounter = 0;
    
    if (data.reportId === undefined || data.reportId === null || data.reportId === '') {
        util.createLog("reportId is missing");
        errcounter++;
    }
    if (data.financial_report_year === undefined || data.financial_report_year === null || data.financial_report_year === '') {
        util.createLog("Financial report year is missing");
        errcounter++;
    }
    if (data.sub_doc === undefined || data.sub_doc === null || data.sub_doc === '') {
        util.createLog("Subject document is missing");
        errcounter++;
    }
    if (data.file_name === undefined || data.file_name === null || data.file_name === '') {
        util.createLog("File name is missing");
        errcounter++;
    }
    return errcounter <= 0;
}
module.exports.deleteReq = (data) => {
    let errcounter = 0;
    if (data.reportId === undefined || data.reportId == null) {
        util.createLog("reportId is missing");
        errcounter++;
    }
    return errcounter <= 0;
}