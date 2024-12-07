import React, { useState, useEffect, useRef } from 'react'
import Sidebar from '../../components/Sidebar'
import Topbar from '../../components/Topbar'
import AddEmployee from '../../components/Modals/AddEmployee'
import EditEmployee from '../../components/Modals/EditEmployee'
import DeleteEmployee from '../../components/Modals/DeleteEmployee'
import AddDocument from '../../components/Modals/AddDocument'
import Toast from '../toastNotification/Toast'
import AllDocuments from '../../components/Modals/AllDocuments'
import { useNavigate } from 'react-router-dom'
import BASE_URL from '../../config';
const AllEmployees = () => {
  const navigate = useNavigate();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);
  const [showAllDocumentsModal, setShowAllDocumentsModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [dropdownStates, setDropdownStates] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);

  // Create a map of refs for each dropdown
  const dropdownRefs = useRef({});

  // Check authentication on page load and refresh
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  // Modify the click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutside = Object.values(dropdownRefs.current).every(
        ref => ref && !ref.contains(event.target)
      );
      
      if (clickedOutside) {
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

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/admin/getallemployees`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
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
        showToastMessage('Failed to fetch employees');
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, [showAddModal, showDeleteModal, showEditModal]); // Refetch when modals close

  const toggleDropdown = (employeeId) => {
    setDropdownStates(prev => ({
      ...prev,
      [employeeId]: !prev[employeeId]
    }));
  };

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setSelectedEmployeeId(employee._id);
    setShowEditModal(true);
    setDropdownStates(prev => ({...prev, [employee._id]: false}));
  };

  const handleDeleteClick = (employee) => {
    setSelectedEmployee(employee);
    setSelectedEmployeeId(employee._id);
    setShowDeleteModal(true);
    setDropdownStates(prev => ({...prev, [employee._id]: false}));
  };

  const handleAddDocumentClick = (employee) => {
    setSelectedEmployee(employee);
    setSelectedEmployeeId(employee._id);
    setShowAddDocumentModal(true);
    setDropdownStates(prev => ({...prev, [employee._id]: false}));
  };

  // Get file type from file path
  const getFileType = (filePath) => {
    const extension = filePath.split('.').pop().toLowerCase();
    return extension;
  };

  // Handle document view
  const handleViewDocument = (filePath) => {
    const cleanPath = filePath.replace('uploads/', '');
    window.open(`${BASE_URL}/${cleanPath}`, '_blank');
  };

  const fetchDocuments = async () => {
    try {
        const response = await fetch(`${BASE_URL}/admin/showalldocuments/${employeeId}`);
        const data = await response.json();
        if (data.success) {
            setDocuments(data.documents);
        }
    } catch (error) {
        console.error('Error fetching documents:', error);
    }
  };

  const viewDocument = async (documentId) => {
    try {
        const response = await fetch(`${BASE_URL}/admin/document/${employeeId}/${documentId}`);
        const data = await response.json();
        if (data.success) {
            // Handle the document based on its type
            const { file, type, title } = data.document;
            
            if (type.startsWith('image/')) {
                // For images, you can display them directly
                const img = new Image();
                img.src = file;
                // Display the image in your UI
            } else if (type === 'application/pdf') {
                // For PDFs, you might want to open in a new tab or use a PDF viewer
                const pdfWindow = window.open();
                pdfWindow.document.write(
                    `<iframe width='100%' height='100%' src='${file}'></iframe>`
                );
            }
        }
    } catch (error) {
        console.error('Error viewing document:', error);
    }
  };

  return (
    <>
      <div className='flex flex-col lg:flex-row min-h-screen bg-gray-100 overflow-hidden'>
        <div className='lg:block hidden'>
          <Sidebar />
        </div>
        <div className='w-full'>
          <Topbar />
          <div className='p-4 lg:p-8 w-full lg:w-[calc(100vw-16rem)] min-h-[calc(100vh-5rem)] mt-20 lg:ml-64 right-0 bottom-0 bg-gray-100'>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between flex-wrap">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Employee Management</h1>
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

            {isLoading ? (
              <div className="w-full h-[calc(100vh-20rem)] flex justify-center items-center">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-6">
                {employees.map((employee) => (
                  <div key={employee._id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
                    <div className="bg-gradient-to-r from-blue-400 to-blue-500 p-4">
                      <div className="flex justify-end mb-2 relative">
                        <div className="relative" ref={el => dropdownRefs.current[employee._id] = el}>
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
                              onClick={(e) => e.stopPropagation()} 
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
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                  </svg>
                                  Add Document
                                </button>
                                <button 
                                  onClick={() => handleDeleteClick(employee)}
                                  className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
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
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="text-gray-500 font-medium text-sm sm:text-base">Documents:</h4>
                            {employee.documents && employee.documents.length > 0 && (
                              <button 
                                onClick={() => {
                                  setSelectedEmployee(employee);
                                  setSelectedEmployeeId(employee._id);
                                  setShowAllDocumentsModal(true);
                                }}
                                className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                              >
                                See all
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            )}
                          </div>
                          {employee.documents && employee.documents.length > 0 ? (
                            <div className="space-y-2">
                              {employee.documents.slice(0, 3).map((doc, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                  <span className="text-gray-700 text-sm truncate flex-1">{doc.title}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-500 text-sm uppercase">{getFileType(doc.file)}</span>
                                    <button 
                                      onClick={() => handleViewDocument(doc.file)}
                                      className="text-blue-600 hover:text-blue-800"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              ))}
                              {employee.documents.length > 3 && (
                                <div className="text-gray-500 text-sm text-center italic">
                                  {employee.documents.length - 3} more files
                                </div>
                              )}
                            </div>
                          ) : (
                            <p className="text-gray-500 italic text-sm">No documents uploaded</p>
                          )}
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
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <AddEmployee 
          onClose={() => setShowAddModal(false)} 
          showToast={showToastMessage} 
        />
      )}

      {showEditModal && selectedEmployee && (
        <EditEmployee 
          employee={selectedEmployee}
          employeeId={selectedEmployeeId}
          onClose={() => {
            setShowEditModal(false);
            setSelectedEmployee(null);
            setSelectedEmployeeId(null);
          }} 
          showToast={showToastMessage} 
        />
      )}

      {showDeleteModal && selectedEmployee && (
        <div className="fixed inset-0 z-[1000]">
          <DeleteEmployee 
            employee={selectedEmployee}
            employeeId={selectedEmployeeId}
            onClose={() => {
              setShowDeleteModal(false);
              setSelectedEmployee(null);
              setSelectedEmployeeId(null);
            }} 
            showToast={showToastMessage} 
          />
        </div>
      )}

      {showAddDocumentModal && selectedEmployee && (
        <AddDocument
          employee={selectedEmployee}
          employeeId={selectedEmployeeId}
          onClose={() => {
            setShowAddDocumentModal(false);
            setSelectedEmployee(null);
            setSelectedEmployeeId(null);
          }}
          showToast={showToastMessage}
        />
      )}

      {showAllDocumentsModal && selectedEmployee && (
        <AllDocuments
          employee={selectedEmployee}
          employeeId={selectedEmployeeId}
          onClose={() => {
            setShowAllDocumentsModal(false);
            setSelectedEmployee(null);
            setSelectedEmployeeId(null);
          }}
          showToast={showToastMessage}
        />
      )}

      <Toast message={toastMessage} visible={showToast} />

    </>
  )
}

export default AllEmployees