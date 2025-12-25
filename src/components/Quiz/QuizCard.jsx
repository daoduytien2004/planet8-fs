import React from 'react';
import './QuizCard.css';
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
                badgeClass: 'completed',
                buttonText: 'Đã hoàn thành',
                buttonClass: 'completed'
            };
        }

        if (status === 'locked') {
            return {
                badge: 'Chưa mở khóa',
                badgeClass: 'locked',
                buttonText: `Yêu cầu cấp ${minLevelRequired}`,
                buttonClass: 'locked'
            };
        }

        return {
            badge: 'Đang tiến hành',
            badgeClass: 'in-progress',
            buttonText: 'Tiếp tục',
            buttonClass: 'primary'
        };
    };

    const statusInfo = getStatusInfo();
    const planetImageUrl = planet.image2d || planet.image2D || '/placeholder-planet.png';

    return (
        <div className={`quiz-card ${status}`}>
            {/* Status Badge - only show for locked or completed */}
            {status !== 'unlocked' && <div className={`status-badge ${statusInfo.badgeClass}`}>
                {status === 'locked' ? <LockIcon size={14} /> : status === 'completed' ? <CheckIcon size={14} /> : <CheckIcon size={14} />}
                <span>{statusInfo.badge}</span>
            </div>}

            {/* Planet Image */}
            <div className="planet-image-wrapper">
                <img
                    src={planetImageUrl}
                    alt={planet.nameVi}
                    className="planet-image"
                />
                {status === 'locked' && (
                    <div className="locked-overlay">
                        <span className="lock-icon"><LockIcon size={32} /></span>
                    </div>
                )}
            </div>

            {/* Planet Info */}
            <div className="planet-info">
                <h3 className="planet-name">{planet.nameVi || planet.nameEn}</h3>
                <p className="planet-category">{planet.type || 'HÀNH TINH'}</p>
            </div>

            {/* Quiz List */}
            <div className="quiz-list">
                {quizzes && quizzes.length > 0 ? (
                    quizzes.map((quiz, index) => {
                        const isQuizLocked = quiz.minLevel > userLevel;
                        const isQuizCompleted = completedQuizIds.includes(quiz.id);
                        return (
                            <div
                                key={quiz.id || index}
                                className={`quiz-item ${isQuizLocked ? 'quiz-locked' : ''} ${isQuizCompleted ? 'quiz-completed' : ''}`}
                            >
                                <span className="quiz-icon">
                                    {isQuizLocked ? <LockIcon size={16} /> : isQuizCompleted ? <StarFilledIcon size={16} /> : <StarEmptyIcon size={16} />}
                                </span>
                                <span className="quiz-title">{quiz.title}</span>
                                {isQuizLocked && (
                                    <span className="quiz-level-requirement">Lv.{quiz.minLevel}</span>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div className="quiz-item">
                        <span className="quiz-icon">📝</span>
                        <span className="quiz-title">Đang cập nhật...</span>
                    </div>
                )}
            </div>

            {/* Action Button */}
            <button
                className={`action-button ${statusInfo.buttonClass}`}
                onClick={() => onStartQuiz && onStartQuiz(planet)}
                disabled={status === 'locked' || status === 'completed'}
            >
                {statusInfo.buttonText}
                {status !== 'locked' && status !== 'completed' && <span className="button-arrow">→</span>}
            </button>
        </div>
    );
}

export default QuizCard;
