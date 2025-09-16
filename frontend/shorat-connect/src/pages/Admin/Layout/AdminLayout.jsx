import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./Header";
import { AdminSidebar } from "../Layout/AdminSidebar";

// Pages
import { DashboardContent } from "../Dashboard/DashboardContent";
import FranchiseManagement from "../Franchise/FranchiseManagement";
import StaffManagement from "../../Franchise/staff/staffmanagement";
import { NotificationPage } from "../Notifications/NotificationPage";
import StudentManagement from "../Student/StudentManagement";
import CourseManagement from "../course/CourseManagement";
import BatchManagement from "../Batches/BatchManagement";
import AttendanceSystem from "../AttendanceSystem/AttendanceSystem";
import ReportAnalysis from "../Report and Analysis/ReportAnalysis";
import EventsWorkshop from "../Events&Workshop/EventsWorkshop";
import FeedbackPage from "../Feedback/FeedbackPage";
import AdminProfile from "../Profile/AdminProfile";
import AdminSetting from "../Setting/AdminSetting";

import { Menu, X } from "lucide-react";
import PaymentBilling from "../Payment&Billing/PaymentBilling";

export default function AdminLayout({ onLogout }) {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Dummy data
  const [franchises] = useState([
    { id: 1, name: "Franchise A" },
    { id: 2, name: "Franchise B" },
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, message: "New staff member added", time: "2 min ago", franchiseId: 1, read: false },
    { id: 2, message: "Payment received", time: "10 min ago", franchiseId: 2, read: false },
    { id: 3, message: "Franchise updated profile", time: "30 min ago", franchiseId: 1, read: false },
  ]);

  // Mark read handlers
  const handleMarkRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <Header
        onNotificationsClick={() => navigate("/admin/notifications")}
        unreadCount={notifications.filter((n) => !n.read).length}
        onGoHome={() => navigate("/admin/dashboard")}
        setActivePage={(page) => navigate(`/admin/${page}`)}
        onLogout={onLogout}
      />

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <AdminSidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          unreadCount={notifications.filter((n) => !n.read).length}
        />

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto relative">
          {/* Floating Hamburger / X button */}
          <div className="mb-4">
            <button
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100"
              onClick={() =>
                window.innerWidth < 1024
                  ? setMobileOpen((prev) => !prev)
                  : setCollapsed((prev) => !prev)
              }
            >
              {window.innerWidth < 1024 ? (
                mobileOpen ? (
                  <X className="h-6 w-6 text-gray-700" />
                ) : (
                  <Menu className="h-6 w-6 text-gray-700" />
                )
              ) : collapsed ? (
                <X className="h-6 w-6 text-gray-700" />
              ) : (
                <Menu className="h-6 w-6 text-gray-700" />
              )}
            </button>
          </div>

          {/* Nested routes */}
          <Routes>
            <Route path="dashboard" element={<DashboardContent />} />
            <Route path="settings" element={<AdminSetting />} />
            <Route path="franchise" element={<FranchiseManagement />} />
            <Route path="course" element={<CourseManagement />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="student" element={<StudentManagement />} />
            <Route path="payments" element={<PaymentBilling/>}/>
            <Route path="batch" element={<BatchManagement />} />
            <Route path="attendance" element={<AttendanceSystem />} />
            <Route path="reports" element={<ReportAnalysis />} />
            <Route path="events" element={<EventsWorkshop />} />
            <Route path="feedback" element={<FeedbackPage />} />
            <Route
              path="notifications"
              element={
                <NotificationPage
                  franchises={franchises}
                  notifications={notifications}
                  onMarkRead={handleMarkRead}
                  onMarkAllRead={handleMarkAllRead}
                />
              }
            />
            <Route path="profile" element={<AdminProfile />} />
            {/* Default redirect */}
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
    