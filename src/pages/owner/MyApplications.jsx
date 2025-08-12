import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import { listOwnerProjects } from '../../services/api';
import jsPDF from 'jspdf';
import QRCode from 'qrcode';

function MyApplications() {
  const userId = localStorage.getItem('currentUserId');
  const username = localStorage.getItem('currentUserUsername');

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError('');
      try {
        const res = await listOwnerProjects(userId);
        setProjects(res || []);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  async function downloadCertificate(p) {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Building/Project Permit Certificate', 20, 20);
    doc.setFontSize(12);
    doc.text(`Project ID: ${p.projectId}`, 20, 35);
    doc.text(`Project Name: ${p.projectName}`, 20, 45);
    doc.text(`Owner: ${username}`, 20, 55);
    doc.text(`Decision: ${p.decision?.toUpperCase() || p.status}`, 20, 65);
    doc.text(`Issued By: Government Boards`, 20, 75);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 85);

    if (p.decision === 'approved') {
      doc.setTextColor(0, 128, 0);
      doc.text('Status: APPROVED', 20, 100);
    } else if (p.decision === 'denied') {
      doc.setTextColor(200, 0, 0);
      doc.text('Status: DENIED', 20, 100);
    }

    doc.save(`Certificate_${p.projectId}.pdf`);
  }

  async function downloadSticker(p) {
    const size = 200;
    const canvas = document.createElement('canvas');
    const qrText = `PROJECT:${p.projectId}`;
    await QRCode.toCanvas(canvas, qrText, { width: size });

    const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: [size + 40, size + 100] });
    doc.setFontSize(14);
    doc.text('Official Project Sticker', 20, 30);
    doc.text(`Project ID: ${p.projectId}`, 20, 50);
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 20, 60, size, size);
    doc.save(`Sticker_${p.projectId}.pdf`);
  }

  return (
    <div className="dashboard-container d-flex">
      <Sidebar role="owner" />
      <div className="main-content flex-grow-1">
        <Header username={username} />
        <div className="container mt-3">
          <h4>My Applications</h4>
          {loading && <p>Loading...</p>}
          {error && <div className="alert alert-danger">{error}</div>}
          {!loading && projects.length === 0 && <p>No applications yet.</p>}

          {projects.map((p) => (
            <div className="card mb-2" key={p.projectId}>
              <div className="card-body d-flex justify-content-between align-items-center">
                <div>
                  <div><strong>{p.projectName}</strong> ({p.projectId})</div>
                  <div className="small">Status: {p.status} {p.decision && `(Decision: ${p.decision})`}</div>
                </div>
                <div className="d-flex gap-2">
                  {p.decision && (
                    <button className="btn btn-outline-primary btn-sm" onClick={() => downloadCertificate(p)}>Certificate</button>
                  )}
                  {p.decision === 'approved' && (
                    <button className="btn btn-outline-success btn-sm" onClick={() => downloadSticker(p)}>Sticker</button>
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

export default MyApplications;