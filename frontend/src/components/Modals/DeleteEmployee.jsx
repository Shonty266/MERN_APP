import React, { useState } from 'react';
import Toast from '../../pages/toastNotification/Toast';
import BASE_URL from '../../config';

const DeleteEmployee = ({ onClose, showToast, employee, employeeId }) => {
  const [showLocalToast, setShowLocalToast] = useState(false);
  const [localToastMessage, setLocalToastMessage] = useState('');

  const displayLocalToast = (message) => {
    setLocalToastMessage(message);
    setShowLocalToast(true);
    setTimeout(() => {
      setShowLocalToast(false);
    }, 3000);
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        displayLocalToast('Authentication error. Please login again.');
        return;
      }

      const response = await fetch(`${BASE_URL}/admin/deleteemployee/${employeeId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ id: employeeId })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete employee');
      }

      onClose();
      showToast('Employee deleted successfully', 'success');
    } catch (error) {
      console.error('Error deleting employee:', error);
      displayLocalToast(error.message || 'Failed to delete employee. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl px-4 sm:px-8 py-4 sm:py-6 w-full sm:w-[500px] max-w-[95vw]">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Delete Employee</h2>
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

        <div className="mb-6">
          <p className="text-gray-600 mb-4">
            Are you sure you want to delete the following employee?
          </p>
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="font-medium text-gray-800">Name: {employee.name}</p>
            <p className="text-gray-600">Email: {employee.email}</p>
            <p className="text-gray-600">Contact: {employee.contact}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
          >
            Delete Employee
          </button>
        </div>
      </div>
      {showLocalToast && <Toast message={localToastMessage} visible={showLocalToast} />}
    </div>
  );
};

export default DeleteEmployee;
