import React from 'react';

function QuizResults({ results, onRetry, onBackToList }) {
    // Backend returns: { attempt: { score, xpEarned, ... }, questionIds: [...] }
    // Extract totalQuestions from questionIds array first, fallback to hardcoded 5
    const totalQuestions = results?.questionIds?.length || results?.totalQuestions || 5;

    // Score is on 0-10 scale, calculate correctAnswers: score = (correct/total) * 10
    // Therefore: correctAnswers = (score * total) / 10
    const score = results?.attempt?.score || results?.score || 0;
    const correctAnswers = Math.round((score * totalQuestions) / 10);

    const scorePercentage = (correctAnswers / totalQuestions) * 100;
    const isPerfect = scorePercentage === 100;

    return (
        <div className="min-h-screen flex items-center justify-center p-8 relative z-10 w-full">
            <div className="max-w-[600px] w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[25px] p-12 text-center shadow-[0_20px_60px_rgba(0,0,0,0.4)] md:p-8">
                {isPerfect ? (
                    /* Success Screen - All Correct */
                    <>
                        <div className="mb-6">
                            <span className="text-[5rem] animate-bounce block md:text-[4rem]">🎉</span>
                        </div>
                        <h1 className="text-[2.5rem] font-bold mb-4 bg-gradient-to-br from-green-500 to-emerald-500 bg-clip-text text-transparent md:text-[2rem]">Hoàn thành!</h1>
                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                            Chúc mừng bạn đã hoàn thành xuất sắc!
                        </p>
                        <div className="my-10 flex justify-center">
                            <div className="w-[180px] h-[180px] rounded-full flex flex-col items-center justify-center relative bg-green-500/10 border-[3px] border-green-500 shadow-[0_0_40px_rgba(34,197,94,0.4)] md:w-[150px] md:h-[150px]">
                                <span className="text-[3rem] font-bold text-white leading-none md:text-[2.5rem]">{scorePercentage}%</span>
                                <span className="text-slate-400 text-sm mt-2">{correctAnswers}/{totalQuestions} đúng</span>
                            </div>
                        </div>
                        {(results?.attempt?.xpEarned || results?.xpEarned) && (
                            <div className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400/20 border-2 border-yellow-400 rounded-[20px] mb-8">
                                <span className="text-2xl">⭐</span>
                                <span className="text-yellow-400 text-xl font-bold">+{results?.attempt?.xpEarned || results?.xpEarned} XP</span>
                            </div>
                        )}
                        <div className="flex gap-4 justify-center flex-wrap md:flex-col">
                            <button
                                className="px-10 py-4 rounded-xl text-lg font-semibold border-none cursor-pointer transition-all duration-300 bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-[0_10px_30px_rgba(99,102,241,0.4)] hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(99,102,241,0.6)] md:w-full md:py-3.5 md:text-base"
                                onClick={onBackToList}
                            >
                                Hoàn thành
                            </button>
                        </div>
                    </>
                ) : (
                    /* Failure Screen - Some Wrong */
                    <>
                        <div className="mb-6">
                            <span className="text-[5rem] animate-bounce block md:text-[4rem]">😔</span>
                        </div>
                        <h1 className="text-[2.5rem] font-bold mb-4 bg-gradient-to-br from-red-500 to-orange-500 bg-clip-text text-transparent md:text-[2rem]">Thất bại</h1>
                        <p className="text-slate-400 text-lg mb-8 leading-relaxed">
                            Đừng nản chí! Hãy thử lại để đạt kết quả tốt hơn.
                        </p>
                        <div className="my-10 flex justify-center">
                            <div className="w-[180px] h-[180px] rounded-full flex flex-col items-center justify-center relative bg-red-500/10 border-[3px] border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.4)] md:w-[150px] md:h-[150px]">
                                <span className="text-[3rem] font-bold text-white leading-none md:text-[2.5rem]">{scorePercentage.toFixed(0)}%</span>
                                <span className="text-slate-400 text-sm mt-2">{correctAnswers}/{totalQuestions} đúng</span>
                            </div>
                        </div>
                        <div className="flex gap-4 justify-center flex-wrap md:flex-col">
                            <button
                                className="px-10 py-4 rounded-xl text-lg font-semibold border-none cursor-pointer transition-all duration-300 bg-gradient-to-br from-indigo-500 to-violet-500 text-white shadow-[0_10px_30px_rgba(99,102,241,0.4)] hover:-translate-y-1 hover:shadow-[0_15px_40px_rgba(99,102,241,0.6)] md:w-full md:py-3.5 md:text-base"
                                onClick={onRetry}
                            >
                                Thử lại
                            </button>
                            <button
                                className="px-10 py-4 rounded-xl text-lg font-semibold cursor-pointer transition-all duration-300 bg-white/10 text-white border-2 border-white/20 hover:bg-white/15 hover:border-white/30 hover:-translate-y-1 md:w-full md:py-3.5 md:text-base"
                                onClick={onBackToList}
                            >
                                Quay về
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default QuizResults;
