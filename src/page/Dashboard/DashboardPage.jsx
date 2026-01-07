
import React from 'react';
import { Link } from 'react-router-dom';

export const DashboardPage = () => {
    // Dummy stats data
    const stats = [
        { label: 'Total Exams', value: '12', icon: '📚', color: 'bg-blue-100 text-blue-600' },
        { label: 'Completed', value: '8', icon: '✅', color: 'bg-green-100 text-green-600' },
        { label: 'Average Score', value: '78%', icon: 'cw', color: 'bg-purple-100 text-purple-600' }, // Custom icon below
        { label: 'Pending', value: '4', icon: '⏳', color: 'bg-orange-100 text-orange-600' },
    ];

    const upcomingExams = [
        { id: 1, title: 'Introduction to React', date: 'Jan 15, 2025', time: '10:00 AM', status: 'Upcoming' },
        { id: 2, title: 'UI/UX Design Fundamentals', date: 'Jan 20, 2025', time: '09:00 AM', status: 'Upcoming' },
    ];

    const recentActivity = [
        { id: 1, title: 'Completed Python for Data Science', date: '2 days ago', score: '85%' },
        { id: 2, title: 'Registered for Node.js Backend', date: '1 week ago', score: '-' },
        { id: 3, title: 'Completed Advanced JavaScript', date: '2 weeks ago', score: '92%' },
    ];

    return (
        <div className="space-y-8">
            {/* Find available exams banner */}
            <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute right-0 top-0 h-full w-1/3 bg-white/10 skew-x-12 transform translate-x-12"></div>
                <div className="relative z-10">
                    <h1 className="text-3xl font-bold mb-2">Welcome Back, John! 👋</h1>
                    <p className="text-white/80 mb-6 max-w-xl">You have 2 upcoming exams this week. Keep up the great work and stay prepared.</p>
                    <Link to="/exams" className="px-6 py-3 bg-white text-primary font-bold rounded-xl shadow-md hover:bg-gray-50 transition-colors inline-block">
                        Find Available Exams
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-text">{stat.value}</h3>
                            </div>
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl ${stat.color}`}>
                                {stat.icon === 'cw' ? (
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                                ) : stat.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bottom Section: Two Columns */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Upcoming Exams (Lectures/Events) */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-text">Upcoming Exams</h2>
                        <Link to="/exams" className="text-primary text-sm font-semibold hover:underline">View All</Link>
                    </div>
                    <div className="space-y-4">
                        {upcomingExams.map((exam) => (
                            <div key={exam.id} className="flex items-center justify-between p-4 rounded-xl bg-surface hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-200">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-lg bg-indigo-100 text-indigo-600 flex flex-col items-center justify-center text-xs font-bold leading-none">
                                        <span>{exam.date.split(' ')[0]}</span>
                                        <span className="text-lg">{exam.date.split(' ')[1].replace(',', '')}</span>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-text">{exam.title}</h3>
                                        <p className="text-sm text-gray-500">{exam.time} • Online</p>
                                    </div>
                                </div>
                                <span className="px-3 py-1 bg-amber-100 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
                                    {exam.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                    <h2 className="text-xl font-bold text-text mb-6">Recent Activity</h2>
                    <div className="relative border-l-2 border-gray-100 ml-3 space-y-8 pl-6 py-2">
                        {recentActivity.map((activity, index) => (
                            <div key={index} className="relative">
                                <div className="absolute -left-[31px] w-4 h-4 rounded-full bg-white border-4 border-primary"></div>
                                <div>
                                    <h4 className="text-sm font-semibold text-text">{activity.title}</h4>
                                    <p className="text-xs text-gray-400 mt-1">{activity.date}</p>
                                    {activity.score !== '-' && (
                                        <div className="mt-2 inline-block px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                                            Score: {activity.score}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
