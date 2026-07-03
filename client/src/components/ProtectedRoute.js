import React from 'react';
import { Navigate } from 'react-router-dom';

// Wraps routes that require authentication (and optionally specific roles)
// Usage: <ProtectedRoute allowedRoles={['senior', 'teacher']}><Dashboard /></ProtectedRoute>
const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const role = (localStorage.getItem('role') || '').toLowerCase().trim();

    // No token = not logged in
    if (!token) {
        return <Navigate to="/" replace />;
    }

    // If specific roles are required, check them
    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
