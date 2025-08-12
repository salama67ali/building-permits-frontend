import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('owner');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  // Corrected password strength regex
  const isPasswordStrong = (pwd) => 
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(pwd);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Validation
    if (!username || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      setIsLoading(false);
      return;
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters long.');
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      setError('Invalid email format.');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    if (!isPasswordStrong(password)) {
      setError(
        'Password must be at least 6 characters, include uppercase, lowercase, a digit, and a special character.'
      );
      setIsLoading(false);
      return;
    }

    try {
      const res = await axios.post('http://localhost:9090/api/register', {
        role: role,
        username,
        email,
        password
      });

      // Show success message
      alert(res.data.message || 'Registration successful! You can now login.');
      
      // Clear form
      setUsername('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      setRole('owner');
      
      // Redirect to login
      navigate('/login');
      
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow mx-auto" style={{ maxWidth: '500px' }}>
        <h2 className="text-center mb-3">Register Here</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input 
              type="text" 
              className="form-control" 
              value={username}
              onChange={(e) => setUsername(e.target.value)} 
              required 
              minLength="3"
            />
            <div className="form-text">Username must be at least 3 characters long.</div>
          </div>

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
            <label className="form-label">Role</label>
            <select 
              className="form-select" 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="owner">Owner</option>
              <option value="consultant">Consultant</option>
              <option value="engineer">Engineer</option>
              <option value="government-board">Government Board</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={password}
              onChange={(e) => setPassword(e.target.value)} 
              required 
              minLength="6"
            />
            <div className="form-text">
              Password must be at least 6 characters with uppercase, lowercase, number, and special character.
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input 
              type="password" 
              className="form-control" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-success w-100"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-3 text-center">
          Already registered? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default Register;