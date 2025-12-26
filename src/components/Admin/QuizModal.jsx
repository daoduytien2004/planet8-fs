import { useState, useEffect } from 'react';

const QuizModal = ({ quiz, planets, initialPlanetId, onSave, onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        planetId: initialPlanetId || (planets[0]?.id || ''),
        rewardXp: 50,
        minLevel: 1
    });

    useEffect(() => {
        if (quiz) {
            setFormData({
                title: quiz.title || '',
                description: quiz.description || '',
                planetId: quiz.planetId || '',
                rewardXp: quiz.rewardXp || 50,
                minLevel: quiz.minLevel || 1
            });
        }
    }, [quiz]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="fixed inset-0 w-full h-full bg-black/80 flex justify-center items-center z-[1000] backdrop-blur-sm" onClick={onClose}>
            <div
                className="bg-[#0f172a] border border-indigo-500/30 rounded-2xl p-8 max-w-[600px] w-[90%] shadow-2xl relative"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">
                        {quiz ? 'Chỉnh Sửa Quiz' : 'Thêm Quiz Mới'}
                    </h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white text-xl">&times;</button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-slate-400 text-sm font-semibold mb-2">Tiêu đề</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                            placeholder="Nhập tên quiz..."
                        />
                    </div>

                    <div>
                        <label className="block text-slate-400 text-sm font-semibold mb-2">Mô tả</label>
                        <textarea
                            value={formData.description}
                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none transition-colors h-24 resize-none"
                            placeholder="Mô tả ngắn về nội dung quiz..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-slate-400 text-sm font-semibold mb-2">Hành tinh</label>
                            <select
                                value={formData.planetId}
                                onChange={e => setFormData({ ...formData, planetId: parseInt(e.target.value) })}
                                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                            >
                                {planets.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-semibold mb-2">Level Yêu Cầu</label>
                            <input
                                type="number"
                                min="1"
                                value={formData.minLevel}
                                onChange={e => setFormData({ ...formData, minLevel: parseInt(e.target.value) })}
                                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-400 text-sm font-semibold mb-2">Phần thưởng XP</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.rewardXp}
                                onChange={e => setFormData({ ...formData, rewardXp: parseInt(e.target.value) })}
                                className="w-full bg-slate-800/50 border border-slate-700/50 rounded-lg p-3 text-white focus:border-indigo-500 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>

                    <div className="flex gap-4 justify-end pt-4 mt-6 border-t border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-500 shadow-lg shadow-indigo-500/20 transition-all transform hover:-translate-y-0.5"
                        >
                            Lưu Thay Đổi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default QuizModal;
