import React from 'react';

function QuizProgress({ totalQuestions, currentIndex, answeredQuestions }) {
    const percentage = (answeredQuestions / totalQuestions) * 100;

    return (
        <div className="max-w-[900px] mx-auto mb-10 p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl relative z-10 md:p-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-white text-base font-semibold m-0">Tiến độ</h3>
                <span className="text-indigo-300 text-sm font-semibold">{answeredQuestions}/{totalQuestions}</span>
            </div>

            {/* Progress Bar */}
            <div className="h-2 bg-white/10 rounded-full overflow-hidden mb-6">
                <div
                    className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-[width] duration-500 shadow-[0_0_10px_rgba(99,102,241,0.6)]"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>

            {/* Question Indicators */}
            <div className="flex gap-4 justify-center md:gap-2">
                {Array.from({ length: totalQuestions }, (_, index) => {
                    let statusClass = 'bg-white/5 border-white/20 text-slate-500'; // unanswered
                    if (index < currentIndex) {
                        statusClass = 'bg-green-500/20 border-green-500 text-green-400'; // answered
                    } else if (index === currentIndex) {
                        statusClass = 'bg-indigo-500/20 border-indigo-500 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.5)] animate-pulse'; // current
                    }

                    return (
                        <div
                            key={index}
                            className={`w-[45px] h-[45px] rounded-full flex items-center justify-center font-semibold text-base transition-all duration-300 border-2 md:w-10 md:h-10 md:text-sm ${statusClass}`}
                        >
                            {index + 1}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default QuizProgress;
