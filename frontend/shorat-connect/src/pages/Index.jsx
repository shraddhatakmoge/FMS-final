import { useState, useEffect } from "react";
import { NotificationPage } from "@/components/Notifications/NotificationPage";
import { LoginForm } from "@/components/auth/LoginForm";
import { Header } from "@/components/Layout/Header";
import { Sidebar } from "@/components/Layout/Sidebar";
import { DashboardContent } from "@/components/Dashboard/DashboardContent";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import ReportsAnalytics from "../components/Report and Analysis/ReportAnalysis";
import StaffManagement from "../components/staff/staffmanagement";
import StudentManagement from "../components/Student/StudentManagement";
import BatchManagement from "../components/Batches/BatchManagement";
import FranchiseManagement from "../components/Franchise/FranchiseManagement";
import CourseManagement from "../components/course/CourseManagement";
import EventsDashboard from "../components/Events&Workshop/Events&Workshops";



const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const [notifications, setNotifications] = useState([
    { id: 1, franchiseId: 1, message: "New staff member added to Pune Wagholi", time: "Just now", read: false },
    { id: 2, franchiseId: null, message: "Batch 3 schedule updated", time: "1 hour ago", read: false },
    { id: 3, franchiseId: 2, message: "Payment received from Ahilya Nagar", time: "Yesterday", read: false },
    { id: 4, franchiseId: null, message: "Attendance report is now available", time: "2 days ago", read: false },
    { id: 5, franchiseId: null, message: "Upcoming workshop: React Basics", time: "3 days ago", read: false },
    { id: 6, franchiseId: 1, message: "New staff member added to Shraddha takmoge Pune Wagholi", time: "Just now", read: false }
  ]);

  const franchises = [
    { id: 1, name: "Pune Wagholi" },
    { id: 2, name: "Ahilya Nagar" },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = (credentials) => {
    const userData = {
      name: getRoleDisplayName(credentials.role),
      role: credentials.role,
      email: credentials.email,
    };
    setUser(userData);
    setIsAuthenticated(true);
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case "admin":
        return "Admin User";
      case "franchise_head":
        return "Franchise Head";
      case "staff":
        return "Staff Member";
      default:
        return "User";
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setActiveItem("Dashboard");
  };

  const handleNotificationClick = () => {
    setActiveItem("Notifications");
  };

  const renderContent = () => {
    switch (activeItem) {
      case "Staff Management":
        return <StaffManagement/>;
      case "Batch Management":
        return <BatchManagement/>;
      case "Student Management":
        return <StudentManagement />;
      case "Events & Workshops":
          return <EventsDashboard/>;
      case "Dashboard":
        return <DashboardContent userRole={user?.role || ""} />;
      case "Franchise Management":
        return <FranchiseManagement />;
      case "Reports & Analytics":
        return <ReportsAnalytics/>;
      case "Notifications":
        return (
          <NotificationPage
            franchises={franchises}
            notifications={notifications}
            onMarkRead={(id) => {
              setNotifications(
                notifications.map((n) =>
                  n.id === id ? { ...n, read: true } : n
                )
              );
            }}
            onMarkAllRead={() => {
              setNotifications(
                notifications.map((n) => ({ ...n, read: true }))
              );
            }}
          />
        );
      case "Course Management":
        return <CourseManagement />;
      default:
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">{activeItem}</h2>
            <p className="text-muted-foreground">
              This module is under development...
            </p>
          </div>
        );
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header
        user={user}
        onLogout={handleLogout}
        unreadCount={unreadCount}
        onBellClick={handleNotificationClick}
        onMenuToggle={() => setMobileSidebarOpen(true)}
      />
      <div className="flex flex-1 overflow-hidden">
        
        {/* Sidebar for Desktop */}
        {!isMobile && (
          <div
            className={cn(
              "transition-all duration-300 hidden md:block",
              sidebarCollapsed ? "w-16" : "w-64"
            )}
          >
            <Sidebar
              userRole={user?.role || ""}
              activeItem={activeItem}
              onItemClick={(item) => {
                setActiveItem(item);
                if (item === "Notifications") handleNotificationClick();
              }}
              collapsed={sidebarCollapsed}
              unreadCount={unreadCount}
            />
          </div>
        )}

        {/* Sidebar for Mobile */}
        {isMobile && (
          <Sidebar
            userRole={user?.role || ""}
            activeItem={activeItem}
            onItemClick={(item) => {
              setActiveItem(item);
              setMobileSidebarOpen(false);
              if (item === "Notifications") handleNotificationClick();
            }}
            collapsed={false}
            unreadCount={unreadCount}
            mobileOpen={mobileSidebarOpen}
            onClose={() => setMobileSidebarOpen(false)}
          />
        )}

        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex items-center mb-6">
              {!isMobile && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:inline-flex mr-4"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                >
                  {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
                </Button>
              )}
              <div className="text-sm text-muted-foreground truncate">
                {user?.role === "admin" && "System Administrator"}
                {user?.role === "franchise_head" && "Franchise Management"}
                {user?.role === "staff" && "Staff Portal"}
                <span className="mx-2">•</span>
                {activeItem}
              </div>
            </div>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;