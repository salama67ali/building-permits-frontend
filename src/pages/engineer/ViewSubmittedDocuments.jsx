// src/pages/engineer/ViewSubmittedDocuments.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE = 'http://localhost:8080';

function ViewSubmittedDocuments() {
  const navigate = useNavigate();
  const username = localStorage.getItem('currentUserUsername');
  const engineerId = Number(localStorage.getItem('currentUserId'));
  
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [reviewModal, setReviewModal] = useState(false);
  const [reviewData, setReviewData] = useState({
    status: '',
    comments: '',
    technicalNotes: ''
  });

  const authHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      // Fetch documents assigned to engineers for review
      const response = await axios.get(`${API_BASE}/api/documents/engineer/review`, { 
        headers: authHeaders() 
      });
      setDocuments(response.data);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc => {
    if (filter === 'all') return true;
    return doc.status.toLowerCase().replace('_', '-') === filter;
  });

  const handleReview = (doc) => {
    setSelectedDoc(doc);
    setReviewData({
      status: doc.status === 'PENDING' ? 'UNDER_REVIEW' : doc.status,
      comments: '',
      technicalNotes: ''
    });
    setReviewModal(true);
  };

  const handleApprove = async (doc) => {
    try {
      await axios.patch(`${API_BASE}/api/documents/${doc.id}/status`, {
        status: 'APPROVED',
        engineerId: engineerId,
        reviewDate: new Date().toISOString(),
        comments: 'Document approved by engineer'
      }, { headers: authHeaders() });
      
      setStatus('Document approved successfully!');
      fetchDocuments(); // Refresh the list
    } catch (err) {
      setError('Failed to approve document: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleReject = async (doc) => {
    try {
      await axios.patch(`${API_BASE}/api/documents/${doc.id}/status`, {
        status: 'REJECTED',
        engineerId: engineerId,
        reviewDate: new Date().toISOString(),
        comments: 'Document rejected by engineer'
      }, { headers: authHeaders() });
      
      setStatus('Document rejected successfully!');
      fetchDocuments(); // Refresh the list
    } catch (err) {
      setError('Failed to reject document: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleReviewSubmit = async () => {
    if (!reviewData.status || !reviewData.comments) {
      setError('Please provide status and comments');
      return;
    }

    try {
      await axios.patch(`${API_BASE}/api/documents/${selectedDoc.id}/status`, {
        status: reviewData.status,
        engineerId: engineerId,
        reviewDate: new Date().toISOString(),
        comments: reviewData.comments,
        technicalNotes: reviewData.technicalNotes
      }, { headers: authHeaders() });
      
      setStatus('Document review submitted successfully!');
      setReviewModal(false);
      setSelectedDoc(null);
      fetchDocuments(); // Refresh the list
    } catch (err) {
      setError('Failed to submit review: ' + (err.response?.data?.message || err.message));
    }
  };

  const getPriorityBadge = (priority) => {
    const priorityMap = {
      'HIGH': 'bg-danger',
      'MEDIUM': 'bg-warning',
      'LOW': 'bg-secondary'
    };
    return priorityMap[priority] || 'bg-secondary';
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      'APPROVED': 'bg-success',
      'REJECTED': 'bg-danger',
      'UNDER_REVIEW': 'bg-info',
      'PENDING': 'bg-warning'
    };
    return statusMap[status] || 'bg-secondary';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-success" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

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
                      <option value="pending">Pending Review</option>
                      <option value="under-review">Under Review</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
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
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-folder-check display-1 text-muted"></i>
                  <p className="text-muted">No documents found for review</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Document ID</th>
                        <th>Project</th>
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
                          <td>{doc.project?.projectName || 'N/A'}</td>
                          <td>{doc.owner?.username || 'N/A'}</td>
                          <td>{doc.designType || 'Document'}</td>
                          <td>
                            <span className={`badge ${getPriorityBadge(doc.priority)}`}>
                              {doc.priority || 'MEDIUM'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${getStatusBadge(doc.status)}`}>
                              {doc.status?.replace('_', ' ')}
                            </span>
                          </td>
                          <td>{new Date(doc.uploadDate).toLocaleDateString()}</td>
                          <td>
                            <div className="btn-group" role="group">
                              <button 
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleReview(doc)}
                                title="Review document"
                              >
                                <i className="bi bi-eye"></i> Review
                              </button>
                              {doc.status === 'PENDING' && (
                                <>
                                  <button 
                                    className="btn btn-sm btn-outline-success"
                                    onClick={() => handleApprove(doc)}
                                    title="Approve document"
                                  >
                                    <i className="bi bi-check"></i> Approve
                                  </button>
                                  <button 
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleReject(doc)}
                                    title="Reject document"
                                  >
                                    <i className="bi bi-x"></i> Reject
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
                      <span className="badge bg-warning">{documents.filter(d => d.status === 'PENDING').length}</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Under Review</span>
                      <span className="badge bg-info">{documents.filter(d => d.status === 'UNDER_REVIEW').length}</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Approved</span>
                      <span className="badge bg-success">{documents.filter(d => d.status === 'APPROVED').length}</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Rejected</span>
                      <span className="badge bg-danger">{documents.filter(d => d.status === 'REJECTED').length}</span>
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

      {/* Review Modal */}
      {reviewModal && selectedDoc && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Review Document - {selectedDoc.id}</h5>
                <button type="button" className="btn-close" onClick={() => setReviewModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>Project:</strong> {selectedDoc.project?.projectName}
                  </div>
                  <div className="col-md-6">
                    <strong>Document Type:</strong> {selectedDoc.designType}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <strong>Owner:</strong> {selectedDoc.owner?.username}
                  </div>
                  <div className="col-md-6">
                    <strong>Upload Date:</strong> {new Date(selectedDoc.uploadDate).toLocaleDateString()}
                  </div>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Review Status *</label>
                  <select 
                    className="form-select" 
                    value={reviewData.status} 
                    onChange={(e) => setReviewData({...reviewData, status: e.target.value})}
                  >
                    <option value="">Select Status</option>
                    <option value="APPROVED">Approve</option>
                    <option value="REJECTED">Reject</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Review Comments *</label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    value={reviewData.comments} 
                    onChange={(e) => setReviewData({...reviewData, comments: e.target.value})}
                    placeholder="Provide detailed review comments..."
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label className="form-label">Technical Notes</label>
                  <textarea 
                    className="form-control" 
                    rows="3" 
                    value={reviewData.technicalNotes} 
                    onChange={(e) => setReviewData({...reviewData, technicalNotes: e.target.value})}
                    placeholder="Additional technical observations..."
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setReviewModal(false)}>
                  Cancel
                </button>
                <button type="button" className="btn btn-success" onClick={handleReviewSubmit}>
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Backdrop */}
      {reviewModal && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
}

export default ViewSubmittedDocuments;