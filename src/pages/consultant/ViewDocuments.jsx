import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';

function ViewDocuments() {
  const navigate = useNavigate();
  const username = localStorage.getItem('currentUserUsername');
  const [documents] = useState([
    { 
      id: 'DOC-001', 
      projectId: 'BP-2024-001', 
      type: 'Architectural Plans', 
      status: 'Approved', 
      uploadDate: '2024-01-15', 
      size: '2.5 MB',
      fileName: 'architectural_plans_v2.pdf',
      fileUrl: 'data:application/pdf;base64,JVBERi0xLjQKJcfsj6IKNSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA0NAo+PgpzdHJlYW0KQJQKMC4wNzUgMCAwIDAuMDc1IDAgMCBjbQovRjEgMTIgVGYKNzIgNzIwIFRkCihBcmNoaXRlY3R1cmFsIFBsYW5zKSBUagplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDU4IDAwMDAwIG4gCjAwMDAwMDAxMTUgMDAwMDAgbiAKMDAwMDAwMDIwNCAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDUKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjI5OAolJUVPRgo='
    },
    { 
      id: 'DOC-002', 
      projectId: 'BP-2024-002', 
      type: 'Structural Design', 
      status: 'Under Review', 
      uploadDate: '2024-01-18', 
      size: '4.2 MB',
      fileName: 'structural_design_v1.dwg',
      fileUrl: 'data:application/octet-stream;base64,QXV0b0NBRCA='
    },
    { 
      id: 'DOC-003', 
      projectId: 'BP-2024-003', 
      type: 'Electrical Plans', 
      status: 'Pending', 
      uploadDate: '2024-01-20', 
      size: '1.8 MB',
      fileName: 'electrical_plans.pdf',
      fileUrl: 'data:application/pdf;base64,JVBERi0xLjQKJcfsj6IKNSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA0NAo+PgpzdHJlYW0KQJQKMC4wNzUgMCAwIDAuMDc1IDAgMCBjbQovRjEgMTIgVGYKNzIgNzIwIFRkCihFbGVjdHJpY2FsIFBsYW5zKSBUagplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDU4IDAwMDAwIG4gCjAwMDAwMDAxMTUgMDAwMDAgbiAKMDAwMDAwMDIwNCAwMDAwMCBuIAp0cmFpbGVyCjw8Ci9TaXplIDUKL1Jvb3QgMSAwIFIKPj4Kc3RhcnR4cmVmCjI5OAolJUVPRgo='
    },
    { 
      id: 'DOC-004', 
      projectId: 'BP-2024-001', 
      type: 'HVAC Design', 
      status: 'Approved', 
      uploadDate: '2024-01-22', 
      size: '3.1 MB',
      fileName: 'hvac_design.pdf',
      fileUrl: 'data:application/pdf;base64,JVBERi0xLjQKJcfsj6IKNSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA0NAo+PgpzdHJlYW0KQJQKMC4wNzUgMCAwIDAuMDc1IDAgMCBjbQovRjEgMTIgVGYKNzIgNzIwIFRkCihIVkFDIERlc2lnbikgVGoKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyMDQgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA1Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgoyOTgKJSVFT0YK'
    }
  ]);

  const [filter, setFilter] = useState('all');

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
      link.download = doc.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert('File download not available');
    }
  };

  const handleEdit = (doc) => {
    alert(`Edit functionality for ${doc.fileName} will be implemented in future updates.`);
  };

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
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Document ID</th>
                      <th>Project ID</th>
                      <th>Document Type</th>
                      <th>Status</th>
                      <th>Upload Date</th>
                      <th>File Size</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredDocuments.map((doc) => (
                      <tr key={doc.id}>
                        <td>{doc.id}</td>
                        <td>{doc.projectId}</td>
                        <td>{doc.type}</td>
                        <td>
                          <span className={`badge ${
                            doc.status === 'Approved' ? 'bg-success' :
                            doc.status === 'Under Review' ? 'bg-info' :
                            'bg-warning'
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                        <td>{doc.uploadDate}</td>
                        <td>{doc.size}</td>
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
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="row mt-4">
            <div className="col-md-3">
              <div className="card bg-success text-white">
                <div className="card-body text-center">
                  <h4>{documents.filter(d => d.status === 'Approved').length}</h4>
                  <p className="mb-0">Approved</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-info text-white">
                <div className="card-body text-center">
                  <h4>{documents.filter(d => d.status === 'Under Review').length}</h4>
                  <p className="mb-0">Under Review</p>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-warning text-white">
                <div className="card-body text-center">
                  <h4>{documents.filter(d => d.status === 'Pending').length}</h4>
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