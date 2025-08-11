import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isPasswordStrong = (pwd) => /^(?=.[A-Z])(?=.[a-z])(?=.\d)(?=.[@$!%?#&])[A-Za-z\d@$!%?#&]{6,}$/.test(pwd);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password) return setError('All fields are required.');
    if (!validateEmail(email)) return setError('Invalid email format.');
    if (!isPasswordStrong(password)) {
      return setError('Password must include uppercase, lowercase, digit, special char and be 6+ chars.');
    }

    try {
      const res = await axios.post('http://localhost:9090/api/register', {
        username,
        email,
        password,
        role: 'citizen'
      });

      alert(res.data.message || 'Registration successful.');
      localStorage.setItem('currentUserEmail', email);
      localStorage.setItem('currentUserUsername', username);
      localStorage.setItem('currentUserRole', 'citizen');
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="card p-4 shadow mx-auto" style={{ maxWidth: '400px' }}>
        <h2 className="text-center mb-3">Citizen Registration</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input type="text" className="form-control" value={username}
              onChange={(e) => setUsername(e.target.value)} required />
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

          <button type="submit" className="btn btn-success w-100">Register</button>
        </form>

        <p className="mt-3 text-center">
          Already registered? <a href="/login">Login here</a>
        </p>
      </div>
    </div>
  );
}

export default Register;