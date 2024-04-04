const pdfschema = require('../models/pdfmodel'); //import the model

// used for upload pdf in database

const uploadpdf = async (req, res) => {

    try {

        // create new item in mongodb with pdf details

        const upload = await new pdfschema({

            pdfname: req.file.originalname,
            pdf: req.file.filename,

        })

        const pop = await upload.save()

        // In the below code if item created successfully it return success otherwise it returns error

        if (pop) {

            return res.status(201).json({
                success: true,
                result: pop,
                message: 'Successfully uploaded the file'

            })
        } else {

            return res.status(404).json({
                success: false,
                result: null,
                message: "file not uploaded"
            })
        }

    } catch (err) {

        // It is a catch block to handle unexpected errors

        return res.status(500).json({
            success: false,
            result: null,
            message: Array.isArray(err.message) ? err.message[0].msg : err.message
        })
    }
}


module.exports = { uploadpdf }