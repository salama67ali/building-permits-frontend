import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import OwnerUpload from "../../components/OwnerUpload";
import DocumentList from "../../components/DocumentList";

function OwnerDashboard() {
  const userEmail = localStorage.getItem('currentUserEmail');
  const username = localStorage.getItem('currentUserUsername');
  const userId = localStorage.getItem('currentUserId');
  const [notifications, setNotifications] = useState([]);
  const [showAlert, setShowAlert] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    if (!userId) return;

    axios.get(`http://localhost:9090/api/notifications/unread/${userId}`)
      .then((res) => {
        if (res.data.length > 0) {
          setNotifications(res.data);
          setShowAlert(true);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch notifications", err);
      });
  }, [userId]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:9090/api/notifications/viewed/${id}`);
      setNotifications((prev) => prev.filter((n) => n.notificationId !== id));
    } catch (err) {
      console.error("Error marking notification as read", err);
    }
  };

  const dismissAll = () => {
    setShowAlert(false);
  };

  return (
    <div className="dashboard-container d-flex">
      <Sidebar role="owner" />
      <div className="main-content flex-grow-1">
        <Header username={username} />
        <div className="container mt-3">
          {showAlert && notifications.length > 0 && (
            <div className="alert alert-info">
              <strong>📢 You have {notifications.length} new notification(s):</strong>
              <ul>
                {notifications.map((n) => (
                  <li key={n.notificationId}>
                    <p>{n.message}</p>
                    <small>Sent: {new Date(n.dateSent).toLocaleString()}</small>
                    <br />
                    <button
                      className="btn btn-sm btn-outline-primary mt-1"
                      onClick={() => markAsRead(n.notificationId)}
                    >
                      Mark as Read
                    </button>
                  </li>
                ))}
              </ul>
              <button className="btn btn-secondary btn-sm mt-2" onClick={dismissAll}>
                Dismiss All
              </button>
            </div>
          )}

          <OwnerUpload userId={userId} onUploaded={() => setRefreshKey((k) => k + 1)} />

          <div className="card card-body">
            <h5 className="mb-2">Your Documents</h5>
            <DocumentList role="owner" userId={userId} refreshKey={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;
