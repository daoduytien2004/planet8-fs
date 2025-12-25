import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import authService from '../../services/authService';
import AvatarDropdown from './AvatarDropdown';

function Navbar() {
    const [user, setUser] = useState(null);
    const [showDropdown, setShowDropdown] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if user is logged in
        setUser(authService.getUser());

        // Listen for auth changes
        const handleAuthChange = () => {
            setUser(authService.getUser());
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
        <nav className="w-full h-[10vh] flex justify-between items-center px-10 bg-[#0a0a25]/90 backdrop-blur-md border-b border-white/10 z-[1000]">
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
                    <div className="flex items-center gap-3 cursor-pointer relative">
                        <div
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-white flex items-center justify-center text-lg font-bold border-2 border-indigo-500/30 transition-all duration-300 cursor-pointer overflow-hidden hover:scale-105 hover:border-indigo-500 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                            onClick={toggleDropdown}
                        >
                            {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                            ) : (
                                user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'
                            )}
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-white text-sm font-semibold">{user.username || user.email}</span>
                        </div>
                        {showDropdown && <AvatarDropdown onClose={() => setShowDropdown(false)} />}
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
