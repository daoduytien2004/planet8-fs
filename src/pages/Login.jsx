import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../apis/authApi';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await authService.login(username, password);
            // Redirect to home or previous page after successful login
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu.');
        } finally {
            setLoading(false);
        }
    };

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
                        <h1 className="text-3xl font-bold mb-3 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent md:text-2xl">Chào mừng trở lại</h1>
                        <p className="text-slate-400 text-sm m-0">Tiếp tục hành trình chinh phục vũ trụ</p>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-300 text-sm text-center">
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <label htmlFor="username" className="text-sm font-semibold text-slate-200 uppercase tracking-wide">Tên đăng nhập</label>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-lg pointer-events-none">👤</span>
                                <input
                                    type="text"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Nhập tên đăng nhập"
                                    required
                                    className="w-full p-4 pl-12 bg-[#1e293b]/60 border border-indigo-500/20 rounded-xl text-white text-base transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:bg-[#1e293b]/80 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] placeholder:text-slate-400/50"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center">
                                <label htmlFor="password" className="text-sm font-semibold text-slate-200 uppercase tracking-wide">Mật khẩu</label>
                                <Link to="/forgot-password" className="text-xs text-indigo-500 hover:text-indigo-400 transition-colors">
                                    Quên mật khẩu?
                                </Link>
                            </div>
                            <div className="relative flex items-center">
                                <span className="absolute left-4 text-lg pointer-events-none">🔒</span>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                        </div>

                        <button
                            type="submit"
                            className="mt-2 p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 border-none rounded-xl text-white text-base font-semibold cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(99,102,241,0.4)] disabled:opacity-60 disabled:cursor-not-allowed hover:not-disabled:-translate-y-0.5 active:not-disabled:translate-y-0"
                            disabled={loading}
                        >
                            {loading ? 'Đang xử lý...' : ' Đăng nhập'}
                        </button>
                    </form>

                    <div className="mt-8 text-center pt-8 border-t border-indigo-500/10">
                        <p className="text-slate-400 text-sm m-0">
                            Chưa có tài khoản? <Link to="/register" className="text-indigo-500 font-semibold hover:text-indigo-400 transition-colors">Đăng ký ngay</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
