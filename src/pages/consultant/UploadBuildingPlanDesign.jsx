// src/pages/consultant/UploadBuildingPlanDesign.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_BASE = 'http://localhost:8080';

function UploadBuildingPlanDesign() {
  const navigate = useNavigate();
  const username = localStorage.getItem('currentUserUsername');
  const consultantId = Number(localStorage.getItem('currentUserId'));
  
  const [projects, setProjects] = useState([]);
  const [uploadData, setUploadData] = useState({
    projectId: '',
    designType: 'architectural',
    file: null,
    description: ''
  });
  const [status, setStatus] = useState('');
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const authHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/projects`, { headers: authHeaders() });
      setProjects(response.data);
    } catch (err) {
      console.error('Error fetching projects:', err);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'file') {
      setUploadData({ ...uploadData, file: e.target.files[0] });
    } else {
      setUploadData({ ...uploadData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setError('');

    if (!uploadData.file) {
      setError('Please select a file to upload.');
      return;
    }

    if (!uploadData.projectId) {
      setError('Please select a project.');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', uploadData.file);
      formData.append('projectId', uploadData.projectId);
      formData.append('designType', uploadData.designType);
      formData.append('description', uploadData.description);
      formData.append('consultantId', consultantId);

      await axios.post(`${API_BASE}/api/documents/upload`, formData, {
        headers: {
          ...authHeaders(),
          'Content-Type': 'multipart/form-data'
        }
      });

      setStatus('Building plan design uploaded successfully!');
      setUploadData({
        projectId: '',
        designType: 'architectural',
        file: null,
        description: ''
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to upload design.');
    } finally {
      setUploading(false);
    }
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
            <a className="nav-link text-white active" onClick={() => navigate('/consultant/upload-building-plan-design')} style={{cursor: 'pointer'}}>
              <i className="bi bi-upload me-2"></i>Upload Designs
            </a>
            <a className="nav-link text-white" onClick={() => navigate('/consultant/view-documents')} style={{cursor: 'pointer'}}>
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
            <h2>Upload Building Plan Design</h2>
            <button className="btn btn-outline-secondary" onClick={() => navigate('/consultant')}>
              Back to Dashboard
            </button>
          </div>

          {status && <div className="alert alert-success">{status}</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          <div className="row">
            <div className="col-md-8">
              <div className="card">
                <div className="card-header">
                  <h5>Upload New Design</h5>
                </div>
                <div className="card-body">
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label className="form-label">Project *</label>
                      <select 
                        className="form-select" 
                        name="projectId" 
                        value={uploadData.projectId} 
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select a project</option>
                        {projects.map(project => (
                          <option key={project.id} value={project.id}>
                            {project.projectName} - {project.address}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Design Type</label>
                      <select 
                        className="form-select" 
                        name="designType" 
                        value={uploadData.designType} 
                        onChange={handleChange}
                      >
                        <option value="architectural">Architectural Plans</option>
                        <option value="structural">Structural Design</option>
                        <option value="electrical">Electrical Plans</option>
                        <option value="plumbing">Plumbing Design</option>
                        <option value="hvac">HVAC Design</option>
                        <option value="landscape">Landscape Design</option>
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Design File *</label>
                      <input 
                        type="file" 
                        className="form-control" 
                        name="file" 
                        onChange={handleChange}
                        accept=".pdf,.dwg,.dxf,.png,.jpg,.jpeg"
                        required 
                      />
                      <small className="text-muted">Accepted formats: PDF, DWG, DXF, PNG, JPG, JPEG (Max: 25MB)</small>
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea 
                        className="form-control" 
                        rows="4" 
                        name="description" 
                        value={uploadData.description} 
                        onChange={handleChange}
                        placeholder="Describe the design details, revisions, or special considerations..."
                      ></textarea>
                    </div>

                    <div className="d-flex gap-2">
                      <button type="submit" className="btn btn-info" disabled={uploading}>
                        {uploading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2"></span>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-upload me-2"></i>Upload Design
                          </>
                        )}
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={() => setUploadData({projectId: '', designType: 'architectural', file: null, description: ''})}>
                        Clear Form
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card">
                <div className="card-header">
                  <h5>Upload Guidelines</h5>
                </div>
                <div className="card-body">
                  <div className="alert alert-info">
                    <h6>Design Standards:</h6>
                    <ul className="mb-0 small">
                      <li>Follow local building codes</li>
                      <li>Include proper dimensions</li>
                      <li>Add material specifications</li>
                      <li>Include revision history</li>
                      <li>Ensure drawings are to scale</li>
                    </ul>
                  </div>
                  <div className="alert alert-warning">
                    <strong>Quality Check:</strong> All designs will be reviewed by engineers before approval.
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

export default UploadBuildingPlanDesign;