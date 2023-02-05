const formidable = require('formidable');
const fs = require('fs');
const config = require('../../config')

var genFileName = (filename) => {
    let splfile = filename.split(".");
    let ext = splfile.pop();
    let onlyfile = splfile.join('').replace(/[^a-zA-Z ]/g, "").replace(" ", "_").trim();
    return 'RERAUPF' + Date.now() + "." + ext;
}

module.exports.handelFormData = async (req, type) => {
    try {
        return new Promise((resolve, reject) => {
            var FileUploadPath = config.FILEPATH
            if (type == 'news') {
                FileUploadPath = config.NEWSPATH
            }
            const form = formidable({multiples: true, uploadDir: FileUploadPath});
            let filename = '';
            let orgfilename = '';
            let success = true;
            let message = ''
            form.on('fileBegin', function (field, file) {
                let splfile = file.originalFilename.split(".");
                let type = splfile.pop();
                if (type != 'jpeg' && type != 'png' && type != 'pdf' && type != 'pdf') {
                    success = false;
                    message = 'Only .jpeg,.jpg,.png and .pdf file is allowed.';
                    fs.unlink(file.path);
                }
            });
            form.on('file', function (field, file) {
                //rename the incoming file to the file's name
                orgfilename = file.originalFilename;
                filename = genFileName(file.originalFilename);
                fs.rename(file.filepath, form.uploadDir + "/" + filename, (err) => {
                    console.log('file error >> ', err);
                });
            });
            form.parse(req, async (err, fields, files) => {
                const data = fields;
                data['success'] = success;
                data['fileName'] = filename;
                data['orgfilename'] = orgfilename;
                data['message'] = message;
                resolve(data)
            });
        })
    } catch (e) {
        console.log(e)
        resolve({})
    }
}