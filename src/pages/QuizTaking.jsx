import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import quizService from '../services/quizService';
import QuizQuestion from '../components/QuizTaking/QuizQuestion';
import QuizResults from '../components/QuizTaking/QuizResults';

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
            <div className="h-[90vh] bg-gradient-to-br from-[#0a0e27] to-[#1a1d3d] p-4 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 pointer-events-none opacity-30 bg-[size:200px_200px] bg-[image:radial-gradient(2px_2px_at_20px_30px,white,transparent),radial-gradient(2px_2px_at_60px_70px,white,transparent),radial-gradient(1px_1px_at_50px_50px,white,transparent)] animate-[twinkle_5s_ease-in-out_infinite]" />
                <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 relative z-10">
                    <div className="w-[60px] h-[60px] border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                    <p className="text-xl text-slate-400 font-medium">Đang tải quiz...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="h-[90vh] bg-gradient-to-br from-[#0a0e27] to-[#1a1d3d] p-4 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 pointer-events-none opacity-30 bg-[size:200px_200px] bg-[image:radial-gradient(2px_2px_at_20px_30px,white,transparent),radial-gradient(2px_2px_at_60px_70px,white,transparent),radial-gradient(1px_1px_at_50px_50px,white,transparent)] animate-[twinkle_5s_ease-in-out_infinite]" />
                <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6 relative z-10">
                    <p className="text-xl text-red-500 text-center">{error}</p>
                    <button className="px-8 py-4 bg-indigo-500 border-none text-white rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-indigo-600 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_rgba(99,102,241,0.4)]" onClick={startQuizAttempt}>
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    if (isCompleted && results) {
        return (
            <div className="h-[90vh] bg-gradient-to-br from-[#0a0e27] to-[#1a1d3d] p-4 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 pointer-events-none opacity-30 bg-[size:200px_200px] bg-[image:radial-gradient(2px_2px_at_20px_30px,white,transparent),radial-gradient(2px_2px_at_60px_70px,white,transparent),radial-gradient(1px_1px_at_50px_50px,white,transparent)] animate-[twinkle_5s_ease-in-out_infinite]" />
                <QuizResults
                    results={results}
                    onRetry={handleRetry}
                    onBackToList={handleBackToQuizList}
                />
            </div>
        );
    }

    return (
        <div className="h-[90vh] bg-gradient-to-br from-[#0a0e27] to-[#1a1d3d] p-4 relative overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 pointer-events-none opacity-30 bg-[size:200px_200px] bg-[image:radial-gradient(2px_2px_at_20px_30px,white,transparent),radial-gradient(2px_2px_at_60px_70px,white,transparent),radial-gradient(1px_1px_at_50px_50px,white,transparent)] animate-[twinkle_5s_ease-in-out_infinite]" />
            <style jsx>{`
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.5; }
                }
            `}</style>

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
