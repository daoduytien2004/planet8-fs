import React from 'react';
import { useNavigate } from 'react-router-dom';
import { StarFilledIcon, LockIcon, CheckIcon } from './QuizIcons';

function QuizSelectionModal({ planet, quizzes, userLevel = 1, completedQuizIds = [], onClose }) {
    const navigate = useNavigate();

    const handleStartQuiz = (quiz) => {
        if (quiz.minLevel > userLevel) {
            // Don't allow starting locked quizzes
            return;
        }
        // Always allow starting/retaking quiz
        navigate(`/quiz/take/${quiz.id}`);
    };
    console.log(quizzes)
    if (!planet || !quizzes) return null;

    return (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md flex items-center justify-center z-[1000] p-8 animate-[fadeIn_0.3s_ease] md:p-4" onClick={onClose}>
            <div className="bg-gradient-to-br from-[#1a1d3d]/95 to-[#0a0e27]/95 border border-indigo-500/30 rounded-[25px] p-6 max-w-[600px] w-full shadow-[0_25px_80px_rgba(0,0,0,0.6)] relative animate-[slideUp_0.4s_ease] md:p-6 md:rounded-2xl" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 border border-white/20 text-white text-2xl cursor-pointer flex items-center justify-center transition-all duration-300 hover:bg-red-500/20 hover:border-red-500 hover:rotate-90" onClick={onClose}>
                    ✕
                </button>

                {/* Planet Header */}
                <div className="text-center mb-4">
                    <div className="w-[70px] h-[70px] mx-auto mb-3 rounded-full bg-indigo-500/10 border-[3px] border-indigo-500/30 flex items-center justify-center shadow-[0_10px_40px_rgba(99,102,241,0.3)]">
                        <img
                            src={planet.image2d || planet.image2D}
                            alt={planet.name}
                            className="w-20 h-20 object-contain drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                        />
                    </div>
                    <h2 className="bg-gradient-to-r from-indigo-500 to-violet-500 bg-clip-text text-transparent text-2xl font-bold mb-1 md:text-xl">{planet.nameVi || planet.name}</h2>
                    <p className="text-slate-400 text-sm m-0">Chọn Quiz để bắt đầu</p>
                </div>

                {/* Quiz List */}
                <div className="flex flex-col gap-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                    {quizzes?.map((quiz) => {
                        const isLocked = quiz.minLevel > userLevel;
                        const isCompleted = completedQuizIds.includes(quiz.id);
                        return (
                            <div key={quiz.id} className={`bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-4 transition-all duration-300 hover:bg-white/10 hover:border-indigo-500/40 hover:translate-x-1 md:p-5 ${isLocked ? 'opacity-60 cursor-not-allowed hover:transform-none hover:bg-white/5 hover:border-white/10' : ''} ${isCompleted ? 'bg-green-500/5 border-green-500/20 hover:bg-green-500/10 hover:border-green-500/30' : ''}`}>
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-white text-base font-semibold m-0 flex items-center md:text-sm">
                                        {isLocked && <LockIcon size={18} className="mr-2" />}
                                        {isCompleted && <CheckIcon size={18} className="mr-2" />}
                                        {quiz.title}
                                    </h3>
                                    <span className={`px-3 py-1 bg-indigo-500/20 border border-indigo-500/40 rounded-xl text-indigo-300 text-xs font-semibold ${isLocked ? 'bg-slate-500/20 border-slate-500/40 text-slate-400' : ''}`}>
                                        Level {quiz.minLevel || 1}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-xs leading-relaxed m-0 mb-3">{quiz.description}</p>
                                <div className="flex justify-between items-center md:flex-col md:items-stretch md:gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl"><StarFilledIcon size={18} /></span>
                                        <span className="text-yellow-400 font-semibold text-sm">+{quiz.rewardXp || 50} XP</span>
                                    </div>
                                    {isLocked ? (
                                        <div className="px-5 py-2.5 bg-slate-500/20 border border-slate-500/30 rounded-lg text-slate-400 text-sm font-semibold text-center">
                                            Yêu cầu cấp {quiz.minLevel}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-2 w-full md:w-auto">
                                            {isCompleted && (
                                                <div className="px-5 py-2.5 bg-green-500/20 border border-green-500/40 rounded-lg text-green-400 text-sm font-semibold text-left md:text-center flex items-center gap-2">
                                                    <CheckIcon size={16} /> Đã hoàn thành
                                                </div>
                                            )}
                                            <button
                                                className={`px-5 py-2.5 border-none rounded-lg text-white text-sm font-semibold cursor-pointer transition-all duration-300 shadow-[0_5px_15px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(99,102,241,0.5)] md:w-full ${isCompleted
                                                    ? 'bg-slate-700/50 hover:bg-slate-600/50 ring-1 ring-white/10'
                                                    : 'bg-gradient-to-br from-indigo-500 to-violet-500'
                                                    }`}
                                                onClick={() => handleStartQuiz(quiz)}
                                            >
                                                {isCompleted ? 'Làm lại bài' : 'Bắt đầu'}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <style jsx>{`
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(50px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(99, 102, 241, 0.5);
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(99, 102, 241, 0.7);
                }
            `}</style>
        </div>
    );
}

export default QuizSelectionModal;
