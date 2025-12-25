import React from 'react';
import QuizOption from './QuizOption';
import './QuizQuestion.css';

function QuizQuestion({ question, questionNumber, totalQuestions, selectedAnswer, onSelectAnswer }) {
    if (!question) return null;

    // Ensure we have options array
    const options = question.options || [];
    const optionLetters = ['A', 'B', 'C', 'D'];

    return (
        <div className="quiz-question">
            {/* Question Header */}
            <div className="question-header">
                <span className="question-number">Câu {questionNumber}/{totalQuestions}</span>
            </div>

            {/* Question Content */}
            <div className="question-content">
                <h2 className="question-text">{question.content}</h2>

                {/* Question Image if available */}
                {question.mediaUrl && (
                    <div className="question-image-wrapper">
                        <img
                            src={question.mediaUrl}
                            alt="Question illustration"
                            className="question-image"
                        />
                    </div>
                )}
            </div>

            {/* Answer Options */}
            <div className="question-options">
                {options.map((option, index) => (
                    <QuizOption
                        key={option.id}
                        option={option}
                        optionLetter={optionLetters[index]}
                        optionIndex={index}
                        isSelected={selectedAnswer === option.id}
                        onSelect={() => onSelectAnswer(option.id)}
                    />
                ))}
            </div>
        </div>
    );
}

export default QuizQuestion;
