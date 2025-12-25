import React from 'react';
import './QuizOption.css';

function QuizOption({ option, optionLetter, optionIndex, isSelected, onSelect }) {
    // Color variants for each option
    const colorVariants = ['blue', 'teal', 'orange', 'pink'];
    const colorClass = colorVariants[optionIndex] || 'blue';

    return (
        <div
            className={`quiz-option quiz-option-${colorClass} ${isSelected ? 'selected' : ''}`}
            onClick={onSelect}
        >
            <div className="option-number">{optionIndex + 1}</div>
            <div className="option-content">{option.content}</div>
        </div>
    );
}

export default QuizOption;
