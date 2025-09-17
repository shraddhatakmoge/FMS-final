import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Routes,
  Route,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import NotFound from "./pages/NotFound";
import { LoginForm } from "./components/auth/LoginForm";

// ✅ Different layouts for different roles
import FranchiseLayout from "../src/pages/Franchise/Layout/FranchiseLayout";
import { StaffLayout } from "../src/pages/Staff/Layout/StaffLayout";
import AdminLayout from "../src/pages/Admin/Layout/AdminLayout";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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

  // ✅ Restore session on refresh
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const email = localStorage.getItem("email");
    const expiry = localStorage.getItem("expiry");

    if (token && role && email && expiry && Date.now() < expiry) {
      const userData = {
        name: getRoleDisplayName(role),
        role,
        email,
        token,
      };
      setUser(userData);
      setIsAuthenticated(true);
    } else {
      handleLogout(false); // expired session → force logout
    }
    setLoading(false);
  }, []);

  // ✅ Auto-expiry: logout when token expires
  useEffect(() => {
    if (isAuthenticated && user) {
      const expiry = localStorage.getItem("expiry");
      if (expiry) {
        const remaining = expiry - Date.now();
        const timer = setTimeout(() => {
          handleLogout();
        }, remaining);
        return () => clearTimeout(timer);
      }
    }
  }, [isAuthenticated, user]);

  const handleLoginSuccess = (credentials) => {
    const userData = {
      name: getRoleDisplayName(credentials.role),
      role: credentials.role,
      email: credentials.email,
      token: credentials.token,
    };

    // Save session
    localStorage.setItem("token", credentials.token);
    localStorage.setItem("role", credentials.role);
    localStorage.setItem("email", credentials.email);
    localStorage.setItem("expiry", Date.now() + 1000 * 60 * 60); // 1 hour

    setUser(userData);
    setIsAuthenticated(true);

    // ✅ Redirect based on role
    switch (credentials.role) {
      case "admin":
        navigate("/admin/dashboard", { replace: true });
        break;
      case "franchise_head":
        navigate("/franchise/dashboard", { replace: true });
        break;
      case "staff":
        navigate("/staff/dashboard", { replace: true });
        break;
      default:
        navigate("/login", { replace: true });
    }
  };

  const handleLogout = (redirect = true) => {
    // Remove only auth keys
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("expiry");

    setIsAuthenticated(false);
    setUser(null);

    if (redirect) {
      navigate("/login", { replace: true });
    }
  };

  // ✅ New: Handle back navigation
  const handleGoBack = () => {
    navigate(-1);
  };

  // ✅ Show loader until session check completes
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
          {/* Always go to login on first load */}
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

          <Route path="/not-found" element={<NotFound />} />

          {/* Protected Routes */}
          {isAuthenticated ? (
            <>
              <Route
  path="/admin/*"
  element={<AdminLayout user={user} onLogout={handleLogout} onGoBack={handleGoBack} />}
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
        </Routes>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
