import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mockApi from '../services/mockApi';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !role) {
      setError('All fields are required.');
      return;
    }

    try {
      const response = await mockApi.login({ email, password, role: role.toLowerCase() });

      // Handle successful login
      const { role: userRole, userId, username } = response.data;
      
      // Store user data in localStorage
      localStorage.setItem('currentUserRole', userRole);
      localStorage.setItem('currentUserUsername', username);
      localStorage.setItem('currentUserEmail', email);
      localStorage.setItem('currentUserId', userId);
      
      // Redirect based on role
      switch (userRole.toLowerCase()) {
        case 'admin':
          navigate('/admin');
          break;
        case 'owner':
          navigate('/owner');
          break;
        case 'consultant':
          navigate('/consultant');
          break;
        case 'engineer':
          navigate('/engineer');
          break;
        case 'government-boards':
          navigate('/government-boards');
          break;
        default:
          navigate('/');
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail || !validateEmail(resetEmail)) {
      setResetMessage('Please enter a valid email address.');
      return;
    }

    try {
      // Mock password reset - in real app this would send email
      setResetMessage('Password reset instructions sent to your email.');
    } catch (err) {
      setResetMessage('Failed to send reset email.');
    }
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
            <button
              className="btn btn-link"
              onClick={() => setShowForgot(!showForgot)}
            >
              {showForgot ? 'Back to Login' : 'Forgot Password?'}
            </button>
            <br />
            <button
              className="btn btn-link"
              onClick={() => navigate('/register')}
            >
              Don't have an account? Register
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;