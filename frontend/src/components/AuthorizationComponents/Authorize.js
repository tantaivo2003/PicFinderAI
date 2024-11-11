import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";

const Authorize = ({ showModal, toggleLoginModal, toggleRegisterModal }) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        const log_user = {"email": email, "password": password, "rememberme": rememberMe};
        const response = await fetch(`${process.env.REACT_APP_API_URL}/login/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(log_user),
        });

        const data = await response.json();
        if (!data) {
            alert("Login fail, please check your information!");
            return;
        }

        // Reset form fields and close the modal
        setEmail('');
        setPassword('');
        navigate('/');
        window.location.reload()
    };

    if (!showModal) return null;

    const handleRegisterClick = (e) => {
        e.preventDefault();
        toggleLoginModal(); // Close the login modal
        toggleRegisterModal(); // Open the register modal
    };


    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-gray-200 bg-opacity-80">
            <div className="relative p-6 w-full max-w-lg max-h-full bg-white rounded-lg shadow-lg">
                <div className="flex items-center justify-between p-6 border-b rounded-t border-gray-300">
                    <h3 className="text-2xl font-semibold text-gray-800">
                        Login
                    </h3>
                    <button onClick={toggleLoginModal} type="button" className="text-gray-500 bg-transparent hover:bg-gray-300 hover:text-gray-800 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center">
                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 1"/>
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                <div className="p-6">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block mb-2 text-lg font-medium text-gray-800">Email</label>
                            <input 
                                type="email" 
                                name="email" 
                                id="email" 
                                className="bg-gray-100 border border-gray-400 text-gray-800 text-lg rounded-lg focus:ring-blue-400 focus:border-blue-400 block w-full p-3" 
                                placeholder="name@company.com" 
                                required 
                                value={email} 
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block mb-2 text-lg font-medium text-gray-800">Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                id="password" 
                                placeholder="••••••••" 
                                className="bg-gray-100 border border-gray-400 text-gray-800 text-lg rounded-lg focus:ring-blue-400 focus:border-blue-400 block w-full p-3" 
                                required 
                                value={password} 
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                        </div>
                        <div className="flex justify-between">
                            <div className="flex items-center">
                                <input id="remember" type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}  className="w-5 h-5 border border-gray-400 rounded bg-gray-100 focus:ring-3 focus:ring-blue-300" />
                                <label htmlFor="remember" className="ml-2 text-lg font-medium text-gray-800">Remember me</label>
                            </div>
                            <button className="text-lg text-custom-blue hover:underline">Forgot Password?</button>
                        </div>
                        <button type="submit" className="w-full text-lg text-white bg-custom-blue hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-3">Login</button>
                        <div className="text-lg font-medium text-gray-600">
                        Don't have an account? <button className="text-custom-blue hover:underline" onClick={handleRegisterClick}> Sign up </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Authorize;
