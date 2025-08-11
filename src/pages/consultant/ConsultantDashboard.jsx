import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';

function ConsultantDashboard() {
  const userEmail = localStorage.getItem('currentUserEmail');
  const username = localStorage.getItem('currentUserUsername');
  const userId = localStorage.getItem('currentUserId');

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [toRDocuments, setToRDocuments] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(true);

  // Fetch ToR documents sent by owners from backend
  useEffect(() => {
    if (!userId) return;

    setLoadingDocs(true);
    axios
      .get(`http://localhost:9090/api/consultant/tor-documents/${userId}`)
      .then((res) => {
        setToRDocuments(res.data || []);
        setLoadingDocs(false);
      })
      .catch((err) => {
        console.error('Failed to fetch ToR documents', err);
        setLoadingDocs(false);
      });
  }, [userId]);

  // Handle file selection
  function handleFileChange(event) {
    setSelectedFile(event.target.files[0]);
    setUploadStatus('');
  }

  // Handle upload building plan design file
  async function handleUpload(event) {
    event.preventDefault();

    if (!selectedFile) {
      setUploadStatus('Please select a file to upload.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('consultantId', userId); // optionally send consultant id

      const response = await axios.post(
        'http://localhost:9090/api/consultant/upload-building-plan',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setUploadStatus('File uploaded successfully!');
      setSelectedFile(null);
      // Optionally you can refresh ToR documents if needed
    } catch (error) {
      console.error('Error uploading file', error);
      setUploadStatus('File upload failed. Please try again.');
    }
  }

  return (
    <div className="dashboard-container d-flex">
      <Sidebar role="consultant" />
      <div className="main-content flex-grow-1">
        <Header username={username} />
        <div className="container mt-4">
          <h2>Consultant Dashboard</h2>

          <section className="mb-4">
            <h4>Upload Building Plan Design</h4>
            <form onSubmit={handleUpload}>
              <div className="mb-3">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="form-control"
                  accept=".pdf,.doc,.docx,.dwg,.dxf"
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Upload
              </button>
            </form>
            {uploadStatus && <p className="mt-2">{uploadStatus}</p>}
          </section>

          <section>
            <h4>ToR Documents Submitted by Owners</h4>
            {loadingDocs ? (
              <p>Loading documents...</p>
            ) : toRDocuments.length === 0 ? (
              <p>No documents found.</p>
            ) : (
              <ul className="list-group">
                {toRDocuments.map((doc) => (
                  <li key={doc.id} className="list-group-item d-flex justify-content-between align-items-center">
                    {doc.name}
                    {/* Example: Add a view/download link */}
                    {doc.url && (
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-secondary">
                        View
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

export default ConsultantDashboard;
