import React, { useEffect, useState } from 'react';
import axios from 'axios';

function DocumentList({ role, userId, canUpdateStatus = false, refreshKey = 0 }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savingId, setSavingId] = useState(null);

  const fetchDocs = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get('http://localhost:9090/api/documents', {
        params: { role, userId },
      });
      setDocuments(res.data || []);
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to load documents');
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
      await axios.put(`http://localhost:9090/api/status/${id}`, { status });
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
                {doc.originalName}
                {doc.url && (
                  <a
                    className="ms-2 btn btn-sm btn-outline-secondary"
                    href={`http://localhost:9090${doc.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View
                  </a>
                )}
              </td>
              <td>{doc.docType}</td>
              <td>{doc.uploadedByRole}</td>
              <td>{new Date(doc.createdAt).toLocaleString()}</td>
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
                {doc.url && (
                  <a
                    className="btn btn-sm btn-outline-primary"
                    href={`http://localhost:9090${doc.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
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