import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header";

function EngineerDashboard() {
  const username = localStorage.getItem('currentUserUsername');
  const navigate = useNavigate();
  const [stats] = useState({
    totalAssessments: 25,
    pendingAssessments: 8,
    completedAssessments: 17,
    approvedPlans: 15,
    rejectedPlans: 2
  });

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-success text-white" style={{ width: '250px', minHeight: '100vh' }}>
        <div className="p-3">
          <h5 className="text-center mb-4">Engineer Panel</h5>
          <nav className="nav flex-column">
            <a className="nav-link text-white active" href="#dashboard">
              <i className="bi bi-speedometer2 me-2"></i>Dashboard
            </a>
            <a className="nav-link text-white" onClick={() => navigate('/engineer/view-submitted-documents')} style={{cursor: 'pointer'}}>
              <i className="bi bi-file-earmark-text me-2"></i>Review Documents
            </a>
            <a className="nav-link text-white" href="#assessments">
              <i className="bi bi-clipboard-check me-2"></i>Technical Assessments
            </a>
            <a className="nav-link text-white" href="#inspections">
              <i className="bi bi-building me-2"></i>Site Inspections
            </a>
            <a className="nav-link text-white" href="#reports">
              <i className="bi bi-file-earmark-bar-graph me-2"></i>Generate Reports
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        <Header username={username} />
        
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Engineer Dashboard</h2>
            <div className="text-muted">Welcome back, {username}!</div>
          </div>

          {/* Statistics Cards */}
          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4>{stats.totalAssessments}</h4>
                      <p className="mb-0">Total Assessments</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-clipboard-check fs-1"></i>
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
                      <h4>{stats.pendingAssessments}</h4>
                      <p className="mb-0">Pending Reviews</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-clock fs-1"></i>
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
                      <h4>{stats.approvedPlans}</h4>
                      <p className="mb-0">Approved Plans</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-check-circle fs-1"></i>
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
                      <h4>{stats.rejectedPlans}</h4>
                      <p className="mb-0">Rejected Plans</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-x-circle fs-1"></i>
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
                    <button className="btn btn-success" onClick={() => navigate('/engineer/view-submitted-documents')}>
                      <i className="bi bi-file-earmark-text me-2"></i>Review Documents
                    </button>
                    <button className="btn btn-primary">
                      <i className="bi bi-clipboard-check me-2"></i>Technical Assessment
                    </button>
                    <button className="btn btn-info">
                      <i className="bi bi-building me-2"></i>Schedule Inspection
                    </button>
                    <button className="btn btn-warning">
                      <i className="bi bi-file-earmark-bar-graph me-2"></i>Generate Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h5>Pending Assessments</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Application ID</th>
                          <th>Project Name</th>
                          <th>Owner</th>
                          <th>Document Type</th>
                          <th>Priority</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>BP-2024-004</td>
                          <td>High-Rise Residential</td>
                          <td>John Smith</td>
                          <td>Structural Plans</td>
                          <td><span className="badge bg-danger">High</span></td>
                          <td>
                            <button className="btn btn-sm btn-outline-success me-1">Review</button>
                            <button className="btn btn-sm btn-outline-primary">Details</button>
                          </td>
                        </tr>
                        <tr>
                          <td>BP-2024-005</td>
                          <td>Shopping Mall</td>
                          <td>ABC Developers</td>
                          <td>Electrical Plans</td>
                          <td><span className="badge bg-warning">Medium</span></td>
                          <td>
                            <button className="btn btn-sm btn-outline-success me-1">Review</button>
                            <button className="btn btn-sm btn-outline-primary">Details</button>
                          </td>
                        </tr>
                        <tr>
                          <td>BP-2024-006</td>
                          <td>Office Complex</td>
                          <td>XYZ Corp</td>
                          <td>Mechanical Plans</td>
                          <td><span className="badge bg-info">Low</span></td>
                          <td>
                            <button className="btn btn-sm btn-outline-success me-1">Review</button>
                            <button className="btn btn-sm btn-outline-primary">Details</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Assessments */}
          <div className="card">
            <div className="card-header">
              <h5>Recent Assessments</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Assessment Completed</strong>
                    <br />
                    <small className="text-muted">Structural assessment for BP-2024-003 approved</small>
                  </div>
                  <span className="badge bg-success">1 hour ago</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Site Inspection Scheduled</strong>
                    <br />
                    <small className="text-muted">Site inspection for BP-2024-004 scheduled for Jan 25</small>
                  </div>
                  <span className="badge bg-info">3 hours ago</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Technical Report Generated</strong>
                    <br />
                    <small className="text-muted">Technical report for BP-2024-002 completed</small>
                  </div>
                  <span className="badge bg-primary">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EngineerDashboard;
