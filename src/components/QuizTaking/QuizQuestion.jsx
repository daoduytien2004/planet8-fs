import React from 'react';
import QuizOption from './QuizOption';

function QuizQuestion({
    question,
    questionNumber,
    totalQuestions,
    selectedAnswer,
    onSelectAnswer,
    onCheckAnswer,
    onNextQuestion,
    isChecked,
    isCorrect,
    correctAnswerId
}) {
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
            <div className="grid grid-cols-1 gap-4 max-w-[1200px] mx-auto md:grid-cols-2 md:gap-6 mb-8">
                {options.map((option, index) => {
                    // Logic to color options based on check state can be improved here
                    // For now, we rely on QuizOption handling 'isSelected'. 
                    // To show correct/incorrect specifically on option would require passing that data down
                    // or relying on the overall 'isCorrect' + 'isSelected' combination.
                    // If isChecked is true:
                    // - If this option selected: color Green (if correct) or Red (if incorrect)
                    // - If this option NOT selected: standard (or disable)

                    let status = 'default';
                    if (isChecked) {
                        if (option.id === correctAnswerId) {
                            status = 'correct';
                        } else if (selectedAnswer === option.id) {
                            status = isCorrect ? 'correct' : 'incorrect';
                        }
                    }

                    return (
                        <QuizOption
                            key={option.id}
                            option={option}
                            optionLetter={optionLetters[index]}
                            optionIndex={index}
                            isSelected={selectedAnswer === option.id}
                            onSelect={() => !isChecked && onSelectAnswer(option.id)}
                            status={status} // Pass status to Option if you want to support specific coloring
                            disabled={isChecked}
                        />
                    );
                })}
            </div>

            {/* Actions & Feedback */}
            <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-4">
                {isChecked && (
                    <div className={`w-full p-4 rounded-xl text-center font-bold text-lg animate-in fade-in zoom-in duration-300 ${isCorrect
                        ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                        : 'bg-red-500/20 text-red-400 border border-red-500/50'
                        }`}>
                        {isCorrect ? '🎉 Chính xác! Bạn đã trả lời đúng.' : '😓 Sai rồi! Rất tiếc.'}
                    </div>
                )}

                <div className="flex gap-4">
                    {!isChecked ? (
                        <button
                            onClick={onCheckAnswer}
                            disabled={!selectedAnswer}
                            className={`px-8 py-3 rounded-xl font-bold text-white transition-all duration-300 ${selectedAnswer
                                ? 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-lg hover:-translate-y-1'
                                : 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                                }`}
                        >
                            Kiểm tra kết quả
                        </button>
                    ) : (
                        <button
                            onClick={onNextQuestion}
                            className="px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
                        >
                            {questionNumber < totalQuestions ? 'Câu hỏi tiếp theo' : 'Xem kết quả'}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default QuizQuestion;
