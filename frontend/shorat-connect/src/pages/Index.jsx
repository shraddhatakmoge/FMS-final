import { useState } from "react";
import { LoginForm } from "@/components/auth/LoginForm";
import  {Header}  from "@/components/Layout/Header";
import { Sidebar } from "@/components/Layout/Sidebar";
import { DashboardContent } from "@/components/Dashboard/DashboardContent";

import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import StaffManagement from "../components/staff/staffmanagement";
import StudentManagement from "../components/Student/StudentManagement";
import BatchManagement from "../components/Batches/BatchManagement";
import FranchiseManagement from "../components/Franchise/FranchiseManagement";
import ReportAnalysis from "../components/Report and Analysis/ReportAnalysis";
const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const handleLogin = (credentials) => {
    // Mock authentication - in real app, this would call an API
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

  const renderContent = () => {
    switch (activeItem) {
      case "Staff Management":
        return <StaffManagement/>;
      case "Reports & Analytics":
        return <ReportAnalysis/>;
      case "Batch Management":
        return <BatchManagement/>;
      case "Student Management":
        return <StudentManagement/>;
      case "Dashboard":
        return <DashboardContent userRole={user?.role || ""} />;
      case "Franchise Management":
        return <FranchiseManagement />;
      case "Staff Management":
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Staff Management</h2>
            <p className="text-muted-foreground">Staff management module coming soon...</p>
          </div>
        );
      case "Student Management":
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Student Management</h2>
            <p className="text-muted-foreground">Student management module coming soon...</p>
          </div>
        );
      case "Payments & Billing":
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Payments & Billing</h2>
            <p className="text-muted-foreground">Payment management module coming soon...</p>
          </div>
        );
      default:
        return (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">{activeItem}</h2>
            <p className="text-muted-foreground">This module is under development...</p>
          </div>
        );
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header user={user} onLogout={handleLogout} />
      <div className="flex flex-1 overflow-hidden">
        <div
          className={cn(
            "transition-all duration-300 flex-shrink-0",
            sidebarCollapsed ? "w-16" : "w-64"
          )}
        >
          <Sidebar
            userRole={user?.role || ""}
            activeItem={activeItem}
            onItemClick={setActiveItem}
            collapsed={sidebarCollapsed}
          />
        </div>
        <main className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="flex items-center mb-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="mr-4"
              >
                {sidebarCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
              </Button>
              <div className="text-sm text-muted-foreground">
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
