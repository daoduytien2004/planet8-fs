import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading'); // loading, success, error
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get('token');

            if (!token) {
                setStatus('error');
                setMessage('Token không hợp lệ');
                return;
            }

            try {
                const response = await axios.patch(`${API_BASE_URL}/auth/verify-email`, {
                    token
                });

                if (response.data.success) {
                    setStatus('success');
                    setMessage(response.data.message || 'Email đã được xác thực thành công!');

                    // Redirect to login after 3 seconds
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                } else {
                    setStatus('error');
                    setMessage('Xác thực email thất bại');
                }
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.message || 'Có lỗi xảy ra khi xác thực email');
            }
        };

        verifyEmail();
    }, [searchParams, navigate, API_BASE_URL]);

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
                @keyframes scaleIn {
                    from { transform: scale(0); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}</style>

            <div className="z-10 w-full max-w-[500px] p-8 md:p-4">
                <div className="bg-[#0f172a]/90 backdrop-blur-xl border border-indigo-500/20 rounded-3xl p-12 shadow-[0_20px_60px_rgba(0,0,0,0.5)] animate-[slideUp_0.5s_ease] md:p-6">
                    {status === 'loading' && (
                        <div className="flex flex-col items-center text-center">
                            <div className="w-20 h-20 border-4 border-indigo-500/10 border-t-indigo-500 rounded-full animate-spin mb-8"></div>
                            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent md:text-2xl">Đang xác thực email...</h1>
                            <p className="text-base text-slate-300 mb-8 leading-relaxed">Vui lòng chờ trong giây lát</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="flex flex-col items-center text-center">
                            <div className="w-[100px] h-[100px] rounded-full flex items-center justify-center text-5xl mb-8 animate-[scaleIn_0.5s_ease] bg-green-500/10 border-[3px] border-green-500 text-green-500 md:w-20 md:h-20 md:text-4xl">
                                <span>✓</span>
                            </div>
                            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent md:text-2xl">Xác thực thành công!</h1>
                            <p className="text-base text-slate-300 mb-8 leading-relaxed">{message}</p>
                            <div className="text-sm text-slate-400 p-4 bg-indigo-500/5 rounded-xl border border-indigo-500/10">
                                Bạn sẽ được chuyển đến trang đăng nhập sau 3 giây...
                            </div>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="flex flex-col items-center text-center">
                            <div className="w-[100px] h-[100px] rounded-full flex items-center justify-center text-5xl mb-8 animate-[scaleIn_0.5s_ease] bg-red-500/10 border-[3px] border-red-500 text-red-500 md:w-20 md:h-20 md:text-4xl">
                                <span>✕</span>
                            </div>
                            <h1 className="text-3xl font-bold mb-4 bg-gradient-to-br from-white to-slate-400 bg-clip-text text-transparent md:text-2xl">Xác thực thất bại</h1>
                            <p className="text-base text-slate-300 mb-8 leading-relaxed">{message}</p>
                            <button
                                onClick={() => navigate('/login')}
                                className="mt-4 p-4 px-8 bg-gradient-to-br from-indigo-500 to-indigo-600 border-none rounded-xl text-white text-base font-semibold cursor-pointer transition-all duration-300 shadow-[0_4px_15px_rgba(99,102,241,0.3)] hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(99,102,241,0.4)]"
                            >
                                Quay lại đăng nhập
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default VerifyEmail;
