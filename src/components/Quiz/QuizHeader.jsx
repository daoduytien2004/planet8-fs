import React from 'react';

function QuizHeader({ userStats, levels }) {
    if (!userStats || !levels) {
        return (
            <div className="p-8 bg-slate-900/80 backdrop-blur-md border-b border-indigo-500/20 mb-8 md:p-6">
                <div className="max-w-[1400px] mx-auto">
                    <div className="mb-8">
                        <h1 className="text-[2.5rem] font-bold mb-3 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent md:text-2xl">Hành trình Hệ Mặt Trời</h1>
                        <p className="text-base text-slate-400 leading-relaxed m-0 max-w-[800px] md:text-sm">
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
        <div className="p-8 bg-slate-900/80 backdrop-blur-md border-b border-indigo-500/20 mb-8 md:p-6">
            <div className="max-w-[1400px] mx-auto">
                {/* Title Section */}
                <div className="mb-8">
                    <h1 className="text-[2.5rem] font-bold mb-3 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent md:text-2xl">Hành trình Hệ Mặt Trời</h1>
                    <p className="text-base text-slate-400 leading-relaxed m-0 max-w-[800px] md:text-sm">
                        Hoàn thành 3 thử thách tại mỗi hành tinh để thu thập đủ các ngôi sao.
                        Chinh phục toàn bộ 8 hành tinh để trở thành Nhà Thám Hiểm Vũ Trụ.
                    </p>
                </div>

                {/* Stats Section */}
                <div className="grid grid-cols-3 gap-6 lg:grid-cols-1 lg:gap-4">
                    <div className="bg-slate-900/50 border border-indigo-500/30 rounded-xl p-6 flex items-center gap-4 transition-all duration-300 hover:bg-slate-900/70 hover:border-indigo-500 hover:-translate-y-0.5 md:p-5">
                        <div className="flex-1">
                            <div className="text-xs text-slate-400 uppercase tracking-widest mb-1 font-semibold">Đã chinh phục</div>
                            <div className="text-2xl font-bold text-white md:text-xl">{stats.completedQuizzes}/{stats.totalQuizzes} Quiz</div>
                        </div>
                    </div>

                    <div className="bg-slate-900/50 border border-indigo-500/30 rounded-xl p-6 flex items-center gap-4 transition-all duration-300 hover:bg-slate-900/70 hover:border-indigo-500 hover:-translate-y-0.5 md:p-5">
                        <div className="flex-1">
                            <div className="text-xs text-slate-400 uppercase tracking-widest mb-1 font-semibold">Cấp độ</div>
                            <div className="text-2xl font-bold text-white md:text-xl flex items-baseline gap-2">
                                LV. {user.level}
                                <span className="text-sm text-slate-400 font-medium">{currentLevel?.rankName || 'Newbie'}</span>
                            </div>
                            {nextLevel && (
                                <div className="mt-2 w-full">
                                    <div className="w-full h-1.5 bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-indigo-500 to-indigo-400 rounded-full transition-[width] duration-300" style={{ width: `${xpProgress}%` }} />
                                    </div>
                                    <div className="text-[0.7rem] text-right text-slate-400 mt-1">{user.totalXp} / {nextMinXp} XP</div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-slate-900/50 border border-indigo-500/30 rounded-xl p-6 flex items-center gap-4 transition-all duration-300 hover:bg-slate-900/70 hover:border-indigo-500 hover:-translate-y-0.5 md:p-5">
                        <div className="flex-1">
                            <div className="text-xs text-slate-400 uppercase tracking-widest mb-1 font-semibold">Tổng sao</div>
                            <div className="text-2xl font-bold text-yellow-400 md:text-xl">⭐ {stats.totalStars}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default QuizHeader;
