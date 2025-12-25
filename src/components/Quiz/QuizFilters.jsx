import React from 'react';

function QuizFilters({ activeFilter, onFilterChange, sortBy, onSortChange }) {
    const filters = [
        { id: 'all', label: 'Tất cả' },
        { id: 'in-progress', label: 'Đang tiến hành' },
        { id: 'locked', label: 'Chưa mở khóa' }
    ];

    return (
        <div className="px-8 pb-6 md:px-6">
            <div className="max-w-[1400px] mx-auto flex justify-between items-center gap-8 lg:flex-col lg:items-stretch lg:gap-4">
                {/* Filter Tabs */}
                <div className="flex gap-2 bg-slate-900/50 p-2 rounded-xl border border-indigo-500/20 lg:justify-center md:flex-wrap">
                    {filters.map(filter => (
                        <button
                            key={filter.id}
                            className={`px-6 py-3 bg-transparent border-none text-slate-400 text-sm font-semibold rounded-lg cursor-pointer transition-all duration-300 whitespace-nowrap hover:text-white hover:bg-indigo-500/10 md:px-5 md:py-2.5 ${activeFilter === filter.id ? 'bg-indigo-500 !text-white shadow-[0_4px_12px_rgba(99,102,241,0.4)]' : ''}`}
                            onClick={() => onFilterChange(filter.id)}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                {/* Sort Dropdown */}
                <div className="flex items-center gap-4 lg:justify-between md:flex-col md:items-start md:gap-2 md:w-full">
                    <label className="text-sm text-slate-400 font-semibold flex items-center gap-2">Tổng sao:</label>
                    <select
                        className="px-5 py-3 bg-slate-900/50 border border-indigo-500/30 rounded-lg text-white text-sm font-semibold cursor-pointer outline-none hover:bg-slate-900/70 hover:border-indigo-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 md:w-full"
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                    >
                        <option value="default" className="bg-[#1e293b] text-white">⭐ 14/24</option>
                        <option value="name" className="bg-[#1e293b] text-white">Tên hành tinh</option>
                        <option value="progress" className="bg-[#1e293b] text-white">Tiến độ</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default QuizFilters;
