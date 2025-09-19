import React, { createContext, useState, useEffect, useCallback, useContext } from "react";
import axios from "axios";
// Correct path to get from Notifications/ to src/, then into context/
import { AuthContext } from "../context/AuthContext";
export const NotificationContext = createContext();
export const NotificationProvider = ({ children }) => {
  const { authToken } = useContext(AuthContext); // Access the token from your AuthContext
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper function to get the CSRF token (re-use from NotificationsContainer)
  const getCsrfToken = () => {
    let csrfToken = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith("csrftoken=")) {
          csrfToken = decodeURIComponent(cookie.substring("csrftoken=".length));
          break;
        }
      }
    }
    return csrfToken;
  };

  const fetchNotifications = useCallback(async () => {
    if (!authToken) {
      setLoading(false);
      return; // Prevent fetching if no token is available
    }

    try {
      setLoading(true);
      const response = await axios.get(
        "http://localhost:8000/api/notifications/list/",
        {
          headers: {
            Authorization: `Bearer ${authToken}`, // <-- This is the key change
          },
        }
      );
      setNotifications(response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  }, [authToken]); // Add authToken as a dependency
    // The handleMarkRead and handleMarkAllRead functions also need to be updated
    const handleMarkRead = async (id) => {
    if (!authToken) {
      console.error("Authentication token not provided.");
      return;
    }
    const csrfToken = getCsrfToken();
    try {
      await axios.post(
        `http://localhost:8000/api/notifications/mark-read/${id}/`,
        {},
        {
          headers: {
            "X-CSRFToken": csrfToken,
            Authorization: `Bearer ${authToken}`, // <-- Add this header
          },
        }
      );
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error("Error marking notification as read:", error.response?.data || error.message);
    }
  };

  const handleMarkAllRead = async () => {
    if (!authToken) {
      console.error("Authentication token not provided.");
      return;
    }
    const csrfToken = getCsrfToken();
    try {
      await axios.post(
        "http://localhost:8000/api/notifications/mark-all-read/",
        {},
        {
          headers: {
            "X-CSRFToken": csrfToken,
            Authorization: `Bearer ${authToken}`, // <-- Add this header
          },
        }
      );
      setNotifications((prevNotifications) =>
        prevNotifications.map((n) => ({ ...n, read: true }))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 60000); 
    return () => clearInterval(intervalId);
  }, [fetchNotifications]);
  

  const value = {
    notifications,
    loading,
    fetchNotifications, 
    handleMarkRead,
    handleMarkAllRead,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};