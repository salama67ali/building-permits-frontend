// src/pages/HomePage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import buildingLogo from '../assets/BPM-LOGO.jpg'; // Replace with your actual logo

function HomePage() {
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(true);

  const toggleSidebar = () => setShowSidebar(!showSidebar);

  return (
    <div className="container-fluid min-vh-100 d-flex flex-column flex-md-row">
      {/* Sidebar */}
      <div
        className={`bg-primary text-white p-3 d-flex flex-column align-items-center justify-content-center ${
          showSidebar ? 'd-flex' : 'd-none'
        } d-md-flex transition-all`}
        style={{ width: '200px' }}
      >
        <img
          src={buildingLogo}
          alt="Building Logo"
          className="img-fluid mb-3"
          style={{ maxWidth: '80px', transition: 'transform 0.3s ease' }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
        <h5 className="text-center mb-3">Building Permissions</h5>
        <button
          onClick={() => navigate('/login')}
          className="btn btn-outline-light btn-sm mb-2 w-100"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/register')}
          className="btn btn-light btn-sm w-100"
        >
          Register as Owner
        </button>
      </div>

      {/* Toggle for small screens */}
      <button
        className="btn btn-outline-primary d-md-none m-2"
        onClick={toggleSidebar}
      >
        {showSidebar ? 'Hide Menu ☰' : 'Show Menu ☰'}
      </button>

      {/* Main Content */}
      <div className="p-4 p-md-5 flex-grow-1 d-flex flex-column justify-content-center align-items-center bg-light text-center">
        <h2 className="mb-3">Welcome to the Building Permissions Management System</h2>
        <p className="lead mb-4 w-75">
          Apply for building permits, track approvals, and manage permissions efficiently. Access is available for Owners, GovernmentBoard, and Admins.
        </p>
        <img
          src="https://cdn-icons-png.flaticon.com/512/235/235861.png"
          alt="Building"
          className="img-fluid shadow-sm"
          style={{
            maxWidth: '250px',
            transition: 'transform 0.3s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        />
        <button
          onClick={() => navigate('/about')}
          className="btn btn-outline-secondary btn-sm mt-3"
        >
          About Us
        </button>
      </div>
    </div>
  );
}

export default HomePage;
