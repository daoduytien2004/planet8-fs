import React from 'react';
import { StarEmptyIcon, StarFilledIcon, LockIcon, CheckIcon } from './QuizIcons';

function QuizCard({ planet, quizzes, userLevel = 1, completedQuizIds = [], onStartQuiz }) {
    // Check if planet has any unlocked quizzes
    const minLevelRequired = quizzes.length > 0
        ? Math.min(...quizzes.map(q => q.minLevel || 1))
        : 1;

    const hasUnlockedQuizzes = minLevelRequired <= userLevel;

    // Check if ALL quizzes for this planet are completed
    const allQuizzesCompleted = quizzes.length > 0 &&
        quizzes.every(quiz => completedQuizIds.includes(quiz.id));

    // Determine status: 'completed', 'locked', or 'unlocked'
    let status = 'unlocked';
    if (allQuizzesCompleted) {
        status = 'completed';
    } else if (!hasUnlockedQuizzes) {
        status = 'locked';
    }

    // Get status display info
    const getStatusInfo = () => {
        if (status === 'completed') {
            return {
                badge: 'Hoàn thành',
                badgeClass: 'bg-green-500/20 border border-green-500/50 text-green-400',
                buttonText: 'Đã hoàn thành',
                buttonClass: 'bg-green-500/20 border border-green-500/50 text-green-400 cursor-not-allowed hover:transform-none hover:shadow-none'
            };
        }

        if (status === 'locked') {
            return {
                badge: 'Chưa mở khóa',
                badgeClass: 'bg-slate-500/20 border border-slate-500/50 text-slate-400',
                buttonText: `Yêu cầu cấp ${minLevelRequired}`,
                buttonClass: 'bg-slate-500/20 border border-slate-500/30 text-slate-500 cursor-not-allowed hover:transform-none hover:shadow-none'
            };
        }

        return {
            badge: 'Đang tiến hành',
            badgeClass: 'bg-yellow-400/20 border border-yellow-400/50 text-yellow-400',
            buttonText: 'Tiếp tục',
            buttonClass: 'bg-gradient-to-br from-indigo-500 to-indigo-400 text-white hover:from-indigo-600 hover:to-indigo-500 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(99,102,241,0.4)]'
        };
    };

    const statusInfo = getStatusInfo();
    const planetImageUrl = planet.image2d || planet.image2D || '/placeholder-planet.png';

    return (
        <div className={`group bg-slate-900/70 backdrop-blur-md border border-indigo-500/30 rounded-xl p-3 relative transition-all duration-300 overflow-hidden hover:-translate-y-2 hover:border-indigo-500 hover:shadow-[0_20px_40px_rgba(99,102,241,0.3)]
            after:content-[''] after:absolute after:top-0 after:left-0 after:right-0 after:h-1 after:bg-gradient-to-r after:from-indigo-500 after:to-indigo-400 after:opacity-0 after:transition-opacity after:duration-300 after:group-hover:opacity-100
             ${status === 'locked' ? 'opacity-60 cursor-not-allowed hover:transform-none hover:shadow-none' : ''}`}>

            {/* Status Badge - only show for locked or completed */}
            {status !== 'unlocked' && <div className={`absolute top-4 right-4 py-1 px-4 rounded-[20px] text-xs font-bold flex items-center gap-1.5 z-[2] ${statusInfo.badgeClass}`}>
                {status === 'locked' ? <LockIcon size={14} /> : status === 'completed' ? <CheckIcon size={14} /> : <CheckIcon size={14} />}
                <span className="leading-none">{statusInfo.badge}</span>
            </div>}

            {/* Planet Image */}
            <div className="w-full h-[120px] flex items-center justify-center mb-3 relative md:h-[150px]">
                <img
                    src={planetImageUrl}
                    alt={planet.nameVi}
                    className={`max-w-[110px] max-h-[110px] object-contain drop-shadow-[0_0_25px_rgba(99,102,241,0.6)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-[5deg] md:max-w-[140px] md:max-h-[140px]
                    ${status === 'locked' ? 'grayscale opacity-50' : ''}`}
                />
                {status === 'locked' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-transparent">
                        <span className="text-slate-400 opacity-60"><LockIcon size={32} /></span>
                    </div>
                )}
            </div>

            {/* Planet Info */}
            <div className="text-center mb-3">
                <h3 className="text-[1.1rem] font-bold text-white mb-1 md:text-xl">{planet.nameVi || planet.nameEn}</h3>
                <p className="text-[0.6rem] uppercase tracking-[1.2px] text-slate-400 font-semibold m-0">{planet.type || 'HÀNH TINH'}</p>
            </div>

            {/* Quiz List */}
            <div className="flex flex-col gap-1.5 mb-3 p-2.5 bg-slate-800/40 rounded-lg border border-indigo-500/20">
                {quizzes && quizzes.length > 0 ? (
                    quizzes.map((quiz, index) => {
                        const isQuizLocked = quiz.minLevel > userLevel;
                        const isQuizCompleted = completedQuizIds.includes(quiz.id);
                        return (
                            <div
                                key={quiz.id || index}
                                className={`flex items-center gap-2 text-xs text-slate-300 ${isQuizLocked ? 'opacity-50' : ''} ${isQuizCompleted ? 'text-green-400 opacity-80' : ''}`}
                            >
                                <span className="text-base flex-shrink-0">
                                    {isQuizLocked ? <LockIcon size={16} /> : isQuizCompleted ? <StarFilledIcon size={16} /> : <StarEmptyIcon size={16} />}
                                </span>
                                <span className="flex-1">{quiz.title}</span>
                                {isQuizLocked && (
                                    <span className="text-[0.65rem] px-1.5 py-0.5 bg-slate-600/30 rounded-[10px] text-slate-400">Lv.{quiz.minLevel}</span>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="flex items-center gap-2 text-xs text-slate-300 md:text-xs">
                        <span className="text-base flex-shrink-0">📝</span>
                        <span className="flex-1">Đang cập nhật...</span>
                    </div>
                )}
            </div>

            {/* Action Button */}
            <button
                className={`w-full p-2 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 flex items-center justify-center gap-1 border-none ${statusInfo.buttonClass}`}
                onClick={() => onStartQuiz && onStartQuiz(planet)}
                disabled={status === 'locked' || status === 'completed'}
            >
                {statusInfo.buttonText}
                {status !== 'locked' && status !== 'completed' && <span className="text-lg transition-transform duration-300 group-hover/btn:translate-x-1">→</span>}
            </button>
        </div>
    );
}

export default QuizCard;
