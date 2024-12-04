import React from 'react';
import Toast from '../../pages/toastNotification/Toast';

const DeleteEmployee = ({ onClose, showToast, employee }) => {
  const [showLocalToast, setShowLocalToast] = React.useState(false);
  const [localToastMessage, setLocalToastMessage] = React.useState('');

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

      const response = await fetch(`https://mern-app-azwp.vercel.app/admin/deleteemployee/${employee._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl px-8 py-6 w-[400px] max-w-[90vw]">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Delete Employee</h2>
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

        <div className="mb-6">
          <p className="text-gray-600">
            Are you sure you want to delete employee <span className="font-semibold">{employee?.name}</span>? This action cannot be undone.
          </p>
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
      {showLocalToast && <Toast message={localToastMessage} visible={showLocalToast} />}
    </div>
  );
};

export default DeleteEmployee;
