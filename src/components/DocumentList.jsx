import React, { useEffect, useState } from 'react';

function DocumentList({ role, userId, canUpdateStatus = false, refreshKey = 0 }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState(null);

  const fetchDocs = async () => {
    setLoading(true);
    setError('');
    try {
      // Load documents from localStorage
      const storedDocs = JSON.parse(localStorage.getItem('uploadedDocuments') || '[]');
      
      // Filter documents by userId if provided
      const filteredDocs = userId 
        ? storedDocs.filter(doc => doc.userId === userId)
        : storedDocs;
      
      setDocuments(filteredDocs);
    } catch (e) {
      setError('Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role, userId, refreshKey]);

  async function handleStatusChange(id, status) {
    try {
      setSavingId(id);
      // Update status in localStorage
      const storedDocs = JSON.parse(localStorage.getItem('uploadedDocuments') || '[]');
      const updatedDocs = storedDocs.map(doc => doc.id === id ? { ...doc, status } : doc);
      localStorage.setItem('uploadedDocuments', JSON.stringify(updatedDocs));
      setDocuments(updatedDocs);
      setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, status } : d)));
    } catch (e) {
      alert(e.response?.data?.message || 'Failed to update status');
    } finally {
      setSavingId(null);
    }
  }

  if (loading) return <p>Loading documents...</p>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!documents.length) return <p>No documents found.</p>;

  return (
    <div className="table-responsive">
      <table className="table table-sm table-bordered align-middle">
        <thead className="table-light">
          <tr>
            <th>File</th>
            <th>Type</th>
            <th>Uploaded By</th>
            <th>Uploaded At</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc) => (
            <tr key={doc.id}>
              <td>
                <div className="d-flex align-items-center">
                  <span className="me-2">{doc.fileName}</span>
                  <small className="text-muted">({(doc.fileSize / 1024).toFixed(1)} KB)</small>
                </div>
                {doc.fileUrl && (
                  <a
                    className="ms-2 btn btn-sm btn-outline-secondary"
                    href={doc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                )}
              </td>
              <td>
                <span className="badge bg-info text-capitalize">
                  {doc.docType.replace('_', ' ')}
                </span>
              </td>
              <td>Owner</td>
              <td>{new Date(doc.uploadedAt).toLocaleString()}</td>
              <td>
                {canUpdateStatus ? (
                  <select
                    className="form-select form-select-sm"
                    disabled={savingId === doc.id}
                    value={doc.status}
                    onChange={(e) => handleStatusChange(doc.id, e.target.value)}
                  >
                    <option value="submitted">Submitted</option>
                    <option value="under-review">Under Review</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                ) : (
                  <span className="badge text-bg-secondary text-capitalize">{doc.status}</span>
                )}
              </td>
              <td>
                {doc.fileUrl && (
                  <a
                    className="btn btn-sm btn-outline-primary"
                    href={doc.fileUrl}
                    download={doc.fileName}
                  >
                    Download
                  </a>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default DocumentList;