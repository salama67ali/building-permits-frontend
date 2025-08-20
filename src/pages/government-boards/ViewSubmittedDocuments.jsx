// src/pages/government-boards/ViewSubmittedDocuments.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE = 'http://localhost:8080';

function ViewSubmittedDocuments() {
  const navigate = useNavigate();
  const username = localStorage.getItem('currentUserUsername');
  const [documents, setDocuments] = useState([]);
  const [processingAction, setProcessingAction] = useState(null);
  const [projectIdQuery, setProjectIdQuery] = useState('');
  const [error, setError] = useState('');

  const authHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadProjectDocuments = async (projectId) => {
    setError('');
    try {
      const resp = await axios.get(`${API_BASE}/api/projects/${projectId}/documents`, {
        headers: authHeaders()
      });
      // Normalize for UI
      const items = (resp.data || []).map(d => ({
        id: d.id,
        projectId: d.projectId,
        owner: d.uploadedBy || 'N/A',
        type: d.name || 'Document',
        status: 'Pending Review',
        date: d.uploadedAt ? new Date(d.uploadedAt).toISOString().slice(0,10) : '',
        fileName: d.name || `document_${d.id}`,
        fileUrl: d.url || ''
      }));
      setDocuments(items);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load documents (check project id and permissions)');
    }
  };

  const handleDownload = (doc) => {
    if (doc.fileUrl) {
      const link = document.createElement('a');
      link.href = doc.fileUrl;
      link.download = doc.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('File not available for download');
    }
  };

  // Approve/Reject at project level (GovernmentBoard decision API)
  const handleApprove = async (doc) => {
    setProcessingAction(`approve-${doc.projectId}`);
    try {
      await axios.post(`${API_BASE}/api/government-board/projects/${doc.projectId}/decision`, {
        decision: 'APPROVE',
        notes: `Approved by ${username}`
      }, { headers: { ...authHeaders(), 'Content-Type': 'application/json' }});
      alert('✅ Project approved successfully!');
    } catch (error) {
      alert(error.response?.data?.message || '❌ Failed to approve project.');
    } finally {
      setProcessingAction(null);
    }
  };

  const handleReject = async (doc) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;
    setProcessingAction(`reject-${doc.projectId}`);
    try {
      await axios.post(`${API_BASE}/api/government-board/projects/${doc.projectId}/decision`, {
        decision: 'REJECT',
        notes: reason
      }, { headers: { ...authHeaders(), 'Content-Type': 'application/json' }});
      alert(`❌ Project rejected. Reason: ${reason}`);
    } catch (error) {
      alert(error.response?.data?.message || '❌ Failed to reject project.');
    } finally {
      setProcessingAction(null);
    }
  };

  const handleView = (doc) => {
    if (doc.fileUrl) {
      window.open(doc.fileUrl, '_blank');
    } else {
      alert('File preview not available');
    }
  };

  return (
    <div className="d-flex">
      <div className="bg-dark text-white" style={{ width: '280px', minHeight: '100vh' }}>
        <div className="p-3">
          <div className="text-center mb-4">
            <h4 className="fw-bold text-warning">Government Panel</h4>
            <small className="text-muted">Building Permits Authority</small>
          </div>
          <nav className="nav flex-column">
            <a className="nav-link text-white" onClick={() => navigate('/government-boards')} style={{cursor: 'pointer', fontWeight: '500'}}>
              <i className="bi bi-speedometer2 me-2"></i>Dashboard
            </a>
            <a className="nav-link text-white active bg-warning text-dark rounded mb-1" onClick={() => navigate('/government-boards/view-submitted-documents')} style={{cursor: 'pointer', fontWeight: '500'}}>
              <i className="bi bi-file-earmark-text me-2"></i>Review Applications
            </a>
            <a className="nav-link text-white hover-bg-secondary rounded mb-1" onClick={() => navigate('/government-boards/send-notification')} style={{cursor: 'pointer', fontWeight: '500'}}>
              <i className="bi bi-send me-2"></i>Send Notifications
            </a>
          </nav>
        </div>
      </div>

      <div className="flex-grow-1">
        <Header username={username} />
        <div className="p-4" style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="fw-bold text-dark mb-1">Review Submitted Documents</h1>
              <p className="text-muted mb-0">Load a project, review files, and decide at project level</p>
            </div>
            <button className="btn btn-outline-secondary" onClick={() => navigate('/government-boards')}>
              <i className="bi bi-arrow-left me-2"></i>Back to Dashboard
            </button>
          </div>

          <div className="card mb-3">
            <div className="card-body d-flex gap-2 align-items-end">
              <div>
                <label className="form-label">Project ID</label>
                <input
                  className="form-control"
                  value={projectIdQuery}
                  onChange={(e) => setProjectIdQuery(e.target.value)}
                  placeholder="Enter project ID (number)"
                />
              </div>
              <button
                className="btn btn-primary"
                onClick={() => projectIdQuery && loadProjectDocuments(projectIdQuery)}
              >
                Load Documents
              </button>
            </div>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold text-dark">Documents</h5>
                  <small className="text-muted">Process application files and update project status</small>
                </div>
                <span className="badge bg-primary fs-6">{documents.length} files</span>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Document ID</th>
                      <th>Project ID</th>
                      <th>Uploader</th>
                      <th>Document</th>
                      <th>Submitted</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.id}>
                        <td className="text-primary">{doc.id}</td>
                        <td className="text-secondary">{doc.projectId}</td>
                        <td>{doc.owner}</td>
                        <td>{doc.type}</td>
                        <td>{doc.date ? new Date(doc.date).toLocaleDateString() : '-'}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <button className="btn btn-sm btn-outline-secondary" onClick={() => handleView(doc)} title="View document">
                              <i className="bi bi-eye"></i>
                            </button>
                            <button className="btn btn-sm btn-outline-primary" onClick={() => handleDownload(doc)} title="Download document">
                              <i className="bi bi-download"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-success"
                              onClick={() => handleApprove(doc)}
                              disabled={processingAction === `approve-${doc.projectId}`}
                              title="Approve project"
                            >
                              {processingAction === `approve-${doc.projectId}` ? (
                                <span className="spinner-border spinner-border-sm" role="status"></span>
                              ) : (
                                <i className="bi bi-check-lg"></i>
                              )}
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleReject(doc)}
                              disabled={processingAction === `reject-${doc.projectId}`}
                              title="Reject project"
                            >
                              {processingAction === `reject-${doc.projectId}` ? (
                                <span className="spinner-border spinner-border-sm" role="status"></span>
                              ) : (
                                <i className="bi bi-x-lg"></i>
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {documents.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-4">No documents loaded</td>
                      </tr>
                    )}
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