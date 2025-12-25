import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import authService from '../services/authService';
import './Register.css';

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
        <div className="register-page">
            <div className="register-container">
                <div className="register-card">
                    <div className="register-left">
                        <div className="register-header">
                            <h1>Đăng ký</h1>
                            <p>Tạo tài khoản để bắt đầu hành trình chinh phục vũ trụ</p>
                        </div>

                        <form onSubmit={handleSubmit} className="register-form">
                            {error && (
                                <div className="error-message">
                                    ⚠️ {error}
                                </div>
                            )}

                            <div className="form-group">
                                <label htmlFor="username">Tên đăng nhập</label>
                                <div className="input-wrapper">

                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="Nhập tên đăng nhập"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <div className="input-wrapper">

                                    <input
                                        type="email"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="name@example.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="password">Mật khẩu</label>
                                <div className="input-wrapper">

                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        className="toggle-password"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? '👁️' : '👁️‍🗨️'}
                                    </button>
                                </div>
                            </div>

                            <div className="checkbox-group">
                                <label className="checkbox-label">
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    />
                                    <span>
                                        Tôi đồng ý với <Link to="/terms" className="link">Điều khoản</Link> và <Link to="/privacy" className="link">Chính sách bảo mật</Link>
                                    </span>
                                </label>
                            </div>

                            <button type="submit" className="btn-register" disabled={loading}>
                                {loading ? '⏳ Đang xử lý...' : '→ Tạo tài khoản'}
                            </button>
                        </form>

                        <div className="register-footer">
                            <p>
                                Đã có tài khoản? <Link to="/login" className="login-link">Đăng nhập ngay</Link>
                            </p>
                        </div>
                    </div>

                    <div className="register-right">
                        <div className="hero-badge">
                            <span className="badge-dot"></span>
                            CÙNG ĐỒNG HÀNH
                        </div>
                        <h2>Khám phá vũ trụ cùng Planet8</h2>
                        <p>Tham gia cùng hơn 50,000 nhà thám hiểm và chinh phục các hành tinh trong hệ mặt trời.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;
