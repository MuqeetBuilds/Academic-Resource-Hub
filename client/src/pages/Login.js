import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import '../App.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', msg: '' });
        setLoading(true);

        try {
            const res = await api.post('/api/auth/login', { email, password });

            // Save auth data
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role);
            localStorage.setItem('userName', res.data.user.name);

            const userRole = res.data.user.role;

            if (userRole === 'teacher') {
                navigate('/teacher');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setStatus({
                type: 'error',
                msg: err.response?.data?.msg || 'Login failed. Please check your credentials.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="card-auth">
                <h1 className="auth-heading">Welcome back</h1>
                <p className="auth-subheading">Sign in to Academic Resource Hub</p>

                {status.msg && (
                    <div className={`status-msg status-msg-${status.type}`}>
                        {status.msg}
                    </div>
                )}

                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="login-email">Email</label>
                        <input
                            id="login-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="login-password">Password</label>
                        <input
                            id="login-password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block btn-lg"
                        disabled={loading}
                    >
                        {loading ? 'Signing in...' : 'Sign in'}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account?{' '}
                    <Link to="/register" className="link-subtle">
                        Create one
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Login;