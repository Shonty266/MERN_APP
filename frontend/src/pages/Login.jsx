 import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Toast from './toastNotification/Toast'
import loginImg from './assets/login-img.svg'

const Login = () => {
    const [showToast, setShowToast] = useState(false)
    const [toastMessage, setToastMessage] = useState('')
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: ''
    })
    const [showPassword, setShowPassword] = useState(false)

    const navigate = useNavigate()

    const handleChange = (e) => {
        const { name, value } = e.target
        setLoginInfo(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSuccess = (message) => {
        setToastMessage(message)
        setShowToast(true)
    }

    const handleError = (message) => {
        setToastMessage(message)
        setShowToast(true)
    }

    const handleLogin = async (e) => {
        e.preventDefault()
        const { email, password } = loginInfo
        if (!email || !password) {
            return handleError('Email and password are required')
        }
        try {
            const url = `https://mern-app-api-beta.vercel.app/auth/login`
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            })
            const result = await response.json()
            const { success, message, jwtToken, name, error } = result
            if (success) {
                handleSuccess("Login successful, redirecting to dashboard")
                localStorage.setItem('token', jwtToken)
                localStorage.setItem('loggedInUser', name)
                setTimeout(() => {
                    navigate('/admin/dashboard')
                }, 4000)
            } else if (error) {
                const details = error?.details[0].message
                handleError(details)
            } else if (!success) {
                handleError(message)
            }
        } catch (err) {
            handleError(err.message)
        }
    }

    const togglePassword = () => {
        setShowPassword(prev => !prev)
    }

    return (
        <div className="w-full h-screen flex overflow-hidden">
            <div className="lg:w-1/2 w-full lg:h-full h-fit py-20 lg:px-10 px-4 relative flex flex-col justify-between">
                <div className="logo-div flex justify-between items-center lg:px-10 px-4">
                    <div><h1 className="text-2xl font-bold">Logo</h1></div>
                    <a href="/admin/signup"><div className="flex items-center group"><h1>Not a member? <span className="text-bold hover:font-bold cursor-pointer transition-all duration-300 inline-flex items-center gap-1 group-hover:translate-x-1">Sign Up<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:[stroke-width:3] transition-all duration-500"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></span></h1></div></a>
                </div>
                
                <div className="login-div lg:px-20 px-4 mt-20">
                    <div>
                        <h1 className="text-4xl font-bold">Login</h1>
                    </div>
                    <form onSubmit={handleLogin} className="mt-10">
                        <div className="mt-4">
                            <h3 className="text-md mb-1 font-semibold">Email</h3>
                            <input
                                type="email"
                                name="email"
                                value={loginInfo.email}
                                onChange={handleChange}
                                placeholder="Email"
                                className="w-full p-2 rounded-md bg-[#F5F5F5] outline-none"
                               
                            />
                        </div>

                        <div className="mt-4">
                            <h3 className="text-md mb-1 font-semibold">Password</h3>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={loginInfo.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    className="w-full p-2 rounded-md bg-[#F5F5F5] outline-none mb-2"
                                    
                                />
                                <button
                                    type="button"
                                    className="absolute right-2 top-1/2 -translate-y-1/2 mb-2"
                                    onClick={togglePassword}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-5 h-5"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full p-2 rounded-md bg-[#2563eb] text-white mt-6"
                            >
                                Login
                            </button>
                        </div>
                    </form>
                    
                    <hr className="my-6" />

                    <div className="flex justify-center items-center gap-10">
                        <button type="button" className="w-1/2 p-2 border border-gray-300 rounded-md flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                            </svg>
                            Login with Google
                        </button>
                        <button type="button" className="w-1/2 p-2 border border-gray-300 rounded-md flex items-center justify-center gap-2">
                            <svg className="w-5 h-5" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
                                <path fill="#f35325" d="M1 1h10v10H1z"/>
                                <path fill="#81bc06" d="M12 1h10v10H12z"/>
                                <path fill="#05a6f0" d="M1 12h10v10H1z"/>
                                <path fill="#ffba08" d="M12 12h10v10H12z"/>
                            </svg>
                            Login with Microsoft  
                        </button>
                    </div>
                </div>
            </div>
            <div className="w-1/2 hidden lg:flex h-full bg-gradient-to-br from-[#BFECFF]/40 to-[#FFF6E3]/40 flex items-center justify-center flex-col gap-6 absolute right-0">
                <img src={loginImg} alt="Login" />
                <p className="text-xl font-gelion text-center px-20 font-semibold">Unlock powerful tools to optimize employee management and boost productivity</p>
            </div>
            <Toast message={toastMessage} visible={showToast} />
        </div>
    )
}

export default Login