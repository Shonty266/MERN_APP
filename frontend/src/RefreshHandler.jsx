import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function RefreshHandler({ setIsAuthenticated }) {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            setIsAuthenticated(true);

            if (location.pathname === '/admin/allemployee') {
                return;
            }

            
            if (location.pathname === '/admin/login' ||
                location.pathname === '/admin/login' ||
                location.pathname === '/admin/signup'||
                location.pathname === '/login' ||
                location.pathname === '/signup'
            ) {
                navigate('/admin/dashboard', { replace: false });
            }
        }
    }, [location, navigate, setIsAuthenticated])

    return (
        null
    )
}

export default RefreshHandler