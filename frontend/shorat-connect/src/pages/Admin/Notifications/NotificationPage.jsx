// import React, { useEffect, useState, useRef } from "react";

// export const NotificationPage = ({ franchises = [] }) => {
//   const [notifications, setNotifications] = useState([]);
//   const listRef = useRef(null);

//   // Fetch notifications on mount
//   useEffect(() => {
//     fetch("http://127.0.0.1:8000/api/notifications/")
//   .then((res) => res.json())
//   .then((data) => setNotifications(data));

//   }, []);

//   const onMarkRead = (id) => {
//     fetch(`/api/notifications/${id}/mark_read/`, { method: "POST" })
//       .then(() => {
//         setNotifications((prev) =>
//           prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
//         );
//       });
//   };

//   const onMarkAllRead = () => {
//     fetch(`/api/notifications/mark_all_read/`, { method: "POST" })
//       .then(() => {
//         setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
//       });
//   };

//   const getFranchiseName = (id) => {
//     const franchise = franchises.find((f) => f.id === id);
//     return franchise ? franchise.name : "Unknown Franchise";
//   };

//   const handleMarkAllAndScroll = () => {
//     onMarkAllRead();
//     if (listRef.current) {
//       listRef.current.scrollTop = listRef.current.scrollHeight;
//     }
//   };

//   return (
//     <div className="relative min-h-[400px]">
//       <div className="flex justify-between items-center mb-1">
//         <h1 className="text-3xl font-bold">Notifications</h1>
//       </div>
//       <p className="text-gray-700 mb-6">View recent updates and alerts</p>

//       <ul
//         ref={listRef}
//         className="space-y-4 mb-20 max-h-[400px] overflow-y-auto"
//       >
//         {notifications.length === 0 && (
//           <li className="text-center text-gray-500">No notifications.</li>
//         )}

//         {notifications.map(({ id, message, created_at, franchiseId, is_read }) => (
//           <li
//             key={id}
//             className={`p-4 border rounded shadow-sm bg-white flex justify-between items-center ${
//               is_read ? "opacity-60" : "font-semibold"
//             }`}
//           >
//             <div>
//               <p className="font-semibold">{message}</p>
//               <p className="text-sm text-gray-700">{new Date(created_at).toLocaleString()}</p>
//               <p className="text-xs text-gray-500">
                
//               </p>
//             </div>
//             {!is_read && (
//               <button
//                 className="text-blue-600 underline text-sm"
//                 onClick={() => onMarkRead(id)}
//               >
//                 Mark Read
//               </button>
//             )}
//           </li>
//         ))}
//       </ul>

//       {notifications.some((n) => !n.is_read) && (
//         <button
//           onClick={handleMarkAllAndScroll}
//           title="Mark all notifications as read"
//           className="fixed bottom-4 right-4 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
//           aria-label="Mark all notifications as read"
//         >
//           <svg
//             xmlns="http://www.w3.org/2000/svg"
//             className="h-6 w-6"
//             fill="none"
//             viewBox="0 0 24 24"
//             stroke="currentColor"
//             strokeWidth={2}
//           >
//             <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
//           </svg>
//         </button>
//       )}
//     </div>
//   );
// };


import React, { useEffect, useState, useRef } from "react";

export const NotificationPage = ({ franchises = [] }) => {
  const [notifications, setNotifications] = useState([]);
  const listRef = useRef(null);

  const API_BASE = "http://127.0.0.1:8000/api/notifications";
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/notifications/")
      .then((res) => res.json())
      .then((data) => setNotifications(data));
  }, []);

  const onMarkRead = (id) => {
  fetch(`${API_BASE}/${id}/mark_read/`, { method: "POST" })
    .then(() => {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    });
};

  const onMarkAllRead = () => {
    fetch(`/api/notifications/mark_all_read/`, { method: "POST" })
      .then(() => {
        setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      });
  };

  const handleMarkAllAndScroll = () => {
    onMarkAllRead();
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="relative min-h-[400px]">
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          Notifications
          {unreadCount > 0 && (
            <span className="bg-red-600 text-white text-sm font-semibold px-2 py-0.5 rounded-full">
              {unreadCount}
            </span>
          )}
        </h1>
      </div>
      <p className="text-gray-700 mb-6">View recent updates and alerts</p>

      <ul
        ref={listRef}
        className="space-y-4 mb-20 max-h-[400px] overflow-y-auto"
      >
        {notifications.length === 0 && (
          <li className="text-center text-gray-500">No notifications.</li>
        )}

        {notifications.map(({ id, message, created_at, is_read }) => (
          <li
            key={id}
            className={`p-4 border rounded shadow-sm bg-white flex justify-between items-center ${
              is_read ? "opacity-60" : "font-semibold"
            }`}
          >
            <div>
              <p className="font-semibold">{message}</p>
              <p className="text-sm text-gray-700">
                {new Date(created_at).toLocaleString()}
              </p>
            </div>
            {!is_read && (
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

      {unreadCount > 0 && (
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
