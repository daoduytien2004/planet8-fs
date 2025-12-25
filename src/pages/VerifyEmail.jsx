import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import './VerifyEmail.css';

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
        <div className="verify-email-page">
            <div className="verify-container">
                <div className="verify-card">
                    {status === 'loading' && (
                        <div className="verify-content">
                            <div className="spinner"></div>
                            <h1>Đang xác thực email...</h1>
                            <p>Vui lòng chờ trong giây lát</p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="verify-content success">
                            <div className="icon-circle success-icon">
                                <span>✓</span>
                            </div>
                            <h1>Xác thực thành công!</h1>
                            <p>{message}</p>
                            <div className="redirect-info">
                                Bạn sẽ được chuyển đến trang đăng nhập sau 3 giây...
                            </div>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="verify-content error">
                            <div className="icon-circle error-icon">
                                <span>✕</span>
                            </div>
                            <h1>Xác thực thất bại</h1>
                            <p>{message}</p>
                            <button
                                onClick={() => navigate('/login')}
                                className="btn-back"
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
