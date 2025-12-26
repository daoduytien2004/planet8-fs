import React from 'react';

function QuizOption({ option, optionLetter, optionIndex, isSelected, onSelect, status = 'default', disabled = false }) {
    // Color variants for each option
    const colorClasses = [
        'bg-gradient-to-br from-[#1e88e5] to-[#1565c0]', // Blue
        'bg-gradient-to-br from-[#26a69a] to-[#00897b]', // Teal
        'bg-gradient-to-br from-[#fb8c00] to-[#f57c00]', // Orange
        'bg-gradient-to-br from-[#ec407a] to-[#d81b60]'  // Pink
    ];

    // Fallback circular selection if more than 4 options
    let bgClass = colorClasses[optionIndex % colorClasses.length];
    let borderClass = '';

    // Override styles based on status
    if (status === 'correct') {
        bgClass = 'bg-gradient-to-br from-green-500 to-green-600';
        borderClass = 'border-[3px] border-white/90 ring-4 ring-green-500/30';
    } else if (status === 'incorrect') {
        bgClass = 'bg-gradient-to-br from-red-500 to-red-600';
        borderClass = 'border-[3px] border-white/90 ring-4 ring-red-500/30';
    } else if (isSelected) {
        borderClass = 'border-[3px] border-white/80';
    }

    return (
        <div
            className={`min-h-[140px] rounded-[20px] p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300 relative overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.3)] md:min-h-[150px] md:p-6 md:w-full
            ${bgClass}
            ${borderClass}
            ${isSelected && status === 'default' ? 'scale-105 shadow-[0_20px_50px_rgba(0,0,0,0.6)] animate-[selectedPulse_0.5s_ease]' : ''}
            ${disabled ? 'cursor-default opacity-90 hover:transform-none hover:shadow-none' : 'hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)]'}
            `}
            onClick={!disabled ? onSelect : undefined}
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

            {/* Status Icon */}
            {status === 'correct' && (
                <div className="absolute top-4 left-4 bg-white/20 rounded-full p-1 animate-in zoom-in fade-in duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
            )}
            {status === 'incorrect' && (
                <div className="absolute top-4 left-4 bg-white/20 rounded-full p-1 animate-in zoom-in fade-in duration-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>
            )}
        </div>
    );
}

export default QuizOption;
