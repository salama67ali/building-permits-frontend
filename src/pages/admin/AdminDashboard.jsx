
import React from 'react';
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

function AdminDashboard() {
  const username = localStorage.getItem('currentUserUsername'); // ✅ Get username from localStorage

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar role="admin" />
        <div className="col-md-10 ms-sm-auto px-4">
          <Header username={username} /> {/* ✅ Pass to Header */}
          <div className="py-4">
            <h2>Admin Dashboard</h2>
            <p>Manage users, View Submissions, Send Notifications.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;