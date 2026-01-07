
import React, { useState } from 'react';

export const Settings = () => {
    const [activeTab, setActiveTab] = useState('profile');

    const tabs = [
        { id: 'profile', label: 'Profile Settings', icon: '👤' },
        { id: 'security', label: 'Security', icon: '🔒' },
        { id: 'notifications', label: 'Notifications', icon: '🔔' },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-text">Settings</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row min-h-[600px]">
                {/* Sidebar / Tabs */}
                <div className="w-full md:w-64 bg-gray-50 border-r border-gray-100 p-4">
                    <nav className="space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${activeTab === tab.id
                                        ? 'bg-white text-primary shadow-sm ring-1 ring-gray-200'
                                        : 'text-gray-500 hover:bg-white/50 hover:text-gray-700'
                                    }`}
                            >
                                <span className="text-lg">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-8">
                    {activeTab === 'profile' && (
                        <div className="space-y-6 animate-fadeIn">
                            <h2 className="text-xl font-bold text-text mb-6">Profile Information</h2>

                            {/* Avatar */}
                            <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                                <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                                    JD
                                </div>
                                <div className="space-y-3">
                                    <button className="px-4 py-2 bg-white border border-gray-200 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                                        Change Avatar
                                    </button>
                                    <p className="text-xs text-gray-500">JPG, GIF or PNG. Max size of 800K</p>
                                </div>
                            </div>

                            {/* Form */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        defaultValue="John Doe"
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Email Address</label>
                                    <input
                                        type="email"
                                        defaultValue="john.doe@university.edu"
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Student ID</label>
                                    <input
                                        type="text"
                                        defaultValue="STU-2024-001"
                                        readOnly
                                        className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-semibold text-gray-700">Phone Number</label>
                                    <input
                                        type="tel"
                                        defaultValue="+1 (555) 000-0000"
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end pt-6 border-t border-gray-100">
                                <button className="px-6 py-2.5 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-accent hover:shadow-lg transition-all active:scale-95">
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6 animate-fadeIn">
                            <h2 className="text-xl font-bold text-text mb-6">Security Settings</h2>

                            <div className="space-y-6">
                                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold text-text">Two-Factor Authentication</h3>
                                            <p className="text-sm text-gray-500 mt-1">Add an extra layer of security to your account.</p>
                                        </div>
                                        <div className="relative inline-block w-12 h-6 transition duration-200 ease-in-out">
                                            <input type="checkbox" className="opacity-0 w-0 h-0 peer" />
                                            <span className="absolute cursor-pointer inset-0 bg-gray-300 rounded-full transition-all duration-300 peer-checked:bg-primary before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:left-1 before:bottom-1 before:transition-all peer-checked:before:translate-x-6"></span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-semibold text-text border-b border-gray-100 pb-2">Change Password</h3>
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-gray-700">Current Password</label>
                                        <input type="password" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">New Password</label>
                                            <input type="password" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
                                            <input type="password" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button className="px-6 py-2.5 bg-gray-900 text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 transition-all">
                                            Update Password
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="space-y-6 animate-fadeIn">
                            <h2 className="text-xl font-bold text-text mb-6">Notification Preferences</h2>

                            <div className="space-y-4">
                                {[
                                    { title: 'Exam Reminders', desc: 'Get notified 1 hour before scheduled exams' },
                                    { title: 'Result Announcements', desc: 'Receive notifications when exam results are published' },
                                    { title: 'Email Newsletters', desc: 'Receive updates about new features and courses' },
                                ].map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                                        <div>
                                            <h3 className="font-semibold text-text text-sm">{item.title}</h3>
                                            <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                                        </div>
                                        <div className="relative inline-block w-11 h-6 transition duration-200 ease-in-out">
                                            <input type="checkbox" defaultChecked={idx < 2} className="opacity-0 w-0 h-0 peer" />
                                            <span className="absolute cursor-pointer inset-0 bg-gray-200 rounded-full transition-all duration-300 peer-checked:bg-primary before:content-[''] before:absolute before:w-4 before:h-4 before:bg-white before:rounded-full before:left-1 before:bottom-1 before:transition-all peer-checked:before:translate-x-5 shadow-inner"></span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
