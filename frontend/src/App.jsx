import React, { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import AllEmployees from './pages/Admin/AllEmployees'
import AdminDashboard from './pages/Admin/AdminDashboard'
import RefreshHandler from './RefreshHandler'



function App() {
const [isAuthenticated, setIsAuthenticated] = useState(false); 

  const PrivateRoutes = ({element}) => {
    return isAuthenticated ? element : <Navigate to="/admin/login" />;
  }


  
  return <div>

    <RefreshHandler setIsAuthenticated={setIsAuthenticated} />
    <Routes>
      <Route path='/' element={<Login />} />
      <Route path='/admin/login' element={<Login />} />
      <Route path='/admin/signup' element={<SignUp />} />
      <Route path='/admin/dashboard' element={<PrivateRoutes element={<AdminDashboard />} />} />
      <Route path='/admin/allemployees' element={<PrivateRoutes element={<AllEmployees />} />} />
    </Routes>
  </div>
}

export default App
