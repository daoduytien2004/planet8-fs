import React from 'react';
import './QuizFilters.css';

function QuizFilters({ activeFilter, onFilterChange, sortBy, onSortChange }) {
    const filters = [
        { id: 'all', label: 'Tất cả' },
        { id: 'in-progress', label: 'Đang tiến hành' },
        { id: 'locked', label: 'Chưa mở khóa' }
    ];

    return (
        <div className="quiz-filters">
            <div className="filters-container">
                {/* Filter Tabs */}
                <div className="filter-tabs">
                    {filters.map(filter => (
                        <button
                            key={filter.id}
                            className={`filter-tab ${activeFilter === filter.id ? 'active' : ''}`}
                            onClick={() => onFilterChange(filter.id)}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                {/* Sort Dropdown */}
                <div className="sort-section">
                    <label className="sort-label">Tổng sao:</label>
                    <select
                        className="sort-dropdown"
                        value={sortBy}
                        onChange={(e) => onSortChange(e.target.value)}
                    >
                        <option value="default">⭐ 14/24</option>
                        <option value="name">Tên hành tinh</option>
                        <option value="progress">Tiến độ</option>
                    </select>
                </div>
            </div>
        </div>
    );
}

export default QuizFilters;
