import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import authService from '../../apis/authApi';
import AvatarDropdown from './AvatarDropdown';

function Navbar() {
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const avatarButtonRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Initial load from localStorage (non-blocking)
        const initUser = async () => {
            const cachedUser = await authService.getUser();
            setUser(cachedUser);
        };
        initUser();

        // Fetch fresh data from backend with refresh=true
        const fetchUserData = async () => {
            if (authService.isAuthenticated()) {
                const freshUser = await authService.getUser(true);
                setUser(freshUser);
            }
        };
        fetchUserData();

        // Listen for auth changes
        const handleAuthChange = async () => {
            const user = await authService.getUser();
            setUser(user);
        };

        window.addEventListener('authChange', handleAuthChange);

        return () => {
            window.removeEventListener('authChange', handleAuthChange);
        };
    }, []);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    return (
        <nav className="w-full h-[10vh] flex justify-between items-center px-10 bg-[#0a0a25]/90 backdrop-blur-md border-b border-white/10 z-[9999]">
            <div className="flex items-center gap-2.5 cursor-pointer">
                <span className="text-[28px]">🪐</span>
                <span className="text-white text-xl font-bold">Planet8</span>
            </div>

            <ul className="flex list-none gap-5 m-0 p-0">
                <li>
                    <NavLink to="/" className={({ isActive }) => isActive ?
                        'text-white bg-indigo-500/20 border border-indigo-500/50 text-base px-4 py-2 rounded-lg transition-all duration-300' :
                        'text-white/70 no-underline text-base px-4 py-2 rounded-lg transition-all duration-300 hover:text-white hover:bg-white/10'
                    }>
                        Vũ trụ
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/explore" className={({ isActive }) => isActive ?
                        'text-white bg-indigo-500/20 border border-indigo-500/50 text-base px-4 py-2 rounded-lg transition-all duration-300' :
                        'text-white/70 no-underline text-base px-4 py-2 rounded-lg transition-all duration-300 hover:text-white hover:bg-white/10'
                    }>
                        Khám phá
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/quiz" className={({ isActive }) => isActive ?
                        'text-white bg-indigo-500/20 border border-indigo-500/50 text-base px-4 py-2 rounded-lg transition-all duration-300' :
                        'text-white/70 no-underline text-base px-4 py-2 rounded-lg transition-all duration-300 hover:text-white hover:bg-white/10'
                    }>
                        Quiz
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/chatbot" className={({ isActive }) => isActive ?
                        'text-white bg-indigo-500/20 border border-indigo-500/50 text-base px-4 py-2 rounded-lg transition-all duration-300' :
                        'text-white/70 no-underline text-base px-4 py-2 rounded-lg transition-all duration-300 hover:text-white hover:bg-white/10'
                    }>
                        Trợ lý AI
                    </NavLink>
                </li>
                {authService.isAdmin() && (
                    <li>
                        <NavLink to="/admin" className={({ isActive }) => isActive ?
                            'text-white bg-indigo-500/30 border border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.3)] text-base px-4 py-2 rounded-lg transition-all duration-300' :
                            'text-white/70 no-underline bg-indigo-500/15 border border-indigo-500/30 text-base px-4 py-2 rounded-lg transition-all duration-300 hover:bg-indigo-500/25 hover:border-indigo-500 hover:text-white'
                        }>
                            Admin
                        </NavLink>
                    </li>
                )}
            </ul>

            <div className="flex items-center">
                {user ? (
                    <div
                        ref={avatarButtonRef}
                        className="flex items-center gap-3 cursor-pointer relative"
                        onClick={toggleDropdown}
                    >
                        <div
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-lg font-bold border-2 border-indigo-500/30 transition-all duration-300 cursor-pointer overflow-hidden hover:scale-105 hover:border-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                        >
                            {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'
                            )}
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-white text-sm font-semibold">{user.username || user.email}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/20 px-1.5 py-0.5 rounded border border-indigo-500/30">
                                    LV.{user.level || 1}
                                </span>
                                <span className="text-[10px] font-medium text-slate-400">
                                    {user.totalXp || 0} XP
                                </span>
                            </div>
                        </div>
                        {showDropdown && <AvatarDropdown onClose={() => setShowDropdown(false)} buttonRef={avatarButtonRef} />}
                    </div>
                ) : (
                    <NavLink to="/login" className="flex items-center gap-2 bg-[#4a90e2] text-white no-underline px-5 py-2.5 rounded-[20px] text-sm font-semibold transition-all duration-300 hover:bg-[#357abd] hover:-translate-y-0.5">
                        Tài khoản
                    </NavLink>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
