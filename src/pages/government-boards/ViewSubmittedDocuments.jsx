import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';

function ViewSubmittedDocuments() {
  const navigate = useNavigate();
  const username = localStorage.getItem('currentUserUsername');
  const [documents] = useState([
    { id: 'DOC-001', projectId: 'BP-2024-001', owner: 'John Doe', type: 'Building Plans', status: 'Pending Review', date: '2024-01-15' },
    { id: 'DOC-002', projectId: 'BP-2024-002', owner: 'ABC Corp', type: 'Site Survey', status: 'Approved', date: '2024-01-10' },
    { id: 'DOC-003', projectId: 'BP-2024-003', owner: 'XYZ Ltd', type: 'Environmental Impact', status: 'Under Review', date: '2024-01-20' }
  ]);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-warning text-dark" style={{ width: '250px', minHeight: '100vh' }}>
        <div className="p-3">
          <h5 className="text-center mb-4">Government Panel</h5>
          <nav className="nav flex-column">
            <a className="nav-link text-dark" onClick={() => navigate('/government-boards')} style={{cursor: 'pointer'}}>
              <i className="bi bi-speedometer2 me-2"></i>Dashboard
            </a>
            <a className="nav-link text-dark active" onClick={() => navigate('/government-boards/view-submitted-documents')} style={{cursor: 'pointer'}}>
              <i className="bi bi-file-earmark-text me-2"></i>Review Applications
            </a>
            <a className="nav-link text-dark" onClick={() => navigate('/government-boards/send-notification')} style={{cursor: 'pointer'}}>
              <i className="bi bi-send me-2"></i>Send Notifications
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        <Header username={username} />
        
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Review Submitted Documents</h2>
            <button className="btn btn-outline-secondary" onClick={() => navigate('/government-boards')}>
              Back to Dashboard
            </button>
          </div>

          <div className="card">
            <div className="card-header">
              <h5>Documents Awaiting Review</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Document ID</th>
                      <th>Project ID</th>
                      <th>Owner</th>
                      <th>Document Type</th>
                      <th>Status</th>
                      <th>Submitted Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.id}>
                        <td>{doc.id}</td>
                        <td>{doc.projectId}</td>
                        <td>{doc.owner}</td>
                        <td>{doc.type}</td>
                        <td>
                          <span className={`badge ${
                            doc.status === 'Approved' ? 'bg-success' :
                            doc.status === 'Pending Review' ? 'bg-warning' :
                            'bg-info'
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                        <td>{doc.date}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-1">Download</button>
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

export default ViewSubmittedDocuments;