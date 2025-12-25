import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import './ForgotPassword.css';

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Vui lòng nhập địa chỉ email hợp lệ');
            setLoading(false);
            return;
        }

        try {
            await authService.forgotPassword(email);
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="forgot-password-page">
                <div className="forgot-password-container">
                    <div className="forgot-password-card">
                        <div className="forgot-password-header">
                            <h1>Email đã được gửi!</h1>
                            <p>Vui lòng kiểm tra hộp thư của bạn</p>
                        </div>
                        <div className="success-message">
                            <p>Chúng tôi đã gửi link đặt lại mật khẩu đến <strong>{email}</strong></p>
                            <p>Link sẽ hết hạn sau 1 giờ.</p>
                        </div>
                        <button
                            className="btn-back-login"
                            onClick={() => navigate('/login')}
                        >
                            Quay lại đăng nhập
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="forgot-password-page">
            <div className="forgot-password-container">
                <div className="forgot-password-card">
                    <div className="forgot-password-header">
                        <h1>Quên mật khẩu?</h1>
                        <p>Nhập email của bạn để nhận link đặt lại mật khẩu</p>
                    </div>

                    <form onSubmit={handleSubmit} className="forgot-password-form">
                        {error && (
                            <div className="error-message">
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your-email@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Đang gửi...' : 'Xác nhận'}
                        </button>
                    </form>

                    <div className="forgot-password-footer">
                        <p>
                            Đã nhớ mật khẩu? <Link to="/login" className="login-link">Đăng nhập</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
