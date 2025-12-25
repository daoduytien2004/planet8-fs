import React from 'react';
import QuizOption from './QuizOption';

function QuizQuestion({ question, questionNumber, totalQuestions, selectedAnswer, onSelectAnswer }) {
    if (!question) return null;

    // Ensure we have options array
    const options = question.options || [];
    const optionLetters = ['A', 'B', 'C', 'D'];

    return (
        <div className="max-w-[1100px] w-full mx-auto relative z-10 md:p-4">
            {/* Question Header */}
            <div className="mb-4 text-center">
                <span className="inline-block px-6 py-2 bg-indigo-500/20 border border-indigo-500/40 rounded-full text-indigo-300 text-sm font-semibold tracking-wider">
                    Câu {questionNumber}/{totalQuestions}
                </span>
            </div>

            {/* Question Content */}
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 mb-6 shadow-[0_8px_32px_rgba(0,0,0,0.3)] md:p-6">
                <h2 className="text-white text-2xl font-semibold leading-relaxed m-0 text-center md:text-xl">{question.content}</h2>

                {/* Question Image if available */}
                {question.mediaUrl && (
                    <div className="mt-8 flex justify-center">
                        <img
                            src={question.mediaUrl}
                            alt="Question illustration"
                            className="max-w-full max-h-[300px] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] md:max-h-[200px]"
                        />
                    </div>
                )}
            </div>

            {/* Answer Options */}
            <div className="grid grid-cols-2 gap-8 max-w-[1000px] mx-auto md:grid-cols-1 md:gap-4">
                {options.map((option, index) => (
                    <QuizOption
                        key={option.id}
                        option={option}
                        optionLetter={optionLetters[index]}
                        optionIndex={index}
                        isSelected={selectedAnswer === option.id}
                        onSelect={() => onSelectAnswer(option.id)}
                    />
                ))}
            </div>
        </div>
    );
}

export default QuizQuestion;
