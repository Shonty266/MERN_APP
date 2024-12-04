import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Topbar from '../../components/Topbar';
import Toast from '../toastNotification/Toast';

function AdminDashboard() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const [stats, setStats] = useState({
        totalEmployees: 156,
        activeProjects: 12,
        monthlyRevenue: 125000,
        pendingTasks: 8
    });
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
        <div className='flex min-h-screen bg-gray-100'>
            <div >
                <Sidebar />
            </div>
            <div className='w-full'>
                <Topbar />
            </div>
            <Toast message={toastMessage} visible={showToast} />
        </div>
    )
}

export default AdminDashboard