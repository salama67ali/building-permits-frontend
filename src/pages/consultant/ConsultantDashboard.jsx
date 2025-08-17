import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header";
import 'bootstrap/dist/css/bootstrap.min.css';

function ConsultantDashboard() {
  const username = localStorage.getItem('currentUserUsername');
  const navigate = useNavigate();
  const [stats] = useState({
    totalProjects: 12,
    activeProjects: 8,
    completedProjects: 4,
    pendingReviews: 3
  });

  // Terms of Reference received from owners
  const [receivedToRs, setReceivedToRs] = useState([
    {
      id: 'TOR-2024-001',
      projectId: 'BP-2024-007',
      projectName: 'Luxury Hotel Development',
      ownerName: 'Hotel Corp Ltd',
      receivedDate: '2024-01-15',
      status: 'New',
      documentUrl: 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO4CjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nHVUy27CMBD8lT1XyE7iJD5WFKhUqVKlPfTWm+XYm2Bl24u9Ier/1+tHSx+AJc/szOzMrr0BAA==',
      priority: 'High'
    },
    {
      id: 'TOR-2024-002',
      projectId: 'BP-2024-008',
      projectName: 'Medical Center Complex',
      ownerName: 'HealthCare Inc',
      receivedDate: '2024-01-18',
      status: 'In Review',
      documentUrl: 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO4CjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nHVUy27CMBD8lT1XyE7iJD5WFKhUqVKlPfTWm+XYm2Bl24u9Ier/1+tHSx+AJc/szOzMrr0BAA==',
      priority: 'Medium'
    },
    {
      id: 'TOR-2024-003',
      projectId: 'BP-2024-009',
      projectName: 'Educational Complex',
      ownerName: 'Education Foundation',
      receivedDate: '2024-01-20',
      status: 'Building Plan Submitted',
      documentUrl: 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO4CjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nHVUy27CMBD8lT1XyE7iJD5WFKhUqVKlPfTWm+XYm2Bl24u9Ier/1+tHSx+AJc/szOzMrr0BAA==',
      priority: 'High'
    }
  ]);

  const [buildingPlans, setBuildingPlans] = useState([
    {
      id: 'BP-PLAN-001',
      torId: 'TOR-2024-003',
      projectName: 'Educational Complex',
      fileName: 'Educational_Complex_Building_Plan.pdf',
      uploadDate: '2024-01-22',
      status: 'Submitted',
      seenByEngineer: false,
      engineerReviewDate: null
    }
  ]);

  const [processingAction, setProcessingAction] = useState('');
  const [notifications, setNotifications] = useState([
    {
      id: 'NOTIF-001',
      type: 'tor_received',
      message: 'New Terms of Reference received from Hotel Corp Ltd',
      timestamp: '2024-01-15T10:30:00Z',
      read: false
    },
    {
      id: 'NOTIF-002',
      type: 'government_decision',
      message: 'Building permit approved for Educational Complex project',
      timestamp: '2024-01-20T14:15:00Z',
      read: false
    }
  ]);

  // Handle ToR download
  const handleDownloadToR = (tor) => {
    if (tor.documentUrl) {
      const link = document.createElement('a');
      link.href = tor.documentUrl;
      link.download = `ToR_${tor.projectName.replace(/\s+/g, '_')}_${tor.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Update status to reviewed
      setReceivedToRs(prev => prev.map(item => 
        item.id === tor.id ? { ...item, status: 'In Review' } : item
      ));
      
      alert('Terms of Reference downloaded successfully!');
    }
  };

  // Handle building plan upload
  const handleUploadBuildingPlan = (torId) => {
    setProcessingAction(`upload-${torId}`);
    
    // Simulate file upload process
    setTimeout(() => {
      const tor = receivedToRs.find(t => t.id === torId);
      const newPlan = {
        id: `BP-PLAN-${Date.now()}`,
        torId: torId,
        projectName: tor.projectName,
        fileName: `${tor.projectName.replace(/\s+/g, '_')}_Building_Plan.pdf`,
        uploadDate: new Date().toISOString().split('T')[0],
        status: 'Submitted',
        seenByEngineer: false,
        engineerReviewDate: null
      };
      
      setBuildingPlans(prev => [...prev, newPlan]);
      setReceivedToRs(prev => prev.map(item => 
        item.id === torId ? { ...item, status: 'Building Plan Submitted' } : item
      ));
      
      setProcessingAction('');
      alert('Building plan uploaded successfully!');
    }, 2000);
  };

  // Handle government document download
  const handleDownloadGovernmentDoc = (docType, projectName) => {
    // Simulate government document download
    const dummyPdf = 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO4CjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nHVUy27CMBD8lT1XyE7iJD5WFKhUqVKlPfTWm+XYm2Bl24u9Ier/1+tHSx+AJc/szOzMrr0BAA==';
    
    const link = document.createElement('a');
    link.href = dummyPdf;
    link.download = `${docType}_${projectName.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    alert(`${docType} document downloaded successfully!`);
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-info text-white" style={{ width: '250px', minHeight: '100vh' }}>
        <div className="p-3">
          <h5 className="text-center mb-4">Consultant Panel</h5>
          <nav className="nav flex-column">
            <a className="nav-link text-white active" href="#dashboard">
              <i className="bi bi-speedometer2 me-2"></i>Dashboard
            </a>
            <a className="nav-link text-white" onClick={() => navigate('/consultant/received-tor')} style={{cursor: 'pointer'}}>
              <i className="bi bi-inbox me-2"></i>Received ToR
            </a>
            <a className="nav-link text-white" onClick={() => navigate('/consultant/upload-building-plan-design')} style={{cursor: 'pointer'}}>
              <i className="bi bi-upload me-2"></i>Upload Building Plans
            </a>
            <a className="nav-link text-white" onClick={() => navigate('/consultant/view-documents')} style={{cursor: 'pointer'}}>
              <i className="bi bi-folder me-2"></i>View Documents
            </a>
            <a className="nav-link text-white" onClick={() => navigate('/consultant/notifications')} style={{cursor: 'pointer'}}>
              <i className="bi bi-bell me-2"></i>Notifications
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="badge bg-danger ms-1">{notifications.filter(n => !n.read).length}</span>
              )}
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        <Header username={username} />
        
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Consultant Dashboard</h2>
            <div className="text-muted">Welcome back, {username}!</div>
          </div>

          {/* Statistics Cards */}
          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <div className="card bg-info text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4>{stats.totalProjects}</h4>
                      <p className="mb-0">Total Projects</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-briefcase fs-1"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4>{stats.activeProjects}</h4>
                      <p className="mb-0">Active Projects</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-play-circle fs-1"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4>{stats.completedProjects}</h4>
                      <p className="mb-0">Completed</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-check-circle fs-1"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card bg-warning text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4>{stats.pendingReviews}</h4>
                      <p className="mb-0">Pending Reviews</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-clock fs-1"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Terms of Reference Management */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold text-dark">Terms of Reference (ToR) Management</h5>
                  <small className="text-muted">Review ToR documents from project owners and upload building plans</small>
                </div>
                <span className="badge bg-info fs-6">{receivedToRs.filter(t => t.status === 'New').length} new ToR</span>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="fw-semibold">ToR ID</th>
                      <th className="fw-semibold">Project</th>
                      <th className="fw-semibold">Owner</th>
                      <th className="fw-semibold">Priority</th>
                      <th className="fw-semibold">Status</th>
                      <th className="fw-semibold">Received Date</th>
                      <th className="fw-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {receivedToRs.map((tor) => (
                      <tr key={tor.id}>
                        <td><span className="fw-medium text-primary">{tor.id}</span></td>
                        <td>
                          <div className="fw-medium">{tor.projectName}</div>
                          <small className="text-muted">{tor.projectId}</small>
                        </td>
                        <td>{tor.ownerName}</td>
                        <td>
                          <span className={`badge ${
                            tor.priority === 'High' ? 'bg-warning-subtle text-warning-emphasis' :
                            tor.priority === 'Medium' ? 'bg-info-subtle text-info-emphasis' :
                            'bg-secondary-subtle text-secondary-emphasis'
                          }`}>
                            {tor.priority}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${
                            tor.status === 'New' ? 'bg-success-subtle text-success-emphasis' :
                            tor.status === 'In Review' ? 'bg-warning-subtle text-warning-emphasis' :
                            tor.status === 'Building Plan Submitted' ? 'bg-primary-subtle text-primary-emphasis' :
                            'bg-secondary-subtle text-secondary-emphasis'
                          }`}>
                            {tor.status}
                          </span>
                        </td>
                        <td>{new Date(tor.receivedDate).toLocaleDateString()}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <button 
                              className="btn btn-sm btn-primary"
                              onClick={() => handleDownloadToR(tor)}
                              title="Download ToR Document"
                            >
                              <i className="bi bi-download"></i>
                            </button>
                            {tor.status !== 'New' && (
                              <button 
                                className="btn btn-sm btn-success"
                                onClick={() => handleUploadBuildingPlan(tor.id)}
                                disabled={processingAction === `upload-${tor.id}` || tor.status === 'Building Plan Submitted'}
                                title="Upload Building Plan"
                              >
                                {processingAction === `upload-${tor.id}` ? (
                                  <span className="spinner-border spinner-border-sm" role="status"></span>
                                ) : (
                                  <i className="bi bi-upload"></i>
                                )}
                              </button>
                            )}
                            <button 
                              className="btn btn-sm btn-secondary"
                              title="View Details"
                            >
                              <i className="bi bi-eye"></i>
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

          {/* Building Plans Status */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold text-dark">Submitted Building Plans</h5>
                  <small className="text-muted">Track status of uploaded building plans and engineer reviews</small>
                </div>
                <span className="badge bg-warning fs-6">{buildingPlans.filter(bp => !bp.seenByEngineer).length} pending engineer review</span>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="fw-semibold">Plan ID</th>
                      <th className="fw-semibold">Project</th>
                      <th className="fw-semibold">File Name</th>
                      <th className="fw-semibold">Upload Date</th>
                      <th className="fw-semibold">Engineer Review</th>
                      <th className="fw-semibold">Status</th>
                      <th className="fw-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buildingPlans.map((plan) => (
                      <tr key={plan.id}>
                        <td><span className="fw-medium text-primary">{plan.id}</span></td>
                        <td>{plan.projectName}</td>
                        <td>{plan.fileName}</td>
                        <td>{new Date(plan.uploadDate).toLocaleDateString()}</td>
                        <td>
                          {plan.seenByEngineer ? (
                            <span className="badge bg-success-subtle text-success-emphasis">
                              <i className="bi bi-check-circle me-1"></i>Reviewed
                            </span>
                          ) : (
                            <span className="badge bg-warning-subtle text-warning-emphasis">
                              <i className="bi bi-clock me-1"></i>Pending
                            </span>
                          )}
                        </td>
                        <td>
                          <span className={`badge ${
                            plan.status === 'Submitted' ? 'bg-info-subtle text-info-emphasis' :
                            plan.status === 'Under Review' ? 'bg-warning-subtle text-warning-emphasis' :
                            'bg-success-subtle text-success-emphasis'
                          }`}>
                            {plan.status}
                          </span>
                        </td>
                        <td>
                          <div className="btn-group" role="group">
                            <button 
                              className="btn btn-sm btn-secondary"
                              title="View Plan Details"
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-primary"
                              onClick={() => handleDownloadGovernmentDoc('Approval_Certificate', plan.projectName)}
                              title="Download Government Documents"
                            >
                              <i className="bi bi-download"></i>
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

          {/* Quick Actions */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h5>Quick Actions</h5>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <button className="btn btn-info" onClick={() => navigate('/consultant/received-tor')}>
                      <i className="bi bi-inbox me-2"></i>View Received ToR
                    </button>
                    <button className="btn btn-primary" onClick={() => navigate('/consultant/view-documents')}>
                      <i className="bi bi-folder me-2"></i>View Documents
                    </button>
                    <button className="btn btn-success" onClick={() => navigate('/consultant/notifications')}>
                      <i className="bi bi-bell me-2"></i>Notifications
                      {notifications.filter(n => !n.read).length > 0 && (
                        <span className="badge bg-light text-dark ms-1">{notifications.filter(n => !n.read).length}</span>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h5>Active Projects</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Project ID</th>
                          <th>Client Name</th>
                          <th>Project Type</th>
                          <th>Status</th>
                          <th>Due Date</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>PRJ-001</td>
                          <td>ABC Construction</td>
                          <td>Residential Complex</td>
                          <td><span className="badge bg-primary">In Progress</span></td>
                          <td>2024-02-15</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-1">View</button>
                            <button className="btn btn-sm btn-outline-success">Update</button>
                          </td>
                        </tr>
                        <tr>
                          <td>PRJ-002</td>
                          <td>XYZ Developers</td>
                          <td>Commercial Building</td>
                          <td><span className="badge bg-warning">Review Pending</span></td>
                          <td>2024-02-20</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-1">View</button>
                            <button className="btn btn-sm btn-outline-success">Update</button>
                          </td>
                        </tr>
                        <tr>
                          <td>PRJ-003</td>
                          <td>City Corp</td>
                          <td>Industrial Facility</td>
                          <td><span className="badge bg-info">Design Phase</span></td>
                          <td>2024-03-01</td>
                          <td>
                            <button className="btn btn-sm btn-outline-primary me-1">View</button>
                            <button className="btn btn-sm btn-outline-success">Update</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="card">
            <div className="card-header">
              <h5>Recent Activities</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Design Review Completed</strong>
                    <br />
                    <small className="text-muted">Residential Complex design review completed for ABC Construction</small>
                  </div>
                  <span className="badge bg-success">2 hours ago</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>New Project Assigned</strong>
                    <br />
                    <small className="text-muted">Industrial Facility project assigned by City Corp</small>
                  </div>
                  <span className="badge bg-info">1 day ago</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Client Meeting Scheduled</strong>
                    <br />
                    <small className="text-muted">Meeting with XYZ Developers scheduled for tomorrow</small>
                  </div>
                  <span className="badge bg-warning">2 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsultantDashboard;
