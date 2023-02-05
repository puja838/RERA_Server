const express       	=	require('express');
const bodyParser    	=	require('body-parser');
const cors          	=	require('cors');
const helmet        	=	require('helmet');
const morgan       	    =	require('morgan');
const fs            	=	require('fs');
const path          	=	require('path');
const compression 	    = 	require('compression');
const config 		    =	require('./config');
const l			        =	require('./utility/logger');
const token			        =	require('./utility/token');
const util			        =	require('./utility/util');
const http              = require('http');

const PORT = process.env.PORT || config.PORT;
const app = express();
const dirname = __dirname.replace('/src', '');
const root = dirname + "/public";

// compress all responses
app.use(compression())

// set static path
app.use(express.static(path.resolve(config.FILEPATH)));

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json({limit: '50mb'}));

app.use(helmet.frameguard({ action: 'SAMEORIGIN' }));

// enabling CORS for all requests
app.use(cors());
app.use(express.static(root));
app.set('views', path.join(dirname, 'public'));
app.set('view engine', 'html');

// adding morgan to log HTTP requests
app.use(morgan('combined'));
app.use(token.decryptRequest);
app.use(token.authenticateToken);

fs.readdir(config.controllerPath, (err, files) => {
    if(err){
        console.log("error occured");
        console.log(err);
    } else {
        // console.log(files)
        //this can get all folder and file under  <MyFolder>
        files.map(function (file) {
            //return file or folder path, such as **MyFolder/SomeFile.txt**
            return path.join(config.controllerPath, file);
        }).filter(function (file) {
            //use sync judge method. The file will add next files array if the file is directory, or not. 
            return fs.statSync(file).isDirectory();
        }).forEach(function (files) {
            //The files is array, so each. files is the folder name. can handle the folder.
            fs.readdir(files, (err, files1) => {
                if(err){
                    console.log("error occured");
                    console.log(err);
                } else {
                    files1.forEach(file1 => {
                        if (file1.indexOf('controller') > -1) {
                            app.use('/api' , require(files+'/' +file1));
                        }
                     });
                }
            });
        });
    }
});

app.use(token.encryptResponse)

const server = http.createServer(app);
server.listen(PORT, () => {
    l.logger.log('info', 'listening on port '+PORT);
});
