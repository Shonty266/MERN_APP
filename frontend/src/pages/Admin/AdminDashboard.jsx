import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Toast from '../toastNotification/Toast';

function AdminDashboard() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [toastMessage, setToastMessage] = useState('');
    const [showToast, setShowToast] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        const user = localStorage.getItem('loggedInUser');
        if (!user) {
            navigate('/admin/login');
        }
        setLoggedInUser(user);
    }, [navigate])

    return (
        <div className='flex min-h-screen'>
            <div>
                <Sidebar />
            </div>
            <div className='w-full'>
                <Topbar />
                <div className='p-4 lg:p-8 w-full lg:w-[calc(100vw-16rem)] min-h-[calc(100vh-5rem)] mt-20 lg:ml-64 right-0 bottom-0 bg-gray-100'>
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between flex-wrap">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Dashboard</h1>
                                <p className="text-gray-600 mt-1"><span className="font-bold">Welcome,</span> to the employee management portal</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Toast message={toastMessage} visible={showToast} />
        </div>
    )
}

export default AdminDashboard