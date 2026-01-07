
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { dummyExams } from '../../data/exams';
import { QuestionPalette } from './components/QuestionPalette';
import { QuestionDisplay } from './components/QuestionDisplay';
import { ProctoringPanel } from './components/ProctoringPanel';

// Dummy questions data - ideally this would come from an API based on examId
const generateQuestions = (count) => {
    return Array.from({ length: count }, (_, i) => ({
        id: i + 1,
        text: `This is a sample question number ${i + 1} for the exam. Select the correct option from the choices given below.`,
        options: [
            `Option A for Question ${i + 1}`,
            `Option B for Question ${i + 1}`,
            `Option C for Question ${i + 1}`,
            `Option D for Question ${i + 1}`
        ],
        status: 'not_visited', // not_visited, not_answered, answered, marked
        selectedOption: null
    }));
};

export const ExamPage = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const exam = dummyExams.find(e => e.id === parseInt(examId));

    // State
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(3600); // Dummy 1 hour in seconds
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isPaletteOpen, setIsPaletteOpen] = useState(true);
    const [isProctorOpen, setIsProctorOpen] = useState(true);

    // Initialize
    useEffect(() => {
        if (exam) {
            // Simulate API fetch
            setTimeout(() => {
                const initialQuestions = generateQuestions(exam.totalQuestions || 20);
                // Mark first question as visited/not_answered by default if just starting
                initialQuestions[0].status = 'not_answered';
                setQuestions(initialQuestions);
                setLoading(false);
            }, 500);
        }
    }, [exam]);

    // Timer logic
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmitExam();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    // Handlers
    const handleQuestionSelect = (index) => {
        if (questions[currentQuestionIndex].status === 'not_visited') {
            updateQuestionStatus(currentQuestionIndex, 'not_answered'); // Mark previously current as not answered if unmarked
        }
        setCurrentQuestionIndex(index);
        // Mark new as visited/not_answered if still 'not_visited'
        if (questions[index].status === 'not_visited') {
            updateQuestionStatus(index, 'not_answered');
        }
    };

    const updateQuestionStatus = (index, status) => {
        setQuestions(prev => {
            const newQs = [...prev];
            newQs[index].status = status;
            return newQs;
        });
    };

    const handleOptionSelect = (optionIndex) => {
        setQuestions(prev => {
            const newQs = [...prev];
            newQs[currentQuestionIndex].selectedOption = optionIndex;
            // Automatically mark as answered if an option is selected? 
            // Usually 'Save & Next' confirms it, but for UI feedback let's just keep selectedOption state
            return newQs;
        });
    };

    const handleNext = () => {
        // Logic for 'Save & Next'
        const currentQ = questions[currentQuestionIndex];
        const newStatus = currentQ.selectedOption !== null ? 'answered' : 'not_answered';

        updateQuestionStatus(currentQuestionIndex, newStatus);

        if (currentQuestionIndex < questions.length - 1) {
            const nextIndex = currentQuestionIndex + 1;
            setCurrentQuestionIndex(nextIndex);
            if (questions[nextIndex].status === 'not_visited') {
                updateQuestionStatus(nextIndex, 'not_answered');
            }
        } else {
            handleSubmitExam();
        }
    };

    const handlePrev = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleMarkReview = () => {
        updateQuestionStatus(currentQuestionIndex, 'marked');
    };

    const handleClearResponse = () => {
        setQuestions(prev => {
            const newQs = [...prev];
            newQs[currentQuestionIndex].selectedOption = null;
            newQs[currentQuestionIndex].status = 'not_answered';
            return newQs;
        });
    };

    const handleSubmitExam = () => {
        // Submit logic
        alert("Exam Submitted Successfully!");
        navigate('/dashboard');
    };

    const currentStats = {
        answered: questions.filter(q => q.status === 'answered').length,
        notAnswered: questions.filter(q => q.status === 'not_answered').length,
        marked: questions.filter(q => q.status === 'marked').length,
        notVisited: questions.filter(q => q.status === 'not_visited').length,
    };

    if (loading || !exam) {
        return <div className="h-screen w-screen flex items-center justify-center bg-gray-100 italic text-gray-500">Loading Exam Environment...</div>;
    }

    return (
        <div className="h-screen w-screen flex flex-col bg-gray-100 overflow-hidden">
            {/* Top Bar */}
           

            {/* Main Content Grid */}
            <div className="flex-1 flex overflow-hidden">
                {/* Left: Question Palette */}
                <aside
                    className={`${isPaletteOpen ? 'w-56' : 'w-0'} bg-white flex-shrink-0 z-30 transition-all duration-300 border-r border-gray-200 relative`}
                    style={{ overflow: 'visible' }}
                >
                    <div
                        className="absolute top-1/2 -right-3 z-40 translate-y-[-50%]"
                        title={isPaletteOpen ? "Collapse Palette" : "Expand Palette"}
                    >
                        <button
                            onClick={() => setIsPaletteOpen(!isPaletteOpen)}
                            className="bg-white border border-gray-200 rounded-r-lg py-3 px-0.5 shadow-md hover:bg-gray-50 text-primary flex items-center justify-center h-10 w-5 focus:outline-none transition-transform hover:scale-105"
                        >
                            {isPaletteOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <div className={`h-full w-56 overflow-hidden transition-all duration-300 ${isPaletteOpen ? 'opacity-100 visible translate-x-0' : 'opacity-0 invisible -translate-x-full'}`}>
                        <QuestionPalette
                            questions={questions}
                            currentQuestionIndex={currentQuestionIndex}
                            setCurrentQuestion={handleQuestionSelect}
                            stats={currentStats}
                        />
                    </div>
                </aside>

                {/* Middle: Question Area */}
                <main className="flex-1 p-4 relative bg-[#f4f4f9] overflow-hidden flex flex-col items-center">
                     <header className="h-16 bg-white shadow-sm border-b w-full border-gray-200 flex items-center justify-between px-6 z-10">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 p-2 rounded-lg">
                        <span className="font-bold text-primary text-xl tracking-wider">EXAM PANEL</span>
                    </div>
                    <div className="h-8 w-px bg-gray-300 mx-2"></div>
                    <div>
                        <h1 className="font-bold text-gray-800 text-lg">{exam.title}</h1>
                        <p className="text-xs text-gray-500 font-medium">Subject: {exam.subject} | ID: {examId}</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Time Remaining</span>
                        <div className={`text-2xl font-mono font-bold ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-gray-800'}`}>
                            {formatTime(timeLeft)}
                        </div>
                    </div>
                    <button
                        onClick={handleSubmitExam}
                        className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg shadow-md transition-colors text-sm"
                    >
                        Finish Exam
                    </button>
                </div>
            </header>
                    <div className="w-full h-full max-w-6xl flex flex-col justify-center">
                        <div className="h-[90%] w-full"> {/* Limit height slightly to ensure it doesn't look too stretched */}
                            <QuestionDisplay
                                question={{ ...questions[currentQuestionIndex], index: currentQuestionIndex }}
                                selectedOption={questions[currentQuestionIndex].selectedOption}
                                handleOptionSelect={handleOptionSelect}
                                handleNext={handleNext}
                                handlePrev={handlePrev}
                                handleMarkReview={handleMarkReview}
                                handleClearResponse={handleClearResponse}
                                isFirst={currentQuestionIndex === 0}
                                isLast={currentQuestionIndex === questions.length - 1}
                            />
                        </div>
                    </div>
                </main>

                {/* Right: Proctoring & Info */}
                <aside
                    className="w-64 bg-white border-l border-gray-200 flex-shrink-0 z-20 p-3 transition-all duration-300"
                >
                    <div className="h-full overflow-hidden w-full">
                        <ProctoringPanel
                            messages={[
                                { time: '10:05 AM', text: 'Welcome to the exam session. Good luck!' },
                                { time: '10:06 AM', text: 'Your camera feed is stable.' }
                            ]}
                        />
                    </div>
                </aside>
            </div>
        </div>
    );
};
