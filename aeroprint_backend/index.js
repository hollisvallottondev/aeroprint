// Imports
const express = require('express');
const multiparty = require('multiparty');
const app = express();
const port = 5000;
const cors = require('cors');
const fs = require('fs');
const folder = 'files/';
// CORS configurations
app.use(cors());
// Endpoints
app.post('/upload', (req, res) => {
    // initiate multiparty
    const form = new multiparty.Form();
    
    // parse req form data
    return form.parse(req, (err, fields, files) => {
        // error handling
        if (err) {
             return res.status(400).send({error: err });
        }
        
        console.log('files', files);
        // path
        const { path } = files.file[0];
   
        // get the temp file name from the tmp folder
        // let filename = path.split('/');
        // for windows: 

        let filename = path.split(`\\`);

        console.log('filename', filename); 
        
        filename = filename[filename.length - 1];
        
        // move file into folder
        return fs.rename(path, `${folder}${filename}`, error => {
             // error handling for moving

             if (error) {
                 console.error( error ); 
                  return res.status(400).send({ error });
             }
             return res.status(200).send({ file: filename });
        });
    });
});
// Listen
app.listen(port, () => console.log(`Listening on port ${port}`));