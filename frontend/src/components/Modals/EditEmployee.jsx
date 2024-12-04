import React, { useState } from 'react';
import Toast from '../../pages/toastNotification/Toast';

const EditEmployee = ({ onClose, showToast, employee }) => {
  const [formData, setFormData] = useState({
    name: employee.name,
    email: employee.email,
    contact: employee.contact,
    notes: employee.notes || '' 
  });

  const [showLocalToast, setShowLocalToast] = useState(false);
  const [localToastMessage, setLocalToastMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'notes' && value.length > 100) {
      displayLocalToast('Note cannot exceed 100 characters');
      return;
    }
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const displayLocalToast = (message) => {
    setLocalToastMessage(message);
    setShowLocalToast(true);
    setTimeout(() => {
      setShowLocalToast(false);
    }, 3000);
  };

  const validateForm = () => {
    // Name validation
    if (!formData.name) {
      displayLocalToast('Name is required');
      return false;
    }
    if (formData.name.length < 3) {
      displayLocalToast('Name must be at least 3 characters long');
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email) {
      displayLocalToast('Email is required');
      return false;
    }
    if (!emailRegex.test(formData.email)) {
      displayLocalToast('Please enter a valid email address');
      return false;
    }

    // Contact validation
    const contactRegex = /^\d{10}$/;
    if (!formData.contact) {
      displayLocalToast('Contact number is required');
      return false;
    }
    if (!contactRegex.test(formData.contact)) {
      displayLocalToast('Contact number must be 10 digits');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
  
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        displayLocalToast('Authentication error. Please login again.');
        return;
      }
  
      const response = await fetch(`https://mern-app-azwp.vercel.app/admin/editemployee/${employee._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          contact: String(formData.contact),
          notes: formData.notes
        })
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update employee');
      }
  
      onClose();
      showToast('Employee updated successfully', 'success');
    } catch (error) {
      console.error('Error updating employee:', error);
      displayLocalToast(error.message || 'Failed to update employee. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]" onClick={(e) => e.stopPropagation()}>
      <div className="bg-white rounded-lg shadow-xl px-8 py-6 w-[500px] max-w-[90vw]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Edit Employee</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter employee name"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter employee email"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
              Contact Number
            </label>
            <input
              type="tel"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Enter 10-digit phone number"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
              Additional Notes (Max 100 characters)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes"
              rows="3"
              maxLength={100}
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
            />
            <div className="text-sm text-gray-500 mt-1">
              {formData.notes ? formData.notes.length : 0}/100 characters
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Update Employee
            </button>
          </div>
        </form>
      </div>
      {showLocalToast && <Toast message={localToastMessage} visible={showLocalToast} />}
    </div>
  );
};

export default EditEmployee;
