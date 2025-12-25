import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import authService from '../services/authService';
import './ResetPassword.css';

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
            <div className="reset-password-page">
                <div className="reset-password-container">
                    <div className="reset-password-card">

                        <div className="reset-password-header">
                            <h1>Link không hợp lệ</h1>
                            <p>Link đặt lại mật khẩu không tồn tại hoặc đã hết hạn</p>
                        </div>
                        <Link to="/forgot-password" className="btn-request-new">
                            Yêu cầu link mới
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="reset-password-page">
                <div className="reset-password-container">
                    <div className="reset-password-card">

                        <div className="reset-password-header">
                            <h1>Đặt lại mật khẩu thành công!</h1>
                            <p>Mật khẩu của bạn đã được cập nhật</p>
                        </div>
                        <div className="success-message">
                            <p>Bạn có thể đăng nhập với mật khẩu mới ngay bây giờ</p>
                            <p className="redirect-info">Đang chuyển đến trang đăng nhập...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const strength = getPasswordStrength();

    return (
        <div className="reset-password-page">
            <div className="reset-password-container">
                <div className="reset-password-card">
                    <div className="reset-password-header">
                        <h1>Đặt lại mật khẩu</h1>
                        <p>Nhập mật khẩu mới của bạn</p>
                    </div>

                    <form onSubmit={handleSubmit} className="reset-password-form">
                        {error && (
                            <div className="error-message">
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="newPassword">Mật khẩu mới</label>
                            <div className="input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="newPassword"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                            {newPassword && (
                                <div className="password-strength">
                                    <div className="strength-bar">
                                        <div
                                            className="strength-fill"
                                            style={{
                                                width: `${(newPassword.length / 12) * 100}%`,
                                                backgroundColor: strength.color
                                            }}
                                        ></div>
                                    </div>
                                    <span className="strength-label" style={{ color: strength.color }}>
                                        {strength.label}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                            <div className="input-wrapper">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    className="toggle-password"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                    {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="btn-submit" disabled={loading}>
                            {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
                        </button>
                    </form>

                    <div className="reset-password-footer">
                        <p>
                            Nhớ mật khẩu? <Link to="/login" className="login-link">Đăng nhập</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;
