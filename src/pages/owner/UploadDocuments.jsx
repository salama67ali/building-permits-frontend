// src/pages/owner/UploadDocuments.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import OwnerUpload from '../../components/OwnerUpload';
import DocumentList from '../../components/DocumentList';
import 'bootstrap/dist/css/bootstrap.min.css';

const apiBase = 'http://localhost:8080';

function UploadDocuments() {
  const navigate = useNavigate();
  const username = localStorage.getItem('currentUserUsername');
  const ownerId = Number(localStorage.getItem('currentUserId'));
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState('');

  const authHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    if (!ownerId) {
      setError('You must be logged in as OWNER.');
      return;
    }
    axios.get(`${apiBase}/api/projects/owner/${ownerId}`, { headers: authHeaders() })
      .then(({ data }) => {
        setProjects(Array.isArray(data) ? data : []);
        if (Array.isArray(data) && data.length > 0) {
          setSelectedProjectId(String(data[0].id));
        }
      })
      .catch(() => setError('Failed to load your projects.'));
  }, [ownerId]);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-primary text-white" style={{ width: '250px', minHeight: '100vh' }}>
        <div className="p-3">
          <h5 className="text-center mb-4">Owner Panel</h5>
          <nav className="nav flex-column">
            <a className="nav-link text-white" onClick={() => navigate('/owner')} style={{cursor: 'pointer'}}>
              <i className="bi bi-speedometer2 me-2"></i>Dashboard
            </a>
            <a className="nav-link text-white" onClick={() => navigate('/owner/apply-permit')} style={{cursor: 'pointer'}}>
              <i className="bi bi-plus-circle me-2"></i>New Application
            </a>
            <a className="nav-link text-white" onClick={() => navigate('/owner/view-applications')} style={{cursor: 'pointer'}}>
              <i className="bi bi-list-check me-2"></i>My Applications
            </a>
            <a className="nav-link text-white active" onClick={() => navigate('/owner/upload-documents')} style={{cursor: 'pointer'}}>
              <i className="bi bi-upload me-2"></i>Upload Documents
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        <Header username={username} />
        
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Upload Documents</h2>
            <button className="btn btn-outline-secondary" onClick={() => navigate('/owner')}>
              Back to Dashboard
            </button>
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          {/* Project Selector */}
          <div className="card mb-4">
            <div className="card-header"><h5>Select Project</h5></div>
            <div className="card-body">
              {projects.length === 0 ? (
                <div className="text-muted">No projects found. Please register a project first.</div>
              ) : (
                <div className="row g-2">
                  <div className="col-md-6">
                    <select
                      className="form-select"
                      value={selectedProjectId}
                      onChange={(e) => setSelectedProjectId(e.target.value)}
                    >
                      {projects.map(p => (
                        <option key={p.id} value={p.id}>
                          #{p.id} — {p.projectName} ({p.status?.toLowerCase()})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Upload Guidelines */}
          <div className="card mb-4">
            <div className="card-header">
              <h5>Document Upload Guidelines</h5>
            </div>
            <div className="card-body">
              <div className="alert alert-info">
                <h6>Required Documents:</h6>
                <ul className="mb-0">
                  <li><strong>ToR (Terms of Reference):</strong> PDF link</li>
                  <li><strong>Building Plans:</strong> Consultant will upload separately</li>
                </ul>
              </div>
              <div className="alert alert-warning">
                <strong>File Requirements:</strong> For now, backend accepts a URL (link) to the file.
              </div>
            </div>
          </div>

          {/* Upload Component */}
          <OwnerUpload
            projectId={selectedProjectId ? Number(selectedProjectId) : null}
            onUploaded={() => setRefreshKey(k => k + 1)}
          />

          {/* Document List */}
          <div className="card mt-4">
            <div className="card-header">
              <h5>Your Uploaded Documents</h5>
            </div>
            <div className="card-body">
              {selectedProjectId ? (
                <DocumentList projectId={Number(selectedProjectId)} refreshKey={refreshKey} />
              ) : (
                <div className="text-muted">Select a project to see its documents.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadDocuments;