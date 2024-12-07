import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar'; // Import the Sidebar component

const Topbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({
    name: '',
  });

  useEffect(() => {
    const loggedInUser = localStorage.getItem('loggedInUser');
    
    if (loggedInUser) {
      setUser({
        name: loggedInUser,
      });
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  return (
    <div>
      <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />
      
      <nav className="w-full h-20 bg-white border-b border-gray-200 lg:px-10 px-4 fixed top-0 z-50">
        <div className="max-w-full mx-auto lg:px-8 px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 lg:w-1/3">
              <button 
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  {isOpen ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  ) : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
                </svg>
              </button>
              <span className="text-3xl font-bold text-blue-600 hidden lg:block">EMS</span>
            </div>

            <div className="flex items-center justify-center lg:hidden">
              <span className="text-3xl font-bold text-blue-600">EMS</span>
            </div>

            <div className="flex items-center gap-6 justify-end lg:w-1/3">
              <div className="relative hidden sm:block">
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-gray-600"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <div className="p-2 bg-gray-100 rounded-lg cursor-pointer hover:bg-gray-200 transition-colors hidden sm:block">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
              </div>

              <div className='flex gap-2'>
                <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold shadow-lg">
                  {user.name ? user.name[0].toUpperCase() : 'U'}
                </div>
                
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-gray-500">{user.name}</span>
                  <span className="text-sm font-semibold text-gray-900">admin</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Topbar;