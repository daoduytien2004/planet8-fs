import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import authService from '../../services/authService';
import './AvatarDropdown.css';

function AvatarDropdown({ onClose }) {
    const navigate = useNavigate();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleProfile = () => {
        navigate('/profile');
        onClose();
    };

    const handleChangePassword = () => {
        navigate('/change-password');
        onClose();
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
        onClose();
    };

    return (
        <div className="avatar-dropdown" ref={dropdownRef}>
            <div className="dropdown-menu">
                <button className="dropdown-item" onClick={handleProfile}>

                    <span className="item-text">Hồ sơ</span>
                </button>
                <button className="dropdown-item" onClick={handleChangePassword}>

                    <span className="item-text">Đổi mật khẩu</span>
                </button>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item logout" onClick={handleLogout}>

                    <span className="item-text">Đăng xuất</span>
                </button>
            </div>
        </div>
    );
}

export default AvatarDropdown;
