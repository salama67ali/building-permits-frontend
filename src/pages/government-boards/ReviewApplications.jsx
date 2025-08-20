// src/pages/government-boards/ReviewApplications.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

const API_BASE = 'http://localhost:8080';

function ReviewApplications() {
  const reviewerId = localStorage.getItem('currentUserId');
  const username = localStorage.getItem('currentUserUsername');

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [decidingId, setDecidingId] = useState(null);
  const [projectIdQuery, setProjectIdQuery] = useState('');

  const authHeaders = () => {
    const token = localStorage.getItem('authToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Admin-only fallback list (permission-status). If user is GOVT_BOARD only, use manual project lookup below.
  async function fetchPendingViaAdminStatus() {
    const resp = await axios.get(`${API_BASE}/api/admin/permission-status?page=0&size=100`, {
      headers: authHeaders()
    });
    const items = resp.data?.items || [];
    // Show items likely awaiting government decision
    const pendingForGov = items.filter(
      it => ['ENGINEER_APPROVED', 'PENDING', 'pending'].includes(String(it.status || '').toUpperCase())
    );
    // Normalize to UI structure
    setProjects(
      pendingForGov.map(it => ({
        projectId: it.projectId,
        projectName: it.projectName,
        ownerName: it.ownerName,
        status: it.status,
        decision: null,
        gisAssessment: null
      }))
    );
  }

  // GOVT-BOARD: fetch a specific project bundle by ID
  async function fetchBundle(projectId) {
    const resp = await axios.get(`${API_BASE}/api/government-board/projects/${projectId}/bundle`, {
      headers: authHeaders()
    });
    const data = resp.data || {};
    const existing = new Map(projects.map(p => [p.projectId, p]));
    existing.set(projectId, {
      projectId: data.projectId,
      projectName: data.projectName || `Project ${data.projectId}`,
      ownerName: data.ownerName || '',
      status: data.status,
      decision: null,
      gisAssessment: { risks: data.assessment ? [
        { type: 'Flood', level: data.assessment.floodsRisk, impact: '' },
        { type: 'Erosion', level: data.assessment.erosionRisk, impact: '' },
        { type: 'Earthquake', level: data.assessment.earthquakeRisk, impact: '' },
        { type: 'Volcano', level: data.assessment.volcanoRisk, impact: '' }
      ] : [] }
    });
    setProjects(Array.from(existing.values()));
  }

  async function refresh() {
    setLoading(true);
    setError('');
    try {
      // Try admin permission-status (works if token has ADMIN). If forbidden, user can still fetch project bundles by ID.
      await fetchPendingViaAdminStatus();
    } catch (e) {
      // Ignore; likely 403 for non-admin. User can use the projectId lookup.
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refresh();
  }, []);

  async function onDecide(projectId, decision) {
    try {
      setDecidingId(projectId);
      const body = { decision: decision.toUpperCase(), notes: `Reviewed by ${username} (#${reviewerId})` };
      await axios.post(`${API_BASE}/api/government-board/projects/${projectId}/decision`, body, {
        headers: { ...authHeaders(), 'Content-Type': 'application/json' }
      });
      await refresh();
      alert(`Project ${projectId} ${decision}`);
    } catch (e) {
      alert(e.response?.data?.message || e.message || 'Failed to submit decision');
    } finally {
      setDecidingId(null);
    }
  }

  async function generateCertificate(p) {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Building/Project Permit Certificate', 20, 20);
    doc.setFontSize(12);
    doc.text(`Project ID: ${p.projectId}`, 20, 35);
    doc.text(`Project Name: ${p.projectName}`, 20, 45);
    doc.text(`Decision: ${(p.decision?.toUpperCase() || p.status || '').toString()}`, 20, 55);
    doc.text(`Issued By: Government Boards`, 20, 65);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 75);
    doc.save(`Certificate_${p.projectId}.pdf`);
  }

  async function generateSticker(p) {
    const size = 200;
    const canvas = document.createElement('canvas');
    await QRCode.toCanvas(canvas, `PROJECT:${p.projectId}`, { width: size });
    const imgData = canvas.toDataURL('image/png');
    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: [size + 40, size + 100] });
    doc.setFontSize(14);
    doc.text('Official Project Sticker', 20, 30);
    doc.text(`Project ID: ${p.projectId}`, 20, 50);
    doc.addImage(imgData, 'PNG', 20, 60, size, size);
    doc.save(`Sticker_${p.projectId}.pdf`);
  }

  return (
    <div className="dashboard-container d-flex">
      <Sidebar role="government-boards" />
      <div className="main-content flex-grow-1">
        <Header username={username} />
        <div className="container mt-3">
          <h4>Review Applications</h4>

          <div className="card mb-3">
            <div className="card-body d-flex gap-2 align-items-end">
              <div>
                <label className="form-label">Find Project by ID</label>
                <input
                  className="form-control"
                  value={projectIdQuery}
                  onChange={(e) => setProjectIdQuery(e.target.value)}
                  placeholder="Enter project ID (number)"
                />
              </div>
              <button
                className="btn btn-outline-primary"
                onClick={async () => {
                  if (!projectIdQuery) return;
                  try {
                    setLoading(true);
                    await fetchBundle(projectIdQuery);
                  } catch (e) {
                    alert(e.response?.data?.message || 'Project not found or forbidden');
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                Load
              </button>
            </div>
          </div>

          {loading && <p>Loading...</p>}
          {error && <div className="alert alert-danger">{error}</div>}
          {!loading && projects.length === 0 && <p>No applications waiting review.</p>}

          {projects.map((p) => (
            <div className="card mb-2" key={p.projectId}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{p.projectName}</strong> ({p.projectId})
                    <div className="small text-muted">Owner: {p.ownerName || p.ownerId || '-'}</div>
                    <div className="small">Status: {p.status}</div>
                  </div>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success btn-sm"
                      disabled={decidingId === String(p.projectId)}
                      onClick={() => onDecide(p.projectId, 'approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      disabled={decidingId === String(p.projectId)}
                      onClick={() => onDecide(p.projectId, 'reject')}
                    >
                      Deny
                    </button>
                  </div>
                </div>

                {Array.isArray(p.gisAssessment?.risks) && p.gisAssessment.risks.length > 0 && (
                  <ul className="mt-2 mb-1">
                    {p.gisAssessment.risks.map((r, idx) => (
                      <li key={idx}>
                        <strong>{r.type}</strong>: level {r.level} {r.impact ? `- ${r.impact}` : ''}
                      </li>
                    ))}
                  </ul>
                )}

                <div className="d-flex gap-2 mt-2">
                  {p.status && (
                    <button className="btn btn-outline-primary btn-sm" onClick={() => generateCertificate(p)}>
                      Generate Certificate
                    </button>
                  )}
                  {String(p.status || '').toUpperCase() === 'PERMIT_GRANTED' && (
                    <button className="btn btn-outline-success btn-sm" onClick={() => generateSticker(p)}>
                      Generate Sticker
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ReviewApplications;