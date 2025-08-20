// src/pages/owner/ProjectRegistration.jsx
import React, { useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

const API_BASE = 'http://localhost:8080';

function ProjectRegistration() {
  const ownerId = Number(localStorage.getItem('currentUserId'));
  const username = localStorage.getItem('currentUserUsername');

  const [form, setForm] = useState({
    projectName: '',
    description: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    areaName: '',
    coordinateFormat: 'latlng',
    coordinatesText: '',
    projectType: 'residential',
    buildingHeight: '',
    plotSize: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [assessmentStep, setAssessmentStep] = useState('form'); // 'form' | 'assessing' | 'results'

  const authHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const handleChange = (e) => {
    setForm((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  // Mock GIS Assessment function - front-end only
  const performGISAssessment = (coordinates, projectType, buildingHeight, plotSize) => {
    let centerLat, centerLng;
    if (form.coordinateFormat === 'latlng') {
      const lines = coordinates.split('\n').filter(line => line.trim());
      if (lines.length > 0) {
        const [lat, lng] = lines[0].split(',').map(coord => parseFloat(coord.trim()));
        centerLat = lat;
        centerLng = lng;
      }
    }
    const risks = [];
    const assessmentId = `GIS-${Date.now()}`;

    const floodRisk = centerLat && centerLat < -1.0 ? 'high' : centerLat < 0 ? 'moderate' : 'low';
    risks.push({
      type: 'Flood Risk',
      level: floodRisk,
      impact: floodRisk === 'high' ? 'High probability of flooding during rainy seasons' :
              floodRisk === 'moderate' ? 'Moderate flood risk, drainage required' : 'Low flood risk',
      mitigation: floodRisk === 'high' ? 'Elevated foundation, proper drainage system required' :
                  floodRisk === 'moderate' ? 'Install adequate drainage systems' : 'Standard construction practices sufficient'
    });

    const erosionRisk = Math.abs(centerLng) > 35 ? 'high' : Math.abs(centerLng) > 34 ? 'moderate' : 'low';
    risks.push({
      type: 'Soil Erosion',
      level: erosionRisk,
      impact: erosionRisk === 'high' ? 'High risk of soil erosion and landslides' :
              erosionRisk === 'moderate' ? 'Moderate erosion risk on slopes' : 'Minimal erosion risk',
      mitigation: erosionRisk === 'high' ? 'Terracing, retaining walls, and vegetation cover required' :
                  erosionRisk === 'moderate' ? 'Slope stabilization recommended' : 'Standard soil conservation practices'
    });

    const seismicRisk = centerLat && Math.abs(centerLat + 1) < 2 ? 'high' : 'moderate';
    risks.push({
      type: 'Seismic Activity',
      level: seismicRisk,
      impact: seismicRisk === 'high' ? 'High earthquake risk zone - special construction required' :
              'Moderate seismic activity possible',
      mitigation: seismicRisk === 'high' ? 'Earthquake-resistant design, reinforced foundation required' :
                  'Standard seismic building codes compliance'
    });

    const volcanicRisk = centerLat && centerLat > -2 && centerLat < 2 && Math.abs(centerLng - 37) < 3 ? 'moderate' : 'low';
    risks.push({
      type: 'Volcanic Activity',
      level: volcanicRisk,
      impact: volcanicRisk === 'moderate' ? 'Located near volcanic region - ash fall possible' : 'Low volcanic risk',
      mitigation: volcanicRisk === 'moderate' ? 'Ash-resistant roofing, air filtration systems recommended' :
                  'No special volcanic precautions required'
    });

    const environmentalImpact = projectType === 'industrial' ? 'high' :
                                projectType === 'commercial' ? 'moderate' : 'low';
    risks.push({
      type: 'Environmental Impact',
      level: environmentalImpact,
      impact: environmentalImpact === 'high' ? 'Significant environmental impact expected' :
              environmentalImpact === 'moderate' ? 'Moderate environmental considerations' :
              'Minimal environmental impact',
      mitigation: environmentalImpact === 'high' ? 'EIA required, waste management plan needed' :
                  environmentalImpact === 'moderate' ? 'Environmental monitoring recommended' :
                  'Standard environmental practices sufficient'
    });

    const highRisks = risks.filter(r => r.level === 'high').length;
    const moderateRisks = risks.filter(r => r.level === 'moderate').length;
    const overallRisk = highRisks > 2 ? 'high' : (highRisks > 0 || moderateRisks > 3) ? 'moderate' : 'low';

    return {
      assessmentId,
      coordinates: { lat: centerLat, lng: centerLng },
      overallRisk,
      risks,
      recommendations: {
        approval: overallRisk === 'low' ? 'recommended' :
                  overallRisk === 'moderate' ? 'conditional' : 'requires_detailed_study',
        conditions: overallRisk === 'high' ? [
          'Detailed geological survey required',
          'Environmental Impact Assessment (EIA) mandatory',
          'Specialized engineering design needed',
          'Regular monitoring during construction'
        ] : overallRisk === 'moderate' ? [
          'Site-specific mitigation measures required',
          'Regular inspections during construction',
          'Compliance with environmental guidelines'
        ] : [
          'Standard building codes compliance',
          'Regular construction inspections'
        ]
      },
      generatedAt: new Date().toISOString()
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    setResult(null);
    setAssessmentStep('assessing');

    try {
      if (!ownerId) throw new Error('Owner is not logged in.');
      if (!form.projectName.trim()) throw new Error('Project name is required.');
      if (!form.projectType.trim()) throw new Error('Project type is required.');
      if (!form.address.trim() || !form.city.trim() || !form.state.trim() || !form.zipCode.trim()) {
        throw new Error('Address, city, state, and zip code are required.');
      }
      if (!form.coordinatesText.trim()) throw new Error('Please provide project coordinates.');

      // Simulate GIS assessment delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      const gisAssessment = performGISAssessment(
        form.coordinatesText,
        form.projectType,
        form.buildingHeight,
        form.plotSize
      );

      // Create project in backend
      // Backend ProjectController expects a Project entity; include owner via nested object { id: ownerId }
      const payload = {
        projectName: form.projectName,
        projectType: form.projectType,
        address: form.address,
        city: form.city,
        state: form.state,
        zipCode: form.zipCode,
        description: form.description,
        owner: { id: ownerId }
      };

      const { data } = await axios.post(
        `${API_BASE}/api/projects`,
        payload,
        { headers: { ...authHeaders(), 'Content-Type': 'application/json' } }
      );

      const assessmentResult = {
        projectId: data?.id ?? `PRJ-${Date.now()}`,
        status: data?.status ?? 'pending',
        projectDetails: {
          name: data?.projectName ?? form.projectName,
          type: data?.projectType ?? form.projectType,
          address: data?.address ?? form.address,
          areaName: form.areaName,
          coordinates: form.coordinatesText
        },
        gisAssessment,
        nextSteps: {
          requiresEIA: gisAssessment.overallRisk === 'high',
          estimatedProcessingTime: gisAssessment.overallRisk === 'high' ? '45-60 days' :
                                   gisAssessment.overallRisk === 'moderate' ? '30-45 days' : '15-30 days',
          requiredDocuments: [
            'Detailed architectural plans',
            'Structural engineering drawings',
            'Site survey report',
            ...(gisAssessment.overallRisk === 'high' ? ['Environmental Impact Assessment', 'Geological survey report'] : [])
          ]
        }
      };

      setResult(assessmentResult);
      setAssessmentStep('results');
    } catch (e1) {
      setError(e1?.response?.data?.message || e1.message || 'Failed to register project.');
      setAssessmentStep('form');
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
                    <label className="form-label">Project Name *</label>
                    <input name="projectName" className="form-control" value={form.projectName} onChange={handleChange} required />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Area Name *</label>
                    <input name="areaName" className="form-control" value={form.areaName} onChange={handleChange} required />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Project Type *</label>
                    <select name="projectType" className="form-select" value={form.projectType} onChange={handleChange} required>
                      <option value="residential">Residential Building</option>
                      <option value="commercial">Commercial Building</option>
                      <option value="industrial">Industrial Facility</option>
                      <option value="institutional">Institutional Building</option>
                      <option value="mixed">Mixed Use Development</option>
                    </select>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Building Height (m)</label>
                    <input name="buildingHeight" type="number" className="form-control" value={form.buildingHeight} onChange={handleChange} placeholder="e.g., 12" />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">Plot Size (m²)</label>
                    <input name="plotSize" type="number" className="form-control" value={form.plotSize} onChange={handleChange} placeholder="e.g., 500" />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">City *</label>
                    <input name="city" className="form-control" value={form.city} onChange={handleChange} required />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">State/Region *</label>
                    <input name="state" className="form-control" value={form.state} onChange={handleChange} required />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">ZIP/Postal Code *</label>
                    <input name="zipCode" className="form-control" value={form.zipCode} onChange={handleChange} required />
                  </div>

                  <div className="col-12">
                    <label className="form-label">Address</label>
                    <input name="address" className="form-control" value={form.address} onChange={handleChange} placeholder="Street address" />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Project Description</label>
                    <textarea name="description" className="form-control" rows={3} value={form.description} onChange={handleChange} placeholder="Describe your construction project..." />
                  </div>

                  <div className="col-12">
                    <div className="alert alert-info">
                      <h6><i className="bi bi-info-circle"></i> Location Coordinates Required for Environmental Assessment</h6>
                      <p className="mb-0">Provide site coordinates for assessment (flood, erosion, seismic, volcano, etc.).</p>
                    </div>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Coordinate Format *</label>
                    <select name="coordinateFormat" className="form-select" value={form.coordinateFormat} onChange={handleChange}>
                      <option value="latlng">Latitude, Longitude (Decimal)</option>
                      <option value="geojson">GeoJSON (Polygon)</option>
                      <option value="wkt">WKT (POLYGON)</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label">Project Site Coordinates *</label>
                    <textarea
                      name="coordinatesText"
                      className="form-control"
                      rows={form.coordinateFormat === 'latlng' ? 4 : 6}
                      placeholder={
                        form.coordinateFormat === 'latlng'
                          ? 'Enter coordinates for project boundary:\n-1.2921, 36.8219\n-1.2925, 36.8225\n-1.2930, 36.8220\n-1.2921, 36.8219'
                          : form.coordinateFormat === 'geojson'
                          ? '{"type": "Polygon", "coordinates": [[[36.8219,-1.2921],[36.8225,-1.2925],[36.8220,-1.2930],[36.8219,-1.2921]]]}'
                          : 'POLYGON((36.8219 -1.2921, 36.8225 -1.2925, 36.8220 -1.2930, 36.8219 -1.2921))'
                      }
                      value={form.coordinatesText}
                      onChange={handleChange}
                      required
                    />
                    <div className="form-text">
                      {form.coordinateFormat === 'latlng' && 'Enter latitude,longitude pairs (one per line)'}
                      {form.coordinateFormat === 'geojson' && 'Enter valid GeoJSON polygon geometry'}
                      {form.coordinateFormat === 'wkt' && 'Enter Well-Known Text (WKT) polygon'}
                    </div>
                  </div>
                </div>

                {error && <div className="text-danger mt-2">{error}</div>}

                <div className="mt-3">
                  <button className="btn btn-primary" disabled={submitting} type="submit">
                    {submitting ? 'Submitting...' : 'Submit for GIS Assessment & Register'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {assessmentStep === 'assessing' && (
            <div className="card mt-3">
              <div className="card-header">
                <i className="bi bi-hourglass-split"></i> Performing Environmental & Social Impact Assessment
              </div>
              <div className="card-body text-center">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h5>Analyzing Environmental Impacts...</h5>
                <div className="progress mb-3">
                  <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={{width: '75%'}}></div>
                </div>
                <small className="text-muted">This may take a few moments...</small>
              </div>
            </div>
          )}

          {result && assessmentStep === 'results' && (
            <div className="card mt-3">
              <div className="card-header bg-success text-white">
                <i className="bi bi-check-circle"></i> Assessment Complete & Project Registered
              </div>
              <div className="card-body">
                <div className="row mb-4">
                  <div className="col-md-6">
                    <h6>Project Information</h6>
                    <p><strong>Project ID:</strong> {result.projectId}</p>
                    <p><strong>Project Name:</strong> {result.projectDetails.name}</p>
                    <p><strong>Type:</strong> {result.projectDetails.type}</p>
                    <p><strong>Location:</strong> {result.projectDetails.areaName}</p>
                    <p><strong>Status:</strong> {result.status}</p>
                  </div>
                  <div className="col-md-6">
                    <h6>Assessment Details</h6>
                    <p><strong>Assessment ID:</strong> {result.gisAssessment.assessmentId}</p>
                    <p><strong>Generated:</strong> {new Date(result.gisAssessment.generatedAt).toLocaleString()}</p>
                    <p><strong>Coordinates:</strong> {result.gisAssessment.coordinates.lat?.toFixed(4)}, {result.gisAssessment.coordinates.lng?.toFixed(4)}</p>
                  </div>
                </div>

                <div className={`alert alert-${result.gisAssessment.overallRisk === 'low' ? 'success' : result.gisAssessment.overallRisk === 'moderate' ? 'warning' : 'danger'} mb-4`}>
                  <h5 className="alert-heading">
                    Overall Risk Level: {result.gisAssessment.overallRisk.toUpperCase()}
                  </h5>
                  <p className="mb-0">
                    Approval Status: <strong>{result.gisAssessment.recommendations.approval.replace('_', ' ').toUpperCase()}</strong>
                  </p>
                </div>

                <h6>Environmental & Social Impact Analysis</h6>
                <div className="row">
                  {result.gisAssessment.risks.map((risk, idx) => (
                    <div key={idx} className="col-md-6 mb-3">
                      <div className="card h-100">
                        <div className={`card-header text-white bg-${risk.level === 'low' ? 'success' : risk.level === 'moderate' ? 'warning' : 'danger'}`}>
                          <strong>{risk.type}</strong>
                          <span className="badge bg-light text-dark float-end">{risk.level.toUpperCase()}</span>
                        </div>
                        <div className="card-body">
                          <p><strong>Impact:</strong> {risk.impact}</p>
                          <p><strong>Mitigation:</strong> {risk.mitigation}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <h6>Approval Conditions & Requirements</h6>
                  <ul className="list-group">
                    {result.gisAssessment.recommendations.conditions.map((c, idx) => (
                      <li key={idx} className="list-group-item">
                        <i className="bi bi-check-square text-primary me-2"></i>{c}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4">
                  <h6>Next Steps & Processing Information</h6>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6>Required Documents</h6>
                          <ul className="mb-0">
                            {result.nextSteps.requiredDocuments.map((doc, idx) => (<li key={idx}>{doc}</li>))}
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="card bg-light">
                        <div className="card-body">
                          <h6>Processing Timeline</h6>
                          <p><strong>Estimated Time:</strong> {result.nextSteps.estimatedProcessingTime}</p>
                          <p><strong>EIA Required:</strong> {result.nextSteps.requiresEIA ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-center">
                  <button
                    className="btn btn-outline-primary me-2"
                    onClick={() => {
                      const reportData = JSON.stringify(result, null, 2);
                      const blob = new Blob([reportData], { type: 'application/json' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `GIS_Assessment_Report_${result.projectId}.json`;
                      a.click();
                      URL.revokeObjectURL(url);
                    }}
                  >
                    <i className="bi bi-download"></i> Download GIS Assessment Report
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      setResult(null);
                      setAssessmentStep('form');
                      setForm({
                        projectName: '',
                        description: '',
                        address: '',
                        city: '',
                        state: '',
                        zipCode: '',
                        areaName: '',
                        coordinateFormat: 'latlng',
                        coordinatesText: '',
                        projectType: 'residential',
                        buildingHeight: '',
                        plotSize: '',
                      });
                    }}
                  >
                    <i className="bi bi-plus-circle"></i> Register New Project
                  </button>
                </div>

                <div className="alert alert-info mt-4">
                  <h6><i className="bi bi-info-circle"></i> What Happens Next?</h6>
                  <p className="mb-0">
                    Your project has been registered and will proceed to review. You’ll receive notifications as the status changes.
                  </p>
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