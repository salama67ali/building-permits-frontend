import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header";

function ConsultantDashboard() {
  const username = localStorage.getItem('currentUserUsername');
  const navigate = useNavigate();
  const [stats] = useState({
    totalProjects: 12,
    activeProjects: 8,
    completedProjects: 4,
    pendingReviews: 3
  });

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-info text-white" style={{ width: '250px', minHeight: '100vh' }}>
        <div className="p-3">
          <h5 className="text-center mb-4">Consultant Panel</h5>
          <nav className="nav flex-column">
            <a className="nav-link text-white active" href="#dashboard">
              <i className="bi bi-speedometer2 me-2"></i>Dashboard
            </a>
            <a className="nav-link text-white" onClick={() => navigate('/consultant/upload-building-plan-design')} style={{cursor: 'pointer'}}>
              <i className="bi bi-upload me-2"></i>Upload Designs
            </a>
            <a className="nav-link text-white" onClick={() => navigate('/consultant/view-documents')} style={{cursor: 'pointer'}}>
              <i className="bi bi-folder me-2"></i>View Documents
            </a>
            <a className="nav-link text-white" href="#reviews">
              <i className="bi bi-search me-2"></i>Technical Reviews
            </a>
            <a className="nav-link text-white" href="#clients">
              <i className="bi bi-people me-2"></i>Client Projects
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        <Header username={username} />
        
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Consultant Dashboard</h2>
            <div className="text-muted">Welcome back, {username}!</div>
          </div>

          {/* Statistics Cards */}
          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <div className="card bg-info text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4>{stats.totalProjects}</h4>
                      <p className="mb-0">Total Projects</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-briefcase fs-1"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4>{stats.activeProjects}</h4>
                      <p className="mb-0">Active Projects</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-play-circle fs-1"></i>
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
                      <h4>{stats.completedProjects}</h4>
                      <p className="mb-0">Completed</p>
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
                      <h4>{stats.pendingReviews}</h4>
                      <p className="mb-0">Pending Reviews</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-clock fs-1"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h5>Quick Actions</h5>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <button className="btn btn-info" onClick={() => navigate('/consultant/upload-building-plan-design')}>
                      <i className="bi bi-upload me-2"></i>Upload Building Plans
                    </button>
                    <button className="btn btn-primary" onClick={() => navigate('/consultant/view-documents')}>
                      <i className="bi bi-folder me-2"></i>View Documents
                    </button>
                    <button className="btn btn-success">
                      <i className="bi bi-search me-2"></i>Technical Review
                    </button>
                    <button className="btn btn-warning">
                      <i className="bi bi-people me-2"></i>Client Meetings
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h5>Active Projects</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Project ID</th>
                          <th>Client Name</th>
                          <th>Project Type</th>
                          <th>Status</th>
                          <th>Due Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>PRJ-001</td>
                          <td>ABC Construction</td>
                          <td>Residential Complex</td>
                          <td><span className="badge bg-primary">In Progress</span></td>
                          <td>2024-02-15</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-1">View</button>
                            <button className="btn btn-sm btn-outline-success">Update</button>
                          </td>
                        </tr>
                        <tr>
                          <td>PRJ-002</td>
                          <td>XYZ Developers</td>
                          <td>Commercial Building</td>
                          <td><span className="badge bg-warning">Review Pending</span></td>
                          <td>2024-02-20</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-1">View</button>
                            <button className="btn btn-sm btn-outline-success">Update</button>
                          </td>
                        </tr>
                        <tr>
                          <td>PRJ-003</td>
                          <td>City Corp</td>
                          <td>Industrial Facility</td>
                          <td><span className="badge bg-info">Design Phase</span></td>
                          <td>2024-03-01</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-1">View</button>
                            <button className="btn btn-sm btn-outline-success">Update</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="card">
            <div className="card-header">
              <h5>Recent Activities</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Design Review Completed</strong>
                    <br />
                    <small className="text-muted">Residential Complex design review completed for ABC Construction</small>
                  </div>
                  <span className="badge bg-success">2 hours ago</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>New Project Assigned</strong>
                    <br />
                    <small className="text-muted">Industrial Facility project assigned by City Corp</small>
                  </div>
                  <span className="badge bg-info">1 day ago</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Client Meeting Scheduled</strong>
                    <br />
                    <small className="text-muted">Meeting with XYZ Developers scheduled for tomorrow</small>
                  </div>
                  <span className="badge bg-warning">2 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsultantDashboard;
