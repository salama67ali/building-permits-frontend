import React, { useState } from 'react';
import axios from 'axios';

function OwnerUpload({ userId, onUploaded }) {
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState('tor');
  const [status, setStatus] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('');
    if (!file) {
      setStatus('Please select a file.');
      return;
    }
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('docType', docType);
      const res = await axios.post('http://localhost:9090/api/owner/upload-document', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setStatus('Uploaded successfully');
      setFile(null);
      if (typeof onUploaded === 'function') onUploaded(res.data.doc);
    } catch (e) {
      setStatus(e.response?.data?.message || 'Upload failed.');
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card card-body mb-3">
      <h5 className="mb-2">Upload Owner Document</h5>
      <div className="row g-2 align-items-end">
        <div className="col-md-4">
          <label className="form-label small">Document Type</label>
          <select className="form-select form-select-sm" value={docType} onChange={(e) => setDocType(e.target.value)}>
            <option value="tor">ToR</option>
            <option value="general">General</option>
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label small">File</label>
          <input
            className="form-control form-control-sm"
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.dwg,.dxf"
          />
        </div>
        <div className="col-md-2 d-grid">
          <button type="submit" className="btn btn-primary btn-sm">Upload</button>
        </div>
      </div>
      {status && <div className="small mt-2">{status}</div>}
    </form>
  );
}

export default OwnerUpload;