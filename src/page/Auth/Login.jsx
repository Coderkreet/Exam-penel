import React, { useState } from 'react';
import loginImage from '../../assets/LoginPage/login.png';
import { Link, useNavigate } from 'react-router-dom';

export const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login:', formData);
        // Simulate login - In real app, validate with backend first
        sessionStorage.setItem('token', 'dummy-token-123');
        navigate('/dashboard');
    };

    return (
        <div className="h-screen flex overflow-hidden">
            {/* Left Side - Image Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#5d4bb9] to-[#545cec] relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
                    <img
                        src={loginImage}
                        alt="Login"
                        className="max-w-lg w-full h-auto object-contain drop-shadow-2xl"
                    />
                    <div className="text-center mt-8">
                        <h2 className="text-4xl font-bold mb-4">Welcome to Exam Portal</h2>
                        <p className="text-lg text-white/90">Secure, reliable, and easy-to-use exam platform</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#f4f4f9] p-6 overflow-y-auto">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-block p-4 bg-gradient-to-br from-[#5d4bb9] to-[#545cec] rounded-2xl mb-4 shadow-lg">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold text-[#141112] mb-2">Welcome Back</h1>
                        <p className="text-gray-500 text-sm">Sign in to access your exam portal</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block mb-2 text-sm font-semibold text-[#141112]">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-[#141112] placeholder:text-gray-400 text-sm transition-all duration-300 ease-in-out focus:outline-none focus:border-[#5d4bb9] focus:ring-4 focus:ring-[#a697e6]/20 hover:border-gray-300"
                                placeholder="student@university.edu"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block mb-2 text-sm font-semibold text-[#141112]">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-lg text-[#141112] placeholder:text-gray-400 text-sm transition-all duration-300 ease-in-out focus:outline-none focus:border-[#5d4bb9] focus:ring-4 focus:ring-[#a697e6]/20 hover:border-gray-300"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center cursor-pointer group">
                                <input
                                    type="checkbox"
                                    className="h-5 w-5 cursor-pointer rounded border-2 border-gray-300 text-[#5d4bb9] transition-all duration-200 focus:ring-2 focus:ring-[#a697e6]/30 hover:border-[#5d4bb9]"
                                    checked={formData.rememberMe}
                                    onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                                />
                                <span className="ml-2 text-sm text-[#141112] font-medium group-hover:text-[#5d4bb9] transition-colors">
                                    Remember me
                                </span>
                            </label>
                            <a href="/forgot-password" className="text-sm font-semibold text-[#5d4bb9] hover:text-[#545cec] transition-colors">
                                Forgot Password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-3.5 px-6 bg-gradient-to-r from-[#5d4bb9] to-[#545cec] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#a697e6]/50"
                        >
                            Sign In
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="flex items-center my-5">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-4 text-xs text-gray-500 font-medium">or continue with</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>


                    {/* Sign Up Link */}
                    <p className="text-center mt-6 text-sm text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-bold text-[#5d4bb9] hover:text-[#545cec] transition-colors">
                            Create Account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
