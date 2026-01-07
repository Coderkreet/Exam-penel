
import React, { useState } from 'react';
import { dummyExams } from '../../data/exams';
import { useNavigate } from 'react-router-dom';

export const ExamList = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('upcoming'); // 'upcoming' or 'previous'

    const getStatusColor = (status) => {
        switch (status) {
            case 'Upcoming':
                return 'bg-blue-100 text-blue-700 border-blue-200';
            case 'Ongoing':
                return 'bg-green-100 text-green-700 border-green-200 animate-pulse';
            case 'Completed':
                return 'bg-gray-100 text-gray-700 border-gray-200';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    // Filter exams based on status
    const upcomingExams = dummyExams.filter(exam => exam.status === 'Upcoming' || exam.status === 'Ongoing');
    const previousExams = dummyExams.filter(exam => exam.status === 'Completed');

    const displayedExams = activeTab === 'upcoming' ? upcomingExams : previousExams;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-text">My Exams</h1>
                    <p className="text-gray-500 text-sm mt-1">View and manage your examination schedule</p>
                </div>

                {/* Search box - could keep this global or per tab */}
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search exams..."
                        className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-secondary/20 w-full md:w-64"
                    />
                    <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button
                    onClick={() => setActiveTab('upcoming')}
                    className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'upcoming'
                        ? 'text-primary'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Upcoming & Ongoing
                    {activeTab === 'upcoming' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('previous')}
                    className={`px-6 py-3 text-sm font-medium transition-colors relative ${activeTab === 'previous'
                        ? 'text-primary'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    Previous Exams
                    {activeTab === 'previous' && (
                        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary rounded-t-full"></div>
                    )}
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {displayedExams.length > 0 ? (
                    displayedExams.map((exam) => (
                        <div key={exam.id} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center p-2 group-hover:scale-110 transition-transform duration-300">
                                        <img src={exam.image} alt={exam.subject} className="w-full h-full object-contain" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-text line-clamp-1">{exam.title}</h3>
                                        <p className="text-sm text-gray-500">{exam.subject}</p>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(exam.status)}`}>
                                    {exam.status}
                                </span>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                                <div className="bg-surface rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1">Duration</p>
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm font-semibold text-text">{exam.duration}</span>
                                    </div>
                                </div>
                                <div className="bg-surface rounded-lg p-3">
                                    <p className="text-xs text-gray-500 mb-1">Questions</p>
                                    <div className="flex items-center gap-1.5">
                                        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        <span className="text-sm font-semibold text-text">{exam.totalQuestions}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                <div className="text-xs text-gray-500 font-medium">
                                    <p>{exam.date}</p>
                                    <p>{exam.time}</p>
                                </div>
                                {activeTab === 'upcoming' ? (
                                    <button
                                        onClick={() => navigate(`/exam/${exam.id}/instructions`)}
                                        className="px-5 py-2 bg-primary text-white text-sm font-semibold rounded-lg shadow-md hover:bg-accent hover:shadow-lg transition-all active:scale-95"
                                    >
                                        Start Exam
                                    </button>
                                ) : (
                                    <button className="px-5 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-all">
                                        View Result
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-1 md:col-span-2 xl:col-span-3 py-12 text-center bg-white rounded-2xl border-dashed border-2 border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 font-medium">No exams found in this category.</p>
                    </div>
                )}
            </div>
        </div>
    );
};
