import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';

function ViewSubmissions() {
  const navigate = useNavigate();
  const username = localStorage.getItem('currentUserUsername');
  const [submissions] = useState([
    { id: 'BP-2024-001', projectName: 'Residential Building', owner: 'John Doe', status: 'Pending', date: '2024-01-15' },
    { id: 'BP-2024-002', projectName: 'Commercial Complex', owner: 'ABC Corp', status: 'Approved', date: '2024-01-10' },
    { id: 'BP-2024-003', projectName: 'Industrial Warehouse', owner: 'XYZ Ltd', status: 'Under Review', date: '2024-01-20' }
  ]);

  return (
    <div className="d-flex flex-column flex-md-row">
      {/* Sidebar */}
      <div className="bg-dark text-white d-none d-md-block" style={{ width: '250px', minHeight: '100vh' }}>
        <div className="p-3">
          <h5 className="text-center mb-4">Admin Panel</h5>
          <nav className="nav flex-column">
            <a className="nav-link text-white" onClick={() => navigate('/admin')} style={{cursor: 'pointer'}}>
              <i className="bi bi-speedometer2 me-2"></i>Dashboard
            </a>
            <a className="nav-link text-white" onClick={() => navigate('/admin/manage-users')} style={{cursor: 'pointer'}}>
              <i className="bi bi-people me-2"></i>Manage Users
            </a>
            <a className="nav-link text-white active" onClick={() => navigate('/admin/view-submissions')} style={{cursor: 'pointer'}}>
              <i className="bi bi-file-earmark-text me-2"></i>Applications
            </a>
            <a className="nav-link text-white" onClick={() => navigate('/admin/send-notifications')} style={{cursor: 'pointer'}}>
              <i className="bi bi-bell me-2"></i>Send Notifications
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        <Header username={username} />
        
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>View Submissions</h2>
            <button className="btn btn-outline-secondary" onClick={() => navigate('/admin')}>
              Back to Dashboard
            </button>
          </div>

          <div className="card">
            <div className="card-header">
              <h5>All Application Submissions</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Permit ID</th>
                      <th>Project Name</th>
                      <th>Owner</th>
                      <th>Status</th>
                      <th>Submission Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {submissions.map((submission) => (
                      <tr key={submission.id}>
                        <td>{submission.id}</td>
                        <td>{submission.projectName}</td>
                        <td>{submission.owner}</td>
                        <td>
                          <span className={`badge ${
                            submission.status === 'Approved' ? 'bg-success' :
                            submission.status === 'Pending' ? 'bg-warning' :
                            'bg-info'
                          }`}>
                            {submission.status}
                          </span>
                        </td>
                        <td>{submission.date}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-1">View</button>
                          <button className="btn btn-sm btn-outline-success me-1">Approve</button>
                          <button className="btn btn-sm btn-outline-danger">Reject</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewSubmissions;