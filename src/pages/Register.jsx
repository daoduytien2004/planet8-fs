import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../apis/authApi';

function Register() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!agreedToTerms) {
            setError('Vui lòng đồng ý với Điều khoản và Chính sách bảo mật');
            return;
        }

        setLoading(true);

        try {
            await authService.register(username, email, password);
            // Redirect to home after successful registration
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-[90vh] flex items-center justify-center bg-gradient-to-br from-[#0a0e27] to-[#1a1d3d] relative overflow-hidden p-8 md:p-4">
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

            <div className="z-10 w-full max-w-[900px]">
                <div className="bg-[#0f172a]/90 backdrop-blur-xl border border-indigo-500/20 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.5)] grid grid-cols-2 animate-[slideUp_0.5s_ease] max-h-[85vh] md:grid-cols-1">
                    <div className="p-8 overflow-y-auto md:p-6">
                        <div className="mb-5">
                            <h1 className="text-2xl font-bold mb-2 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent md:text-xl">Đăng ký</h1>
                            <p className="text-xs text-slate-400 m-0 leading-relaxed">Tạo tài khoản để bắt đầu hành trình chinh phục vũ trụ</p>
                        </div>

                        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                            {error && (
                                <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3.5 text-red-300 text-sm text-center">
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
                                        className="w-full p-3 pl-10 bg-[#1e293b]/60 border border-indigo-500/20 rounded-xl text-white text-base transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:bg-[#1e293b]/80 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] placeholder:text-slate-400/50"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="email" className="text-sm font-semibold text-slate-200 uppercase tracking-wide">Email</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 text-lg pointer-events-none">📧</span>
                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        required
                                        className="w-full p-3 pl-10 bg-[#1e293b]/60 border border-indigo-500/20 rounded-xl text-white text-base transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:bg-[#1e293b]/80 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] placeholder:text-slate-400/50"
                                    />
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label htmlFor="password" className="text-sm font-semibold text-slate-200 uppercase tracking-wide">Mật khẩu</label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-4 text-lg pointer-events-none">🔒</span>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                        className="w-full p-3 pl-10 bg-[#1e293b]/60 border border-indigo-500/20 rounded-xl text-white text-base transition-all duration-300 focus:outline-none focus:border-indigo-500 focus:bg-[#1e293b]/80 focus:shadow-[0_0_0_3px_rgba(99,102,241,0.1)] placeholder:text-slate-400/50"
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

                            <div className="mt-1">
                                <label className="flex items-start gap-3 cursor-pointer text-sm text-slate-300 leading-normal">
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="mt-1 w-[18px] h-[18px] cursor-pointer accent-indigo-500"
                                    />
                                    <span>
                                        Tôi đồng ý với <Link to="/terms" className="text-indigo-500 no-underline transition-colors hover:text-indigo-400">Điều khoản</Link> và <Link to="/privacy" className="text-indigo-500 no-underline transition-colors hover:text-indigo-400">Chính sách bảo mật</Link>
                                    </span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className="mt-2 p-4 bg-gradient-to-br from-indigo-500 to-indigo-600 border-none rounded-xl text-white text-base font-semibold cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(99,102,241,0.4)] disabled:opacity-60 disabled:cursor-not-allowed hover:not-disabled:-translate-y-0.5 active:not-disabled:translate-y-0"
                                disabled={loading}
                            >
                                {loading ? '⏳ Đang xử lý...' : '→ Tạo tài khoản'}
                            </button>
                        </form>

                        <div className="mt-6 text-center pt-6 border-t border-indigo-500/10">
                            <p className="text-slate-400 text-sm m-0">
                                Đã có tài khoản? <Link to="/login" className="text-indigo-500 font-semibold hover:text-indigo-400 transition-colors">Đăng nhập ngay</Link>
                            </p>
                        </div>
                    </div>

                    <div className="bg-[url('/images/photo3.jpg')] bg-cover bg-center p-20 pt-8 pb-8 flex flex-col justify-start items-center text-center relative md:hidden">
                        <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 px-3 py-1.5 rounded-full text-[0.65rem] font-semibold text-green-500 tracking-widest mb-5">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            CÙNG ĐỒNG HÀNH
                        </div>
                        <h2 className="text-[1.35rem] font-bold text-white mb-3 leading-snug">Khám phá vũ trụ cùng Planet8</h2>
                        <p className="text-sm text-slate-300 mb-5 leading-relaxed">Tham gia cùng hơn 50,000 nhà thám hiểm và chinh phục các hành tinh trong hệ mặt trời.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
