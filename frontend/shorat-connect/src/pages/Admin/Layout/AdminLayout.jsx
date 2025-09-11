import React, { useState } from "react";
import Header from "./Header";
import { AdminSidebar } from "../Layout/AdminSidebar";
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
import { Menu, X } from "lucide-react";
import AdminProfile from "../Profile/AdminProfile"; // ✅ NEW IMPORT
import AdminSetting from "../Setting/AdminSetting";
export default function AdminLayout() {
  const [activePage, setActivePage] = useState("dashboard"); // default dashboard
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

  // Switch page rendering
  const renderContent = () => {
  switch (activePage) {
    case "dashboard":
      return <DashboardContent />;
    case "settings":
      return <AdminSetting />;
    case "franchise":
      return <FranchiseManagement setActivePage={setActivePage} />; // ✅ FIX
    case "course":
      return <CourseManagement />;
    case "staff":
      return <StaffManagement setActivePage={setActivePage} />;
    case "student":
      return <StudentManagement setActivePage={setActivePage} />;
    case "batch":
      return <BatchManagement setActivePage={setActivePage} />;
    case "attendance":
      return <AttendanceSystem />;
    case "reports":
      return <ReportAnalysis />;
    case "events":
      return <EventsWorkshop />;
    case "feedback":
      return <FeedbackPage />;
    case "notifications":
      return (
        <NotificationPage
          franchises={franchises}
          notifications={notifications}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
        />
      );
    case "profile":
      return <AdminProfile />;
    default:
      return <DashboardContent />;
  }
};


  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <Header
        onNotificationsClick={() => setActivePage("notifications")}
        unreadCount={notifications.filter((n) => !n.read).length}
        onGoHome={() => setActivePage("dashboard")} // ✅ Clicking Shorat Innovations = dashboard
        setActivePage={setActivePage} // ✅ Pass to Header for Profile button
      />

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <AdminSidebar
          activeItem={activePage} // ✅ Dashboard text red when active
          onItemClick={setActivePage}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          unreadCount={notifications.filter((n) => !n.read).length}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
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

          {renderContent()}
        </main>
      </div>
      </div>
    
  );
}
