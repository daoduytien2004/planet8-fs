import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import authService from '../../services/authService';

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
        <div className="absolute top-[calc(100%+0.5rem)] right-0 z-[1000] animate-[dropdownFadeIn_0.2s_ease]" ref={dropdownRef}>
            <div className="bg-slate-900/95 backdrop-blur-xl border border-indigo-500/30 rounded-xl p-2 min-w-[200px] shadow-[0_10px_40px_rgba(0,0,0,0.4)]">
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 bg-transparent border-none rounded-lg cursor-pointer transition-all duration-200 text-slate-200 text-[0.95rem] font-medium text-left hover:bg-indigo-500/20 hover:translate-x-1"
                    onClick={handleProfile}
                >
                    <span className="flex-1">Hồ sơ</span>
                </button>
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 bg-transparent border-none rounded-lg cursor-pointer transition-all duration-200 text-slate-200 text-[0.95rem] font-medium text-left hover:bg-indigo-500/20 hover:translate-x-1"
                    onClick={handleChangePassword}
                >
                    <span className="flex-1">Đổi mật khẩu</span>
                </button>
                <div className="h-px bg-indigo-500/20 my-2"></div>
                <button
                    className="w-full flex items-center gap-3 px-4 py-3 bg-transparent border-none rounded-lg cursor-pointer transition-all duration-200 text-slate-200 text-[0.95rem] font-medium text-left hover:bg-indigo-500/20 hover:translate-x-1 hover:bg-red-500/20 hover:text-red-300"
                    onClick={handleLogout}
                >
                    <span className="flex-1">Đăng xuất</span>
                </button>
            </div>
        </div>
    );
}

export default AvatarDropdown;
