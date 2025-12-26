import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../apis/authApi';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function ChangePassword() {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    const user = authService.getUser();

    if (!user) {
        navigate('/login');
        return null;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ type: '', text: '' });

        // Validation
        if (newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({ type: 'error', text: 'Mật khẩu xác nhận không khớp' });
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                `${API_BASE_URL}/auth/change-password`,
                {
                    userId: user.id,
                    oldPassword,
                    newPassword
                },
                {
                    headers: {
                        'Authorization': `Bearer ${authService.getToken()}`
                    }
                }
            );

            if (response.data.success) {
                setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
                setOldPassword('');
                setNewPassword('');
                setConfirmPassword('');

                // Redirect to login after 2 seconds
                setTimeout(() => {
                    authService.logout();
                    navigate('/login');
                }, 2000);
            }
        } catch (error) {
            console.error('Change password error:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Đổi mật khẩu thất bại'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[90vh] bg-gradient-to-br from-[#0a0a25] to-[#1a1a3e] p-12 flex justify-center items-center md:p-8">
            <div className="bg-[#1e293b]/80 backdrop-blur-xl border border-indigo-500/30 rounded-[20px] p-10 max-w-[500px] w-full shadow-[0_20px_60px_rgba(0,0,0,0.3)] md:p-6">
                <h1 className="text-3xl font-bold text-white mb-8 text-center bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent md:text-2xl">Đổi Mật Khẩu</h1>

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="oldPassword" className="text-sm text-slate-400 font-semibold uppercase tracking-wider">Mật khẩu hiện tại</label>
                        <input
                            type="password"
                            id="oldPassword"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Nhập mật khẩu hiện tại"
                            required
                            className="p-3.5 px-4 bg-[#0f172a]/60 border border-indigo-500/30 rounded-xl text-white text-base transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="newPassword" className="text-sm text-slate-400 font-semibold uppercase tracking-wider">Mật khẩu mới</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Nhập mật khẩu mới"
                            required
                            minLength="6"
                            className="p-3.5 px-4 bg-[#0f172a]/60 border border-indigo-500/30 rounded-xl text-white text-base transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]"
                        />
                        <p className="text-xs text-slate-500 italic">Tối thiểu 6 ký tự</p>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="confirmPassword" className="text-sm text-slate-400 font-semibold uppercase tracking-wider">Xác nhận mật khẩu mới</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Nhập lại mật khẩu mới"
                            required
                            className="p-3.5 px-4 bg-[#0f172a]/60 border border-indigo-500/30 rounded-xl text-white text-base transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]"
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
                        {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                    </button>

                    <button
                        type="button"
                        className="p-3.5 bg-slate-700/30 border border-slate-400/30 rounded-xl text-slate-400 text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-slate-700/50 hover:text-white"
                        onClick={() => navigate('/profile')}
                    >
                        Hủy
                    </button>
                </form>
            </div>
        </div>
    );
}

export default ChangePassword;
