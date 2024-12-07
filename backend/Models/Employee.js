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
        title: {
            type: String,
            required: true,
        },
        file: {
            type: String,
            required: true
        }
    }]
});

const EmployeeModel = mongoose.model('employees', EmployeeSchema);
module.exports = EmployeeModel;