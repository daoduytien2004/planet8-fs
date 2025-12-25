import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import axios from 'axios';
import './ChangePassword.css';

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
        <div className="change-password-page">
            <div className="change-password-container">
                <h1 className="page-title">Đổi Mật Khẩu</h1>

                <form onSubmit={handleSubmit} className="password-form">
                    <div className="form-group">
                        <label htmlFor="oldPassword">Mật khẩu hiện tại</label>
                        <input
                            type="password"
                            id="oldPassword"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Nhập mật khẩu hiện tại"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="newPassword">Mật khẩu mới</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Nhập mật khẩu mới"
                            required
                            minLength="6"
                        />
                        <p className="field-hint">Tối thiểu 6 ký tự</p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Nhập lại mật khẩu mới"
                            required
                        />
                    </div>

                    {message.text && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                    </button>

                    <button
                        type="button"
                        className="btn-cancel"
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
