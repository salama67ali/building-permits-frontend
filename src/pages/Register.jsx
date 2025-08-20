import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mockApi from '../services/mockApi';
import 'bootstrap/dist/css/bootstrap.min.css';

function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
    
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
  const isPasswordStrong = (pwd) => 
    /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(pwd);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const { firstName, lastName, username, email, password, confirmPassword, phoneNumber, address } = formData;

    // Validation
    if (!username || !email || !password || !confirmPassword || !firstName || !lastName || !phoneNumber || !address) {
      return setError('All required fields must be filled.');
    }
    
    if (!validateEmail(email)) {
      return setError('Invalid email format.');
    }
    
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    
    if (!isPasswordStrong(password)) {
      return setError(
        'Password must be at least 6 characters, include uppercase, lowercase, a digit, and a special character.'
      );
    }

    try {
      const registrationData = {
        role: 'owner',
        username,
        email,
        password,
        firstName,
        lastName,
        phoneNumber,
        address,
      };

      const res = await mockApi.register(registrationData);

      setSuccess(res.data.message || 'Registration successful! You can now login.');
      
      // Clear form (ordered like the UI)
      setFormData({
        firstName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        address: '',
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
      navigate('/login');
      }, 2000);

    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light py-4">
      <div className="card shadow-lg" style={{ maxWidth: '600px', width: '100%' }}>
        <div className="card-body p-4">
          <h2 className="text-center mb-4"> Registration</h2>
        {error && <div className="alert alert-danger">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleRegister}>
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">First Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Last Name *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Username *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Email *</label>
                <input 
                  type="email" 
                  className="form-control" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Password *</label>
                <input 
                  type="password" 
                  className="form-control" 
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required 
                />
                <small className="text-muted">
                  Must be at least 6 characters with uppercase, lowercase, number, and special character
                </small>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Confirm Password *</label>
                <input 
                  type="password" 
                  className="form-control" 
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required 
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Phone Number *</label>
                <input 
                  type="tel" 
                  className="form-control" 
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">Address *</label>
                <input 
                  type="text" 
                  className="form-control" 
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required 
                />
              </div>
          </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary btn-lg">
                Register
              </button>
            </div>

            <div className="text-center mt-3">
              <p className="mb-0">
                Already have an account?{' '}
                <button 
                  type="button" 
                  className="btn btn-link p-0"
                  onClick={() => navigate('/login')}
                >
                  Login here
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;