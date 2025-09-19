// src/pages/Admin/Notifications/NotificationPage.jsx
import React, { useRef } from "react";
import { AuthContext } from "../context/AuthContext.jsx";


export const NotificationPage = ({
  franchises = [],
  notifications = [],
  onMarkRead = () => {},
  onMarkAllRead = () => {},
}) => {
  const listRef = useRef(null);

  const getFranchiseName = (id) => {
    const franchise = franchises.find((f) => f.id === id);
    return franchise ? franchise.name : "Unknown Franchise";
  };

  const handleMarkAllAndScroll = () => {
    onMarkAllRead();
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  return (
    <div className="relative min-h-[400px]">
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-3xl font-bold">Notifications</h1>
      </div>
      <p className="text-gray-700 mb-6">View recent updates and alerts</p>

      <ul
        ref={listRef}
        className="space-y-4 mb-20 max-h-[400px] overflow-y-auto"
      >
        {notifications.length === 0 && (
          <li className="text-center text-gray-500">No notifications.</li>
        )}

        {notifications.map(({ id, message, time, franchiseId, read }) => (
          <li
            key={id}
            className={`p-4 border rounded shadow-sm bg-white flex justify-between items-center ${
              read ? "opacity-60" : "font-semibold"
            }`}
          >
            <div>
              <p className="font-semibold">{message}</p>
              <p className="text-sm text-gray-700">{time}</p>
              <p className="text-xs text-gray-500">
                Franchise: {getFranchiseName(franchiseId)}
              </p>
            </div>
            {!read && (
              <button
                className="text-blue-600 underline text-sm"
                onClick={() => onMarkRead(id)}
              >
                Mark Read
              </button>
            )}
          </li>
        ))}
      </ul>

      {notifications.some((n) => !n.read) && (
        <button
          onClick={handleMarkAllAndScroll}
          title="Mark all notifications as read"
          className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
          aria-label="Mark all notifications as read"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>
  );
};