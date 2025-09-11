import React, { useState } from "react";
import {StaffSidebar} from "./StaffSidebar";
import { StaffHeader } from "./StaffHeader";

// Import all Staff pages (you can adjust according to your folder structure)
import { DashboardContent } from "../Dashboard/DashboardContent";
import {NotificationPage} from "../Notifications/NotificationPage"
import MyStudents from "../Student/MyStudents";
import MyBatches from "../Batches/MyBatches";
import AttendanceSystem from "../AttendanceSystem/AttendanceSystem";
import ProgressReports from "../Progress and Reports/ProgressReports";
import { Menu, X } from "lucide-react";

export const StaffLayout = () => {
  const [activePage, setActivePage] = useState("dashboard"); // default dashboard
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  const renderContent = () => {
    switch (activePage) {

      case "My Students":
        return <MyStudents />;
      case "My Batches":
        return <MyBatches />;
      case "Attendance":
        return <AttendanceSystem />;
      case "Student Progress":
        return <ProgressReports />;
      case "Chat":
        return <ChatSystem />;

      case "Notifications":
              return (
                <NotificationPage
                  // franchises={franchises}
                  notifications={notifications}
                  onMarkRead={handleMarkRead}
                  onMarkAllRead={handleMarkAllRead}
                />
              );
      default:
        return <DashboardContent />;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <StaffHeader
        onNotificationsClick={() => setActivePage("notifications")}
        unreadCount={notifications.filter((n) => !n.read).length}
        onGoHome={() => setActivePage("dashboard")} // ✅ Clicking Shorat Innovations = dashboard
        setActivePage={setActivePage} // ✅ Pass to Header for Profile button
      />

      <div className="flex flex-1 relative">
        {/* Sidebar */}
        <StaffSidebar
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

