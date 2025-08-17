import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';

function SendNotification() {
  const navigate = useNavigate();
  const username = localStorage.getItem('currentUserUsername');
  const [notification, setNotification] = useState({
    recipient: '',
    subject: '',
    message: '',
    priority: 'normal'
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setNotification({ ...notification, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Notification sent successfully!');
    setNotification({
      recipient: '',
      subject: '',
      message: '',
      priority: 'normal'
    });
  };

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className="bg-warning text-dark" style={{ width: '250px', minHeight: '100vh' }}>
        <div className="p-3">
          <h5 className="text-center mb-4">Government Panel</h5>
          <nav className="nav flex-column">
            <a className="nav-link text-dark" onClick={() => navigate('/government-boards')} style={{cursor: 'pointer'}}>
              <i className="bi bi-speedometer2 me-2"></i>Dashboard
            </a>
            <a className="nav-link text-dark" onClick={() => navigate('/government-boards/view-submitted-documents')} style={{cursor: 'pointer'}}>
              <i className="bi bi-file-earmark-text me-2"></i>Review Applications
            </a>
            <a className="nav-link text-dark active" onClick={() => navigate('/government-boards/send-notification')} style={{cursor: 'pointer'}}>
              <i className="bi bi-send me-2"></i>Send Notifications
            </a>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        <Header username={username} />
        
        <div className="p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Send Notification</h2>
            <button className="btn btn-outline-secondary" onClick={() => navigate('/government-boards')}>
              Back to Dashboard
            </button>
          </div>

          {status && <div className="alert alert-success">{status}</div>}

          <div className="card">
            <div className="card-header">
              <h5>Send Notification to Stakeholders</h5>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label className="form-label">Recipient</label>
                    <select 
                      className="form-select" 
                      name="recipient" 
                      value={notification.recipient} 
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Recipient</option>
                      <option value="owners">Property Owners</option>
                      <option value="consultants">Consultants</option>
                      <option value="engineers">Engineers</option>
                      <option value="specific-project">Specific Project</option>
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Priority</label>
                    <select 
                      className="form-select" 
                      name="priority" 
                      value={notification.priority} 
                      onChange={handleChange}
                    >
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>
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
                    rows="6" 
                    name="message" 
                    value={notification.message} 
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-warning">
                    <i className="bi bi-send me-2"></i>Send Notification
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => setNotification({recipient: '', subject: '', message: '', priority: 'normal'})}>
                    Clear Form
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SendNotification;