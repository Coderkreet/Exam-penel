
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dummyExams } from '../../data/exams';

export const SystemCheckPage = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const videoRef = useRef(null);
    const [permissions, setPermissions] = useState({ video: false, audio: false });
    const [error, setError] = useState(null);
    const exam = dummyExams.find(e => e.id === parseInt(examId));

    useEffect(() => {
        const getPermissions = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                setPermissions({ video: true, audio: true });
            } catch (err) {
                console.error("Error accessing media devices:", err);
                setError("Please allow camera and microphone access to proceed.");
                setPermissions({ video: false, audio: false });
            }
        };

        getPermissions();

        return () => {
            // Cleanup stream tracks
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    if (!exam) return <div>Exam not found</div>;

    const handleStartExam = () => {
        if (permissions.video && permissions.audio) {
            // Navigate to actual exam page
            navigate(`/exam/${examId}/start`);
        }
    };

    return (
        <div className="min-h-screen bg-surface flex items-center justify-center p-6">
            <div className="max-w-6xl w-full bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col lg:flex-row h-[600px]">

                {/* Left Side: Exam Info */}
                <div className="w-full lg:w-1/3 bg-gradient-to-br from-primary to-secondary p-8 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-12 -mb-12 blur-xl"></div>

                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-6">{exam.title}</h2>

                        <div className="space-y-6">
                            <div>
                                <p className="text-white/70 text-sm uppercase tracking-wider font-semibold mb-1">Subject</p>
                                <p className="text-xl font-medium">{exam.subject}</p>
                            </div>
                            <div>
                                <p className="text-white/70 text-sm uppercase tracking-wider font-semibold mb-1">Duration</p>
                                <p className="text-xl font-medium">{exam.duration}</p>
                            </div>
                            <div>
                                <p className="text-white/70 text-sm uppercase tracking-wider font-semibold mb-1">Total Questions</p>
                                <p className="text-xl font-medium">{exam.totalQuestions}</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative z-10 pt-8 border-t border-white/20">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                <span className="font-bold">JD</span>
                            </div>
                            <div>
                                <p className="font-medium">John Doe</p>
                                <p className="text-xs text-white/70">Student ID: STU-2024</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: System Check */}
                <div className="w-full lg:w-2/3 p-8 flex flex-col">
                    <h2 className="text-2xl font-bold text-text mb-6">System Check</h2>

                    <div className="flex-1 flex flex-col items-center justify-center gap-6">
                        {/* Video Preview */}
                        <div className="relative w-full max-w-md aspect-video bg-gray-900 rounded-xl overflow-hidden shadow-lg border-2 border-gray-100">
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                                className="w-full h-full object-cover transform scale-x-[-1]"
                            />
                            {!permissions.video && !error && (
                                <div className="absolute inset-0 flex items-center justify-center text-white">
                                    <p>Initializing Camera...</p>
                                </div>
                            )}
                            {error && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white text-center p-4">
                                    <p className="text-red-400 font-medium">{error}</p>
                                </div>
                            )}

                            {/* Status Indicators overlay */}
                            <div className="absolute bottom-4 left-4 flex gap-2">
                                <div className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm flex items-center gap-1.5 ${permissions.video ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                    <span className={`w-2 h-2 rounded-full ${permissions.video ? 'bg-green-400' : 'bg-red-400'}`}></span>
                                    Camera
                                </div>
                                <div className={`px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm flex items-center gap-1.5 ${permissions.audio ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-red-500/20 text-red-400 border border-red-500/30'}`}>
                                    <span className={`w-2 h-2 rounded-full ${permissions.audio ? 'bg-green-400' : 'bg-red-400'}`}></span>
                                    Microphone
                                </div>
                            </div>
                        </div>

                        <p className="text-center text-gray-500 max-w-md">
                            Please ensure your face is clearly visible and you are in a quiet environment.
                            The system is verifying your devices.
                        </p>
                    </div>

                    <div className="border-t border-gray-100 pt-6 flex justify-end">
                        <button
                            onClick={handleStartExam}
                            disabled={!permissions.video || !permissions.audio}
                            className={`px-8 py-3 rounded-lg font-bold shadow-md transition-all ${permissions.video && permissions.audio
                                ? 'bg-gradient-to-r from-primary to-accent text-white hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            Start Examination
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
