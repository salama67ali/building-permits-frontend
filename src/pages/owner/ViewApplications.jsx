import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';

function ViewApplications() {
  const navigate = useNavigate();
  const username = localStorage.getItem('currentUserUsername');
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Mock applications data
  const [applications] = useState([
    {
      id: 'PRJ-1703847234567',
      projectName: 'Residential Villa Complex',
      type: 'residential',
      location: 'Nairobi, Karen',
      coordinates: '-1.2921, 36.8219',
      submittedDate: '2024-01-15',
      status: 'approved',
      overallRisk: 'low',
      processingTime: '18 days',
      approvalConditions: ['Standard building codes compliance', 'Regular construction inspections'],
      nextAction: 'Proceed with construction',
      gisAssessmentId: 'GIS-1703847234567'
    },
    {
      id: 'PRJ-1703847298765',
      projectName: 'Commercial Shopping Center',
      type: 'commercial',
      location: 'Mombasa, Nyali',
      coordinates: '-4.0435, 39.6682',
      submittedDate: '2024-01-20',
      status: 'under_review',
      overallRisk: 'moderate',
      processingTime: '35 days (estimated)',
      approvalConditions: ['Site-specific mitigation measures required', 'Environmental monitoring recommended'],
      nextAction: 'Awaiting government board review',
      gisAssessmentId: 'GIS-1703847298765'
    },
    {
      id: 'PRJ-1703847356789',
      projectName: 'Industrial Manufacturing Plant',
      type: 'industrial',
      location: 'Nakuru, Rift Valley',
      coordinates: '-0.2827, 36.0664',
      submittedDate: '2024-02-01',
      status: 'requires_additional_documents',
      overallRisk: 'high',
      processingTime: '52 days (estimated)',
      approvalConditions: ['Environmental Impact Assessment (EIA) mandatory', 'Specialized engineering design needed'],
      nextAction: 'Submit EIA report and geological survey',
      gisAssessmentId: 'GIS-1703847356789'
    },
    {
      id: 'PRJ-1703847412345',
      projectName: 'Residential Apartment Block',
      type: 'residential',
      location: 'Kisumu, Lakeside',
      coordinates: '-0.0917, 34.7680',
      submittedDate: '2024-02-10',
      status: 'rejected',
      overallRisk: 'high',
      processingTime: '28 days',
      approvalConditions: ['Flood mitigation required', 'Alternative site recommended'],
      nextAction: 'Resubmit with new location or flood mitigation plan',
      gisAssessmentId: 'GIS-1703847412345'
    },
    {
      id: 'PRJ-1703847467890',
      projectName: 'Mixed Use Development',
      type: 'mixed',
      location: 'Eldoret, Uasin Gishu',
      coordinates: '-0.5143, 35.2698',
      submittedDate: '2024-02-15',
      status: 'pending_assessment',
      overallRisk: 'pending',
      processingTime: 'Assessment in progress',
      approvalConditions: ['Pending environmental assessment'],
      nextAction: 'Wait for GIS assessment completion',
      gisAssessmentId: 'GIS-1703847467890'
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
    // In a real app, this would navigate to a detailed view
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
          <button className="nav-link text-white btn btn-link text-start active bg-secondary" onClick={() => navigate('/owner/view-applications')}>
            <i className="bi bi-list-ul me-2"></i>View Applications
          </button>
          <button className="nav-link text-white btn btn-link text-start" onClick={() => navigate('/owner/upload-documents')}>
            <i className="bi bi-cloud-upload me-2"></i>Upload Documents
          </button>
          <button className="nav-link text-white btn btn-link text-start" onClick={() => navigate('/owner/my-applications')}>
            <i className="bi bi-folder me-2"></i>My Applications
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
                      <h5>{applications.filter(app => app.status === 'pending_assessment').length}</h5>
                      <p className="mb-0">Pending Assessment</p>
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
                        <option value="pending_assessment">Pending Assessment</option>
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
                            <th>Status</th>
                            <th>Risk Level</th>
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
                              <td>{getStatusBadge(app.status)}</td>
                              <td>{getRiskBadge(app.overallRisk)}</td>
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

              {/* Application Details Modal would go here in a real implementation */}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewApplications;
