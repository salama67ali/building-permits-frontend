import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { listPendingProjects, decideProject } from '../../services/api';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

function ReviewApplications() {
  const reviewerId = localStorage.getItem('currentUserId');
  const username = localStorage.getItem('currentUserUsername');

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [decidingId, setDecidingId] = useState(null);

  async function refresh() {
    setLoading(true);
    setError('');
    try {
      const res = await listPendingProjects();
      setProjects(res || []);
    } catch (e) {
      setError(e.message);
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
      await decideProject(projectId, decision, reviewerId);
      await refresh();
      alert(`Project ${projectId} ${decision}`);
    } catch (e) {
      alert(e.message);
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
    doc.text(`Decision: ${p.decision?.toUpperCase() || p.status}`, 20, 55);
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
          {loading && <p>Loading...</p>}
          {error && <div className="alert alert-danger">{error}</div>}
          {!loading && projects.length === 0 && <p>No applications waiting review.</p>}

          {projects.map((p) => (
            <div className="card mb-2" key={p.projectId}>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{p.projectName}</strong> ({p.projectId})
                    <div className="small text-muted">Owner: {p.ownerName || p.ownerId}</div>
                    <div className="small">Status: {p.status}</div>
                  </div>
                  <div className="d-flex gap-2">
                    <button className="btn btn-success btn-sm" disabled={decidingId===p.projectId} onClick={() => onDecide(p.projectId, 'approved')}>Approve</button>
                    <button className="btn btn-danger btn-sm" disabled={decidingId===p.projectId} onClick={() => onDecide(p.projectId, 'denied')}>Deny</button>
                  </div>
                </div>
                {Array.isArray(p.gisAssessment?.risks) && p.gisAssessment.risks.length > 0 && (
                  <ul className="mt-2 mb-1">
                    {p.gisAssessment.risks.map((r, idx) => (
                      <li key={idx}><strong>{r.type}</strong>: level {r.level} - {r.impact}</li>
                    ))}
                  </ul>
                )}
                <div className="d-flex gap-2 mt-2">
                  {p.decision && (
                    <button className="btn btn-outline-primary btn-sm" onClick={() => generateCertificate(p)}>Generate Certificate</button>
                  )}
                  {p.decision === 'approved' && (
                    <button className="btn btn-outline-success btn-sm" onClick={() => generateSticker(p)}>Generate Sticker</button>
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