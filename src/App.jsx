import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/admin/AdminDashboard';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import GovernmentBoardsDashboard from './pages/government-boards/GovernmentBoardsDashboard';
import EngineerDashboard from './pages/engineer/EngineerDashboard';
import ConsultantDashboard from './pages/consultant/ConsultantDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ProjectRegistration from './pages/owner/ProjectRegistration';
import MyApplications from './pages/owner/MyApplications';
import UploadDocuments from './pages/owner/UploadDocuments';
import ReviewApplications from './pages/government-boards/ReviewApplications';
import ViewSubmittedDocuments from './pages/government-boards/ViewSubmittedDocuments';
import SendNotification from './pages/government-boards/SendNotification';
import ViewSubmissions from './pages/admin/ViewSubmissions';
import SendNotifications from './pages/admin/SendNotifications';
import UploadBuildingPlanDesign from './pages/consultant/UploadBuildingPlanDesign';
import ViewDocuments from './pages/consultant/ViewDocuments';
import EngineerViewSubmittedDocuments from './pages/engineer/ViewSubmittedDocuments';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/owner" element={<OwnerDashboard />} />
        <Route path='/consultant' element={<ConsultantDashboard />} />
        <Route path="/government-boards" element={<GovernmentBoardsDashboard />} />
        <Route path="/engineer" element={<EngineerDashboard />} />
        <Route path='/admin/manage-users' element={<ManageUsers />} />

        {/* Owner */}
        <Route path='/owner/apply-permit' element={<ProjectRegistration />} />
        <Route path='/owner/view-applications' element={<MyApplications />} />
        <Route path='/owner/upload-documents' element={<UploadDocuments />} />

        {/* Admin */}
        <Route path='/admin/view-submissions' element={<ViewSubmissions />} />
        <Route path='/admin/send-notifications' element={<SendNotifications />} />

        {/* Government Boards */}
        <Route path='/government-boards/review-applications' element={<ReviewApplications />} />
        <Route path='/government-boards/view-submitted-documents' element={<ViewSubmittedDocuments />} />
        <Route path='/government-boards/send-notification' element={<SendNotification />} />

        {/* Consultant */}
        <Route path='/consultant/upload-building-plan-design' element={<UploadBuildingPlanDesign />} />
        <Route path='/consultant/view-documents' element={<ViewDocuments />} />

        {/* Engineer */}
        <Route path='/engineer/view-submitted-documents' element={<EngineerViewSubmittedDocuments />} />
      </Routes>
    </Router>
  );
}

export default App;
