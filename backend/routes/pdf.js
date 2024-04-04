var express = require('express');
var multer = require('multer');   /*multer is a npm package use to file handling in nodjs*/
var router = express.Router();

const { uploadpdf } = require('../controller/uploadpdf.js');  /*import uploadpdf function from uploadpdf.js*/

// It is used to where the files will be stored

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./files");
    },
    filename: (req, file, cb) => {
        if (file.mimetype === 'application/pdf') {
            const unique = Date.now();
            cb(null, unique + file.originalname);
        } else {
            // Return an error if the file is not a 
            cb(new Error('Only PDF files are allowed to Upload'));
        }
    }
});

// It will store the uploaded file in specific storage

const upload = multer({
    storage: storage,
}).single("file")


/* PDF Routes */

router.post('/uploadpdf', upload, uploadpdf);


module.exports = router;
