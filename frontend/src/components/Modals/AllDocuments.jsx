import React, { useState, useEffect } from 'react';
import Toast from '../../pages/toastNotification/Toast';
import BASE_URL from '../../config';

const AllDocuments = ({ onClose, employeeId }) => {
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch(`${BASE_URL}/admin/showalldocuments/${employeeId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch documents');
        }
        const data = await response.json();
        setDocuments(data.documents || []);
      } catch (error) {
        displayToast(error.message || 'Error fetching documents');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDocuments();
  }, [employeeId]);

  const displayToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleView = (file) => {
    try {
      window.open(`${BASE_URL}/${file}`, '_blank');
    } catch (error) {
      displayToast(error.message || 'Error viewing document');
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return (
          <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 18h12a2 2 0 002-2V6.414l-3.707-3.707A1 1 0 0013.586 2H4a2 2 0 00-2 2v12a2 2 0 002 2zm10-16v3a1 1 0 001 1h3L14 2z"/>
          </svg>
        );
      case 'png':
      case 'jpg':
      case 'jpeg':
        return (
          <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/>
          </svg>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full sm:w-[600px] max-w-[95vw] max-h-[90vh] overflow-y-auto relative">
        <div className="sticky w-full top-0 bg-white z-10 flex justify-between items-center px-4 sm:px-8 mb-4 sm:mb-6 py-6 shadow-md">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">All Documents</h2>
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
        <div className="px-4 sm:px-8 py-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-8">
              <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : documents.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No documents found</p>
          ) : (
            <div className="space-y-3">
              {documents.map((document) => (
                <div
                  key={document._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 overflow-hidden"
                >
                  <div className="flex items-center flex-1 min-w-0">
                    {getFileIcon(document.title)}
                    <span className="text-sm sm:text-base text-gray-700 truncate ml-3">
                      {document.title}
                    </span>
                  </div>
                  <button
                    onClick={() => handleView(document.file)}
                    className="ml-4 px-3 py-1.5 text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors flex-shrink-0"
                  >
                    View
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showToast && <Toast message={toastMessage} visible={showToast} />}
    </div>
  );
};

export default AllDocuments;
