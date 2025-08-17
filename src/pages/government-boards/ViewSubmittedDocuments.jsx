import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';

function ViewSubmittedDocuments() {
  const navigate = useNavigate();
  const username = localStorage.getItem('currentUserUsername');
  const [documents, setDocuments] = useState([
    { 
      id: 'DOC-001', 
      projectId: 'BP-2024-001', 
      owner: 'John Doe', 
      type: 'Building Plans', 
      status: 'Pending Review', 
      date: '2024-01-15',
      fileName: 'building_plans_residential.pdf',
      fileUrl: 'data:application/pdf;base64,JVBERi0xLjQKJcfsj6IKNSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA0NAo+PgpzdHJlYW0KQJQKMC4wNzUgMCAwIDAuMDc1IDAgMCBjbQovRjEgMTIgVGYKNzIgNzIwIFRkCihCdWlsZGluZyBQbGFucykgVGoKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyMDQgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA1Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgoyOTgKJSVFT0YK'
    },
    { 
      id: 'DOC-002', 
      projectId: 'BP-2024-002', 
      owner: 'ABC Corp', 
      type: 'Site Survey', 
      status: 'Approved', 
      date: '2024-01-10',
      fileName: 'site_survey_commercial.pdf',
      fileUrl: 'data:application/pdf;base64,JVBERi0xLjQKJcfsj6IKNSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA0NAo+PgpzdHJlYW0KQJQKMC4wNzUgMCAwIDAuMDc1IDAgMCBjbQovRjEgMTIgVGYKNzIgNzIwIFRkCihTaXRlIFN1cnZleSkgVGoKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyMDQgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA1Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgoyOTgKJSVFT0YK'
    },
    { 
      id: 'DOC-003', 
      projectId: 'BP-2024-003', 
      owner: 'XYZ Ltd', 
      type: 'Environmental Impact', 
      status: 'Under Review', 
      date: '2024-01-20',
      fileName: 'environmental_assessment.pdf',
      fileUrl: 'data:application/pdf;base64,JVBERi0xLjQKJcfsj6IKNSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCA0NAo+PgpzdHJlYW0KQJQKMC4wNzUgMCAwIDAuMDc1IDAgMCBjbQovRjEgMTIgVGYKNzIgNzIwIFRkCihFbnZpcm9ubWVudGFsIEltcGFjdCkgVGoKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1OCAwMDAwMCBuIAowMDAwMDAwMTE1IDAwMDAwIG4gCjAwMDAwMDAyMDQgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA1Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgoyOTgKJSVFT0YK'
    }
  ]);

  const [processingAction, setProcessingAction] = useState(null);

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

  const handleApprove = async (docId) => {
    setProcessingAction(`approve-${docId}`);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setDocuments(prevDocs => 
        prevDocs.map(doc => 
          doc.id === docId 
            ? { ...doc, status: 'Approved' }
            : doc
        )
      );
      
      alert('✅ Document approved successfully!');
    } catch (error) {
      alert('❌ Failed to approve document. Please try again.');
    } finally {
      setProcessingAction(null);
    }
  };

  const handleReject = async (docId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;
    
    setProcessingAction(`reject-${docId}`);
    
    try {
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setDocuments(prevDocs => 
        prevDocs.map(doc => 
          doc.id === docId 
            ? { ...doc, status: 'Rejected', rejectionReason: reason }
            : doc
        )
      );
      
      alert(`❌ Document rejected. Reason: ${reason}`);
    } catch (error) {
      alert('❌ Failed to reject document. Please try again.');
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
      {/* Sidebar */}
      <div className="bg-dark text-white" style={{ width: '280px', minHeight: '100vh' }}>
        <div className="p-3">
          <div className="text-center mb-4">
            <h4 className="fw-bold text-warning">Government Panel</h4>
            <small className="text-muted">Building Permits Authority</small>
          </div>
          <nav className="nav flex-column">
            <a className="nav-link text-white hover-bg-secondary rounded mb-1" onClick={() => navigate('/government-boards')} style={{cursor: 'pointer', fontWeight: '500'}}>
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

      {/* Main Content */}
      <div className="flex-grow-1">
        <Header username={username} />
        
        <div className="p-4" style={{backgroundColor: '#f8f9fa', minHeight: '100vh'}}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="fw-bold text-dark mb-1">Review Submitted Documents</h1>
              <p className="text-muted mb-0">Review and process building permit applications</p>
            </div>
            <button className="btn btn-outline-secondary" onClick={() => navigate('/government-boards')}>
              <i className="bi bi-arrow-left me-2"></i>Back to Dashboard
            </button>
          </div>

          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold text-dark">Documents Awaiting Review</h5>
                  <small className="text-muted">Process applications and update statuses</small>
                </div>
                <span className="badge bg-warning fs-6">{documents.filter(d => d.status === 'Pending Review').length} pending</span>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="fw-semibold">Document ID</th>
                      <th className="fw-semibold">Project ID</th>
                      <th className="fw-semibold">Owner</th>
                      <th className="fw-semibold">Document Type</th>
                      <th className="fw-semibold">Status</th>
                      <th className="fw-semibold">Submitted Date</th>
                      <th className="fw-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.map((doc) => (
                      <tr key={doc.id}>
                        <td><span className="fw-medium text-primary">{doc.id}</span></td>
                        <td><span className="fw-medium text-secondary">{doc.projectId}</span></td>
                        <td>{doc.owner}</td>
                        <td>
                          <span className="badge bg-info-subtle text-info-emphasis">
                            {doc.type}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${
                            doc.status === 'Approved' ? 'bg-success-subtle text-success-emphasis' :
                            doc.status === 'Pending Review' ? 'bg-warning-subtle text-warning-emphasis' :
                            doc.status === 'Rejected' ? 'bg-danger-subtle text-danger-emphasis' :
                            'bg-info-subtle text-info-emphasis'
                          }`}>
                            {doc.status}
                          </span>
                        </td>
                        <td>{new Date(doc.date).toLocaleDateString()}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <button 
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => handleView(doc)}
                              title="View document"
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleDownload(doc)}
                              title="Download document"
                            >
                              <i className="bi bi-download"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-success"
                              onClick={() => handleApprove(doc.id)}
                              disabled={processingAction === `approve-${doc.id}` || doc.status === 'Approved'}
                              title="Approve document"
                            >
                              {processingAction === `approve-${doc.id}` ? (
                                <span className="spinner-border spinner-border-sm" role="status"></span>
                              ) : (
                                <i className="bi bi-check-lg"></i>
                              )}
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleReject(doc.id)}
                              disabled={processingAction === `reject-${doc.id}` || doc.status === 'Rejected'}
                              title="Reject document"
                            >
                              {processingAction === `reject-${doc.id}` ? (
                                <span className="spinner-border spinner-border-sm" role="status"></span>
                              ) : (
                                <i className="bi bi-x-lg"></i>
                              )}
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
        </div>
      </div>
    </div>
  );
}

export default ViewSubmittedDocuments;