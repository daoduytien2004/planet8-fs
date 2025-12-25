import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import quizService from '../services/quizService';
import QuizQuestion from '../components/QuizTaking/QuizQuestion';
import QuizResults from '../components/QuizTaking/QuizResults';
import './QuizTaking.css';

function QuizTaking() {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [attemptId, setAttemptId] = useState(null);
    const [questionIds, setQuestionIds] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(null);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isCompleted, setIsCompleted] = useState(false);
    const [results, setResults] = useState(null);

    // Initialize quiz
    useEffect(() => {
        startQuizAttempt();
    }, [quizId]);

    // Load current question when index changes
    useEffect(() => {
        if (questionIds.length > 0 && currentQuestionIndex < questionIds.length) {
            loadQuestion(questionIds[currentQuestionIndex]);
        }
    }, [currentQuestionIndex, questionIds]);

    const startQuizAttempt = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await quizService.startQuiz(parseInt(quizId));

            // Backend returns { attempt: { id, ... }, questionIds: [...] }
            // Extract attemptId from attempt.id
            const extractedAttemptId = data.attempt?.id || data.attemptId;
            const extractedQuestionIds = data.questionIds || [];

            setAttemptId(extractedAttemptId);
            setQuestionIds(extractedQuestionIds);
        } catch (err) {
            console.error('Error starting quiz:', err);
            setError('Không thể bắt đầu quiz. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const loadQuestion = async (questionId) => {
        try {
            setLoading(true);
            const question = await quizService.getQuestion(questionId);
            setCurrentQuestion(question);
        } catch (err) {
            console.error('Error loading question:', err);
            setError('Không thể tải câu hỏi. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleSelectAnswer = async (optionId) => {
        if (!currentQuestion || !attemptId) {
            console.error('Missing data - Cannot submit answer');
            return;
        }

        // Save selected answer
        setSelectedAnswers(prev => ({
            ...prev,
            [currentQuestion.id]: optionId
        }));

        // Submit answer to backend
        try {
            await quizService.submitAnswer(attemptId, currentQuestion.id, optionId);
        } catch (err) {
            console.error('Error submitting answer:', err);
        }

        // Auto-advance to next question after a short delay
        setTimeout(() => {
            if (currentQuestionIndex < questionIds.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
            } else {
                // Last question - submit quiz
                completeQuiz();
            }
        }, 500);
    };

    const completeQuiz = async () => {
        try {
            setLoading(true);
            const attemptStatus = await quizService.getAttemptStatus(attemptId);
            setResults(attemptStatus);
            setIsCompleted(true);
        } catch (err) {
            console.error('Error completing quiz:', err);
            setError('Không thể hoàn thành quiz. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleRetry = () => {
        // Reset state and restart quiz
        setAttemptId(null);
        setQuestionIds([]);
        setCurrentQuestionIndex(0);
        setCurrentQuestion(null);
        setSelectedAnswers({});
        setIsCompleted(false);
        setResults(null);
        startQuizAttempt();
    };

    const handleBackToQuizList = () => {
        navigate('/quiz');
    };

    if (loading && !currentQuestion) {
        return (
            <div className="quiz-taking-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p className="loading-text">Đang tải quiz...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="quiz-taking-page">
                <div className="error-container">
                    <p className="error-text">{error}</p>
                    <button className="retry-button" onClick={startQuizAttempt}>
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    if (isCompleted && results) {
        return (
            <div className="quiz-taking-page">
                <QuizResults
                    results={results}
                    onRetry={handleRetry}
                    onBackToList={handleBackToQuizList}
                />
            </div>
        );
    }

    return (
        <div className="quiz-taking-page">
            {/* Question Display */}
            {currentQuestion && (
                <QuizQuestion
                    question={currentQuestion}
                    questionNumber={currentQuestionIndex + 1}
                    totalQuestions={questionIds.length}
                    selectedAnswer={selectedAnswers[currentQuestion.id]}
                    onSelectAnswer={handleSelectAnswer}
                />
            )}
        </div>
    );
}

export default QuizTaking;
