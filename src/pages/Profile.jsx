import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function Profile() {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = authService.getUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setUser(currentUser);
        setUsername(currentUser.username || '');
        setAvatarPreview(currentUser.avatarUrl || '');
    }, [navigate]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setMessage({ type: 'error', text: 'Kích thước ảnh phải nhỏ hơn 5MB' });
                return;
            }
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            let avatarUrl = user.avatarUrl;

            // Upload avatar if file selected
            if (avatarFile) {
                const formData = new FormData();
                formData.append('file', avatarFile);

                const uploadResponse = await axios.post(`${API_BASE_URL}/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${authService.getToken()}`
                    }
                });

                if (uploadResponse.data.success) {
                    avatarUrl = uploadResponse.data.data.url;
                }
            }

            // Update profile
            const response = await axios.put(
                `${API_BASE_URL}/users/profile`,
                { username, avatarUrl },
                {
                    headers: {
                        'Authorization': `Bearer ${authService.getToken()}`
                    }
                }
            );

            if (response.data.success) {
                // Update local storage
                const updatedUser = { ...user, username, avatarUrl };
                authService.setUser(updatedUser);
                setUser(updatedUser);
                window.dispatchEvent(new Event('authChange'));

                setMessage({ type: 'success', text: 'Cập nhật hồ sơ thành công!' });
                setAvatarFile(null);
            }
        } catch (error) {
            console.error('Profile update error:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Cập nhật thất bại'
            });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="h-[90vh] flex items-center justify-center bg-gradient-to-br from-[#0a0e27] to-[#1a1d3d] p-8 md:p-4">
            <div className="bg-[#1e293b]/80 backdrop-blur-xl border border-indigo-500/30 rounded-[20px] p-8 max-w-[500px] w-full shadow-[0_20px_60px_rgba(0,0,0,0.3)] md:p-6">
                <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent md:text-2xl">Hồ Sơ Người Dùng</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-4 p-6 bg-[#0f172a]/50 rounded-2xl border border-indigo-500/20">
                        <label htmlFor="avatar-input" className="group relative w-[100px] h-[100px] rounded-full overflow-hidden border-[3px] border-indigo-500/50 shadow-[0_0_30px_rgba(99,102,241,0.3)] cursor-pointer transition-all duration-300 hover:border-indigo-500 hover:shadow-[0_0_40px_rgba(99,102,241,0.5)]">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-500 text-white text-4xl font-bold">
                                    {user.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <span className="text-2xl">📷</span>
                                <span className="text-[10px] text-white text-center px-1">Click để chọn ảnh</span>
                            </div>
                        </label>
                        <input
                            type="file"
                            id="avatar-input"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <p className="text-xs text-slate-400 italic">PNG, JPG, GIF tối đa 5MB</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="username" className="text-sm text-slate-400 font-semibold uppercase tracking-wider">Tên người dùng</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nhập tên người dùng"
                            required
                            className="p-3.5 px-4 bg-[#0f172a]/60 border border-indigo-500/30 rounded-xl text-white text-base transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="email" className="text-sm text-slate-400 font-semibold uppercase tracking-wider">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={user.email || ''}
                            disabled
                            className="p-3.5 px-4 bg-[#0f172a]/30 border border-slate-700/50 rounded-xl text-slate-400 text-base cursor-not-allowed"
                        />
                    </div>

                    {message.text && (
                        <div className={`p-4 rounded-xl font-medium text-center ${message.type === 'success'
                                ? 'bg-green-500/20 border border-green-500/40 text-green-300'
                                : 'bg-red-500/20 border border-red-500/40 text-red-300'
                            }`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="mt-2 p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 border-none rounded-xl text-white text-base font-semibold cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(99,102,241,0.4)] disabled:opacity-60 disabled:cursor-not-allowed hover:not-disabled:-translate-y-0.5 active:not-disabled:translate-y-0"
                        disabled={loading}
                    >
                        {loading ? 'Đang cập nhật...' : 'Cập nhật hồ sơ'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Profile;
