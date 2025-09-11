import React, { useState, useEffect } from "react";
import { FranchiseHeader } from "../Layout/FranchiseHeader";
import { FranchiseSidebar } from "../Layout/FranchiseSidebar";
import DashboardContent from "../Dashboard/DashboardContent";
import StaffManagement from "../../Franchise/staff/staffmanagement";
import { NotificationPage } from "../Notifications/NotificationPage";
import StudentManagement from "../Student/StudentManagement";
import CourseManagement from "../course/CourseManagement";
import BatchManagement from "../Batches/BatchManagement";
import AttendanceSystem from "../AttendanceSystem/AttendanceSystem";
import ProgressReports from "../Progress and Reports/ProgressReports";
import EventsDashboard from "../Events&Workshop/EventsDashboard";
import FeedbackPage from "../Feedback/FeedbackPage";
import FranchiseProfile from "../Profile/FranchiseProfile";
import FracnhiseSetting from "../Setting/FranchiseSetting";
import { Menu, X } from "lucide-react";

export default function FranchiseLayout({ user, onLogout }) {
  const [activePage, setActivePage] = useState("Dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  // Track window resize for responsive menu
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

  const renderContent = () => {
    switch (activePage) {
      case "Dashboard":
        return <DashboardContent />;
      case "Staff Management":
        return <StaffManagement />;
      case "Student Management":
        return <StudentManagement />;
      case "Course Management":
        return <CourseManagement />;
      case "Batch Management":
        return <BatchManagement user={user} />;
      case "Attendance System":
        return <AttendanceSystem />;
      case "Progress & Reports":
        return <ProgressReports />;
      case "Events & Workshops":
        return <EventsDashboard />;
      case "Feedback":
        return <FeedbackPage />;
      case "Notifications":
        return (
          <NotificationPage
            franchises={franchises}
            notifications={notifications}
            onMarkRead={handleMarkRead}
            onMarkAllRead={handleMarkAllRead}
          />
        );
      case "Settings":
        return <FracnhiseSetting />;
      case "profile":
        return <FranchiseProfile user={user} />;
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <FranchiseHeader
        user={user}
        onLogout={onLogout}
        onProfileClick={() => setActivePage("profile")}
        unreadCount={notifications.filter((n) => !n.read).length}
        onBellClick={() => setActivePage("Notifications")}
        onMenuToggle={() => setMobileOpen((prev) => !prev)}
      />

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <FranchiseSidebar
          activeItem={activePage}
          onItemClick={setActivePage}
          collapsed={!isMobile && collapsed}
          unreadCount={notifications.filter((n) => !n.read).length}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />

        {/* Main content */}
        <main className="flex-1 p-6 overflow-y-auto relative">
          {/* Floating Hamburger / X button */}
          <div className="mb-4">
            <button
              className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 fixed top-4 left-4 z-50 md:hidden"
              onClick={() => setMobileOpen((prev) => !prev)}
            >
              {mobileOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
            </button>

            {!isMobile && (
              <button
                className="bg-white p-2 rounded-full shadow-md hover:bg-gray-100 ml-2"
                onClick={() => setCollapsed((prev) => !prev)}
              >
                {collapsed ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
              </button>
            )}
          </div>

          {renderContent()}
        </main>
      </div>
    </div>
  );
}
