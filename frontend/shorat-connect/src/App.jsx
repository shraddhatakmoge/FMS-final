import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom"; 
import NotFound from "./pages/NotFound";
import { LoginForm } from "./components/auth/LoginForm"; 
import { useState } from "react";

// ✅ Different layouts for different roles
import FranchiseLayout from "../src/pages/Franchise/Layout/FranchiseLayout";
import {StaffLayout} from "../src/pages/Staff/Layout/StaffLayout";
import AdminLayout from "../src/pages/Admin/Layout/AdminLayout";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const handleLoginSuccess = (credentials) => {
    const userData = {
      name: getRoleDisplayName(credentials.role),
      role: credentials.role,
      email: credentials.email,
    };

    setUser(userData);
    setIsAuthenticated(true);

    // ✅ Redirect based on role
    switch (credentials.role) {
      case "admin":
        navigate("/admin/dashboard");
        break;
      case "franchise_head":
        navigate("/franchise/dashboard");
        break;
      case "staff":
        navigate("/staff/dashboard");
        break;
      default:
        navigate("/login");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    navigate("/login"); 
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

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginForm onLogin={handleLoginSuccess} />} />
          <Route path="/not-found" element={<NotFound />} />

          {/* Protected Routes */}
          {isAuthenticated ? (
            <>
              <Route path="/admin/dashboard/*" element={<AdminLayout user={user} onLogout={handleLogout} />} />
              <Route path="/franchise/dashboard/*" element={<FranchiseLayout user={user} onLogout={handleLogout} />} />
              <Route path="/staff/dashboard/*" element={<StaffLayout user={user} onLogout={handleLogout} />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}

          {/* Fallback for invalid paths */}
          <Route path="*" element={<Navigate to="/not-found" />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
