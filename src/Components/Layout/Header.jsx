import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const [showNotifications, setShowNotifications] = useState(false);

    // Mock notifications data
    const notifications = [
        {
            id: 1,
            title: "Exam Scheduled",
            message: "Your Physics exam is scheduled for tomorrow at 10:00 AM",
            time: "2 hours ago",
            read: false,
            type: "info"
        },
        {
            id: 2,
            title: "Result Published",
            message: "Your Mathematics exam results are now available",
            time: "5 hours ago",
            read: false,
            type: "success"
        },
        {
            id: 3,
            title: "Exam Reminder",
            message: "Chemistry exam starts in 30 minutes",
            time: "1 day ago",
            read: true,
            type: "warning"
        },
        {
            id: 4,
            title: "New Announcement",
            message: "Important: Exam guidelines have been updated",
            time: "2 days ago",
            read: true,
            type: "info"
        }
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleLogout = () => {
        sessionStorage.removeItem('token');
        navigate('/login');
    };

    const getTypeIcon = (type) => {
        switch(type) {
            case 'success':
                return (
                    <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
            case 'warning':
                return (
                    <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                );
            default:
                return (
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                );
        }
    };

    return (
        <header className="h-16 bg-white shadow-sm z-50 flex items-center justify-between px-6 sticky top-0">
            {/* Left side (Mobile Toggle could go here) */}
            <div className="flex items-center gap-4">
                <button className="md:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>
                <h2 className="text-xl font-semibold text-[#141112]">Dashboard</h2>
            </div>

            {/* Right side - Actions */}
            <div className="flex items-center gap-4">
                {/* Notifications */}
                <div 
                    className="relative"
                    onMouseEnter={() => setShowNotifications(true)}
                    onMouseLeave={() => setShowNotifications(false)}
                >
                    <button className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors relative">
                        {unreadCount > 0 && (
                            <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 rounded-full border-2 border-white flex items-center justify-center">
                                <span className="text-white text-xs font-bold">{unreadCount}</span>
                            </span>
                        )}
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                        </svg>
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border-2 border-gray-100 overflow-hidden z-50 animate-fade-in">
                            {/* Header */}
                            <div className="bg-gradient-to-r from-[#5d4bb9] to-[#545cec] px-5 py-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-white">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <span className="px-2.5 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full border border-white/30">
                                            {unreadCount} New
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Notifications List */}
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`px-5 py-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                                                !notification.read ? 'bg-blue-50/50' : ''
                                            }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                {/* Icon */}
                                                {getTypeIcon(notification.type)}

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2 mb-1">
                                                        <h4 className="text-sm font-semibold text-[#141112] leading-tight">
                                                            {notification.title}
                                                        </h4>
                                                        {!notification.read && (
                                                            <span className="flex-shrink-0 w-2 h-2 rounded-full bg-[#5d4bb9] mt-1"></span>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-600 leading-relaxed mb-2">
                                                        {notification.message}
                                                    </p>
                                                    <span className="text-xs text-gray-400 font-medium">
                                                        {notification.time}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-5 py-8 text-center">
                                        <svg className="w-16 h-16 mx-auto text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                        </svg>
                                        <p className="text-sm text-gray-500 font-medium">No notifications</p>
                                    </div>
                                )}
                            </div>

                            {/* Footer */}
                            {notifications.length > 0 && (
                                <div className="bg-gray-50 px-5 py-3 border-t border-gray-200">
                                    <button className="w-full text-center text-sm font-semibold text-[#5d4bb9] hover:text-[#545cec] transition-colors">
                                        View All Notifications
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                </button>
            </div>

            {/* Add animation styles */}
            <style jsx>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out;
                }
            `}</style>
        </header>
    );
};

export default Header;
