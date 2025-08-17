import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header";
import OwnerUpload from "../../components/OwnerUpload";
import DocumentList from "../../components/DocumentList";
import 'bootstrap/dist/css/bootstrap.min.css';

function OwnerDashboard() {
  const username = localStorage.getItem('currentUserUsername');
  const navigate = useNavigate();
  const [stats] = useState({
    totalApplications: 5,
    pendingApplications: 2,
    approvedApplications: 2,
    underReviewApplications: 1
  });
  const userId = localStorage.getItem('currentUserId');
  const [refreshKey, setRefreshKey] = useState(0);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-primary text-white" style={{ width: '250px', minHeight: '100vh' }}>
        <div className="p-3">
          <h5 className="text-center mb-4">Owner Panel</h5>
          <nav className="nav flex-column">
            <a className="nav-link text-white active" href="#dashboard">
              <i className="bi bi-speedometer2 me-2"></i>Dashboard
            </a>
            <a className="nav-link text-white" onClick={() => navigate('/owner/apply-permit')} style={{cursor: 'pointer'}}>
              <i className="bi bi-plus-circle me-2"></i>New Application
            </a>
            <a className="nav-link text-white" onClick={() => navigate('/owner/view-applications')} style={{cursor: 'pointer'}}>
              <i className="bi bi-list-check me-2"></i>My Applications
            </a>
            <a className="nav-link text-white" onClick={() => navigate('/owner/upload-documents')} style={{cursor: 'pointer'}}>
              <i className="bi bi-upload me-2"></i>Upload Documents
            </a>
            <a className="nav-link text-white" href="#notifications">
              <i className="bi bi-bell me-2"></i>Notifications
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        <Header username={username} />
        
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Owner Dashboard</h2>
            <div className="text-muted">Welcome back, {username}!</div>
          </div>

          {/* Statistics Cards */}
          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4>{stats.totalApplications}</h4>
                      <p className="mb-0">Total Applications</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-file-earmark-text fs-1"></i>
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
                      <h4>{stats.pendingApplications}</h4>
                      <p className="mb-0">Pending</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-clock fs-1"></i>
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
                      <h4>{stats.approvedApplications}</h4>
                      <p className="mb-0">Approved</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-check-circle fs-1"></i>
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
                      <h4>{stats.underReviewApplications}</h4>
                      <p className="mb-0">Under Review</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-search fs-1"></i>
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
                    <button className="btn btn-primary" onClick={() => navigate('/owner/apply-permit')}>
                      <i className="bi bi-plus-circle me-2"></i>New Permit Application
                    </button>
                    <button className="btn btn-success" onClick={() => navigate('/owner/upload-documents')}>
                      <i className="bi bi-upload me-2"></i>Upload Documents
                    </button>
                    <button className="btn btn-info" onClick={() => navigate('/owner/view-applications')}>
                      <i className="bi bi-list-check me-2"></i>View All Applications
                    </button>
                    <button className="btn btn-warning">
                      <i className="bi bi-bell me-2"></i>Check Notifications
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h5>Recent Applications</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Permit #</th>
                          <th>Project Name</th>
                          <th>Status</th>
                          <th>Submitted Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>BP-2024-001</td>
                          <td>Residential Building</td>
                          <td><span className="badge bg-warning">Pending</span></td>
                          <td>2024-01-15</td>
                        </tr>
                        <tr>
                          <td>BP-2024-002</td>
                          <td>Commercial Complex</td>
                          <td><span className="badge bg-success">Approved</span></td>
                          <td>2024-01-10</td>
                        </tr>
                        <tr>
                          <td>BP-2024-003</td>
                          <td>Industrial Warehouse</td>
                          <td><span className="badge bg-info">Under Review</span></td>
                          <td>2024-01-20</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <OwnerUpload userId={userId} onUploaded={() => setRefreshKey((k) => k + 1)} />

          <div className="card card-body">
            <h5 className="mb-2">Your Documents</h5>
            <DocumentList role="owner" userId={userId} refreshKey={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;
