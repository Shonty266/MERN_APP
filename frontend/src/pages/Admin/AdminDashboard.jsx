import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';

function AdminDashboard() {
    const [loggedInUser, setLoggedInUser] = useState('');
    const navigate = useNavigate();
    
    useEffect(() => {
        const user = localStorage.getItem('loggedInUser');
        if (!user) {
            navigate('/admin/login');
        }
        setLoggedInUser(user);
    }, [navigate])

    return (
        <div className='flex'>
            <div className='w-1/6'>
            <Sidebar />
            </div>
            <div className="flex-1 p-8">
                <h1 className="text-2xl font-bold">Welcome {loggedInUser}</h1>
                {/* Add your dashboard content here */}
            </div>
        </div>
    )
}

export default AdminDashboard