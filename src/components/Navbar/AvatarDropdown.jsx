import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import authService from '../../apis/authApi';

function AvatarDropdown({ onClose, buttonRef }) {
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const [position, setPosition] = useState({ top: 0, right: 0 });

    useEffect(() => {
        // Calculate position based on button
        if (buttonRef?.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setPosition({
                top: rect.bottom + 8,
                right: window.innerWidth - rect.right
            });
        }

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose, buttonRef]);

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

    const dropdownContent = (
        <div
            className="fixed z-[99999] animate-[dropdownFadeIn_0.2s_ease]"
            ref={dropdownRef}
            style={{
                top: `${position.top}px`,
                right: `${position.right}px`
            }}
        >
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

    return createPortal(dropdownContent, document.body);
}

export default AvatarDropdown;
