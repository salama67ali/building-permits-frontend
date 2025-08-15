import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header";
import 'bootstrap/dist/css/bootstrap.min.css';

function GovernmentBoardsDashboard() {
  const username = localStorage.getItem('currentUserUsername');
  const navigate = useNavigate();
  const [stats] = useState({
    totalApplications: 45,
    pendingApprovals: 12,
    approvedApplications: 28,
    rejectedApplications: 5,
    inspectionsScheduled: 8
  });

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-warning text-dark" style={{ width: '250px', minHeight: '100vh' }}>
        <div className="p-3">
          <h5 className="text-center mb-4">Government Panel</h5>
          <nav className="nav flex-column">
            <a className="nav-link text-dark active" href="#dashboard">
              <i className="bi bi-speedometer2 me-2"></i>Dashboard
            </a>
            <a className="nav-link text-dark" onClick={() => navigate('/government-boards/view-submitted-documents')} style={{cursor: 'pointer'}}>
              <i className="bi bi-file-earmark-text me-2"></i>Review Applications
            </a>
            <a className="nav-link text-dark" onClick={() => navigate('/government-boards/send-notification')} style={{cursor: 'pointer'}}>
              <i className="bi bi-send me-2"></i>Send Notifications
            </a>
            <a className="nav-link text-dark" href="#inspections">
              <i className="bi bi-building me-2"></i>Manage Inspections
            </a>
            <a className="nav-link text-dark" href="#compliance">
              <i className="bi bi-shield-check me-2"></i>Compliance Reports
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        <Header username={username} />
        
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Government Boards Dashboard</h2>
            <div className="text-muted">Welcome back, {username}!</div>
          </div>

          {/* Statistics Cards */}
          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <div className="card bg-warning text-dark">
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
              <div className="card bg-danger text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4>{stats.pendingApprovals}</h4>
                      <p className="mb-0">Pending Approvals</p>
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
                      <h4>{stats.inspectionsScheduled}</h4>
                      <p className="mb-0">Inspections</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-calendar-check fs-1"></i>
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
                    <button className="btn btn-warning" onClick={() => navigate('/government-boards/view-submitted-documents')}>
                      <i className="bi bi-file-earmark-text me-2"></i>Review Applications
                    </button>
                    <button className="btn btn-info" onClick={() => navigate('/government-boards/send-notification')}>
                      <i className="bi bi-send me-2"></i>Send Notifications
                    </button>
                    <button className="btn btn-success">
                      <i className="bi bi-calendar-plus me-2"></i>Schedule Inspection
                    </button>
                    <button className="btn btn-secondary">
                      <i className="bi bi-file-earmark-pdf me-2"></i>Generate Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h5>Pending Applications</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Permit #</th>
                          <th>Project Name</th>
                          <th>Owner</th>
                          <th>Engineer</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>BP-2024-007</td>
                          <td>Luxury Hotel</td>
                          <td>Hotel Corp</td>
                          <td>Eng. Johnson</td>
                          <td><span className="badge bg-warning">Pending</span></td>
                          <td>
                            <button className="btn btn-sm btn-outline-success me-1">Approve</button>
                            <button className="btn btn-sm btn-outline-danger me-1">Reject</button>
                            <button className="btn btn-sm btn-outline-primary">Review</button>
                          </td>
                        </tr>
                        <tr>
                          <td>BP-2024-008</td>
                          <td>Medical Center</td>
                          <td>Health Systems</td>
                          <td>Eng. Williams</td>
                          <td><span className="badge bg-info">Under Review</span></td>
                          <td>
                            <button className="btn btn-sm btn-outline-success me-1">Approve</button>
                            <button className="btn btn-sm btn-outline-danger me-1">Reject</button>
                            <button className="btn btn-sm btn-outline-primary">Review</button>
                          </td>
                        </tr>
                        <tr>
                          <td>BP-2024-009</td>
                          <td>Educational Complex</td>
                          <td>Edu Foundation</td>
                          <td>Eng. Davis</td>
                          <td><span className="badge bg-warning">Pending</span></td>
                          <td>
                            <button className="btn btn-sm btn-outline-success me-1">Approve</button>
                            <button className="btn btn-sm btn-outline-danger me-1">Reject</button>
                            <button className="btn btn-sm btn-outline-primary">Review</button>
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
                    <strong>Application Approved</strong>
                    <br />
                    <small className="text-muted">Building permit BP-2024-006 for Office Complex approved</small>
                  </div>
                  <span className="badge bg-success">2 hours ago</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Inspection Scheduled</strong>
                    <br />
                    <small className="text-muted">Site inspection scheduled for BP-2024-007 on Jan 26</small>
                  </div>
                  <span className="badge bg-info">4 hours ago</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Notification Sent</strong>
                    <br />
                    <small className="text-muted">Approval notification sent to Hotel Corp for BP-2024-007</small>
                  </div>
                  <span className="badge bg-primary">1 day ago</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Compliance Report Generated</strong>
                    <br />
                    <small className="text-muted">Monthly compliance report for January 2024 generated</small>
                  </div>
                  <span className="badge bg-secondary">2 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GovernmentBoardsDashboard;
