// src/pages/consultant/ViewDocuments.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE = 'http://localhost:8080';

function ViewDocuments() {
  const navigate = useNavigate();
  const username = localStorage.getItem('currentUserUsername');
  const consultantId = Number(localStorage.getItem('currentUserId'));
  
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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
      const response = await axios.get(`${API_BASE}/api/documents/consultant/${consultantId}`, { 
        headers: authHeaders() 
      });
      setDocuments(response.data);
    } catch (err) {
      console.error('Error fetching documents:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocuments = documents.filter(doc => 
    filter === 'all' || doc.status.toLowerCase().replace(' ', '-') === filter
  );

  const handleView = (doc) => {
    if (doc.fileUrl) {
      window.open(doc.fileUrl, '_blank');
    } else {
      alert('File preview not available');
    }
  };

  const handleDownload = (doc) => {
    if (doc.fileUrl) {
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      link.download = doc.fileName || `document_${doc.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('File download not available');
    }
  };

  const handleEdit = (doc) => {
    alert(`Edit functionality for ${doc.fileName || doc.id} will be implemented in future updates.`);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-info text-white" style={{ width: '250px', minHeight: '100vh' }}>
        <div className="p-3">
          <h5 className="text-center mb-4">Consultant Panel</h5>
          <nav className="nav flex-column">
            <a className="nav-link text-white" onClick={() => navigate('/consultant')} style={{cursor: 'pointer'}}>
              <i className="bi bi-speedometer2 me-2"></i>Dashboard
            </a>
            <a className="nav-link text-white" onClick={() => navigate('/consultant/upload-building-plan-design')} style={{cursor: 'pointer'}}>
              <i className="bi bi-upload me-2"></i>Upload Designs
            </a>
            <a className="nav-link text-white active" onClick={() => navigate('/consultant/view-documents')} style={{cursor: 'pointer'}}>
              <i className="bi bi-folder me-2"></i>View Documents
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        <Header username={username} />
        
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>View Documents</h2>
            <button className="btn btn-outline-secondary" onClick={() => navigate('/consultant')}>
              Back to Dashboard
            </button>
          </div>

          {/* Filter Controls */}
          <div className="card mb-4">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <h5 className="mb-0">Document Library</h5>
                  <small className="text-muted">Manage and review your uploaded designs</small>
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
                      <option value="approved">Approved</option>
                      <option value="under-review">Under Review</option>
                      <option value="pending">Pending</option>
                    </select>
                    <button className="btn btn-info" onClick={() => navigate('/consultant/upload-building-plan-design')}>
                      <i className="bi bi-plus me-2"></i>Upload New
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Table */}
          <div className="card">
            <div className="card-header">
              <h5>Your Documents ({filteredDocuments.length})</h5>
            </div>
            <div className="card-body">
              {filteredDocuments.length === 0 ? (
                <div className="text-center py-4">
                  <i className="bi bi-folder-x display-1 text-muted"></i>
                  <p className="text-muted">No documents found</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Document ID</th>
                        <th>Project</th>
                        <th>Document Type</th>
                        <th>Status</th>
                        <th>Upload Date</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredDocuments.map((doc) => (
                        <tr key={doc.id}>
                          <td>{doc.id}</td>
                          <td>{doc.project?.projectName || 'N/A'}</td>
                          <td>{doc.designType || 'Document'}</td>
                          <td>
                            <span className={`badge ${
                              doc.status === 'APPROVED' ? 'bg-success' :
                              doc.status === 'UNDER_REVIEW' ? 'bg-info' :
                              'bg-warning'
                            }`}>
                              {doc.status?.replace('_', ' ')}
                            </span>
                          </td>
                          <td>{new Date(doc.uploadDate).toLocaleDateString()}</td>
                          <td>
                            <div className="btn-group" role="group">
                              <button 
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => handleView(doc)}
                                title="View document"
                              >
                                <i className="bi bi-eye"></i> View
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-success"
                                onClick={() => handleDownload(doc)}
                                title="Download document"
                              >
                                <i className="bi bi-download"></i> Download
                              </button>
                              <button 
                                className="btn btn-sm btn-outline-secondary"
                                onClick={() => handleEdit(doc)}
                                title="Edit document"
                              >
                                <i className="bi bi-pencil"></i> Edit
                              </button>
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

          {/* Statistics Cards */}
          <div className="row mt-4">
            <div className="col-md-3">
              <div className="card bg-success text-white">
                <div className="card-body text-center">
                  <h4>{documents.filter(d => d.status === 'APPROVED').length}</h4>
                  <p className="mb-0">Approved</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-info text-white">
                <div className="card-body text-center">
                  <h4>{documents.filter(d => d.status === 'UNDER_REVIEW').length}</h4>
                  <p className="mb-0">Under Review</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-warning text-white">
                <div className="card-body text-center">
                  <h4>{documents.filter(d => d.status === 'PENDING').length}</h4>
                  <p className="mb-0">Pending</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-primary text-white">
                <div className="card-body text-center">
                  <h4>{documents.length}</h4>
                  <p className="mb-0">Total Documents</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewDocuments;