import React, { useState, useEffect, useRef } from 'react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import AddEmployee from '../../components/Modals/AddEmployee'
import EditEmployee from '../../components/Modals/EditEmployee'
import DeleteEmployee from '../../components/Modals/DeleteEmployee'
import Toast from '../toastNotification/Toast'

const AllEmployees = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [dropdownStates, setDropdownStates] = useState({}); // Track dropdown state per employee
  const [toast, setToast] = useState({
    show: false,
    message: '',
    type: ''
  });

  // Add ref for dropdown menu
  const dropdownRef = useRef(null);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Close all dropdowns
        setDropdownStates(prev => {
          const newState = {};
          Object.keys(prev).forEach(key => {
            newState[key] = false;
          });
          return newState;
        });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const showToast = (message, type) => {
    setToast({
      show: true,
      message,
      type
    });
    setTimeout(() => {
      setToast(prev => ({...prev, show: false}));
    }, 3000);
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('https://mern-app-azwp.vercel.app/admin/getallemployees');
        const data = await response.json();
        if (data.success) {
          setEmployees(data.employees);
          // Initialize dropdown states for all employees
          const initialDropdownStates = {};
          data.employees.forEach(emp => {
            initialDropdownStates[emp._id] = false;
          });
          setDropdownStates(initialDropdownStates);
        }
      } catch (error) {
        showToast('Failed to fetch employees', 'error');
      }
    };
    fetchEmployees();
  }, [showDeleteModal, showEditModal]); // Refetch when delete or edit modal closes

  const toggleDropdown = (employeeId) => {
    setDropdownStates(prev => ({
      ...prev,
      [employeeId]: !prev[employeeId]
    }));
  };

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
    setDropdownStates(prev => ({...prev, [employee._id]: false}));
  };

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setShowDeleteModal(true);
    setDropdownStates(prev => ({...prev, [employee._id]: false}));
  };

  const handleAddDocumentClick = (employee) => {
    setSelectedEmployee(employee);
    setShowAddDocumentModal(true);
    setDropdownStates(prev => ({...prev, [employee._id]: false}));
  };

  return (
    <div className='flex flex-col lg:flex-row min-h-screen bg-gray-100'>
      <div className='lg:block hidden'>
        <Sidebar />
      </div>
      <div className='w-full'>
        <Topbar />
        <div className='p-4 lg:p-8 w-full lg:w-[calc(100vw-16rem)] min-h-[calc(100vh-5rem)] right-0 bottom-0 bg-gray-100 absolute'>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between flex-wrap">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Employee Dashboard</h1>
                <p className="text-gray-600 mt-1"><span className="font-bold">Welcome,</span> to the employee management portal</p>
              </div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="mt-4 sm:mt-0 w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center sm:justify-start gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                Add Employee
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
            {employees.map((employee) => (
              <div key={employee._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
                <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-4">
                  <div className="flex justify-end mb-2 relative">
                    <div className="relative" ref={dropdownRef}>
                      <button
                        className="text-white hover:bg-blue-600 rounded-full p-1 transition-colors duration-200 active:bg-blue-700 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleDropdown(employee._id);
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>

                      {dropdownStates[employee._id] && (
                        <div 
                          className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
                          onClick={(e) => e.stopPropagation()} // Prevent clicks inside dropdown from closing it
                        >
                          <div className="py-1">
                            <button 
                              onClick={() => handleEditClick(employee)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit Employee
                            </button>
                            <button 
                              onClick={() => handleAddDocumentClick(employee)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V6a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Add Documents
                            </button>
                            <button 
                              onClick={() => handleDeleteClick(employee)}
                              className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Delete Employee
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2">
                    <span className="text-blue-600 text-2xl font-bold">{employee.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <h3 className="text-white text-xl font-semibold text-center break-words">{employee.name}</h3>
                </div>
                <div className="p-4 sm:p-6">
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700 text-sm sm:text-base break-words">{employee.email}</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-700 text-sm sm:text-base">{employee.contact}</span>
                    </div>
                    <hr className="border-gray-200" />
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span className="text-gray-700 text-sm sm:text-base">
                        {employee.documents ? `${employee.documents.length} Documents` : 'No documents'}
                      </span>
                    </div>
                    <hr className="border-gray-200" />
                    <div>
                      <h4 className="text-gray-500 font-medium mb-1 text-sm sm:text-base">Note:</h4>
                      <p className="text-gray-700 italic break-words text-sm sm:text-base">{employee.notes ? employee.notes : 'No note'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <AddEmployee onClose={() => setShowAddModal(false)} showToast={showToast} />
          </div>
        )}

        {showEditModal && selectedEmployee && (
          <EditEmployee 
            employee={selectedEmployee}
            onClose={() => {
              setShowEditModal(false);
              setSelectedEmployee(null);
            }}
            showToast={showToast}
          />
        )}

        {showDeleteModal && selectedEmployee && (
          <DeleteEmployee 
            employee={selectedEmployee}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedEmployee(null);
            }}
            showToast={showToast}
          />
        )}

        {showAddDocumentModal && selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
            <AddDocument 
              onClose={() => {
                setShowAddDocumentModal(false);
                setSelectedEmployee(null);
              }}
              showToast={showToast}
              employeeId={selectedEmployee._id}
            />
          </div>
        )}

        <Toast message={toast.message} visible={toast.show} type={toast.type} />
      </div>
    </div>
  )
}

export default AllEmployees