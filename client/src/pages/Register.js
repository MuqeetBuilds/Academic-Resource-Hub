import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import '../App.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('junior');
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const onSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: '', msg: '' });
        setLoading(true);

        try {
            const res = await api.post('/api/auth/register', { name, email, password, role });

            // Save auth data and go to dashboard
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('role', res.data.user.role);
            localStorage.setItem('userName', res.data.user.name);

            if (res.data.user.role === 'teacher') {
                navigate('/teacher');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            setStatus({
                type: 'error',
                msg: err.response?.data?.msg || 'Registration failed. Please try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page-container">
            <div className="card-auth">
                <h1 className="auth-heading">Create account</h1>
                <p className="auth-subheading">Join the Academic Resource Hub</p>

                {status.msg && (
                    <div className={`status-msg status-msg-${status.type}`}>
                        {status.msg}
                    </div>
                )}

                <form onSubmit={onSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="reg-name">Full name</label>
                        <input
                            id="reg-name"
                            type="text"
                            placeholder="Your full name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="reg-email">Email</label>
                        <input
                            id="reg-email"
                            type="email"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="reg-password">Password</label>
                        <input
                            id="reg-password"
                            type="password"
                            placeholder="Choose a strong password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="reg-role">I am a...</label>
                        <select
                            id="reg-role"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="form-select"
                        >
                            <option value="junior">Junior Student</option>
                            <option value="senior">Senior Student</option>
                            <option value="teacher">Teacher</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block btn-lg"
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account?{' '}
                    <Link to="/" className="link-subtle">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
