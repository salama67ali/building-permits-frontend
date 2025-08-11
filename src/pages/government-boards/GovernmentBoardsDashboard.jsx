import React from 'react';
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

function GovernmentBoardsDashboard() {
  const username = localStorage.getItem('currentUserUsername'); // ✅ Get username from localStorage

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar role="admin" />
        <div className="col-md-10 ms-sm-auto px-4">
          <Header username={username} /> {/* ✅ Pass to Header */}
          <div className="py-4">
            Government Boards Dashboard Content
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ Ensure default export matches the function name exactly
export default GovernmentBoardsDashboard;
