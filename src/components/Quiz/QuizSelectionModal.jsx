import React from 'react';
import { useNavigate } from 'react-router-dom';
import './QuizSelectionModal.css';
import { StarFilledIcon, LockIcon, CheckIcon } from './QuizIcons';

function QuizSelectionModal({ planet, quizzes, userLevel = 1, completedQuizIds = [], onClose }) {
    const navigate = useNavigate();

    const handleStartQuiz = (quiz) => {
        if (quiz.minLevel > userLevel) {
            // Don't allow starting locked quizzes
            return;
        }
        // Don't allow starting completed quizzes
        if (completedQuizIds.includes(quiz.id)) {
            return;
        }
        navigate(`/quiz/take/${quiz.id}`);
    };

    if (!planet || !quizzes) return null;

    return (
        <div className="quiz-modal-overlay" onClick={onClose}>
            <div className="quiz-modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button className="modal-close-button" onClick={onClose}>
                    ✕
                </button>

                {/* Planet Header */}
                <div className="modal-header">
                    <div className="planet-badge">
                        <img
                            src={planet.image2d || planet.image2D}
                            alt={planet.name}
                            className="planet-icon"
                        />
                    </div>
                    <h2 className="modal-title">{planet.nameVi || planet.name}</h2>
                    <p className="modal-subtitle">Chọn Quiz để bắt đầu</p>
                </div>

                {/* Quiz List */}
                <div className="quiz-list">
                    {quizzes.map((quiz) => {
                        const isLocked = quiz.minLevel > userLevel;
                        const isCompleted = completedQuizIds.includes(quiz.id);
                        return (
                            <div key={quiz.id} className={`quiz-item ${isLocked ? 'locked' : ''} ${isCompleted ? 'completed' : ''}`}>
                                <div className="quiz-item-header">
                                    <h3 className="quiz-item-title">
                                        {isLocked && <LockIcon size={18} style={{ marginRight: '0.5rem' }} />}
                                        {isCompleted && <CheckIcon size={18} style={{ marginRight: '0.5rem' }} />}
                                        {quiz.title}
                                    </h3>
                                    <span className={`quiz-level ${isLocked ? 'locked' : ''}`}>
                                        Level {quiz.minLevel || 1}
                                    </span>
                                </div>
                                <p className="quiz-item-description">{quiz.description}</p>
                                <div className="quiz-item-footer">
                                    <div className="quiz-reward">
                                        <span className="reward-icon"><StarFilledIcon size={18} /></span>
                                        <span className="reward-text">+{quiz.rewardXp || 50} XP</span>
                                    </div>
                                    {isLocked ? (
                                        <div className="locked-requirement">
                                            Yêu cầu cấp {quiz.minLevel}
                                        </div>
                                    ) : isCompleted ? (
                                        <div className="completed-badge">
                                            <CheckIcon size={16} /> Đã hoàn thành
                                        </div>
                                    ) : (
                                        <button
                                            className="start-quiz-button"
                                            onClick={() => handleStartQuiz(quiz)}
                                        >
                                            Bắt đầu
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

export default QuizSelectionModal;
