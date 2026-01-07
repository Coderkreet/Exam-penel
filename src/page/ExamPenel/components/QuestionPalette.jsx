
import React from 'react';

export const QuestionPalette = ({
    questions,
    currentQuestionIndex,
    setCurrentQuestion,
    stats
}) => {
    const getStatusColor = (status, isCurrent) => {
        if (isCurrent) return 'ring-2 ring-primary ring-offset-1 bg-white border-primary text-primary';
        switch (status) {
            case 'answered': return 'bg-emerald-500 text-white border-emerald-600';
            case 'not_answered': return 'bg-rose-500 text-white border-rose-600';
            case 'marked': return 'bg-amber-400 text-white border-amber-500';
            default: return 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'; // not_visited
        }
    };

    return (
        <div className="h-full flex flex-col bg-white border-r border-gray-200 shadow-sm">
            {/* Header / Stats */}
            <div className="p-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-800 mb-3 text-sm uppercase tracking-wide">Question Palette</h3>
                <div className="grid grid-cols-2 gap-y-2 gap-x-1 text-[10px] font-medium text-gray-500">
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                        <span>Answered ({stats.answered})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                        <span>Not Answered ({stats.notAnswered})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        <span>Marked ({stats.marked})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-gray-200"></span>
                        <span>Not Visited ({stats.notVisited})</span>
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-gray-200">
                <div className="grid grid-cols-5 gap-2">
                    {questions.map((q, idx) => (
                        <button
                            key={q.id}
                            onClick={() => setCurrentQuestion(idx)}
                            className={`
                                aspect-square rounded-md flex items-center justify-center font-semibold text-xs transition-all shadow-sm
                                ${getStatusColor(q.status, idx === currentQuestionIndex)}
                            `}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>
            </div>

            {/* Footer with Legend or Action */}
            <div className="p-4 border-t border-gray-200 bg-gray-50">
                <div className="text-center text-xs text-gray-500">
                    Total Questions: {questions.length}
                </div>
            </div>
        </div>
    );
};
