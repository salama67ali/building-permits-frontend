import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetMessage, setResetMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password || !role) {
      setError('All fields are required.');
      setIsLoading(false);
      return;
    }
    
    // Create form data using URLSearchParams
    const formData = new URLSearchParams();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('role', role.toLowerCase());

    try {
      const response = await axios.post('http://localhost:9090/api/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      // Store user data in localStorage
      const { role: userRole, userId, username } = response.data;
      localStorage.setItem('currentUserRole', userRole);
      localStorage.setItem('currentUserId', userId);
      localStorage.setItem('currentUserUsername', username);
      localStorage.setItem('currentUserEmail', email);
      localStorage.setItem('isLoggedIn', 'true');

      // Redirect based on role
      if (userRole === 'admin') {
        navigate('/manage-users');
      } else {
        navigate('/dashboard'); // or wherever non-admin users should go
      }
      
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail || !validateEmail(resetEmail)) {
      setResetMessage('Please enter a valid email address.');
      return;
    }

    try {
      // This would call your password reset API endpoint
      // await axios.post('http://localhost:9090/api/forgot-password', { email: resetEmail });
      setResetMessage('Password reset instructions sent to your email.');
      setResetEmail('');
    } catch (error) {
      setResetMessage('Failed to send reset email. Please try again.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow mx-auto" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-3">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}

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
              <option value="admin">Admin</option>
              <option value="owner">Owner</option>
              <option value="consultant">Consultant</option>
              <option value="engineer">Engineer</option>
              <option value="government-board">Government Board</option>
            </select>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100 mb-3"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="text-center">
          <button 
            type="button" 
            className="btn btn-link btn-sm"
            onClick={() => setShowForgot(!showForgot)}
          >
            Forgot Password?
          </button>
        </div>

        {showForgot && (
          <div className="mt-3 p-3 border rounded">
            <h6>Reset Password</h6>
            <form onSubmit={handleForgotPassword}>
              <div className="mb-2">
                <input
                  type="email"
                  className="form-control form-control-sm"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-outline-secondary btn-sm">
                Send Reset Link
              </button>
            </form>
            {resetMessage && (
              <div className="alert alert-info mt-2 small">{resetMessage}</div>
            )}
          </div>
        )}

        <p className="mt-3 text-center">
          Don't have an account? <a href="/register">Register here</a>
        </p>
      </div>
    </div>
  );
}

export default Login;