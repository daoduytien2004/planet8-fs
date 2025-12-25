import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../services/authService';

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [token, setToken] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const resetToken = searchParams.get('token');
        if (!resetToken) {
            setError('Link đặt lại mật khẩu không hợp lệ');
        } else {
            setToken(resetToken);
        }
    }, [searchParams]);

    const validatePassword = () => {
        if (newPassword.length < 6) {
            return 'Mật khẩu phải có ít nhất 6 ký tự';
        }
        if (newPassword !== confirmPassword) {
            return 'Mật khẩu xác nhận không khớp';
        }
        return null;
    };

    const getPasswordStrength = () => {
        if (newPassword.length === 0) return { label: '', color: '' };
        if (newPassword.length < 6) return { label: 'Yếu', color: '#ef4444' };
        if (newPassword.length < 10) return { label: 'Trung bình', color: '#f59e0b' };
        return { label: 'Mạnh', color: '#22c55e' };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validationError = validatePassword();
        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            await authService.resetPassword(token, newPassword);
            setSuccess(true);
            // Redirect to login after 3 seconds
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || 'Link đặt lại mật khẩu không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu link mới.');
        } finally {
            setLoading(false);
        }
    };

    if (!token && !success) {
        return (
            <div className="h-[90vh] flex items-center justify-center bg-gradient-to-br from-[#0a0e27] to-[#1a1d3d] relative overflow-hidden">
                <style jsx>{`
                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(30px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}</style>
                <div className="z-10 w-full max-w-[450px] p-8 md:p-4">
                    <div className="bg-[#0f172a]/90 backdrop-blur-xl border border-indigo-500/20 rounded-3xl p-12 shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-[slideUp_0.5s_ease] md:p-6 text-center">
                        <div className="mb-10 text-center">
                            <h1 className="text-3xl font-bold mb-3 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent md:text-2xl">Link không hợp lệ</h1>
                            <p className="text-slate-400 text-sm m-0">Link đặt lại mật khẩu không tồn tại hoặc đã hết hạn</p>
                        </div>
                        <Link to="/forgot-password" className="mt-2 p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 border-none rounded-xl text-white text-base font-semibold cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(99,102,241,0.4)] block text-center no-underline active:translate-y-0">
                            Yêu cầu link mới
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="h-[90vh] flex items-center justify-center bg-gradient-to-br from-[#0a0e27] to-[#1a1d3d] relative overflow-hidden">
                <style jsx>{`
                    @keyframes slideUp {
                        from { opacity: 0; transform: translateY(30px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                `}</style>
                <div className="z-10 w-full max-w-[450px] p-8 md:p-4">
                    <div className="bg-[#0f172a]/90 backdrop-blur-xl border border-indigo-500/20 rounded-3xl p-12 shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-[slideUp_0.5s_ease] md:p-6 text-center">
                        <div className="mb-10">
                            <h1 className="text-3xl font-bold mb-3 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent md:text-2xl">Đặt lại mật khẩu thành công!</h1>
                            <p className="text-slate-400 text-sm m-0">Mật khẩu của bạn đã được cập nhật</p>
                        </div>
                        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-6 mb-8 text-center animate-[scaleIn_0.5s_ease]">
                            <p className="text-green-300 text-sm m-2 leading-relaxed">Bạn có thể đăng nhập với mật khẩu mới ngay bây giờ</p>
                            <p className="text-green-400 font-semibold text-sm mt-4">Đang chuyển đến trang đăng nhập...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const strength = getPasswordStrength();

    return (
        <div className="h-[90vh] flex items-center justify-center bg-gradient-to-br from-[#0a0e27] to-[#1a1d3d] relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none opacity-40 bg-[size:200px_200px] bg-[image:radial-gradient(2px_2px_at_20px_30px,white,transparent),radial-gradient(2px_2px_at_60px_70px,white,transparent),radial-gradient(1px_1px_at_50px_50px,white,transparent),radial-gradient(1px_1px_at_130px_80px,white,transparent),radial-gradient(2px_2px_at_90px_10px,white,transparent)] animate-[twinkle_3s_ease-in-out_infinite]" />
            <style jsx>{`
                @keyframes twinkle {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 0.5; }
                }
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="z-10 w-full max-w-[450px] p-8 md:p-4">
                <div className="bg-[#0f172a]/90 backdrop-blur-xl border border-indigo-500/20 rounded-3xl p-12 shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-[slideUp_0.5s_ease] md:p-6">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-bold mb-3 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent md:text-2xl">Đặt lại mật khẩu</h1>
                        <p className="text-slate-400 text-sm m-0">Nhập mật khẩu mới của bạn</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm text-center">
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <label htmlFor="newPassword" className="text-sm font-semibold text-slate-200 uppercase tracking-wide">Mật khẩu mới</label>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-lg pointer-events-none">🔒</span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full p-4 pl-12 bg-[#1e293b]/60 border border-indigo-500/20 rounded-xl text-white text-base transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:bg-[#1e293b]/80 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] placeholder:text-slate-400/50"
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 bg-transparent border-none text-slate-400 text-xl cursor-pointer p-1 hover:text-slate-200 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                            {newPassword && (
                                <div className="flex items-center gap-3 mt-2">
                                    <div className="flex-1 h-1.5 bg-[#1e293b]/60 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-300 rounded-full ${strength.colorClass}`}
                                            style={{
                                                width: `${(newPassword.length / 12) * 100}%`
                                            }}
                                        ></div>
                                    </div>
                                    <span className={`text-xs font-semibold min-w-[80px] text-right ${strength.textClass}`}>
                                        {strength.label}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-2">
                            <label htmlFor="confirmPassword" className="text-sm font-semibold text-slate-200 uppercase tracking-wide">Xác nhận mật khẩu</label>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-lg pointer-events-none">🔒</span>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                    className="w-full p-4 pl-12 bg-[#1e293b]/60 border border-indigo-500/20 rounded-xl text-white text-base transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:bg-[#1e293b]/80 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] placeholder:text-slate-400/50"
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 bg-transparent border-none text-slate-400 text-xl cursor-pointer p-1 hover:text-slate-200 transition-colors"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-2 p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 border-none rounded-xl text-white text-base font-semibold cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(99,102,241,0.4)] block w-full mx-auto disabled:opacity-60 disabled:cursor-not-allowed hover:not-disabled:-translate-y-0.5 active:not-disabled:translate-y-0"
                            disabled={loading}
                        >
                            {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                        </button>
                    </form>

                    <div className="mt-8 text-center pt-8 border-t border-indigo-500/10">
                        <p className="text-slate-400 text-sm m-0">
                            Nhớ mật khẩu? <Link to="/login" className="text-indigo-500 font-semibold hover:text-indigo-400 transition-colors">Đăng nhập</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
