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
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !role) return setError('All fields are required.');
    if (!validateEmail(email)) return setError('Invalid email format.');

    try {
      const response = await axios.post('http://localhost:9090/api/login', {
        email,
        password,
        role: role.toLowerCase()
      });

      const { role: userRole, userId, username } = response.data;

      localStorage.setItem('currentUserEmail', email);
      localStorage.setItem('currentUserRole', userRole);
      localStorage.setItem('currentUserId', userId);
      localStorage.setItem('currentUserUsername', username);

      const normalizedRole = (userRole || '').toLowerCase();
      if (normalizedRole === 'owner') navigate('/owner');
      else if (normalizedRole === 'consultant') navigate('/consultant');
      else if (normalizedRole === 'engineer') navigate('/engineer');
      else if (normalizedRole === 'government-board' || normalizedRole === 'government-boards') navigate('/government-boards');
      else if (normalizedRole === 'admin') navigate('/admin');
      else navigate('/');
      
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    }
  };

  const handleForgotPassword = async () => {
    setResetMessage('');
    if (!validateEmail(resetEmail)) return setResetMessage('Enter a valid email.');

    try {
      const res = await axios.post('http://localhost:9090/api/forgot-password', { email: resetEmail });
      setResetMessage(res.data.message || 'Check your email for reset instructions.');
    } catch (err) {
      setResetMessage(err.response?.data?.message || 'Email not found.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow mx-auto" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-3">Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Select Role</label>
            <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)} required>
              <option value="">Select Role</option>
              <option value="owner">Owner</option>
              <option value="consultant">Consultant</option>
              <option value="engineer">Engineer</option>
              <option value="government-board">Government Board</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" className="form-control" value={email}
              onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input type="password" className="form-control" value={password}
              onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>

        <div className="mt-3 text-center">
          <a href="#" onClick={() => setShowForgot(true)}>Forgot Password?</a>
        </div>

        <p className="mt-3 text-center">
          New Owner? <a href="/register">Register here</a>
        </p>
      </div>

      {showForgot && (
        <div className="card p-3 mt-4 shadow mx-auto" style={{ maxWidth: '400px' }}>
          <h5 className="mb-2">Reset Password</h5>
          <input type="email" className="form-control mb-2" placeholder="Enter your registered email"
            value={resetEmail} onChange={(e) => setResetEmail(e.target.value)} />
          <button onClick={handleForgotPassword} className="btn btn-warning w-100 mb-2">Send Reset</button>
          {resetMessage && <div className="text-center small">{resetMessage}</div>}
          <button onClick={() => setShowForgot(false)} className="btn btn-link text-danger">Cancel</button>
        </div>
      )}
    </div>
  );
}

export default Login;