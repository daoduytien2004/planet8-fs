import { NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import authService from '../../services/authService';
import AvatarDropdown from './AvatarDropdown';
import './Navbar.css';

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
        <nav className="navbar">
            <div className="nav-brand">
                <span className="logo-icon">🪐</span>
                <span className="logo-text">Planet8</span>
            </div>

            <ul className="nav-links">
                <li>
                    <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        Vũ trụ
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/explore" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        Khám phá
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/quiz" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        Quiz
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/chatbot" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                        Trợ lý AI
                    </NavLink>
                </li>
                {authService.isAdmin() && (
                    <li>
                        <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active admin-link' : 'nav-link admin-link'}>
                            Admin
                        </NavLink>
                    </li>
                )}
            </ul>

            <div className="nav-auth">
                {user ? (
                    <div className="user-menu">
                        <div className="user-avatar" onClick={toggleDropdown}>
                            {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt="Avatar" className="avatar-image" />
                            ) : (
                                user.username?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || 'U'
                            )}
                        </div>
                        <div className="user-info">
                            <span className="user-name">{user.username || user.email}</span>
                        </div>
                        {showDropdown && <AvatarDropdown onClose={() => setShowDropdown(false)} />}
                    </div>
                ) : (
                    <NavLink to="/login" className="btn-account">
                        Tài khoản
                    </NavLink>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
