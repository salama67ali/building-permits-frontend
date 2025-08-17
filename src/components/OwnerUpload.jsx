import React, { useState } from 'react';

function OwnerUpload({ userId, onUploaded }) {
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState('terms_of_references');
  const [status, setStatus] = useState('');
  const [uploading, setUploading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('');
    
    if (!file) {
      setStatus('Please select a file.');
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      setStatus('File size exceeds 10MB limit. Please choose a smaller file.');
      return;
    }

    // Validate file type
    const allowedTypes = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.dwg', '.dxf'];
    const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      setStatus('Invalid file type. Please upload PDF, DOC, DOCX, PNG, JPG, JPEG, DWG, or DXF files.');
      return;
    }

    setUploading(true);
    setStatus('Uploading...');

    try {
      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Create mock uploaded document
      const uploadedDoc = {
        id: `doc-${Date.now()}`,
        fileName: file.name,
        fileSize: file.size,
        docType: docType,
        userId: userId,
        uploadedAt: new Date().toISOString(),
        status: 'uploaded',
        fileUrl: URL.createObjectURL(file) // Create temporary URL for preview
      };

      // Store in localStorage for persistence
      const existingDocs = JSON.parse(localStorage.getItem('uploadedDocuments') || '[]');
      existingDocs.push(uploadedDoc);
      localStorage.setItem('uploadedDocuments', JSON.stringify(existingDocs));

      setStatus('✅ Document uploaded successfully!');
      setFile(null);
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]');
      if (fileInput) fileInput.value = '';

      if (typeof onUploaded === 'function') {
        onUploaded(uploadedDoc);
      }
    } catch (e) {
      setStatus('❌ Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card card-body mb-3">
      <h5 className="mb-2">Upload Owner Document</h5>
      <div className="row g-2 align-items-end">
        <div className="col-md-4">
          <label className="form-label small">Document Type</label>
          <select className="form-select form-select-sm" value={docType} onChange={(e) => setDocType(e.target.value)}>
            <option value="terms_of_references">Terms of References</option>
            <option value="building_plan">Building Plan</option>
            <option value="gis_assessment">GIS Assessment</option>
            <option value="approval_report">Approval Report</option>
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
          <button type="submit" className="btn btn-primary btn-sm" disabled={uploading}>
            {uploading ? (
              <>
                <span className="spinner-border spinner-border-sm me-1" role="status"></span>
                Uploading...
              </>
            ) : (
              'Upload'
            )}
          </button>
        </div>
      </div>
      {status && (
        <div className={`small mt-2 ${status.includes('✅') ? 'text-success' : status.includes('❌') ? 'text-danger' : 'text-info'}`}>
          {status}
        </div>
      )}
    </form>
  );
}

export default OwnerUpload;