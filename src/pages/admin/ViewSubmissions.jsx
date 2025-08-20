// src/pages/admin/ViewSubmissions.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';

const apiBase = 'http://localhost:8080';

function ViewSubmissions() {
  const navigate = useNavigate();
  const username = localStorage.getItem('currentUserUsername');

  const [statuses, setStatuses] = useState([]);
  const [page, setPage] = useState(0);
  const size = 10;
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  const authHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const loadStatuses = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${apiBase}/api/admin/permission-status`, {
        headers: authHeaders(),
        params: { page, size }
      });
      setStatuses(data.items ?? []);
    } catch {
      // silently ignore for now
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadStatuses(); }, [page]);

  const updateStatus = async (projectId, newStatus) => {
    try {
      await axios.put(`${apiBase}/api/projects/${projectId}/status`, null, {
        headers: authHeaders(),
        params: { status: newStatus }
      });
      setActionMsg(`Project ${projectId} set to ${newStatus}.`);
      setTimeout(() => setActionMsg(''), 2000);
      loadStatuses();
    } catch {
      setActionMsg('Failed to update status.');
      setTimeout(() => setActionMsg(''), 2000);
    }
  };

  return (
    <div className="d-flex flex-column flex-md-row">
      {/* Sidebar */}
      <div className="bg-dark text-white d-none d-md-block" style={{ width: '250px', minHeight: '100vh' }}>
        <div className="p-3">
          <h5 className="text-center mb-4">Admin Panel</h5>
          <nav className="nav flex-column">
            <a className="nav-link text-white" onClick={() => navigate('/admin')} style={{cursor: 'pointer'}}>
              <i className="bi bi-speedometer2 me-2"></i>Dashboard
            </a>
            <a className="nav-link text-white" onClick={() => navigate('/admin/manage-users')} style={{cursor: 'pointer'}}>
              <i className="bi bi-people me-2"></i>Manage Users
            </a>
            <a className="nav-link text-white active" onClick={() => navigate('/admin/view-submissions')} style={{cursor: 'pointer'}}>
              <i className="bi bi-file-earmark-text me-2"></i>Applications
            </a>
            <a className="nav-link text-white" onClick={() => navigate('/admin/send-notifications')} style={{cursor: 'pointer'}}>
              <i className="bi bi-bell me-2"></i>Send Notifications
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        <Header username={username} />
        
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>View Submissions</h2>
            <button className="btn btn-outline-secondary" onClick={() => navigate('/admin')}>
              Back to Dashboard
            </button>
          </div>

          {actionMsg && <div className="alert alert-info py-2">{actionMsg}</div>}

          <div className="card">
            <div className="card-header d-flex justify-content-between">
              <h5 className="mb-0">All Application Submissions</h5>
              <div>
                <button
                  className="btn btn-sm btn-outline-secondary me-2"
                  disabled={page<=0}
                  onClick={()=>setPage(p=>p-1)}
                >
                  Prev
                </button>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={()=>setPage(p=>p+1)}
                >
                  Next
                </button>
              </div>
            </div>
            <div className="card-body">
              {loading ? (
                <div className="text-center text-muted">Loading...</div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Project ID</th>
                        <th>Project Name</th>
                        <th>Status</th>
                        <th>Submitted</th>
                        <th>Approved</th>
                        <th>Completed</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statuses.length ? statuses.map((s) => (
                        <tr key={s.projectId}>
                          <td>{s.projectId}</td>
                          <td>{s.projectName}</td>
                          <td>
                            <span className="badge bg-secondary">{s.status}</span>
                          </td>
                          <td>{s.submissionDate ? new Date(s.submissionDate).toLocaleString() : '-'}</td>
                          <td>{s.approvalDate ? new Date(s.approvalDate).toLocaleString() : '-'}</td>
                          <td>{s.completionDate ? new Date(s.completionDate).toLocaleString() : '-'}</td>
                          <td>
                            <button className="btn btn-sm btn-outline-success me-1" onClick={() => updateStatus(s.projectId, 'approved')}>Approve</button>
                            <button className="btn btn-sm btn-outline-danger" onClick={() => updateStatus(s.projectId, 'rejected')}>Reject</button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan="7" className="text-center text-muted">No submissions.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ViewSubmissions;