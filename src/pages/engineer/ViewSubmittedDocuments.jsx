import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';

function ViewSubmittedDocuments() {
  const navigate = useNavigate();
  const username = localStorage.getItem('currentUserUsername');
  const [documents] = useState([
    { id: 'DOC-001', projectId: 'BP-2024-001', owner: 'John Doe', type: 'Structural Plans', status: 'Pending Review', date: '2024-01-15', priority: 'High' },
    { id: 'DOC-002', projectId: 'BP-2024-002', owner: 'ABC Corp', type: 'Foundation Design', status: 'Approved', date: '2024-01-10', priority: 'Medium' },
    { id: 'DOC-003', projectId: 'BP-2024-003', owner: 'XYZ Ltd', type: 'Load Calculations', status: 'Under Review', date: '2024-01-20', priority: 'High' }
  ]);

  const [filter, setFilter] = useState('all');

  const filteredDocuments = documents.filter(doc => 
    filter === 'all' || doc.status.toLowerCase().replace(' ', '-') === filter
  );

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-success text-white" style={{ width: '250px', minHeight: '100vh' }}>
        <div className="p-3">
          <h5 className="text-center mb-4">Engineer Panel</h5>
          <nav className="nav flex-column">
            <a className="nav-link text-white" onClick={() => navigate('/engineer')} style={{cursor: 'pointer'}}>
              <i className="bi bi-speedometer2 me-2"></i>Dashboard
            </a>
            <a className="nav-link text-white active" onClick={() => navigate('/engineer/view-submitted-documents')} style={{cursor: 'pointer'}}>
              <i className="bi bi-file-earmark-text me-2"></i>Review Documents
            </a>
            <a className="nav-link text-white" href="#calculations">
              <i className="bi bi-calculator me-2"></i>Calculations
            </a>
            <a className="nav-link text-white" href="#approvals">
              <i className="bi bi-check-circle me-2"></i>Approvals
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
            <button className="btn btn-outline-secondary" onClick={() => navigate('/engineer')}>
              Back to Dashboard
            </button>
          </div>

          {/* Filter Controls */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h5 className="mb-0">Engineering Review Queue</h5>
                  <small className="text-muted">Review structural and technical documents</small>
                </div>
                <div className="col-md-6">
                  <div className="d-flex gap-2 justify-content-end">
                    <select 
                      className="form-select" 
                      style={{width: 'auto'}}
                      value={filter} 
                      onChange={(e) => setFilter(e.target.value)}
                    >
                      <option value="all">All Documents</option>
                      <option value="pending-review">Pending Review</option>
                      <option value="under-review">Under Review</option>
                      <option value="approved">Approved</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Table */}
          <div className="card">
            <div className="card-header">
              <h5>Documents for Review ({filteredDocuments.length})</h5>
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
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Submitted Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocuments.map((doc) => (
                      <tr key={doc.id}>
                        <td>{doc.id}</td>
                        <td>{doc.projectId}</td>
                        <td>{doc.owner}</td>
                        <td>{doc.type}</td>
                        <td>
                          <span className={`badge ${
                            doc.priority === 'High' ? 'bg-danger' :
                            doc.priority === 'Medium' ? 'bg-warning' :
                            'bg-secondary'
                          }`}>
                            {doc.priority}
                          </span>
                        </td>
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
                          <div className="btn-group" role="group">
                            <button className="btn btn-sm btn-outline-primary">
                              <i className="bi bi-eye"></i> Review
                            </button>
                            <button className="btn btn-sm btn-outline-success">
                              <i className="bi bi-check"></i> Approve
                            </button>
                            <button className="btn btn-sm btn-outline-danger">
                              <i className="bi bi-x"></i> Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Review Guidelines */}
          <div className="row mt-4">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h5>Engineering Review Guidelines</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <h6>Structural Review Checklist:</h6>
                      <ul className="small">
                        <li>Load calculations accuracy</li>
                        <li>Material specifications compliance</li>
                        <li>Foundation design adequacy</li>
                        <li>Seismic considerations</li>
                        <li>Building code compliance</li>
                      </ul>
                    </div>
                    <div className="col-md-6">
                      <h6>Documentation Requirements:</h6>
                      <ul className="small">
                        <li>Complete structural drawings</li>
                        <li>Engineering calculations</li>
                        <li>Material test reports</li>
                        <li>Soil investigation reports</li>
                        <li>Professional engineer seal</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h5>Review Statistics</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Pending Review</span>
                      <span className="badge bg-warning">{documents.filter(d => d.status === 'Pending Review').length}</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Under Review</span>
                      <span className="badge bg-info">{documents.filter(d => d.status === 'Under Review').length}</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Approved</span>
                      <span className="badge bg-success">{documents.filter(d => d.status === 'Approved').length}</span>
                    </div>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <strong>Total Documents</strong>
                    <span className="badge bg-primary">{documents.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewSubmittedDocuments;