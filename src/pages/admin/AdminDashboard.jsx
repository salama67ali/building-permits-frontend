import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header";
import 'bootstrap/dist/css/bootstrap.min.css';

function AdminDashboard() {
  const navigate = useNavigate();
  const username = localStorage.getItem('currentUserUsername');
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOwners: 0,
    totalConsultants: 0,
    totalEngineers: 0,
    totalGovernmentBoards: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0
  });

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    axios.get('http://localhost:8080/api/admin/stats', {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    })
    .then(({ data }) => {
      setStats({
        totalUsers: data.totalUsers ?? 0,
        totalOwners: data.totalOwners ?? 0,
        totalConsultants: data.totalConsultants ?? 0,
        totalEngineers: data.totalEngineers ?? 0,
        totalGovernmentBoards: data.totalGovernmentBoards ?? 0,
        pendingApplications: data.pendingApplications ?? 0,
        approvedApplications: data.approvedApplications ?? 0,
        rejectedApplications: data.rejectedApplications ?? 0
      });
    })
    .catch(() => {
      // Optionally handle error/toast
    });
  }, []);

  const pct = (part, whole) => {
    if (!whole || whole <= 0) return 0;
    return Math.min(100, Math.max(0, (part / whole) * 100));
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      {/* Sidebar */}
      <div className="bg-dark text-white d-none d-md-block" style={{ width: '250px', minHeight: '100vh' }}>
        <div className="p-3">
          <h5 className="text-center mb-4">Admin Panel</h5>
          <nav className="nav flex-column">
            <a className="nav-link text-white active" href="#dashboard">
              <i className="bi bi-speedometer2 me-2"></i>Dashboard
            </a>
            <a className="nav-link text-white" onClick={() => navigate('/admin/manage-users')} style={{cursor: 'pointer'}}>
              <i className="bi bi-people me-2"></i>Manage Users
            </a>
            <a className="nav-link text-white" onClick={() => navigate('/admin/view-submissions')} style={{cursor: 'pointer'}}>
              <i className="bi bi-file-earmark-text me-2"></i>Applications
            </a>
            <a className="nav-link text-white" onClick={() => navigate('/admin/send-notifications')} style={{cursor: 'pointer'}}>
              <i className="bi bi-graph-up me-2"></i>Reports
            </a>
            <a className="nav-link text-white" href="#settings" style={{cursor: 'pointer'}}>
              <i className="bi bi-gear me-2"></i>Settings
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        {/* Header */}
        <Header username={username} />
        
        {/* Dashboard Content */}
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Admin Dashboard</h2>
            <div className="text-muted">Welcome back, {username}!</div>
          </div>

          {/* Statistics Cards */}
          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4>{stats.totalUsers}</h4>
                      <p className="mb-0">Total Users</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-people fs-1"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4>{stats.pendingApplications}</h4>
                      <p className="mb-0">Pending Applications</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-clock fs-1"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card bg-info text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4>{stats.approvedApplications}</h4>
                      <p className="mb-0">Approved Applications</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-check-circle fs-1"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card bg-warning text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4>{stats.rejectedApplications}</h4>
                      <p className="mb-0">Rejected Applications</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-x-circle fs-1"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* User Distribution */}
          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5>User Distribution by Role</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Owners</span>
                      <span>{stats.totalOwners}</span>
                    </div>
                    <div className="progress">
                      <div className="progress-bar" style={{ width: `${pct(stats.totalOwners, stats.totalUsers)}%` }}></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Consultants</span>
                      <span>{stats.totalConsultants}</span>
                    </div>
                    <div className="progress">
                      <div className="progress-bar bg-success" style={{ width: `${pct(stats.totalConsultants, stats.totalUsers)}%` }}></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Engineers</span>
                      <span>{stats.totalEngineers}</span>
                    </div>
                    <div className="progress">
                      <div className="progress-bar bg-info" style={{ width: `${pct(stats.totalEngineers, stats.totalUsers)}%` }}></div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>Government Boards</span>
                      <span>{stats.totalGovernmentBoards}</span>
                    </div>
                    <div className="progress">
                      <div className="progress-bar bg-warning" style={{ width: `${pct(stats.totalGovernmentBoards, stats.totalUsers)}%` }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="col-md-6">
              <div className="card">
                <div className="card-header">
                  <h5>Quick Actions</h5>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <button className="btn btn-primary" onClick={() => navigate('/admin/manage-users')}>
                      <i className="bi bi-person-plus me-2"></i>Manage Users
                    </button>
                    <button className="btn btn-success" onClick={() => navigate('/admin/view-submissions')}>
                      <i className="bi bi-file-earmark-text me-2"></i>View Applications
                    </button>
                    <button className="btn btn-info" onClick={() => navigate('/admin/send-notifications')}>
                      <i className="bi bi-graph-up me-2"></i>Generate Report
                    </button>
                    <button className="btn btn-warning">
                      <i className="bi bi-gear me-2"></i>System Settings
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity (static placeholders) */}
          <div className="card">
            <div className="card-header">
              <h5>Recent Activity</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>New Owner Registration</strong>
                    <br />
                    <small className="text-muted">John Doe registered as a new owner</small>
                  </div>
                  <span className="badge bg-primary">2 minutes ago</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Application Approved</strong>
                    <br />
                    <small className="text-muted">Building permit #BP-2024-001 approved</small>
                  </div>
                  <span className="badge bg-success">15 minutes ago</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>New Consultant Added</strong>
                    <br />
                    <small className="text-muted">Sarah Johnson added as consultant</small>
                  </div>
                  <span className="badge bg-info">1 hour ago</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>System Maintenance</strong>
                    <br />
                    <small className="text-muted">Database backup completed</small>
                  </div>
                  <span className="badge bg-secondary">3 hours ago</span>
                </div>
              </div>
            </div>
          </div>
        </div> {/* p-4 */}
      </div> {/* flex-grow-1 */}
    </div>
  );
}

export default AdminDashboard;