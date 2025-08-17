import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';

function ViewApplications() {
  const navigate = useNavigate();
  const username = localStorage.getItem('currentUserUsername');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Applications data with government board status updates
  const [applications] = useState([
    {
      id: 'APP-2024-003',
      projectName: 'Educational Complex',
      type: 'educational',
      location: 'University Area',
      coordinates: '-1.2921, 36.8219',
      submittedDate: '2024-01-20',
      status: 'approved',
      overallRisk: 'low',
      processingTime: '2 days',
      approvalConditions: ['Standard building codes compliance', 'Regular construction inspections'],
      nextAction: 'Download permit certificate and proceed with construction',
      gisAssessmentId: 'GIS-2024-003',
      governmentStatus: 'Approved',
      approvedBy: 'Government Boards',
      approvedDate: '2024-01-22',
      workflowStage: 'Completed',
      consultantStatus: 'Building Plan Submitted',
      engineerStatus: 'Approved',
      permitCertificateAvailable: true
    },
    {
      id: 'APP-2024-001',
      projectName: 'Luxury Hotel Development',
      type: 'commercial',
      location: 'Downtown District',
      coordinates: '-4.0435, 39.6682',
      submittedDate: '2024-01-15',
      status: 'under_review',
      overallRisk: 'moderate',
      processingTime: '7 days (in progress)',
      approvalConditions: ['Site-specific mitigation measures required', 'Environmental monitoring recommended'],
      nextAction: 'Awaiting government board decision',
      gisAssessmentId: 'GIS-2024-001',
      governmentStatus: 'Pending Review',
      approvedBy: null,
      approvedDate: null,
      workflowStage: 'Government Review',
      consultantStatus: 'Building Plan Submitted',
      engineerStatus: 'Under Review',
      permitCertificateAvailable: false
    },
    {
      id: 'APP-2024-002',
      projectName: 'Medical Center Complex',
      type: 'healthcare',
      location: 'Medical District',
      coordinates: '-0.2827, 36.0664',
      submittedDate: '2024-01-18',
      status: 'under_review',
      overallRisk: 'high',
      processingTime: '4 days (in progress)',
      approvalConditions: ['Environmental Impact Assessment (EIA) mandatory', 'Specialized engineering design needed'],
      nextAction: 'Awaiting government board decision',
      gisAssessmentId: 'GIS-2024-002',
      governmentStatus: 'Pending Review',
      approvedBy: null,
      approvedDate: null,
      workflowStage: 'Government Review',
      consultantStatus: 'Building Plan Submitted',
      engineerStatus: 'Under Review',
      permitCertificateAvailable: false
    },
    {
      id: 'APP-2024-004',
      projectName: 'Residential Tower',
      type: 'residential',
      location: 'Suburban Area',
      coordinates: '-0.0917, 34.7680',
      submittedDate: '2024-01-12',
      status: 'rejected',
      overallRisk: 'high',
      processingTime: '9 days',
      approvalConditions: ['Environmental impact concerns', 'Alternative site recommended'],
      nextAction: 'Resubmit with new location or environmental mitigation plan',
      gisAssessmentId: 'GIS-2024-004',
      governmentStatus: 'Rejected',
      approvedBy: 'Government Boards',
      approvedDate: '2024-01-21',
      rejectionReason: 'Environmental impact concerns',
      workflowStage: 'Rejected',
      consultantStatus: 'Building Plan Submitted',
      engineerStatus: 'Approved',
      permitCertificateAvailable: false
    }
  ]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { class: 'bg-success', text: 'Approved' },
      under_review: { class: 'bg-warning', text: 'Under Review' },
      requires_additional_documents: { class: 'bg-info', text: 'Additional Documents Required' },
      rejected: { class: 'bg-danger', text: 'Rejected' },
      pending_assessment: { class: 'bg-secondary', text: 'Pending Assessment' }
    };
    const config = statusConfig[status] || { class: 'bg-secondary', text: 'Unknown' };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const getWorkflowStageBadge = (stage) => {
    const stageConfig = {
      'Completed': { class: 'bg-success', text: 'Completed' },
      'Government Review': { class: 'bg-warning', text: 'Government Review' },
      'Engineer Review': { class: 'bg-info', text: 'Engineer Review' },
      'Consultant Review': { class: 'bg-primary', text: 'Consultant Review' },
      'Rejected': { class: 'bg-danger', text: 'Rejected' },
      'Initial Submission': { class: 'bg-secondary', text: 'Initial Submission' }
    };
    const config = stageConfig[stage] || { class: 'bg-secondary', text: 'Unknown' };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  // Handle permit certificate download
  const handleDownloadCertificate = (application) => {
    if (!application.permitCertificateAvailable) {
      alert('Permit certificate is not yet available. Please wait for approval.');
      return;
    }

    const certificateContent = `
BUILDING PERMIT CERTIFICATE
============================

Certificate ID: CERT-${application.id}
Project Name: ${application.projectName}
Project Type: ${application.type.toUpperCase()}
Location: ${application.location}
Owner: ${localStorage.getItem('currentUserUsername')}

APPROVAL DETAILS
================
Status: ${application.governmentStatus}
Approved By: ${application.approvedBy}
Approval Date: ${new Date(application.approvedDate).toLocaleDateString()}
GIS Assessment ID: ${application.gisAssessmentId}

CONDITIONS
==========
${application.approvalConditions.map((condition, index) => `${index + 1}. ${condition}`).join('\n')}

This certificate authorizes the commencement of construction activities
for the above-mentioned project in accordance with approved plans and
specifications.

Issued by: Building Permissions Management System
Issue Date: ${new Date().toLocaleDateString()}

--- OFFICIAL GOVERNMENT CERTIFICATE ---
    `;

    const blob = new Blob([certificateContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Building_Permit_Certificate_${application.id}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert('✅ Building permit certificate downloaded successfully!');
  };

  const getRiskBadge = (risk) => {
    if (risk === 'pending') return <span className="badge bg-secondary">Pending</span>;
    const riskConfig = {
      low: { class: 'bg-success', text: 'Low Risk' },
      moderate: { class: 'bg-warning', text: 'Moderate Risk' },
      high: { class: 'bg-danger', text: 'High Risk' }
    };
    const config = riskConfig[risk] || { class: 'bg-secondary', text: 'Unknown' };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = app.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleViewDetails = (applicationId) => {
    alert(`Viewing details for application: ${applicationId}`);
  };

  const handleDownloadReport = (application) => {
    const reportData = {
      applicationId: application.id,
      projectName: application.projectName,
      gisAssessmentId: application.gisAssessmentId,
      status: application.status,
      overallRisk: application.overallRisk,
      approvalConditions: application.approvalConditions,
      generatedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Application_Report_${application.id}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard-container d-flex">
      {/* Sidebar */}
      <div className="bg-primary text-white" style={{ width: '250px', minHeight: '100vh' }}>
        <div className="p-3">
          <h5>Owner Dashboard</h5>
        </div>
        <nav className="nav flex-column">
          <button className="nav-link text-white btn btn-link text-start" onClick={() => navigate('/owner/dashboard')}>
            <i className="bi bi-house-door me-2"></i>Dashboard
          </button>
          <button className="nav-link text-white btn btn-link text-start" onClick={() => navigate('/owner/apply-permit')}>
            <i className="bi bi-file-earmark-plus me-2"></i>Apply for Permit
          </button>
          <button className="nav-link text-white btn btn-link text-start active bg-secondary">
            <i className="bi bi-list-ul me-2"></i>View Applications
          </button>
          <button className="nav-link text-white btn btn-link text-start" onClick={() => navigate('/owner/upload-documents')}>
            <i className="bi bi-cloud-upload me-2"></i>Upload Documents
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content flex-grow-1">
        <Header username={username} />
        <div className="container-fluid mt-3">
          <div className="row">
            <div className="col-12">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2><i className="bi bi-list-ul me-2"></i>My Applications</h2>
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate('/owner/apply-permit')}
                >
                  <i className="bi bi-plus-circle me-2"></i>New Application
                </button>
              </div>

              {/* Statistics Cards */}
              <div className="row mb-4">
                <div className="col-md-3">
                  <div className="card bg-success text-white">
                    <div className="card-body">
                      <h5>{applications.filter(app => app.status === 'approved').length}</h5>
                      <p className="mb-0">Approved</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-warning text-white">
                    <div className="card-body">
                      <h5>{applications.filter(app => app.status === 'under_review').length}</h5>
                      <p className="mb-0">Under Review</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-info text-white">
                    <div className="card-body">
                      <h5>{applications.filter(app => app.status === 'requires_additional_documents').length}</h5>
                      <p className="mb-0">Need Documents</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="card bg-secondary text-white">
                    <div className="card-body">
                      <h5>{applications.filter(app => app.status === 'rejected').length}</h5>
                      <p className="mb-0">Rejected</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filters and Search */}
              <div className="card mb-4">
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <label className="form-label">Filter by Status</label>
                      <select 
                        className="form-select" 
                        value={filter} 
                        onChange={(e) => setFilter(e.target.value)}
                      >
                        <option value="all">All Applications</option>
                        <option value="approved">Approved</option>
                        <option value="under_review">Under Review</option>
                        <option value="requires_additional_documents">Need Documents</option>
                        <option value="rejected">Rejected</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Search Applications</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Search by project name, location, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Applications Table */}
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Applications ({filteredApplications.length})</h5>
                </div>
                <div className="card-body">
                  {filteredApplications.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-inbox display-1 text-muted"></i>
                      <h5 className="mt-3">No applications found</h5>
                      <p className="text-muted">Try adjusting your filters or search terms.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Project ID</th>
                            <th>Project Name</th>
                            <th>Type</th>
                            <th>Location</th>
                            <th>Submitted</th>
                            <th>Government Status</th>
                            <th>Workflow Stage</th>
                            <th>Processing Time</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredApplications.map((app) => (
                            <tr key={app.id}>
                              <td>
                                <code>{app.id}</code>
                              </td>
                              <td>
                                <strong>{app.projectName}</strong>
                              </td>
                              <td>
                                <span className="badge bg-light text-dark">
                                  {app.type.charAt(0).toUpperCase() + app.type.slice(1)}
                                </span>
                              </td>
                              <td>{app.location}</td>
                              <td>{new Date(app.submittedDate).toLocaleDateString()}</td>
                              <td>
                                <div className="d-flex flex-column gap-1">
                                  {getStatusBadge(app.status)}
                                  <small className="text-muted">by {app.approvedBy || 'System'}</small>
                                </div>
                              </td>
                              <td>{getWorkflowStageBadge(app.workflowStage)}</td>
                              <td>
                                <small className="text-muted">{app.processingTime}</small>
                              </td>
                              <td>
                                <div className="btn-group btn-group-sm">
                                  <button 
                                    className="btn btn-outline-primary"
                                    onClick={() => handleViewDetails(app.id)}
                                    title="View Details"
                                  >
                                    <i className="bi bi-eye"></i>
                                  </button>
                                  <button 
                                    className="btn btn-outline-secondary"
                                    onClick={() => handleDownloadReport(app)}
                                    title="Download Report"
                                  >
                                    <i className="bi bi-download"></i>
                                  </button>
                                  {app.permitCertificateAvailable && (
                                    <button 
                                      className="btn btn-success btn-sm"
                                      onClick={() => handleDownloadCertificate(app)}
                                      title="Download Permit Certificate"
                                    >
                                      <i className="bi bi-award"></i>
                                    </button>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewApplications;
