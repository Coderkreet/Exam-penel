import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dummyExams } from '../../data/exams';
import stundetimg from '../../assets/studentImg/stundetimg.png'
export const InstructionPage = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const exam = dummyExams.find(e => e.id === parseInt(examId));
    const [agreed, setAgreed] = useState(false);

    // Mock student data - replace with actual user data
    const studentInfo = {
        name: "John Doe",
        studentId: "STU123456",
        rollNumber: "345678027",
        email: "john.doe@university.edu",
        photo: "https://via.placeholder.com/150" // Replace with actual photo
    };

    if (!exam) return <div>Exam not found</div>;

    const handleNext = () => {
        if (!agreed) {
            alert('Please agree to the instructions before continuing');
            return;
        }
        navigate(`/exam/${examId}/check`);
    };

    return (
        <div className="h-screen flex overflow-hidden bg-[#f4f4f9]">
            {/* Fixed Left Sidebar - Student Info */}
            <div className="w-80 bg-white border-r-2 border-gray-200 flex flex-col">
                {/* Student Photo */}
                <div className="p-8 pb-6 bg-gradient-to-br from-[#5d4bb9]/5 to-[#545cec]/5">
                    <div className="w-40 h-40 mx-auto rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                        <img
                            src={stundetimg}
                            alt="Student"
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Student Details */}
                <div className="flex-1 px-6 py-4 space-y-4 overflow-y-auto">
                    <div className="space-y-4">
                        <div className="border-b border-gray-200 pb-3">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Exam Name</p>
                            <p className="text-sm font-semibold text-[#141112] leading-tight">{exam.title}</p>
                        </div>

                        <div className="border-b border-gray-200 pb-3">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Exam Duration</p>
                            <p className="text-sm font-semibold text-[#141112]">{exam.duration}</p>
                        </div>

                        <div className="border-b border-gray-200 pb-3">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Roll Number</p>
                            <p className="text-sm font-semibold text-[#141112]">{studentInfo.rollNumber}</p>
                        </div>

                        <div className="border-b border-gray-200 pb-3">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Candidate Name</p>
                            <p className="text-sm font-semibold text-[#141112]">{studentInfo.name}</p>
                        </div>

                        <div className="border-b border-gray-200 pb-3">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Student ID</p>
                            <p className="text-sm font-semibold text-[#141112]">{studentInfo.studentId}</p>
                        </div>

                        <div className="pb-3">
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</p>
                            <p className="text-sm font-semibold text-[#141112] break-all">{studentInfo.email}</p>
                        </div>
                    </div>
                </div>


            </div>

            {/* Right Side - Scrollable Instructions */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-[#5d4bb9] to-[#545cec] px-8 py-6 shadow-lg">
                    <h1 className="text-3xl font-bold text-white">Instructions</h1>
                </div>

                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto px-8 py-6">
                    <div className="max-w-4xl">
                        {/* General Instructions Header */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-[#141112] mb-3">General Instructions</h2>
                            <p className="text-base text-gray-700">
                                Please read the following instructions carefully before starting the examination:
                            </p>
                        </div>

                        {/* Instructions List */}
                        <div className="space-y-4 mb-8">
                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#141112] mt-2"></div>
                                <p className="text-base text-gray-700 leading-relaxed">
                                    Make sure there is <span className="font-semibold">Stable internet connection.</span>
                                </p>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#141112] mt-2"></div>
                                <p className="text-base text-gray-700 leading-relaxed">
                                    Read all the instructions carefully.
                                </p>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#141112] mt-2"></div>
                                <p className="text-base text-gray-700 leading-relaxed">
                                    All questions will appear in your <span className="font-bold">default language.</span>
                                </p>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#141112] mt-2"></div>
                                <p className="text-base text-gray-700 leading-relaxed">
                                    You may change the language for the <span className="font-bold">entire question paper</span> during the examination.
                                </p>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#141112] mt-2"></div>
                                <p className="text-base text-gray-700 leading-relaxed">
                                    Your <span className="font-bold">webcam, microphone, and screen will be monitored throughout the exam.</span>
                                </p>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#141112] mt-2"></div>
                                <div>
                                    <p className="text-base text-gray-700 leading-relaxed mb-2">
                                        <span className="font-bold">AI systems will track suspicious activities</span> such as:
                                    </p>
                                    <div className="ml-6 space-y-2">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gray-500 mt-2"></div>
                                            <p className="text-base text-gray-600">Multiple faces</p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gray-500 mt-2"></div>
                                            <p className="text-base text-gray-600">Looking away from screen</p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gray-500 mt-2"></div>
                                            <p className="text-base text-gray-600">Mobile phone usage</p>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-gray-500 mt-2"></div>
                                            <p className="text-base text-gray-600">Tab switching or window changes</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#141112] mt-2"></div>
                                <p className="text-base text-gray-700 leading-relaxed">
                                    Do not close the browser window or refresh the page during the exam.
                                </p>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#141112] mt-2"></div>
                                <p className="text-base text-gray-700 leading-relaxed">
                                    Ensure you are in a <span className="font-semibold">quiet, well-lit environment</span> with no distractions.
                                </p>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#141112] mt-2"></div>
                                <p className="text-base text-gray-700 leading-relaxed">
                                    Any violation of exam rules may result in <span className="font-bold text-red-600">immediate disqualification.</span>
                                </p>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="flex-shrink-0 w-2 h-2 rounded-full bg-[#141112] mt-2"></div>
                                <p className="text-base text-gray-700 leading-relaxed">
                                    Click 'Submit' only when you have completed all questions. <span className="font-semibold">Submission is final and cannot be changed.</span>
                                </p>
                            </div>
                        </div>

                        {/* Agreement Checkbox */}
                        <div className="bg-gradient-to-br from-[#5d4bb9]/5 to-[#545cec]/5 border-2 border-[#5d4bb9]/20 rounded-xl p-6">
                            <label className="flex items-start cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={agreed}
                                    onChange={(e) => setAgreed(e.target.checked)}
                                    className="h-5 w-5 cursor-pointer rounded border-2 border-gray-400 text-[#5d4bb9] transition-all duration-200 focus:ring-2 focus:ring-[#a697e6]/30 hover:border-[#5d4bb9] mt-1 flex-shrink-0"
                                />
                                <span className="ml-4 text-sm text-[#141112] font-medium leading-relaxed">
                                    I have read and understood all the instructions mentioned above. I agree to comply with all the examination rules and regulations. I understand that any violation may result in immediate disqualification and further disciplinary action.
                                </span>
                            </label>
                        </div>


                        {/* Next Button */}
                        <div className="mt-8 flex justify-end">
                            <button
                                onClick={handleNext}
                                disabled={!agreed}
                                className={`px-10 py-3 font-bold rounded-xl transition-all transform active:scale-95 shadow-md text-lg ${agreed
                                        ? 'bg-gradient-to-r from-[#5d4bb9] to-[#545cec] text-white hover:shadow-xl hover:-translate-y-0.5'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                NEXT
                            </button>
                        </div>

                        {/* Extra space at bottom for better scrolling */}
                        <div className="h-6"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
