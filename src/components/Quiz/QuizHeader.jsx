import React from 'react';
import './QuizHeader.css';

function QuizHeader({ userStats, levels }) {
    if (!userStats || !levels) {
        return (
            <div className="quiz-header">
                <div className="header-content">
                    <div className="header-title-section">
                        <h1 className="header-title">Hành trình Hệ Mặt Trời</h1>
                        <p className="header-subtitle">
                            Đang tải thông tin...
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const { user, stats } = userStats;
    const currentLevel = levels.find(l => l.level === user.level);
    const nextLevel = levels.find(l => l.level === user.level + 1);

    // Calculate progress to next level
    const currentMinXp = currentLevel?.minXp || 0;
    const nextMinXp = nextLevel?.minXp || (currentMinXp + 1000);
    const xpInCurrentLevel = user.totalXp - currentMinXp;
    const xpNeededForNextLevel = nextMinXp - currentMinXp;
    const xpProgress = Math.min(100, (xpInCurrentLevel / xpNeededForNextLevel) * 100);

    return (
        <div className="quiz-header">
            <div className="header-content">
                {/* Title Section */}
                <div className="header-title-section">
                    <h1 className="header-title">Hành trình Hệ Mặt Trời</h1>
                    <p className="header-subtitle">
                        Hoàn thành 3 thử thách tại mỗi hành tinh để thu thập đủ các ngôi sao.
                        Chinh phục toàn bộ 8 hành tinh để trở thành Nhà Thám Hiểm Vũ Trụ.
                    </p>
                </div>

                {/* Stats Section */}
                <div className="header-stats">
                    <div className="stat-card">
                        <div className="stat-info">
                            <div className="stat-label">Đã chinh phục</div>
                            <div className="stat-value">{stats.completedQuizzes}/{stats.totalQuizzes} Quiz</div>
                        </div>
                    </div>

                    <div className="stat-card level-card">
                        <div className="stat-info">
                            <div className="stat-label">Cấp độ</div>
                            <div className="stat-value level">
                                LV. {user.level}
                                <span className="level-sub">{currentLevel?.rankName || 'Newbie'}</span>
                            </div>
                            {nextLevel && (
                                <div className="xp-progress">
                                    <div className="xp-bar">
                                        <div className="xp-fill" style={{ width: `${xpProgress}%` }} />
                                    </div>
                                    <div className="xp-text">{user.totalXp} / {nextMinXp} XP</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-info">
                            <div className="stat-label">Tổng sao</div>
                            <div className="stat-value stars">⭐ {stats.totalStars}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuizHeader;
