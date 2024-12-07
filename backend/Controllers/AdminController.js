const path = require("path");
const EmployeeModel = require('../Models/Employee')
const DocumentModel = require('../Models/Documents')
const fs = require('fs');

const addemployee = async (req, res) => {
    try {
        const { name, email, contact, notes } = req.body;

        // Check if required fields are present
        if (!name || !email || !contact) {
            return res.status(400)
                .json({ message: 'Name, email and contact are required fields', success: false });
        }

        const employeeByEmail = await EmployeeModel.findOne({ email });
        const employeeByContact = await EmployeeModel.findOne({ contact });
        
        if (employeeByEmail) {
            return res.status(409)
                .json({ message: 'Employee with this email already exists.', success: false });
        }

        if (employeeByContact) {
            return res.status(409)
                .json({ message: 'Employee with this contact number already exists.', success: false });
        }

        const employeeModel = new EmployeeModel({ name, email, contact, notes });
        await employeeModel.save();
        res.status(201)
            .json({
                message: "Employee added successfully", 
                success: true
            })
    } catch (err) {
        res.status(500)
            .json({
                message: "Internal server error",
                success: false
            })
    }
}

const getallemployees = async (req, res) => {
    try {
        const employees = await EmployeeModel.find();
        res.status(200).json({ employees, success: true });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
}

const deleteemployee = async (req, res) => {
    try {
        const { id } = req.params;
        await EmployeeModel.findByIdAndDelete(id);
        res.status(200).json({ message: "Employee deleted successfully", success: true });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
}

const editemployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, contact, notes } = req.body;
        await EmployeeModel.findByIdAndUpdate(id, { name, email, contact, notes });
        res.status(200).json({ message: "Employee updated successfully", success: true });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
}


const adddocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
        success: false
      });
    }

    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({
        message: "Employee ID is required",
        success: false
      });
    }

    const employee = await EmployeeModel.findById(id);
    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
        success: false
      });
    }

    // Store file data in base64 format
    const fileData = req.file.buffer.toString('base64');
    const fileType = req.file.mimetype;
    const fileName = req.file.originalname;

    // Add document to employee
    employee.documents.push({
      title: fileName,
      file: `data:${fileType};base64,${fileData}` // Store as data URL
    });

    await employee.save();

    return res.status(201).json({
      message: "Document added successfully",
      success: true,
      document: {
        title: fileName,
        type: fileType
      }
    });

  } catch (err) {
    console.error("Error in adddocument:", err);
    return res.status(500).json({
      message: "Failed to add document: " + err.message,
      success: false
    });
  }
};



const showalldocuments = async (req, res) => {
    try {
        const { id } = req.params;
        const employee = await EmployeeModel.findById(id);
        
        if (!employee) {
            return res.status(404).json({
                message: "Employee not found",
                success: false
            });
        }

        res.status(200).json({ 
            documents: employee.documents,
            success: true 
        });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
}







module.exports = {
    addemployee,
    getallemployees,
    deleteemployee,
    editemployee,
    adddocument,
    showalldocuments
}
