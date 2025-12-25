import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import axios from 'axios';
import './Profile.css';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

function Profile() {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const navigate = useNavigate();

    useEffect(() => {
        const currentUser = authService.getUser();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        setUser(currentUser);
        setUsername(currentUser.username || '');
        setAvatarPreview(currentUser.avatarUrl || '');
    }, [navigate]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setMessage({ type: 'error', text: 'Kích thước ảnh phải nhỏ hơn 5MB' });
                return;
            }
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            let avatarUrl = user.avatarUrl;

            // Upload avatar if file selected
            if (avatarFile) {
                const formData = new FormData();
                formData.append('file', avatarFile);

                const uploadResponse = await axios.post(`${API_BASE_URL}/upload`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${authService.getToken()}`
                    }
                });

                if (uploadResponse.data.success) {
                    avatarUrl = uploadResponse.data.data.url;
                }
            }

            // Update profile
            const response = await axios.put(
                `${API_BASE_URL}/users/profile`,
                { username, avatarUrl },
                {
                    headers: {
                        'Authorization': `Bearer ${authService.getToken()}`
                    }
                }
            );

            if (response.data.success) {
                // Update local storage
                const updatedUser = { ...user, username, avatarUrl };
                authService.setUser(updatedUser);
                setUser(updatedUser);
                window.dispatchEvent(new Event('authChange'));

                setMessage({ type: 'success', text: 'Cập nhật hồ sơ thành công!' });
                setAvatarFile(null);
            }
        } catch (error) {
            console.error('Profile update error:', error);
            setMessage({
                type: 'error',
                text: error.response?.data?.message || 'Cập nhật thất bại'
            });
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="profile-page">
            <div className="profile-container">
                <h1 className="profile-title">Hồ Sơ Người Dùng</h1>

                <form onSubmit={handleSubmit} className="profile-form">
                    <div className="avatar-section">
                        <label htmlFor="avatar-input" className="avatar-preview-clickable">
                            {avatarPreview ? (
                                <img src={avatarPreview} alt="Avatar" className="preview-image" />
                            ) : (
                                <div className="preview-placeholder">
                                    {user.username?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            )}
                            <div className="avatar-overlay">
                                <span className="upload-icon">📷</span>
                                <span className="upload-text">Click để chọn ảnh</span>
                            </div>
                        </label>
                        <input
                            type="file"
                            id="avatar-input"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="file-input"
                        />
                        <p className="file-hint">PNG, JPG, GIF tối đa 5MB</p>
                    </div>

                    <div className="form-group">
                        <label htmlFor="username">Tên người dùng</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Nhập tên người dùng"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            value={user.email || ''}
                            disabled
                            className="disabled-input"
                        />
                    </div>

                    {message.text && (
                        <div className={`message ${message.type}`}>
                            {message.text}
                        </div>
                    )}

                    <button type="submit" className="btn-submit" disabled={loading}>
                        {loading ? 'Đang cập nhật...' : 'Cập nhật hồ sơ'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Profile;
