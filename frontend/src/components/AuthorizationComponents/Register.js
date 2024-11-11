import React, { useState } from 'react';

const Register = ({ showModal, toggleLoginModal, toggleRegisterModal }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password!== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        if (password.length < 6){
            alert("The password must be at least 6 characters long.");
            return;
        }
        
        const new_user = {"username": username, "email": email, "password": password};
        const response = await fetch(`${process.env.REACT_APP_API_URL}/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },

            body: JSON.stringify(new_user),
        });

        const data = await response.json();
        if (!data) {
            alert("Username or email already exists");
            return;
        }
        alert("Successfull!");
        // Reset form fields and close the modal
        setUsername('');
        setEmail('');
        setPassword('');
        toggleRegisterModal();
        
    };

    if (!showModal) return null;

    const handleLoginClick = (e) => {
        e.preventDefault();
        toggleLoginModal(); // Close the login modal
        toggleRegisterModal(); // Open the register modal
    };
    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center w-full h-full bg-gray-200 bg-opacity-80">
            <div className="relative p-6 w-full max-w-lg max-h-full bg-white rounded-lg shadow-lg">
                <div className="flex items-center justify-between p-6 border-b rounded-t border-gray-300">
                    <h3 className="text-2xl font-semibold text-gray-800">
                        Sign Up
                    </h3>
                    <button onClick={toggleRegisterModal} type="button" className="text-gray-500 bg-transparent hover:bg-gray-300 hover:text-gray-800 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center">
                        <svg className="w-4 h-4" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1l6 6m0 0l6 6M7 7l6-6M7 7L1 1"/>
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                <div className="p-6">
                    <form className="space-y-6" onSubmit={handleRegister}>
                        <div>
                            <label htmlFor="username" className="block mb-2 text-lg font-medium text-gray-800">Username</label>
                            <input 
                                type="text" 
                                name="username" 
                                id="username" 
                                className="bg-gray-100 border border-gray-400 text-gray-800 text-lg rounded-lg focus:ring-blue-400 focus:border-blue-400 block w-full p-3" 
                                placeholder="Username" 
                                required 
                                value={username} 
                                onChange={(e) => setUsername(e.target.value)} 
                            />
                        </div>
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

                        <div>
                            <label htmlFor="confirmpassword" className="block mb-2 text-lg font-medium text-gray-800">Confirm Password</label>
                            <input 
                                type="password" 
                                name="confirmpassword" 
                                id="confirmpassword" 
                                placeholder="••••••••" 
                                className="bg-gray-100 border border-gray-400 text-gray-800 text-lg rounded-lg focus:ring-blue-400 focus:border-blue-400 block w-full p-3" 
                                required 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                            />
                        </div>

                        <button type="submit" className="w-full text-lg text-white bg-custom-blue hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg px-5 py-3">Sign Up</button>
                        <div className="text-lg font-medium text-gray-600">
                        Already have an account? <button className="text-custom-blue hover:underline" onClick={handleLoginClick}>Log in</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
