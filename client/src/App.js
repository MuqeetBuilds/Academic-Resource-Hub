import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import TeacherDashboard from './pages/TeacherDashboard';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected — Any logged-in student */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['junior', 'senior']}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected — Seniors only */}
          <Route
            path="/upload"
            element={
              <ProtectedRoute allowedRoles={['senior']}>
                <Upload />
              </ProtectedRoute>
            }
          />

          {/* Protected — Teachers only */}
          <Route
            path="/teacher"
            element={
              <ProtectedRoute allowedRoles={['teacher']}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;