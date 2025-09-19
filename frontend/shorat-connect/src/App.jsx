import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";

import NotFound from "./pages/NotFound";
import { LoginForm } from "./components/auth/LoginForm";

// Layouts for roles
import FranchiseLayout from "./pages/Franchise/Layout/FranchiseLayout";
import { StaffLayout } from "./pages/Staff/Layout/StaffLayout";
import AdminLayout from "./pages/Admin/Layout/AdminLayout";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Map role to display name
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

  // Restore session from localStorage
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");
    const expiry = localStorage.getItem("expiry");

    if (token && role && email && expiry && Date.now() < +expiry) {
      setUser({
        name: getRoleDisplayName(role),
        role,
        email,
        token,
      });
      setIsAuthenticated(true);
    } else {
      handleLogout(false); // force logout if expired
    }
    setLoading(false);
  }, []);

  // Auto logout on expiry
  useEffect(() => {
    if (isAuthenticated && user) {
      const expiry = localStorage.getItem("expiry");
      if (expiry) {
        const remaining = +expiry - Date.now();
        const timer = setTimeout(() => handleLogout(), remaining);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, user]);

  const handleLoginSuccess = (credentials) => {
    const { token, role, email } = credentials;

    const userData = {
      name: getRoleDisplayName(role),
      role,
      email,
      token,
    };

    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("email", email);
    localStorage.setItem("expiry", Date.now() + 1000 * 60 * 60); // 1 hour

    setUser(userData);
    setIsAuthenticated(true);

    // Redirect based on role
    if (role === "admin") navigate("/admin/dashboard", { replace: true });
    else if (role === "franchise_head") navigate("/franchise/dashboard", { replace: true });
    else if (role === "staff") navigate("/staff/dashboard", { replace: true });
    else navigate("/login", { replace: true });
  };

  const handleLogout = (redirect = true) => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("expiry");

    setIsAuthenticated(false);
    setUser(null);

    if (redirect) navigate("/login", { replace: true });
  };

  const handleGoBack = () => navigate(-1);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />

        <Routes>
          {/* Default route */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Login route */}
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate
                  to={
                    user?.role === "admin"
                      ? "/admin/dashboard"
                      : user?.role === "franchise_head"
                      ? "/franchise/dashboard"
                      : "/staff/dashboard"
                  }
                  replace
                />
              ) : (
                <LoginForm onLogin={handleLoginSuccess} />
              )
            }
          />

          {/* Protected routes */}
          {isAuthenticated && user ? (
            <>
              <Route
                path="/admin/*"
                element={
                  <AdminLayout
                    user={user}
                    onLogout={handleLogout}
                    onGoBack={handleGoBack}
                  />
                }
              />
              <Route
                path="/franchise/dashboard/*"
                element={
                  <FranchiseLayout
                    user={user}
                    onLogout={handleLogout}
                    onGoBack={handleGoBack}
                    email={user?.email} 
                  />
                }
              />
              <Route
                path="/staff/dashboard/*"
                element={
                  <StaffLayout
                    user={user}
                    onLogout={handleLogout}
                    onGoBack={handleGoBack}
                  />
                }
              />
              <Route path="*" element={<Navigate to="/not-found" replace />} />
            </>
          ) : (
            <Route path="*" element={<Navigate to="/login" replace />} />
          )}

          {/* Not Found */}
          <Route path="/not-found" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
