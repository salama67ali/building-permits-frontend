import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "../../components/Header";
import 'bootstrap/dist/css/bootstrap.min.css';

function GovernmentBoardsDashboard() {
  const username = localStorage.getItem('currentUserUsername');
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    pendingApprovals: 12,
    approvedApplications: 28,
    rejectedApplications: 5,
    completedApplications: 15,
    inspectionsScheduled: 8
  });

  // Building permit applications for approval/rejection
  const [applications, setApplications] = useState([
    {
      id: 'APP-2024-001',
      projectName: 'Luxury Hotel Development',
      ownerName: 'Hotel Corp Ltd',
      submissionDate: '2024-01-15',
      status: 'Pending Review',
      priority: 'High',
      projectType: 'Commercial',
      location: 'Downtown District',
      gisAssessmentStatus: 'Complete'
    },
    {
      id: 'APP-2024-002',
      projectName: 'Medical Center Complex',
      ownerName: 'HealthCare Inc',
      submissionDate: '2024-01-18',
      status: 'Pending Review',
      priority: 'Critical',
      projectType: 'Healthcare',
      location: 'Medical District',
      gisAssessmentStatus: 'Complete'
    },
    {
      id: 'APP-2024-003',
      projectName: 'Educational Complex',
      ownerName: 'Education Foundation',
      submissionDate: '2024-01-20',
      status: 'Approved',
      priority: 'High',
      projectType: 'Educational',
      location: 'University Area',
      gisAssessmentStatus: 'Complete',
      approvedDate: '2024-01-22'
    },
    {
      id: 'APP-2024-004',
      projectName: 'Residential Tower',
      ownerName: 'City Developers',
      submissionDate: '2024-01-12',
      status: 'Rejected',
      priority: 'Medium',
      projectType: 'Residential',
      location: 'Suburban Area',
      gisAssessmentStatus: 'Complete',
      rejectedDate: '2024-01-21',
      rejectionReason: 'Environmental impact concerns'
    }
  ]);

  const [processingApplication, setProcessingApplication] = useState('');

  // Calculate total applications from all status categories
  const totalApplications = stats.pendingApprovals + stats.approvedApplications + stats.rejectedApplications + stats.completedApplications;

  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [gisAssessments, setGisAssessments] = useState([
    {
      id: 'GIS-2024-001',
      projectId: 'BP-2024-007',
      projectName: 'Luxury Hotel',
      owner: 'Hotel Corp',
      status: 'Pending Assessment',
      submissionDate: '2024-01-15',
      assessmentType: 'Environmental Impact',
      priority: 'High'
    },
    {
      id: 'GIS-2024-002', 
      projectId: 'BP-2024-008',
      projectName: 'Medical Center',
      owner: 'Health Systems',
      status: 'Assessment Complete',
      submissionDate: '2024-01-18',
      completionDate: '2024-01-22',
      assessmentType: 'Geological Survey',
      priority: 'Critical',
      reportUrl: 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCAyNTAKPj4Kc3RyZWFtCkJUCi9GMSAxMiBUZgoxMDAgNzAwIFRkCihHSVMgQXNzZXNzbWVudCBSZXBvcnQgLSBNZWRpY2FsIENlbnRlcikgVGoKMTAwIDY1MCBUZAooUHJvamVjdCBJRDogQlAtMjAyNC0wMDgpIFRqCjEwMCA2MDAgVGQKKEFzc2Vzc21lbnQgVHlwZTogR2VvbG9naWNhbCBTdXJ2ZXkpIFRqCjEwMCA1NTAgVGQKKFN0YXR1czogQXBwcm92ZWQpIFRqCjEwMCA1MDAgVGQKKERhdGU6IEphbnVhcnkgMjIsIDIwMjQpIFRqCkVUCmVuZHN0cmVhbQplbmRvYmoKNSAwIG9iago8PAovVHlwZSAvRm9udAovU3VidHlwZSAvVHlwZTEKL0Jhc2VGb250IC9IZWx2ZXRpY2EKPj4KZW5kb2JqCnhyZWYKMCA2CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAwOSAwMDAwMCBuIAowMDAwMDAwMDU4IDAwMDAwIG4gCjAwMDAwMDAxMTUgMDAwMDAgbiAKMDAwMDAwMDIxNSAwMDAwMCBuIAowMDAwMDAwNTE1IDAwMDAwIG4gCnRyYWlsZXIKPDwKL1NpemUgNgovUm9vdCAxIDAgUgo+PgpzdGFydHhyZWYKNjE1CiUlRU9G'
    },
    {
      id: 'GIS-2024-003',
      projectId: 'BP-2024-009', 
      projectName: 'Educational Complex',
      owner: 'Edu Foundation',
      status: 'Assessment Complete',
      submissionDate: '2024-01-20',
      completionDate: '2024-01-24',
      assessmentType: 'Traffic Impact',
      priority: 'Medium',
      reportUrl: 'data:application/pdf;base64,JVBERi0xLjQKMSAwIG9iago8PAovVHlwZSAvQ2F0YWxvZwovUGFnZXMgMiAwIFIKPj4KZW5kb2JqCjIgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9LaWRzIFszIDAgUl0KL0NvdW50IDEKPD4KZW5kb2JqCjMgMCBvYmoKPDwKL1R5cGUgL1BhZ2UKL1BhcmVudCAyIDAgUgovTWVkaWFCb3ggWzAgMCA2MTIgNzkyXQovQ29udGVudHMgNCAwIFIKPj4KZW5kb2JqCjQgMCBvYmoKPDwKL0xlbmd0aCAyNzAKPj4Kc3RyZWFtCkJUCi9GMSAxMiBUZgoxMDAgNzAwIFRkCihHSVMgQXNzZXNzbWVudCBSZXBvcnQgLSBFZHVjYXRpb25hbCBDb21wbGV4KSBUagoxMDAgNjUwIFRkCihQcm9qZWN0IElEOiBCUC0yMDI0LTAwOSkgVGoKMTAwIDYwMCBUZAooQXNzZXNzbWVudCBUeXBlOiBUcmFmZmljIEltcGFjdCkgVGoKMTAwIDU1MCBUZAooU3RhdHVzOiBBcHByb3ZlZCkgVGoKMTAwIDUwMCBUZAooRGF0ZTogSmFudWFyeSAyNCwgMjAyNCkgVGoKRVQKZW5kc3RyZWFtCmVuZG9iago1IDAgb2JqCjw8Ci9UeXBlIC9Gb250Ci9TdWJ0eXBlIC9UeXBlMQovQmFzZUZvbnQgL0hlbHZldGljYQo+PgplbmRvYmoKeHJlZgowIDYKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDA5IDAwMDAwIG4gCjAwMDAwMDAwNTggMDAwMDAgbiAKMDAwMDAwMDExNSAwMDAwMCBuIAowMDAwMDAwMjE1IDAwMDAwIG4gCjAwMDAwMDA1MzUgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSA2Ci9Sb290IDEgMCBSCj4+CnN0YXJ0eHJlZgo2NTUKJSVFT0Y='
    }
  ]);

  const [processingAssessment, setProcessingAssessment] = useState(null);

  // Handle application approval
  const handleApproveApplication = async (applicationId) => {
    setProcessingApplication(`approve-${applicationId}`);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const application = applications.find(app => app.id === applicationId);
      
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: 'Approved', approvedDate: new Date().toISOString() }
          : app
      ));
      
      // Update statistics
      setStats(prev => ({
        ...prev,
        pendingApprovals: prev.pendingApprovals - 1,
        approvedApplications: prev.approvedApplications + 1
      }));
      
      // Send notifications to all stakeholders
      const notificationMessage = `Building permit APPROVED for ${application.projectName}. Application ${applicationId} has been approved by government boards.`;
      
      const recipients = ['owner', 'consultant', 'engineer'];
      recipients.forEach(role => {
        console.log(`📧 Notification sent to ${role}: ${notificationMessage}`);
      });
      
      setProcessingApplication('');
      alert('✅ Application approved successfully! Notifications sent to all stakeholders.');
    } catch (error) {
      alert('❌ Failed to approve application. Please try again.');
      setProcessingApplication('');
    }
  };

  // Handle application rejection
  const handleRejectApplication = async (applicationId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;
    
    setProcessingApplication(`reject-${applicationId}`);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const application = applications.find(app => app.id === applicationId);
      
      setApplications(prev => prev.map(app => 
        app.id === applicationId 
          ? { ...app, status: 'Rejected', rejectedDate: new Date().toISOString(), rejectionReason: reason }
          : app
      ));
      
      // Update statistics
      setStats(prev => ({
        ...prev,
        pendingApprovals: prev.pendingApprovals - 1,
        rejectedApplications: prev.rejectedApplications + 1
      }));
      
      // Send notifications to all stakeholders
      const notificationMessage = `Building permit REJECTED for ${application.projectName}. Reason: ${reason}`;
      
      const recipients = ['owner', 'consultant', 'engineer'];
      recipients.forEach(role => {
        console.log(`📧 Notification sent to ${role}: ${notificationMessage}`);
      });
      
      setProcessingApplication('');
      alert('❌ Application rejected with reason provided. Notifications sent to all stakeholders.');
    } catch (error) {
      alert('❌ Failed to reject application. Please try again.');
      setProcessingApplication('');
    }
  };

  const handleApproveAssessment = async (assessmentId) => {
    setProcessingAssessment(`approve-${assessmentId}`);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const assessment = gisAssessments.find(a => a.id === assessmentId);
      
      setGisAssessments(prev => prev.map(assessment => 
        assessment.id === assessmentId 
          ? { ...assessment, status: 'Approved', approvedDate: new Date().toISOString() }
          : assessment
      ));
      
      // Send notifications to all stakeholders
      const notificationMessage = `Building permit APPROVED for ${assessment.projectName}. GIS Assessment ${assessmentId} has been approved by government boards.`;
      
      // Simulate sending notifications to owner, consultant, and engineer
      const recipients = ['owner', 'consultant', 'engineer'];
      recipients.forEach(role => {
        console.log(`📧 Notification sent to ${role}: ${notificationMessage}`);
      });
      
      setProcessingAssessment('');
      alert('✅ GIS Assessment approved successfully! Notifications sent to owner, consultant, and engineer.');
    } catch (error) {
      alert('❌ Failed to approve assessment. Please try again.');
    }
  };

  const handleRejectAssessment = async (assessmentId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (!reason) return;

    setProcessingAssessment(`reject-${assessmentId}`);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const assessment = gisAssessments.find(a => a.id === assessmentId);
      
      setGisAssessments(prev => prev.map(assessment => 
        assessment.id === assessmentId 
          ? { ...assessment, status: 'Rejected', rejectedDate: new Date().toISOString(), rejectionReason: reason }
          : assessment
      ));
      
      // Send notifications to all stakeholders
      const notificationMessage = `Building permit REJECTED for ${assessment.projectName}. Reason: ${reason}`;
      
      // Simulate sending notifications to owner, consultant, and engineer
      const recipients = ['owner', 'consultant', 'engineer'];
      recipients.forEach(role => {
        console.log(`📧 Notification sent to ${role}: ${notificationMessage}`);
      });
      
      setProcessingAssessment('');
      alert('❌ GIS Assessment rejected with reason provided. Notifications sent to all stakeholders.');
    } catch (error) {
      alert('❌ Failed to reject assessment. Please try again.');
    }
  };

  const handleDownloadGISReport = (assessment) => {
    if (assessment.reportUrl) {
      const link = document.createElement('a');
      link.href = assessment.reportUrl;
      link.download = `GIS_Assessment_Report_${assessment.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      alert('📥 GIS Assessment report downloaded successfully!');
    } else {
      alert('❌ Report not available for download.');
    }
  };

  const handleGenerateReport = async () => {
    setIsGeneratingReport(true);
    
    try {
      // Simulate report generation delay
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Generate comprehensive compliance report data
      const reportData = {
        reportId: `GOV-COMPLIANCE-${Date.now()}`,
        generatedBy: username,
        generatedAt: new Date().toISOString(),
        reportType: 'Government Compliance Report',
        period: 'January 2024',
        summary: {
          totalApplications: totalApplications,
          pendingApprovals: stats.pendingApprovals,
          approvedApplications: stats.approvedApplications,
          rejectedApplications: stats.rejectedApplications,
          completedApplications: stats.completedApplications,
          inspectionsScheduled: stats.inspectionsScheduled,
          approvalRate: Math.round((stats.approvedApplications / (stats.approvedApplications + stats.rejectedApplications)) * 100),
          averageProcessingTime: '14 days',
          complianceScore: '94%'
        },
        applications: [
          {
            id: 'BP-2024-007',
            projectName: 'Luxury Hotel',
            owner: 'Hotel Corp',
            status: 'Pending',
            submissionDate: '2024-01-10',
            reviewDate: '2024-01-15',
            complianceNotes: 'All documents submitted. Environmental assessment pending.'
          },
          {
            id: 'BP-2024-008',
            projectName: 'Medical Center',
            owner: 'Health Systems',
            status: 'Under Review',
            submissionDate: '2024-01-12',
            reviewDate: '2024-01-18',
            complianceNotes: 'Structural plans approved. Fire safety review in progress.'
          },
          {
            id: 'BP-2024-009',
            projectName: 'Educational Complex',
            owner: 'Edu Foundation',
            status: 'Approved',
            submissionDate: '2024-01-05',
            reviewDate: '2024-01-20',
            complianceNotes: 'All compliance requirements met. Permit issued.'
          }
        ],
        complianceMetrics: {
          documentCompleteness: '96%',
          timelySubmissions: '89%',
          regulatoryCompliance: '94%',
          safetyStandards: '98%',
          environmentalCompliance: '92%'
        },
        recommendations: [
          'Implement digital document verification system',
          'Reduce average processing time to 10 days',
          'Enhance environmental impact assessment procedures',
          'Increase coordination with fire safety department',
          'Establish automated notification system for applicants'
        ],
        inspections: [
          {
            projectId: 'BP-2024-006',
            inspectionType: 'Foundation',
            scheduledDate: '2024-01-25',
            status: 'Scheduled',
            inspector: 'Inspector Johnson'
          },
          {
            projectId: 'BP-2024-005',
            inspectionType: 'Final',
            scheduledDate: '2024-01-28',
            status: 'Scheduled',
            inspector: 'Inspector Williams'
          }
        ]
      };

      // Create downloadable compliance report
      const reportContent = `
GOVERNMENT COMPLIANCE REPORT
============================

Report ID: ${reportData.reportId}
Generated By: ${reportData.generatedBy}
Generated At: ${new Date(reportData.generatedAt).toLocaleString()}
Report Type: ${reportData.reportType}
Period: ${reportData.period}

EXECUTIVE SUMMARY
=================
Total Applications Processed: ${reportData.summary.totalApplications}
Pending Approvals: ${reportData.summary.pendingApprovals}
Approved Applications: ${reportData.summary.approvedApplications}
Rejected Applications: ${reportData.summary.rejectedApplications}
Scheduled Inspections: ${reportData.summary.inspectionsScheduled}
Approval Rate: ${reportData.summary.approvalRate}%
Average Processing Time: ${reportData.summary.averageProcessingTime}
Overall Compliance Score: ${reportData.summary.complianceScore}

COMPLIANCE METRICS
==================
Document Completeness: ${reportData.complianceMetrics.documentCompleteness}
Timely Submissions: ${reportData.complianceMetrics.timelySubmissions}
Regulatory Compliance: ${reportData.complianceMetrics.regulatoryCompliance}
Safety Standards: ${reportData.complianceMetrics.safetyStandards}
Environmental Compliance: ${reportData.complianceMetrics.environmentalCompliance}

DETAILED APPLICATION REVIEW
============================
${reportData.applications.map(app => `
Project: ${app.projectName} (${app.id})
Owner: ${app.owner}
Status: ${app.status}
Submission Date: ${app.submissionDate}
Review Date: ${app.reviewDate}
Compliance Notes: ${app.complianceNotes}
`).join('\n')}

SCHEDULED INSPECTIONS
=====================
${reportData.inspections.map(inspection => `
Project ID: ${inspection.projectId}
Inspection Type: ${inspection.inspectionType}
Scheduled Date: ${inspection.scheduledDate}
Status: ${inspection.status}
Inspector: ${inspection.inspector}
`).join('\n')}

RECOMMENDATIONS
===============
${reportData.recommendations.map((rec, index) => `${index + 1}. ${rec}`).join('\n')}

REGULATORY COMPLIANCE STATEMENT
===============================
This report confirms that all building permit applications have been processed
in accordance with local building codes, environmental regulations, and safety
standards. The government boards maintain a ${reportData.summary.complianceScore} compliance
score, exceeding the required 90% threshold.

Generated by Building Permissions Management System
Building Permits Authority - Government Boards
Report Date: ${new Date().toLocaleDateString()}
      `;

      // Download the report
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Government_Compliance_Report_${reportData.reportId}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert('✅ Government Compliance Report generated and downloaded successfully!');
    } catch (error) {
      alert('❌ Failed to generate compliance report. Please try again.');
    } finally {
      setIsGeneratingReport(false);
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
            <a className="nav-link text-white active bg-warning text-dark rounded mb-1" href="#dashboard" style={{fontWeight: '500'}}>
              <i className="bi bi-speedometer2 me-2"></i>Dashboard
            </a>
            <a className="nav-link text-white hover-bg-secondary rounded mb-1" onClick={() => navigate('/government-boards/view-submitted-documents')} style={{cursor: 'pointer', fontWeight: '500'}}>
              <i className="bi bi-file-earmark-text me-2"></i>Review Applications
            </a>
            <a className="nav-link text-white hover-bg-secondary rounded mb-1" onClick={() => navigate('/government-boards/send-notification')} style={{cursor: 'pointer', fontWeight: '500'}}>
              <i className="bi bi-send me-2"></i>Send Notifications
            </a>
            <a className="nav-link text-white hover-bg-secondary rounded mb-1" href="#inspections" style={{fontWeight: '500'}}>
              <i className="bi bi-building me-2"></i>Manage Inspections
            </a>
            <a className="nav-link text-white hover-bg-secondary rounded mb-1" href="#compliance" style={{fontWeight: '500'}}>
              <i className="bi bi-shield-check me-2"></i>Compliance Reports
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
              <h1 className="fw-bold text-dark mb-1">Government Dashboard</h1>
              <p className="text-muted mb-0">Building Permits Management System</p>
            </div>
            <div className="text-end">
              <div className="text-muted small">Welcome back,</div>
              <div className="fw-bold text-dark">{username}</div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="row mb-4">
            <div className="col-lg-3 col-md-6 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body bg-gradient" style={{background: 'linear-gradient(135deg, #ffc107 0%, #ffca2c 100%)'}}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-dark">
                      <h2 className="fw-bold mb-1">{totalApplications}</h2>
                      <p className="mb-0 fw-medium">Total Applications</p>
                      <small className="opacity-75">All submitted permits</small>
                    </div>
                    <div className="text-dark opacity-75">
                      <i className="bi bi-file-earmark-text" style={{fontSize: '2.5rem'}}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body bg-gradient" style={{background: 'linear-gradient(135deg, #dc3545 0%, #e55a6b 100%)'}}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-dark">
                      <h2 className="fw-bold mb-1">{stats.pendingApprovals}</h2>
                      <p className="mb-0 fw-medium">Pending Review</p>
                      <small className="opacity-75">Awaiting decision</small>
                    </div>
                    <div className="text-dark opacity-75">
                      <i className="bi bi-clock-history" style={{fontSize: '2.5rem'}}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body bg-gradient" style={{background: 'linear-gradient(135deg, #198754 0%, #20c997 100%)'}}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-dark">
                      <h2 className="fw-bold mb-1">{stats.approvedApplications}</h2>
                      <p className="mb-0 fw-medium">Approved</p>
                      <small className="opacity-75">Successfully processed</small>
                    </div>
                    <div className="text-dark opacity-75">
                      <i className="bi bi-check-circle-fill" style={{fontSize: '2.5rem'}}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body bg-gradient" style={{background: 'linear-gradient(135deg, #6f42c1 0%, #8a63d2 100%)'}}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-dark">
                      <h2 className="fw-bold mb-1">{stats.rejectedApplications}</h2>
                      <p className="mb-0 fw-medium">Rejected</p>
                      <small className="opacity-75">Not approved</small>
                    </div>
                    <div className="text-dark opacity-75">
                      <i className="bi bi-x-circle-fill" style={{fontSize: '2.5rem'}}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-4 mb-3">
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body bg-gradient" style={{background: 'linear-gradient(135deg, #fd7e14 0%, #ff922b 100%)'}}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div className="text-dark">
                      <h2 className="fw-bold mb-1">{stats.completedApplications}</h2>
                      <p className="mb-0 fw-medium">Completed</p>
                      <small className="opacity-75">This month</small>
                    </div>
                    <div className="text-dark opacity-75">
                      <i className="bi bi-clipboard-check-fill" style={{fontSize: '2.5rem'}}></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <button 
                className="btn btn-outline-light btn-lg w-100 h-100 d-flex flex-column align-items-center justify-content-center p-4"
                onClick={handleGenerateReport}
                disabled={isGeneratingReport}
              >
                {isGeneratingReport ? (
                  <>
                    <div className="spinner-border text-warning fs-1 mb-3" role="status"></div>
                    <h5 className="fw-bold mb-2">Generating...</h5>
                    <small className="text-muted">Please wait</small>
                  </>
                ) : (
                  <>
                    <i className="bi bi-file-earmark-bar-graph fs-1 mb-3 text-warning"></i>
                    <h5 className="fw-bold mb-2">Generate Report</h5>
                    <small className="text-muted">Create compliance reports</small>
                  </>
                )}
              </button>
            </div>
            <div className="col-md-4 mb-3">
              <button className="btn btn-outline-primary btn-lg w-100 h-100 d-flex flex-column align-items-center justify-content-center p-4" onClick={() => navigate('/government-boards/view-submitted-documents')}>
                <i className="bi bi-file-earmark-check fs-1 mb-3 text-primary"></i>
                <h5 className="fw-bold mb-2">Review Applications</h5>
                <small className="text-muted">Process pending permits</small>
              </button>
            </div>
            <div className="col-md-4 mb-3">
              <button className="btn btn-outline-info btn-lg w-100 h-100 d-flex flex-column align-items-center justify-content-center p-4" onClick={() => navigate('/government-boards/send-notification')}>
                <i className="bi bi-send fs-1 mb-3 text-info"></i>
                <h5 className="fw-bold mb-2">Send Notifications</h5>
                <small className="text-muted">Notify applicants</small>
              </button>
            </div>
          </div>

          {/* Building Permit Applications */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold text-dark">Building Permit Applications</h5>
                  <small className="text-muted">Review and approve/reject building permit applications</small>
                </div>
                <span className="badge bg-warning fs-6">{applications.filter(app => app.status === 'Pending Review').length} pending approval</span>
              </div>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover align-middle">
                  <thead className="table-light">
                    <tr>
                      <th className="fw-semibold">Application ID</th>
                      <th className="fw-semibold">Project</th>
                      <th className="fw-semibold">Owner</th>
                      <th className="fw-semibold">Type</th>
                      <th className="fw-semibold">Priority</th>
                      <th className="fw-semibold">Status</th>
                      <th className="fw-semibold">Submission Date</th>
                      <th className="fw-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {applications.map((application) => (
                      <tr key={application.id}>
                        <td><span className="fw-medium text-primary">{application.id}</span></td>
                        <td>
                          <div className="fw-medium">{application.projectName}</div>
                          <small className="text-muted">{application.location}</small>
                        </td>
                        <td>{application.ownerName}</td>
                        <td>
                          <span className="badge bg-secondary-subtle text-secondary-emphasis">
                            {application.projectType}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${
                            application.priority === 'Critical' ? 'bg-danger-subtle text-danger-emphasis' :
                            application.priority === 'High' ? 'bg-warning-subtle text-warning-emphasis' :
                            'bg-info-subtle text-info-emphasis'
                          }`}>
                            {application.priority}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${
                            application.status === 'Pending Review' ? 'bg-warning-subtle text-warning-emphasis' :
                            application.status === 'Approved' ? 'bg-success-subtle text-success-emphasis' :
                            application.status === 'Rejected' ? 'bg-danger-subtle text-danger-emphasis' :
                            'bg-secondary-subtle text-secondary-emphasis'
                          }`}>
                            {application.status}
                          </span>
                        </td>
                        <td>{new Date(application.submissionDate).toLocaleDateString()}</td>
                        <td>
                          <div className="btn-group" role="group">
                            {application.status === 'Pending Review' && (
                              <>
                                <button 
                                  className="btn btn-sm btn-success"
                                  onClick={() => handleApproveApplication(application.id)}
                                  disabled={processingApplication === `approve-${application.id}`}
                                  title="Approve Application"
                                >
                                  {processingApplication === `approve-${application.id}` ? (
                                    <span className="spinner-border spinner-border-sm" role="status"></span>
                                  ) : (
                                    <i className="bi bi-check-lg"></i>
                                  )}
                                </button>
                                <button 
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleRejectApplication(application.id)}
                                  disabled={processingApplication === `reject-${application.id}`}
                                  title="Reject Application"
                                >
                                  {processingApplication === `reject-${application.id}` ? (
                                    <span className="spinner-border spinner-border-sm" role="status"></span>
                                  ) : (
                                    <i className="bi bi-x-lg"></i>
                                  )}
                                </button>
                              </>
                            )}
                            <button 
                              className="btn btn-sm btn-secondary"
                              title="View Application Details"
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button 
                              className="btn btn-sm btn-primary"
                              title="Download Documents"
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

          {/* GIS Assessment Management */}
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-header bg-white border-0 pb-0">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="fw-bold text-dark">GIS Assessment Management</h5>
                  <small className="text-muted">Review and approve GIS assessment reports for building permits</small>
                </div>
                <span className="badge bg-info fs-6">{gisAssessments.filter(a => a.status === 'Assessment Complete').length} awaiting approval</span>
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
                          <small className="text-muted">{assessment.projectId} - {assessment.owner}</small>
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
                          <span className={`badge ${
                            assessment.status === 'Assessment Complete' ? 'bg-success-subtle text-success-emphasis' :
                            assessment.status === 'Approved' ? 'bg-primary-subtle text-primary-emphasis' :
                            assessment.status === 'Rejected' ? 'bg-danger-subtle text-danger-emphasis' :
                            'bg-warning-subtle text-warning-emphasis'
                          }`}>
                            {assessment.status}
                          </span>
                        </td>
                        <td>{assessment.completionDate ? new Date(assessment.completionDate).toLocaleDateString() : '-'}</td>
                        <td>
                          <div className="btn-group" role="group">
                            {assessment.status === 'Assessment Complete' && (
                              <>
                                <button 
                                  className="btn btn-sm btn-success"
                                  onClick={() => handleApproveAssessment(assessment.id)}
                                  disabled={processingAssessment === `approve-${assessment.id}`}
                                  title="Approve GIS Assessment"
                                >
                                  {processingAssessment === `approve-${assessment.id}` ? (
                                    <span className="spinner-border spinner-border-sm" role="status"></span>
                                  ) : (
                                    <i className="bi bi-check-lg"></i>
                                  )}
                                </button>
                                <button 
                                  className="btn btn-sm btn-danger"
                                  onClick={() => handleRejectAssessment(assessment.id)}
                                  disabled={processingAssessment === `reject-${assessment.id}`}
                                  title="Reject GIS Assessment"
                                >
                                  {processingAssessment === `reject-${assessment.id}` ? (
                                    <span className="spinner-border spinner-border-sm" role="status"></span>
                                  ) : (
                                    <i className="bi bi-x-lg"></i>
                                  )}
                                </button>
                              </>
                            )}
                            {assessment.reportUrl && (
                              <button 
                                className="btn btn-sm btn-primary"
                                onClick={() => handleDownloadGISReport(assessment)}
                                title="Download GIS Report"
                              >
                                <i className="bi bi-download"></i>
                              </button>
                            )}
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

          {/* Recent Activities */}
          <div className="card border-0 shadow-sm">
            <div className="card-header bg-white border-0 pb-0">
              <h5 className="fw-bold text-dark">Recent Activities</h5>
              <small className="text-muted">Latest system activities and updates</small>
            </div>
            <div className="card-body">
              <div className="timeline">
                <div className="d-flex mb-4">
                  <div className="flex-shrink-0">
                    <div className="bg-success rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                      <i className="bi bi-check-lg text-white"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <div className="fw-semibold text-dark">Application Approved</div>
                    <p className="text-muted mb-1 small">Building permit BP-2024-006 for Office Complex has been approved and notification sent to applicant.</p>
                    <small className="text-success fw-medium">2 hours ago</small>
                  </div>
                </div>
                <div className="d-flex mb-4">
                  <div className="flex-shrink-0">
                    <div className="bg-info rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                      <i className="bi bi-calendar-check text-white"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <div className="fw-semibold text-dark">Inspection Scheduled</div>
                    <p className="text-muted mb-1 small">Site inspection scheduled for BP-2024-007 Luxury Hotel project on January 26, 2024.</p>
                    <small className="text-info fw-medium">4 hours ago</small>
                  </div>
                </div>
                <div className="d-flex mb-4">
                  <div className="flex-shrink-0">
                    <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                      <i className="bi bi-send text-white"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <div className="fw-semibold text-dark">Notification Sent</div>
                    <p className="text-muted mb-1 small">Approval notification sent to Hotel Corp for BP-2024-007 application status update.</p>
                    <small className="text-primary fw-medium">1 day ago</small>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="flex-shrink-0">
                    <div className="bg-secondary rounded-circle d-flex align-items-center justify-content-center" style={{width: '40px', height: '40px'}}>
                      <i className="bi bi-file-earmark-bar-graph text-white"></i>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3">
                    <div className="fw-semibold text-dark">Compliance Report Generated</div>
                    <p className="text-muted mb-1 small">Monthly compliance report for January 2024 has been generated and distributed to stakeholders.</p>
                    <small className="text-secondary fw-medium">2 days ago</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GovernmentBoardsDashboard;
