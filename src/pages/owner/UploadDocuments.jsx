import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import OwnerUpload from '../../components/OwnerUpload';
import DocumentList from '../../components/DocumentList';
import 'bootstrap/dist/css/bootstrap.min.css';

function UploadDocuments() {
  const navigate = useNavigate();
  const username = localStorage.getItem('currentUserUsername');
  const userId = localStorage.getItem('currentUserId');
  const [refreshKey, setRefreshKey] = useState(0);

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

          <div className="row">
            <div className="col-12">
              <div className="card mb-4">
                <div className="card-header">
                  <h5>Document Upload Guidelines</h5>
                </div>
                <div className="card-body">
                  <div className="alert alert-info">
                    <h6>Required Documents:</h6>
                    <ul className="mb-0">
                      <li><strong>Building Plans:</strong> Architectural drawings in PDF or DWG format</li>
                      <li><strong>Site Survey:</strong> Land survey documents</li>
                      <li><strong>Environmental Impact:</strong> Environmental assessment reports</li>
                      <li><strong>Structural Plans:</strong> Engineering drawings and calculations</li>
                      <li><strong>Permits:</strong> Any existing permits or approvals</li>
                    </ul>
                  </div>
                  <div className="alert alert-warning">
                    <strong>File Requirements:</strong> Maximum file size 10MB. Accepted formats: PDF, DOC, DOCX, DWG, DXF, PNG, JPG, JPEG
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Upload Component */}
          <OwnerUpload userId={userId} onUploaded={() => setRefreshKey((k) => k + 1)} />

          {/* Document List */}
          <div className="card">
            <div className="card-header">
              <h5>Your Uploaded Documents</h5>
            </div>
            <div className="card-body">
              <DocumentList role="owner" userId={userId} refreshKey={refreshKey} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadDocuments;