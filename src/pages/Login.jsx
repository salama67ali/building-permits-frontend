// src/pages/Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE = 'http://localhost:8080';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const validateEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const normalizeRoleForApi = (value) =>
    value.trim().toUpperCase().replace('-', '_'); // e.g. government-boards -> GOVERNMENT_BOARDS (we will map below)

  // Some UIs use “government-boards” label; backend expects GOVERNMENT_BOARD (singular, underscore)
  const mapUiRoleToBackend = (value) => {
    const r = value.trim().toLowerCase();
    if (r === 'government-boards' || r === 'government-board') return 'GOVERNMENT_BOARD';
    if (r === 'admin') return 'ADMIN';
    if (r === 'owner') return 'OWNER';
    if (r === 'consultant') return 'CONSULTANT';
    if (r === 'engineer') return 'ENGINEER';
    // default normalization
    return normalizeRoleForApi(value);
  };

  const routeForRole = (backendRole) => {
    const r = backendRole.toUpperCase();
    if (r === 'ADMIN') return '/admin';
    if (r === 'OWNER') return '/owner';
    if (r === 'CONSULTANT') return '/consultant';
    if (r === 'ENGINEER') return '/engineer';
    if (r === 'GOVERNMENT_BOARD') return '/government-boards';
    return '/';
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !role) {
      setError('All fields are required.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Invalid email format.');
      return;
    }

    try {
      const roleForApi = mapUiRoleToBackend(role);
      const { data } = await axios.post(
        `${API_BASE}/api/auth/login`,
        { email, password, role: roleForApi },
        { headers: { 'Content-Type': 'application/json' } }
      );

      // Backend returns token in data.message.
      // Note: data.username and data.email are swapped in the backend DTO.
      // We’ll store both and use role from data.role.
      localStorage.setItem('authToken', data.message || '');
      localStorage.setItem('currentUserUsername', data.username || ''); // This will likely be the email
      localStorage.setItem('currentUserEmail', data.email || '');       // This will likely be the username
      localStorage.setItem('currentUserRole', data.role || '');

      navigate(routeForRole(data.role || ''));
    } catch (err) {
      const msg = err?.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(msg);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail || !validateEmail(resetEmail)) {
      setResetMessage('Please enter a valid email address.');
      return;
    }
    // Placeholder; wire to your backend if you implement a real reset endpoint
    setResetMessage('Password reset instructions sent to your email.');
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body p-4">
          <h2 className="text-center mb-4">Login</h2>
          {error && <div className="alert alert-danger">{error}</div>}
          
          {!showForgot ? (
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Role</label>
                <select
                  className="form-select"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="owner">Owner</option>
                  <option value="admin">Admin</option>
                  <option value="consultant">Consultant</option>
                  <option value="engineer">Engineer</option>
                  <option value="government-boards">Government Boards</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary w-100 mb-3">
                Login
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword}>
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                />
              </div>
              {resetMessage && (
                <div className={`alert ${resetMessage.includes('sent') ? 'alert-success' : 'alert-danger'}`}>
                  {resetMessage}
                </div>
              )}
              <button type="submit" className="btn btn-warning w-100 mb-3">
                Send Reset Email
              </button>
            </form>
          )}
          
          <div className="text-center">
            <button className="btn btn-link" onClick={() => setShowForgot(!showForgot)}>
              {showForgot ? 'Back to Login' : 'Forgot Password?'}
            </button>
            <br />
            <button className="btn btn-link" onClick={() => navigate('/register')}>
              Don't have an account? Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;