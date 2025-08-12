import React from 'react';
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";

function GovernmentBoardsDashboard() {
  const username = localStorage.getItem('currentUserUsername'); // ✅ Get username from localStorage

  return (
    <div className="container-fluid">
      <div className="row">
        <Sidebar role="government-boards" />
        <div className="col-md-10 ms-sm-auto px-4">
          <Header username={username} />
          <div className="py-4">
            <p>Use the menu to review applications and issue decisions.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ✅ Ensure default export matches the function name exactly
export default GovernmentBoardsDashboard;
