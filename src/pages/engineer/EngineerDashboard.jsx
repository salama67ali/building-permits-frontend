import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header";
import 'bootstrap/dist/css/bootstrap.min.css';

function EngineerDashboard() {
  const username = localStorage.getItem('currentUserUsername');
  const navigate = useNavigate();
  const [stats] = useState({
    totalAssessments: 25,
    pendingAssessments: 8,
    completedAssessments: 17,
    approvedPlans: 15,
    rejectedPlans: 2
  });

  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

  // Building plans from consultants for review
  const [buildingPlansForReview, setBuildingPlansForReview] = useState([
    {
      id: 'BP-PLAN-001',
      projectId: 'BP-2024-007',
      projectName: 'Luxury Hotel Development',
      consultantName: 'Design Architects Ltd',
      fileName: 'Luxury_Hotel_Building_Plan.pdf',
      submissionDate: '2024-01-22',
      status: 'Pending Review',
      seenByEngineer: false,
      priority: 'High',
      documentUrl: 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO4CjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nHVUy27CMBD8lT1XyE7iJD5WFKhUqVKlPfTWm+XYm2Bl24u9Ier/1+tHSx+AJc/szOzMrr0BAA=='
    },
    {
      id: 'BP-PLAN-002',
      projectId: 'BP-2024-008',
      projectName: 'Medical Center Complex',
      consultantName: 'Healthcare Design Co',
      fileName: 'Medical_Center_Building_Plan.pdf',
      submissionDate: '2024-01-20',
      status: 'Under Review',
      seenByEngineer: true,
      priority: 'Critical',
      documentUrl: 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO4CjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nHVUy27CMBD8lT1XyE7iJD5WFKhUqVKlPfTWm+XYm2Bl24u9Ier/1+tHSx+AJc/szOzMrr0BAA=='
    },
    {
      id: 'BP-PLAN-003',
      projectId: 'BP-2024-009',
      projectName: 'Educational Complex',
      consultantName: 'Education Planners Inc',
      fileName: 'Educational_Complex_Building_Plan.pdf',
      submissionDate: '2024-01-18',
      status: 'Approved',
      seenByEngineer: true,
      priority: 'Medium',
      documentUrl: 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO4CjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nHVUy27CMBD8lT1XyE7iJD5WFKhUqVKlPfTWm+XYm2Bl24u9Ier/1+tHSx+AJc/szOzMrr0BAA=='
    }
  ]);

  // GIS Assessment reports for review
  const [gisAssessments, setGisAssessments] = useState([
    {
      id: 'GIS-2024-001',
      projectId: 'BP-2024-007',
      projectName: 'Luxury Hotel Development',
      assessmentType: 'Environmental Impact',
      status: 'Assessment Complete',
      completionDate: '2024-01-20',
      priority: 'High',
      reportUrl: 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO4CjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nHVUy27CMBD8lT1XyE7iJD5WFKhUqVKlPfTWm+XYm2Bl24u9Ier/1+tHSx+AJc/szOzMrr0BAA==',
      findings: 'Low environmental risk. Site suitable for development with standard mitigation measures.'
    },
    {
      id: 'GIS-2024-002',
      projectId: 'BP-2024-008',
      projectName: 'Medical Center Complex',
      assessmentType: 'Geological Survey',
      status: 'Assessment Complete',
      completionDate: '2024-01-19',
      priority: 'Critical',
      reportUrl: 'data:application/pdf;base64,JVBERi0xLjQKJcOkw7zDtsO4CjIgMCBvYmoKPDwvTGVuZ3RoIDMgMCBSL0ZpbHRlci9GbGF0ZURlY29kZT4+CnN0cmVhbQp4nHVUy27CMBD8lT1XyE7iJD5WFKhUqVKlPfTWm+XYm2Bl24u9Ier/1+tHSx+AJc/szOzMrr0BAA==',
      findings: 'Stable geological conditions. Foundation requirements within normal parameters.'
    }
  ]);

  const [processingAction, setProcessingAction] = useState('');
  const [notifications, setNotifications] = useState([
    {
      id: 'NOTIF-001',
      type: 'building_plan_received',
      message: 'New building plan received from Design Architects Ltd',
      timestamp: '2024-01-22T09:15:00Z',
      read: false
    },
    {
      id: 'NOTIF-002',
      type: 'gis_assessment_complete',
      message: 'GIS Assessment completed for Medical Center Complex',
      timestamp: '2024-01-19T14:30:00Z',
      read: false
    }
  ]);

  // Handle marking building plan as seen
  const handleMarkAsSeen = (planId) => {
    setProcessingAction(`seen-${planId}`);
    
    setTimeout(() => {
      setBuildingPlansForReview(prev => prev.map(plan => 
        plan.id === planId 
          ? { ...plan, seenByEngineer: true, status: 'Under Review' }
          : plan
      ));
      setProcessingAction('');
      alert('Building plan marked as seen and moved to under review!');
    }, 1000);
  };

  // Handle downloading building plan
  const handleDownloadBuildingPlan = (plan) => {
    if (plan.documentUrl) {
      const link = document.createElement('a');
      link.href = plan.documentUrl;
      link.download = `${plan.fileName}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert('Building plan downloaded successfully!');
    }
  };

  // Handle downloading GIS assessment report
  const handleDownloadGISReport = (assessment) => {
    if (assessment.reportUrl) {
      const link = document.createElement('a');
      link.href = assessment.reportUrl;
      link.download = `GIS_Assessment_${assessment.projectName.replace(/\s+/g, '_')}_${assessment.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      alert('GIS Assessment report downloaded successfully!');
    }
  };

  // Handle approving/rejecting building plans
  const handleApprovePlan = (planId) => {
    setProcessingAction(`approve-${planId}`);
    
    setTimeout(() => {
      setBuildingPlansForReview(prev => prev.map(plan => 
        plan.id === planId 
          ? { ...plan, status: 'Approved', approvedDate: new Date().toISOString() }
          : plan
      ));
      setProcessingAction('');
      alert('Building plan approved successfully!');
    }, 1500);
  };

  const handleRejectPlan = (planId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;
    
    setProcessingAction(`reject-${planId}`);
    
    setTimeout(() => {
      setBuildingPlansForReview(prev => prev.map(plan => 
        plan.id === planId 
          ? { ...plan, status: 'Rejected', rejectedDate: new Date().toISOString(), rejectionReason: reason }
          : plan
      ));
      setProcessingAction('');
      alert('Building plan rejected with reason provided.');
    }, 1500);
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    
    try {
      // Simulate report generation delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate report data
      const reportData = {
        reportId: `ENG-RPT-${Date.now()}`,
        generatedBy: username,
        generatedAt: new Date().toISOString(),
        reportType: 'Engineering Assessment Summary',
        period: 'January 2024',
        summary: {
          totalAssessments: stats.totalAssessments,
          pendingAssessments: stats.pendingAssessments,
          completedAssessments: stats.completedAssessments,
          approvedPlans: stats.approvedPlans,
          rejectedPlans: stats.rejectedPlans,
          approvalRate: Math.round((stats.approvedPlans / (stats.approvedPlans + stats.rejectedPlans)) * 100)
        },
        assessments: [
          {
            id: 'BP-2024-001',
            projectName: 'Residential Complex A',
            owner: 'John Doe',
            status: 'Approved',
            assessmentDate: '2024-01-15',
            engineerNotes: 'Structural plans meet all safety requirements. Foundation design is adequate.'
          },
          {
            id: 'BP-2024-002',
            projectName: 'Commercial Building B',
            owner: 'ABC Corp',
            status: 'Approved',
            assessmentDate: '2024-01-18',
            engineerNotes: 'Electrical and mechanical systems properly designed. Fire safety measures adequate.'
          },
          {
            id: 'BP-2024-003',
            projectName: 'Industrial Facility C',
            owner: 'XYZ Industries',
            status: 'Rejected',
            assessmentDate: '2024-01-20',
            engineerNotes: 'Structural calculations insufficient. Requires revision of load-bearing elements.'
          }
        ],
        recommendations: [
          'Increase focus on structural calculations review',
          'Implement standardized checklist for electrical assessments',
          'Schedule more frequent site inspections for complex projects'
        ]
      };

      // Create downloadable report
      const reportContent = `
ENGINEERING ASSESSMENT REPORT
=============================

Report ID: ${reportData.reportId}
Generated By: ${reportData.generatedBy}
Generated At: ${new Date(reportData.generatedAt).toLocaleString()}
Report Type: ${reportData.reportType}
Period: ${reportData.period}

SUMMARY STATISTICS
==================
Total Assessments: ${reportData.summary.totalAssessments}
Pending Assessments: ${reportData.summary.pendingAssessments}
Completed Assessments: ${reportData.summary.completedAssessments}
Approved Plans: ${reportData.summary.approvedPlans}
Rejected Plans: ${reportData.summary.rejectedPlans}
Approval Rate: ${reportData.summary.approvalRate}%

DETAILED ASSESSMENTS
====================
${reportData.assessments.map(assessment => `
Project: ${assessment.projectName} (${assessment.id})
Owner: ${assessment.owner}
Status: ${assessment.status}
Assessment Date: ${assessment.assessmentDate}
Engineer Notes: ${assessment.engineerNotes}
`).join('\n')}

RECOMMENDATIONS
===============
${reportData.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n')}

Generated by Building Permissions Management System
Report Date: ${new Date().toLocaleDateString()}
      `;

      // Download the report
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Engineering_Assessment_Report_${reportData.reportId}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert('✅ Engineering Assessment Report generated and downloaded successfully!');
    } catch (error) {
      alert('❌ Failed to generate report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
    }
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-success text-white" style={{ width: '250px', minHeight: '100vh' }}>
        <div className="p-3">
          <h5 className="text-center mb-4">Engineer Panel</h5>
          <nav className="nav flex-column">
            <a className="nav-link text-white active" href="#dashboard">
              <i className="bi bi-speedometer2 me-2"></i>Dashboard
            </a>
            <a className="nav-link text-white" onClick={() => navigate('/engineer/review-building-plans')} style={{cursor: 'pointer'}}>
              <i className="bi bi-file-earmark-text me-2"></i>Review Building Plans
            </a>
            <a className="nav-link text-white" onClick={() => navigate('/engineer/gis-assessments')} style={{cursor: 'pointer'}}>
              <i className="bi bi-geo-alt me-2"></i>GIS Assessments
            </a>
            <a className="nav-link text-white" onClick={() => navigate('/engineer/site-inspections')} style={{cursor: 'pointer'}}>
              <i className="bi bi-building me-2"></i>Site Inspections
            </a>
            <a className="nav-link text-white" onClick={() => navigate('/engineer/notifications')} style={{cursor: 'pointer'}}>
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
            <h2>Engineer Dashboard</h2>
            <div className="text-muted">Welcome back, {username}!</div>
          </div>

          {/* Statistics Cards */}
          <div className="row mb-4">
            <div className="col-md-3 mb-3">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4>{stats.totalAssessments}</h4>
                      <p className="mb-0">Total Assessments</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-clipboard-check fs-1"></i>
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
                      <h4>{stats.pendingAssessments}</h4>
                      <p className="mb-0">Pending Reviews</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-clock fs-1"></i>
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
                      <h4>{stats.approvedPlans}</h4>
                      <p className="mb-0">Approved Plans</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-check-circle fs-1"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="card bg-danger text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4>{stats.rejectedPlans}</h4>
                      <p className="mb-0">Rejected Plans</p>
                    </div>
                    <div className="align-self-center">
                      <i className="bi bi-x-circle fs-1"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Building Plans Review */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold text-dark">Building Plans Review</h5>
                  <small className="text-muted">Review building plans submitted by consultants</small>
                </div>
                <span className="badge bg-warning fs-6">{buildingPlansForReview.filter(bp => !bp.seenByEngineer).length} new plans</span>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="fw-semibold">Plan ID</th>
                      <th className="fw-semibold">Project</th>
                      <th className="fw-semibold">Consultant</th>
                      <th className="fw-semibold">Priority</th>
                      <th className="fw-semibold">Status</th>
                      <th className="fw-semibold">Submission Date</th>
                      <th className="fw-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {buildingPlansForReview.map((plan) => (
                      <tr key={plan.id}>
                        <td><span className="fw-medium text-primary">{plan.id}</span></td>
                        <td>
                          <div className="fw-medium">{plan.projectName}</div>
                          <small className="text-muted">{plan.projectId}</small>
                        </td>
                        <td>{plan.consultantName}</td>
                        <td>
                          <span className={`badge ${
                            plan.priority === 'Critical' ? 'bg-danger-subtle text-danger-emphasis' :
                            plan.priority === 'High' ? 'bg-warning-subtle text-warning-emphasis' :
                            'bg-info-subtle text-info-emphasis'
                          }`}>
                            {plan.priority}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${
                            plan.status === 'Pending Review' ? 'bg-warning-subtle text-warning-emphasis' :
                            plan.status === 'Under Review' ? 'bg-info-subtle text-info-emphasis' :
                            plan.status === 'Approved' ? 'bg-success-subtle text-success-emphasis' :
                            'bg-danger-subtle text-danger-emphasis'
                          }`}>
                            {plan.status}
                          </span>
                        </td>
                        <td>{new Date(plan.submissionDate).toLocaleDateString()}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <button 
                              className="btn btn-sm btn-primary"
                              onClick={() => handleDownloadBuildingPlan(plan)}
                              title="Download Building Plan"
                            >
                              <i className="bi bi-download"></i>
                            </button>
                            {!plan.seenByEngineer && (
                              <button 
                                className="btn btn-sm btn-info"
                                onClick={() => handleMarkAsSeen(plan.id)}
                                disabled={processingAction === `seen-${plan.id}`}
                                title="Mark as Seen"
                              >
                                {processingAction === `seen-${plan.id}` ? (
                                  <span className="spinner-border spinner-border-sm" role="status"></span>
                                ) : (
                                  <i className="bi bi-eye"></i>
                                )}
                              </button>
                            )}
                            {plan.seenByEngineer && plan.status === 'Under Review' && (
                              <>
                                <button 
                                  className="btn btn-sm btn-success"
                                  onClick={() => handleApprovePlan(plan.id)}
                                  disabled={processingAction === `approve-${plan.id}`}
                                  title="Approve Plan"
                                >
                                  {processingAction === `approve-${plan.id}` ? (
                                    <span className="spinner-border spinner-border-sm" role="status"></span>
                                  ) : (
                                    <i className="bi bi-check-lg"></i>
                                  )}
                                </button>
                                <button 
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleRejectPlan(plan.id)}
                                  disabled={processingAction === `reject-${plan.id}`}
                                  title="Reject Plan"
                                >
                                  {processingAction === `reject-${plan.id}` ? (
                                    <span className="spinner-border spinner-border-sm" role="status"></span>
                                  ) : (
                                    <i className="bi bi-x-lg"></i>
                                  )}
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
            </div>
          </div>

          {/* GIS Assessment Reports */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold text-dark">GIS Assessment Reports</h5>
                  <small className="text-muted">Review GIS assessment reports for engineering validation</small>
                </div>
                <span className="badge bg-success fs-6">{gisAssessments.filter(g => g.status === 'Assessment Complete').length} completed assessments</span>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="fw-semibold">GIS ID</th>
                      <th className="fw-semibold">Project</th>
                      <th className="fw-semibold">Assessment Type</th>
                      <th className="fw-semibold">Priority</th>
                      <th className="fw-semibold">Status</th>
                      <th className="fw-semibold">Completion Date</th>
                      <th className="fw-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gisAssessments.map((assessment) => (
                      <tr key={assessment.id}>
                        <td><span className="fw-medium text-primary">{assessment.id}</span></td>
                        <td>
                          <div className="fw-medium">{assessment.projectName}</div>
                          <small className="text-muted">{assessment.projectId}</small>
                        </td>
                        <td>
                          <span className="badge bg-secondary-subtle text-secondary-emphasis">
                            {assessment.assessmentType}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${
                            assessment.priority === 'Critical' ? 'bg-danger-subtle text-danger-emphasis' :
                            assessment.priority === 'High' ? 'bg-warning-subtle text-warning-emphasis' :
                            'bg-info-subtle text-info-emphasis'
                          }`}>
                            {assessment.priority}
                          </span>
                        </td>
                        <td>
                          <span className="badge bg-success-subtle text-success-emphasis">
                            {assessment.status}
                          </span>
                        </td>
                        <td>{new Date(assessment.completionDate).toLocaleDateString()}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <button 
                              className="btn btn-sm btn-primary"
                              onClick={() => handleDownloadGISReport(assessment)}
                              title="Download GIS Report"
                            >
                              <i className="bi bi-download"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-secondary"
                              title="View Assessment Details"
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

          {/* Quick Actions */}
          <div className="row mb-4">
            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h5>Quick Actions</h5>
                </div>
                <div className="card-body">
                  <div className="d-grid gap-2">
                    <button className="btn btn-success" onClick={() => navigate('/engineer/review-building-plans')}>
                      <i className="bi bi-file-earmark-text me-2"></i>Review Building Plans
                    </button>
                    <button className="btn btn-info" onClick={() => navigate('/engineer/gis-assessments')}>
                      <i className="bi bi-geo-alt me-2"></i>GIS Assessments
                    </button>
                    <button 
                      className="btn btn-warning" 
                      onClick={handleGenerateReport}
                      disabled={isGeneratingReport}
                    >
                      {isGeneratingReport ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Generating...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-file-earmark-bar-graph me-2"></i>Generate Report
                        </>
                      )}
                    </button>
                    <button className="btn btn-primary" onClick={() => navigate('/engineer/notifications')}>
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
                  <h5>Pending Assessments</h5>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead>
                        <tr>
                          <th>Application ID</th>
                          <th>Project Name</th>
                          <th>Owner</th>
                          <th>Document Type</th>
                          <th>Priority</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>BP-2024-004</td>
                          <td>High-Rise Residential</td>
                          <td>John Smith</td>
                          <td>Structural Plans</td>
                          <td><span className="badge bg-danger">High</span></td>
                          <td>
                            <button className="btn btn-sm btn-outline-success me-1">Review</button>
                            <button className="btn btn-sm btn-outline-primary">Details</button>
                          </td>
                        </tr>
                        <tr>
                          <td>BP-2024-005</td>
                          <td>Shopping Mall</td>
                          <td>ABC Developers</td>
                          <td>Electrical Plans</td>
                          <td><span className="badge bg-warning">Medium</span></td>
                          <td>
                            <button className="btn btn-sm btn-outline-success me-1">Review</button>
                            <button className="btn btn-sm btn-outline-primary">Details</button>
                          </td>
                        </tr>
                        <tr>
                          <td>BP-2024-006</td>
                          <td>Office Complex</td>
                          <td>XYZ Corp</td>
                          <td>Mechanical Plans</td>
                          <td><span className="badge bg-info">Low</span></td>
                          <td>
                            <button className="btn btn-sm btn-outline-success me-1">Review</button>
                            <button className="btn btn-sm btn-outline-primary">Details</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Assessments */}
          <div className="card">
            <div className="card-header">
              <h5>Recent Assessments</h5>
            </div>
            <div className="card-body">
              <div className="list-group list-group-flush">
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Assessment Completed</strong>
                    <br />
                    <small className="text-muted">Structural assessment for BP-2024-003 approved</small>
                  </div>
                  <span className="badge bg-success">1 hour ago</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Site Inspection Scheduled</strong>
                    <br />
                    <small className="text-muted">Site inspection for BP-2024-004 scheduled for Jan 25</small>
                  </div>
                  <span className="badge bg-info">3 hours ago</span>
                </div>
                <div className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <strong>Technical Report Generated</strong>
                    <br />
                    <small className="text-muted">Technical report for BP-2024-002 completed</small>
                  </div>
                  <span className="badge bg-primary">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EngineerDashboard;
