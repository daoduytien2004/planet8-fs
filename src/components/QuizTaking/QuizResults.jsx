import React from 'react';
import './QuizResults.css';

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
        <div className="quiz-results">
            <div className="results-content">
                {isPerfect ? (
                    /* Success Screen - All Correct */
                    <>
                        <div className="results-icon success">
                            <span className="icon-emoji">🎉</span>
                        </div>
                        <h1 className="results-title success">Hoàn thành!</h1>
                        <p className="results-message">
                            Chúc mừng bạn đã hoàn thành xuất sắc!
                        </p>
                        <div className="score-display">
                            <div className="score-circle success">
                                <span className="score-percentage">{scorePercentage}%</span>
                                <span className="score-label">{correctAnswers}/{totalQuestions} đúng</span>
                            </div>
                        </div>
                        {(results?.attempt?.xpEarned || results?.xpEarned) && (
                            <div className="xp-earned">
                                <span className="xp-icon">⭐</span>
                                <span className="xp-text">+{results?.attempt?.xpEarned || results?.xpEarned} XP</span>
                            </div>
                        )}
                        <div className="results-actions">
                            <button
                                className="action-button primary"
                                onClick={onBackToList}
                            >
                                Hoàn thành
                            </button>
                        </div>
                    </>
                ) : (
                    /* Failure Screen - Some Wrong */
                    <>
                        <div className="results-icon failure">
                            <span className="icon-emoji">😔</span>
                        </div>
                        <h1 className="results-title failure">Thất bại</h1>
                        <p className="results-message">
                            Đừng nản chí! Hãy thử lại để đạt kết quả tốt hơn.
                        </p>
                        <div className="score-display">
                            <div className="score-circle failure">
                                <span className="score-percentage">{scorePercentage.toFixed(0)}%</span>
                                <span className="score-label">{correctAnswers}/{totalQuestions} đúng</span>
                            </div>
                        </div>
                        <div className="results-actions">
                            <button
                                className="action-button primary"
                                onClick={onRetry}
                            >
                                Thử lại
                            </button>
                            <button
                                className="action-button secondary"
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
