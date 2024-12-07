const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DocumentSchema = new Schema({
    employeeId: {
        type: Schema.Types.ObjectId,
        ref: 'employees',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        default: ''
    },
    fileUrl: {
        type: String,
        required: true
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

const DocumentModel = mongoose.model('documents', DocumentSchema);
module.exports = DocumentModel;
