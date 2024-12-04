const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EmployeeSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: Number,
        required: true
    },
    notes: {
        type: String,
        default: ''
    },
    documents: [{
        id: {
            type: Schema.Types.ObjectId,
            default: () => new mongoose.Types.ObjectId()
        },
        employeeId: {
            type: Schema.Types.ObjectId,
            ref: 'employees',
            required: true
        },
        title: String,
        fileName: String,
        originalName: String,
        mimeType: String,
        uploadDate: {
            type: Date,
            default: Date.now
        }
    }]
});

const EmployeeModel = mongoose.model('employees', EmployeeSchema);
module.exports = EmployeeModel;