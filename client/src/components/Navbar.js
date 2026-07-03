import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const role = (localStorage.getItem('role') || '').toLowerCase().trim();
    const userName = localStorage.getItem('userName') || 'User';

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('userName');
        navigate('/');
    };

    const isActive = (path) => location.pathname === path ? 'navbar-link active' : 'navbar-link';

    return (
        <nav className="navbar">
            <span className="navbar-brand">Resource Hub</span>

            <ul className="navbar-nav">
                {(role === 'junior' || role === 'senior') && (
                    <li>
                        <Link to="/dashboard" className={isActive('/dashboard')}>
                            Dashboard
                        </Link>
                    </li>
                )}
                {role === 'senior' && (
                    <li>
                        <Link to="/upload" className={isActive('/upload')}>
                            Upload
                        </Link>
                    </li>
                )}
                {role === 'teacher' && (
                    <li>
                        <Link to="/teacher" className={isActive('/teacher')}>
                            Verification
                        </Link>
                    </li>
                )}
            </ul>

            <div className="navbar-right">
                <div className="navbar-user">
                    <span className="navbar-user-name">{userName}</span>
                    <span className="badge badge-role">{role}</span>
                </div>
                <button className="navbar-logout" onClick={handleLogout}>
                    Log out
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
