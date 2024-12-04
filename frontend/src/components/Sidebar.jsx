import React from 'react'
import { useNavigate, Link, useLocation } from 'react-router-dom'

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const navigate = useNavigate()
    const location = useLocation()

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('loggedInUser')
        navigate('/admin/login', { 
            state: { toastMessage: 'Logged out successfully' }
        })
    }

    return (
        <div className={`lg:w-64 h-screen bg-white text-gray-800 fixed left-0 top-0 shadow-lg transition-transform duration-300 ease-in-out z-50 ${
            isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}>
            <div className="h-20 flex items-center justify-center border-b border-gray-200">
                <span className="text-3xl font-bold text-blue-600">EMS</span>
            </div>

            <div className="px-4 py-6 flex flex-col justify-between h-[calc(100vh-5rem)]">
                <div className="space-y-4">
                    <Link to="/admin/dashboard" onClick={toggleSidebar} className={`block flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${location.pathname === '/admin/dashboard' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100 shadow-sm'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                        </svg>
                        Dashboard
                    </Link>
                    
                    <Link to="/admin/allemployees" onClick={toggleSidebar} className={`block flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${location.pathname === '/admin/allemployees' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100 shadow-sm'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        Employees
                    </Link>
                    
                    <Link to="/admin/finance" onClick={toggleSidebar} className={`block flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${location.pathname === '/admin/finance' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100 shadow-sm'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Finance
                    </Link>

                    <Link to="/admin/settings" onClick={toggleSidebar} className={`block flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${location.pathname === '/admin/settings' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100 shadow-sm'}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Settings
                    </Link>
                </div>

                <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 mr-3">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                    </svg>
                    Logout
                </button>
            </div>
        </div>
    )
}

export default Sidebar