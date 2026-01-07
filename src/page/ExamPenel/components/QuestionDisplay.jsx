
import React from 'react';

export const QuestionDisplay = ({
    question,
    selectedOption,
    handleOptionSelect,
    handleNext,
    handlePrev,
    handleMarkReview,
    handleClearResponse,
    isFirst,
    isLast
}) => {
    return (
        <div className="h-full flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Question Header */}
            <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex justify-between items-center">
                <span className="font-bold text-gray-700 text-base">Question {question.index + 1}</span>
                <span className="text-xs font-medium text-gray-500 px-2.5 py-0.5 bg-white rounded-full border border-gray-200">
                    Single Choice
                </span>
            </div>

            {/* Question Content */}
            <div className="flex-1 p-5 overflow-y-auto">
                <h2 className="text-base font-medium text-gray-800 mb-6 leading-relaxed">
                    {question.text}
                </h2>

                <div className="space-y-2.5">
                    {question.options.map((option, idx) => (
                        <label
                            key={idx}
                            className={`
                                flex items-center p-3 rounded-lg border cursor-pointer transition-all
                                ${selectedOption === idx
                                    ? 'border-primary bg-primary/5 shadow-sm'
                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }
                            `}
                        >
                            <input
                                type="radio"
                                name={`question-${question.id}`}
                                value={idx}
                                checked={selectedOption === idx}
                                onChange={() => handleOptionSelect(idx)}
                                className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
                            />
                            <span className="ml-3 text-sm text-gray-700">{option}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Actions Footer */}
            <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
                <div className="flex gap-2.5">
                    <button
                        onClick={handleMarkReview}
                        className="px-3 py-1.5 text-xs text-yellow-700 bg-yellow-100 font-medium rounded hover:bg-yellow-200 transition-colors"
                    >
                        Mark for Review
                    </button>
                    <button
                        onClick={handleClearResponse}
                        className="px-3 py-1.5 text-xs text-gray-600 bg-white border border-gray-300 font-medium rounded hover:bg-gray-50 transition-colors"
                    >
                        Clear Response
                    </button>
                </div>

                <div className="flex gap-2.5">
                    <button
                        onClick={handlePrev}
                        disabled={isFirst}
                        className={`px-4 py-1.5 border border-gray-300 text-sm font-semibold rounded transition-colors ${isFirst
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-white text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNext}
                        className="px-6 py-1.5 bg-primary text-white text-sm font-semibold rounded shadow-sm hover:bg-accent transition-all"
                    >
                        {isLast ? 'Submit Exam' : 'Save & Next'}
                    </button>
                </div>
            </div>
        </div>
    );
};

