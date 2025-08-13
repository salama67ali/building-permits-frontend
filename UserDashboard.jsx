import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const UserDashboard = () => {
  const [userInfo, setUserInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userRole = localStorage.getItem('currentUserRole');
    
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (userRole === 'admin') {
      navigate('/admin-dashboard');
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
            <h2>User Dashboard</h2>
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Profile Information</h5>
              <div className="mb-3">
                <strong>Username:</strong> {userInfo.username}
              </div>
              <div className="mb-3">
                <strong>Email:</strong> {userInfo.email}
              </div>
              <div className="mb-3">
                <strong>Role:</strong> 
                <span className={`badge bg-primary ms-2`}>
                  {userInfo.role}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title">Quick Actions</h5>
              <div className="d-grid gap-2">
                <button className="btn btn-outline-primary" disabled>
                  View Profile (Coming Soon)
                </button>
                <button className="btn btn-outline-secondary" disabled>
                  Change Password (Coming Soon)
                </button>
                <button className="btn btn-outline-secondary" disabled>
                  View Reports (Coming Soon)
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
              <h5 className="card-title">Welcome Message</h5>
              <p className="card-text">
                Welcome to the system, <strong>{userInfo.username}</strong>! 
                You are logged in as a <strong>{userInfo.role}</strong>.
              </p>
              <p className="card-text">
                This dashboard provides you with access to your account information and system features 
                based on your role permissions. If you need additional access or have questions, 
                please contact your system administrator.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <div className="alert alert-info">
            <h6>Role Information</h6>
            <p className="mb-0">
              <strong>{userInfo.role}</strong> role provides access to specific system features. 
              Your permissions are determined by your role assignment.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;