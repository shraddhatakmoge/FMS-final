import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Header from "./Header";
import { AdminSidebar } from "../Layout/AdminSidebar";
import { DashboardContent } from "../Dashboard/DashboardContent";
import FranchiseManagement from "../Franchise/FranchiseManagement";
import StaffManagement from "../staff/StaffManagement";
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
import PaymentBilling from "../Payment&Billing/PaymentBilling";

export default function AdminLayout({ onLogout, user }) {
  const navigate = useNavigate();

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
      {/* Sticky Header */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-border z-50 flex items-center justify-between px-4">
        <Header
          onNotificationsClick={() => navigate("/admin/notifications")}
          unreadCount={notifications.filter((n) => !n.read).length}
          onGoHome={() => navigate("/admin/dashboard")}
          onLogout={onLogout}
          setActivePage={(page, state) => navigate(`/admin/${page}`, { state })}
          email_user={user?.email}
        />
      </header>

      <div className="flex flex-1 relative mt-16">
        {/* Sidebar */}
        <div className="w-64 bg-white border-r border-border h-full fixed lg:static z-40">
          <AdminSidebar
            unreadCount={notifications.filter((n) => !n.read).length}
          />
        </div>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto ">
          <Routes>
            <Route path="dashboard" element={<DashboardContent />} />
            <Route path="settings" element={<AdminSetting />} />
            <Route path="franchise" element={<FranchiseManagement />} />
            <Route path="course" element={<CourseManagement />} />
            <Route path="staff" element={<StaffManagement />} />
            <Route path="student" element={<StudentManagement />} />
            <Route path="payments" element={<PaymentBilling />} />
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
