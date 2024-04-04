const mongoose = require('mongoose');  // mongoose is a mongodb npm package
const mongoosePaginate = require('mongoose-paginate-v2');


// mongodb schema for save pdf details on database
const pdfmodelSchema = new mongoose.Schema({

    pdfname: {
        type: String,
        required: true
    },
    pdf: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }

})

pdfmodelSchema.plugin(mongoosePaginate)

// Export the mongoose schema
module.exports = mongoose.model('pdf', pdfmodelSchema);