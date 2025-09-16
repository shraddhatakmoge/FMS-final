import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // 👇 Load from localStorage on app load
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const branch = localStorage.getItem("branch");
    const email = localStorage.getItem("email");

    if (token && role) {
      setUser({ token, role, branch, email });
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
