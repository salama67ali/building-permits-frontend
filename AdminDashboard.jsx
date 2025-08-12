import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('currentUserRole');
    
    if (!isLoggedIn || userRole !== 'admin') {
      navigate('/login');
      return;
    }

    setUserInfo({
      username: localStorage.getItem('currentUserUsername'),
      email: localStorage.getItem('currentUserEmail'),
      role: userRole
    });
    setIsLoading(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const handleManageUsers = () => {
    navigate('/manage-users');
  };

  if (isLoading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Admin Dashboard</h2>
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Welcome, {userInfo.username}!</h5>
              <p className="card-text">
                <strong>Role:</strong> {userInfo.role}<br/>
                <strong>Email:</strong> {userInfo.email}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-8 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Quick Actions</h5>
              <div className="d-grid gap-2">
                <button 
                  className="btn btn-primary" 
                  onClick={handleManageUsers}
                >
                  Manage Users
                </button>
                <button className="btn btn-outline-secondary" disabled>
                  View Reports (Coming Soon)
                </button>
                <button className="btn btn-outline-secondary" disabled>
                  System Settings (Coming Soon)
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">System Overview</h5>
              <div className="row text-center">
                <div className="col-md-3">
                  <div className="border rounded p-3">
                    <h4 className="text-primary">Users</h4>
                    <p className="mb-0">Manage all system users</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="border rounded p-3">
                    <h4 className="text-success">Roles</h4>
                    <p className="mb-0">Owner, Consultant, Engineer, Government Board</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="border rounded p-3">
                    <h4 className="text-info">Security</h4>
                    <p className="mb-0">Password validation & access control</p>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="border rounded p-3">
                    <h4 className="text-warning">Admin</h4>
                    <p className="mb-0">Full system control</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;