import React, { useState } from 'react';
import Toast from '../../pages/toastNotification/Toast';

const AddDocument = ({ onClose, showToast }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    file: null,
    notes: ''
  });

  const [showLocalToast, setShowLocalToast] = useState(false);
  const [localToastMessage, setLocalToastMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'notes' && value.length > 100) {
      displayLocalToast('Note cannot exceed 100 characters');
      return;
    }
    if (name === 'file') {
      setFormData((prev) => ({
        ...prev,
        file: files[0]
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const displayLocalToast = (message) => {
    setLocalToastMessage(message);
    setShowLocalToast(true);
    setTimeout(() => {
      setShowLocalToast(false);
    }, 3000);
  };

  const validateForm = () => {
    // Title validation
    if (!formData.title) {
      displayLocalToast('Title is required');
      return false;
    }
    if (formData.title.length < 3) {
      displayLocalToast('Title must be at least 3 characters long');
      return false;
    }

    // Description validation
    if (!formData.description) {
      displayLocalToast('Description is required');
      return false;
    }

    // File validation
    if (!formData.file) {
      displayLocalToast('Please select a file to upload');
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

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('file', formData.file);
      formDataToSend.append('notes', formData.notes);
  
      const response = await fetch('https://mern-app-azwp.vercel.app/admin/adddocument', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formDataToSend
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add document');
      }
  
      onClose();
      showToast('Document added successfully', 'success');
    } catch (error) {
      console.error('Error adding document:', error);
      displayLocalToast(error.message || 'Failed to add document. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl px-4 sm:px-8 py-4 sm:py-6 w-full sm:w-[500px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Add New Document</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Close modal"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 sm:h-6 sm:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter document title"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter document description"
              rows="3"
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base"
            />
          </div>

          <div>
            <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-1">
              Upload File
            </label>
            <input
              type="file"
              id="file"
              name="file"
              onChange={handleChange}
              className="mt-1 block w-full text-sm sm:text-base"
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
              className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm sm:text-base"
            />
            <div className="text-xs sm:text-sm text-gray-500 mt-1">
              {formData.notes ? formData.notes.length : 0}/100 characters
            </div>
          </div>

          <div className="flex justify-end gap-3 sm:gap-4 mt-6 sm:mt-8">
            <button
              type="button"
              onClick={onClose}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Document
            </button>
          </div>
        </form>
      </div>
      {showLocalToast && <Toast message={localToastMessage} visible={showLocalToast} />}
    </div>
  );
};

export default AddDocument;
