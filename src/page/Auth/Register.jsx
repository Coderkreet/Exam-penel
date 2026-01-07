import React, { useState } from 'react';
import loginImage from '../../assets/LoginPage/login.png';
import { Link } from 'react-router-dom';

export const Register = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        studentId: '',
        password: '',
        confirmPassword: '',
        agreeToTerms: false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Register:', formData);
    };

    return (
        <div className="h-screen flex overflow-hidden">
            {/* Left Side - Image Section */}
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#5d4bb9] to-[#545cec] relative overflow-hidden">
                <div className="absolute inset-0 bg-black/10"></div>
                <div className="relative z-10 flex flex-col items-center justify-center w-full p-12 text-white">
                    <img 
                        src={loginImage} 
                        alt="Register" 
                        className="max-w-lg w-full h-auto object-contain drop-shadow-2xl"
                    />
                    <div className="text-center mt-8">
                        <h2 className="text-4xl font-bold mb-4">Join Our Exam Portal</h2>
                        <p className="text-lg text-white/90">Start your learning journey with us today</p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="w-full lg:w-1/2 flex items-center justify-center bg-[#f4f4f9] p-6">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-6">
                        <div className="inline-block p-3 bg-gradient-to-br from-[#5d4bb9] to-[#545cec] rounded-2xl mb-3 shadow-lg">
                            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-[#141112] mb-1">Create Account</h1>
                        <p className="text-gray-500 text-xs">Join thousands of students taking exams online</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-3">
                        {/* Full Name */}
                        <div>
                            <label htmlFor="fullName" className="block mb-1.5 text-xs font-semibold text-[#141112]">
                                Full Name
                            </label>
                            <input
                                id="fullName"
                                type="text"
                                className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-[#141112] placeholder:text-gray-400 text-sm transition-all duration-300 ease-in-out focus:outline-none focus:border-[#5d4bb9] focus:ring-2 focus:ring-[#a697e6]/20 hover:border-gray-300"
                                placeholder="John Doe"
                                value={formData.fullName}
                                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                required
                            />
                        </div>

                        {/* Email & Student ID Row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="email" className="block mb-1.5 text-xs font-semibold text-[#141112]">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-[#141112] placeholder:text-gray-400 text-sm transition-all duration-300 ease-in-out focus:outline-none focus:border-[#5d4bb9] focus:ring-2 focus:ring-[#a697e6]/20 hover:border-gray-300"
                                    placeholder="you@university.edu"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="studentId" className="block mb-1.5 text-xs font-semibold text-[#141112]">
                                    Student ID
                                </label>
                                <input
                                    id="studentId"
                                    type="text"
                                    className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-[#141112] placeholder:text-gray-400 text-sm transition-all duration-300 ease-in-out focus:outline-none focus:border-[#5d4bb9] focus:ring-2 focus:ring-[#a697e6]/20 hover:border-gray-300"
                                    placeholder="STU123456"
                                    value={formData.studentId}
                                    onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Password & Confirm Password Row */}
                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label htmlFor="password" className="block mb-1.5 text-xs font-semibold text-[#141112]">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-[#141112] placeholder:text-gray-400 text-sm transition-all duration-300 ease-in-out focus:outline-none focus:border-[#5d4bb9] focus:ring-2 focus:ring-[#a697e6]/20 hover:border-gray-300"
                                    placeholder="Create password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block mb-1.5 text-xs font-semibold text-[#141112]">
                                    Confirm Password
                                </label>
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    className="w-full px-3 py-2 bg-white border-2 border-gray-200 rounded-lg text-[#141112] placeholder:text-gray-400 text-sm transition-all duration-300 ease-in-out focus:outline-none focus:border-[#5d4bb9] focus:ring-2 focus:ring-[#a697e6]/20 hover:border-gray-300"
                                    placeholder="Confirm password"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        {/* Terms & Conditions */}
                        <label className="flex items-start cursor-pointer group pt-1">
                            <input
                                type="checkbox"
                                className="h-4 w-4 cursor-pointer rounded border-2 border-gray-300 text-[#5d4bb9] transition-all duration-200 focus:ring-2 focus:ring-[#a697e6]/30 hover:border-[#5d4bb9] mt-0.5"
                                checked={formData.agreeToTerms}
                                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                                required
                            />
                            <span className="ml-2 text-xs text-gray-600 leading-relaxed">
                                I agree to the{' '}
                                <a href="/terms" className="font-semibold text-[#5d4bb9] hover:text-[#545cec] transition-colors">
                                    Terms of Service
                                </a>{' '}
                                and{' '}
                                <a href="/privacy" className="font-semibold text-[#5d4bb9] hover:text-[#545cec] transition-colors">
                                    Privacy Policy
                                </a>
                            </span>
                        </label>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full py-2.5 px-6 bg-gradient-to-r from-[#5d4bb9] to-[#545cec] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] focus:outline-none focus:ring-4 focus:ring-[#a697e6]/50 mt-2"
                        >
                            Create Account
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <p className="text-center mt-4 text-xs text-gray-600">
                        Already have an account?{' '}
                        <Link to="/login" className="font-bold text-[#5d4bb9] hover:text-[#545cec] transition-colors">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};
