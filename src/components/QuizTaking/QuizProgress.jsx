import React from 'react';
import './QuizProgress.css';

function QuizProgress({ totalQuestions, currentIndex, answeredQuestions }) {
    const percentage = (answeredQuestions / totalQuestions) * 100;

    return (
        <div className="quiz-progress">
            <div className="progress-header">
                <h3 className="progress-title">Tiến độ</h3>
                <span className="progress-count">{answeredQuestions}/{totalQuestions}</span>
            </div>

            {/* Progress Bar */}
            <div className="progress-bar-container">
                <div
                    className="progress-bar-fill"
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>

            {/* Question Indicators */}
            <div className="question-indicators">
                {Array.from({ length: totalQuestions }, (_, index) => (
                    <div
                        key={index}
                        className={`question-indicator ${index < currentIndex ? 'answered' :
                                index === currentIndex ? 'current' :
                                    'unanswered'
                            }`}
                    >
                        {index + 1}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default QuizProgress;
