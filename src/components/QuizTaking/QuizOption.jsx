import React from 'react';

function QuizOption({ option, optionLetter, optionIndex, isSelected, onSelect }) {
    // Color variants for each option
    const colorClasses = [
        'bg-gradient-to-br from-[#1e88e5] to-[#1565c0]', // Blue
        'bg-gradient-to-br from-[#26a69a] to-[#00897b]', // Teal
        'bg-gradient-to-br from-[#fb8c00] to-[#f57c00]', // Orange
        'bg-gradient-to-br from-[#ec407a] to-[#d81b60]'  // Pink
    ];

    // Fallback circular selection if more than 4 options
    const bgClass = colorClasses[optionIndex % colorClasses.length];

    return (
        <div
            className={`min-h-[140px] rounded-[20px] p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.3)] hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)] md:min-h-[150px] md:p-6
            ${bgClass}
            ${isSelected ? 'scale-105 shadow-[0_20px_50px_rgba(0,0,0,0.6)] border-[3px] border-white/80 animate-[selectedPulse_0.5s_ease]' : ''}`}
            onClick={onSelect}
        >
            <style jsx>{`
                @keyframes selectedPulse {
                    0%, 100% { transform: scale(1.05); }
                    50% { transform: scale(1.1); }
                }
            `}</style>
            <div className="absolute top-4 right-4 w-8 h-8 bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center text-white text-base font-bold border-2 border-white/30 md:w-7 md:h-7 md:text-sm">
                {optionIndex + 1}
            </div>
            <div className="text-white text-[1.3rem] font-semibold leading-normal text-center drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)] md:text-lg">
                {option.content}
            </div>
        </div>
    );
}

export default QuizOption;
