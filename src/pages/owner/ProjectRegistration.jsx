import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { createProject } from '../../services/api';

function ProjectRegistration() {
  const userId = localStorage.getItem('currentUserId');
  const username = localStorage.getItem('currentUserUsername');

  const [form, setForm] = useState({
    projectName: '',
    description: '',
    address: '',
    areaName: '',
    coordinateFormat: 'geojson',
    coordinatesText: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    setResult(null);

    try {
      const payload = {
        ownerId: userId,
        projectName: form.projectName,
        description: form.description,
        address: form.address,
        areaName: form.areaName,
        geometryFormat: form.coordinateFormat, // 'geojson' | 'wkt' | 'latlng'
        geometryText: form.coordinatesText,
      };
      const res = await createProject(payload);
      setResult(res); // expect { projectId, status, gisAssessment: { risks: [...] , summary: ... } }
    } catch (e1) {
      setError(e1.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container d-flex">
      <Sidebar role="owner" />
      <div className="main-content flex-grow-1">
        <Header username={username} />
        <div className="container mt-3">
          <div className="card">
            <div className="card-header">Project Registration</div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label">Project Name</label>
                    <input name="projectName" className="form-control" value={form.projectName} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Area Name</label>
                    <input name="areaName" className="form-control" value={form.areaName} onChange={handleChange} required />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Address</label>
                    <input name="address" className="form-control" value={form.address} onChange={handleChange} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Description</label>
                    <textarea name="description" className="form-control" rows={3} value={form.description} onChange={handleChange} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Coordinates Format</label>
                    <select name="coordinateFormat" className="form-select" value={form.coordinateFormat} onChange={handleChange}>
                      <option value="geojson">GeoJSON (Polygon)</option>
                      <option value="wkt">WKT (POLYGON)</option>
                      <option value="latlng">Lat,Lng pairs (one per line)</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Coordinates</label>
                    <textarea
                      name="coordinatesText"
                      className="form-control"
                      rows={6}
                      placeholder={
                        form.coordinateFormat === 'geojson'
                          ? '{ "type": "Polygon", "coordinates": [[[lng,lat],...]] }'
                          : form.coordinateFormat === 'wkt'
                          ? 'POLYGON((lng lat, lng lat, ...))'
                          : 'lat,lng\nlat,lng\n...'
                      }
                      value={form.coordinatesText}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                {error && <div className="text-danger mt-2">{error}</div>}
                <div className="mt-3">
                  <button className="btn btn-primary" disabled={submitting} type="submit">
                    {submitting ? 'Submitting...' : 'Submit for GIS Assessment'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {result && (
            <div className="card mt-3">
              <div className="card-header">GIS Assessment Result</div>
              <div className="card-body">
                <p><strong>Project ID:</strong> {result.projectId}</p>
                <p><strong>Status:</strong> {result.status}</p>
                {result.gisAssessment?.summary && <p>{result.gisAssessment.summary}</p>}
                {Array.isArray(result.gisAssessment?.risks) && result.gisAssessment.risks.length > 0 ? (
                  <ul>
                    {result.gisAssessment.risks.map((r, idx) => (
                      <li key={idx}>
                        <strong>{r.type}</strong>: level {r.level} - {r.impact}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No significant risks detected.</p>
                )}
                <div className="alert alert-info mt-2">
                  Your application has been submitted for review. Government Boards will review and notify you.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectRegistration;