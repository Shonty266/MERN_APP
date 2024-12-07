import React, { useState } from 'react';
import Toast from '../../pages/toastNotification/Toast';
import BASE_URL from '../../config';

const AddDocument = ({ onClose, showToast, employeeId }) => {
  const [files, setFiles] = useState([]);
  const [showLocalToast, setShowLocalToast] = useState(false);
  const [localToastMessage, setLocalToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    
    const validFiles = selectedFiles.filter(file => {
      if (!allowedTypes.includes(file.type)) {
        displayLocalToast('Only PDF, PNG, JPEG and JPG files are allowed');
        return false;
      }
      return true;
    });

    setFiles(validFiles);
  };

  const displayLocalToast = (message) => {
    setLocalToastMessage(message);
    setShowLocalToast(true);
    setTimeout(() => {
      setShowLocalToast(false);
    }, 3000);
  };

  const validateForm = () => {
    if (files.length === 0) {
      displayLocalToast('Please select at least one file');
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
      setIsLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        displayLocalToast('Authentication error. Please login again.');
        return;
      }

      const responses = await Promise.all(files.map(async (file) => {
        const formDataToSend = new FormData();
        formDataToSend.append('title', file.name);
        formDataToSend.append('file', file);
    
        const response = await fetch(`${BASE_URL}/admin/adddocument/${employeeId}`, {
          method: 'POST',
          body: formDataToSend
        });

        if (!response.ok) {
          const errorText = await response.text();
          let errorMessage;
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData.message;
          } catch (e) {
            errorMessage = 'Failed to add document';
          }
          throw new Error(errorMessage);
        }

        return response.json();
      }));
  
      onClose();
      showToast('Documents added successfully', 'success');
    } catch (error) {
      console.error('Error adding documents:', error);
      displayLocalToast(error.message || 'Failed to add documents. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl px-4 sm:px-8 py-4 sm:py-6 w-full sm:w-[500px] max-w-[95vw] max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Add Documents</h2>
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
          <div className="p-4 border rounded-lg space-y-4">
            <div>
              <label htmlFor="files" className="block text-sm font-medium text-gray-700 mb-1">
                Upload Files (PDF, PNG, JPEG, JPG)
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="files"
                  name="files"
                  onChange={handleChange}
                  accept=".pdf,.png,.jpeg,.jpg"
                  multiple
                  className="mt-1 block w-full text-blue-600 rounded-md px-3 py-2 text-sm sm:text-base file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-600 hover:file:bg-blue-200"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 sm:gap-4 mt-6 sm:mt-8">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                'Add Documents'
              )}
            </button>
          </div>
        </form>
      </div>
      {showLocalToast && <Toast message={localToastMessage} visible={showLocalToast} />}
    </div>
  );
};

export default AddDocument;
