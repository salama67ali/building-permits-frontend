// src/pages/admin/SendNotifications.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';

const apiBase = 'http://localhost:8080';

function SendNotifications() {
  const navigate = useNavigate();
  const username = localStorage.getItem('currentUserUsername');

  const [notification, setNotification] = useState({
    recipient: '',
    subject: '',
    message: '',
    type: 'info',
    email: '' // optional: send to specific email
  });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null); // backend response

  const authHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleChange = (e) => {
    setNotification({ ...notification, [e.target.name]: e.target.value });
  };

  const mapRecipientToPayload = (recipient) => {
    switch (recipient) {
      case 'all-owners': return { role: 'OWNER' };
      case 'all-consultants': return { role: 'CONSULTANT' };
      case 'all-engineers': return { role: 'ENGINEER' };
      case 'all-government': return { role: 'GOVERNMENT_BOARD' };
      case 'all-users': default: return {}; // no role/email -> all users
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setError('');
    setResult(null);

    const subject = notification.subject.trim();
    const message = notification.message.trim();
    const email = notification.email.trim();

    if (!subject || !message) {
      setError('Subject and message are required.');
      return;
    }

    try {
      setSending(true);
      // If email provided, backend prioritizes email over role
      const body = email
        ? { subject, message, email }
        : { subject, message, ...mapRecipientToPayload(notification.recipient) };

      const { data } = await axios.post(
        `${apiBase}/api/admin/notifications`,
        body,
        { headers: { ...authHeaders(), 'Content-Type': 'application/json' } }
      );

      setResult(data);
      setStatus('Notification sent successfully!');
      setNotification({ recipient: '', subject: '', message: '', type: 'info', email: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send notification.');
    } finally {
      setSending(false);
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
            <a className="nav-link text-white" onClick={() => navigate('/admin/view-submissions')} style={{cursor: 'pointer'}}>
              <i className="bi bi-file-earmark-text me-2"></i>Applications
            </a>
            <a className="nav-link text-white active" onClick={() => navigate('/admin/send-notifications')} style={{cursor: 'pointer'}}>
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
            <h2>Send Notifications</h2>
            <button className="btn btn-outline-secondary" onClick={() => navigate('/admin')}>
              Back to Dashboard
            </button>
          </div>

          {status && <div className="alert alert-success">{status}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="card">
            <div className="card-header">
              <h5>Create New Notification</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Recipient Group</label>
                    <select 
                      className="form-select" 
                      name="recipient" 
                      value={notification.recipient} 
                      onChange={handleChange}
                    >
                      <option value="">All Users</option>
                      <option value="all-owners">All Owners</option>
                      <option value="all-consultants">All Consultants</option>
                      <option value="all-engineers">All Engineers</option>
                      <option value="all-government">All Government Boards</option>
                      <option value="all-users">All Users</option>
                    </select>
                    <div className="form-text">
                      If you provide a specific email below, it will override the group.
                    </div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Notification Type</label>
                    <select 
                      className="form-select" 
                      name="type" 
                      value={notification.type} 
                      onChange={handleChange}
                    >
                      <option value="info">Information</option>
                      <option value="warning">Warning</option>
                      <option value="success">Success</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label">Specific Email (optional)</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    placeholder="user@example.com"
                    value={notification.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Subject</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    name="subject" 
                    value={notification.subject} 
                    onChange={handleChange}
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Message</label>
                  <textarea 
                    className="form-control" 
                    rows="5" 
                    name="message" 
                    value={notification.message} 
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-primary" disabled={sending}>
                    {sending ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Sending...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>Send Notification
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => { setNotification({recipient: '', subject: '', message: '', type: 'info', email: ''}); setStatus(''); setError(''); setResult(null); }}
                    disabled={sending}
                  >
                    Clear Form
                  </button>
                </div>
              </form>
            </div>
          </div>

          {result && (
            <div className="card mt-3">
              <div className="card-body">
                <div className="mb-1"><strong>Backend Response:</strong></div>
                <div className="small text-muted">Message: {result.message}</div>
                {'count' in result && <div className="small text-muted">Recipients: {result.count}</div>}
                {Array.isArray(result.recipients) && result.recipients.length > 0 && (
                  <div className="mt-2">
                    <div className="small fw-semibold mb-1">Recipient Emails:</div>
                    <ul className="small">
                      {result.recipients.map((r,i) => <li key={i}>{r}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Recent Notifications (static examples) */}
          <div className="card mt-4">
            <div className="card-header">
              <h5>Recent Notifications</h5>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Recipient</th>
                      <th>Subject</th>
                      <th>Type</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2024-01-22</td>
                      <td>All Owners</td>
                      <td>System Maintenance Notice</td>
                      <td><span className="badge bg-warning">Warning</span></td>
                      <td><span className="badge bg-success">Sent</span></td>
                    </tr>
                    <tr>
                      <td>2024-01-21</td>
                      <td>All Users</td>
                      <td>New Feature Update</td>
                      <td><span className="badge bg-info">Info</span></td>
                      <td><span className="badge bg-success">Sent</span></td>
                    </tr>
                    <tr>
                      <td>2024-01-20</td>
                      <td>All Government Boards</td>
                      <td>Policy Update Required</td>
                      <td><span className="badge bg-danger">Urgent</span></td>
                      <td><span className="badge bg-success">Sent</span></td>
                    </tr>
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

export default SendNotifications;