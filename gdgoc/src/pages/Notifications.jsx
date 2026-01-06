import { useEffect, useState } from "react";
import {
  getUserNotifications,
  markNotificationsAsRead,
} from "../firebase/firestore";
import { useAuth } from "../context/AuthContext";
import "./Notifications.css";

/*
  Notifications page
  - Shows all notifications
  - Marks them as READ when page is opened
*/

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchAndMark = async () => {
      // 1️⃣ Fetch notifications
      const data = await getUserNotifications(user.uid);
      setNotifications(data);

      // 2️⃣ Mark all unread notifications as read
      await markNotificationsAsRead(user.uid);
    };

    fetchAndMark();
  }, [user]);

  return (
    <div className="notifications-page">
      <div className="notifications-container">
        <h2 className="notifications-title">Notifications</h2>

        {notifications.length === 0 && (
          <p className="notifications-empty">
            No notifications yet.
          </p>
        )}

        {notifications.map((n) => (
          <div
            key={n.id}
            className={`notification-card ${
              n.read ? "" : "unread"
            }`}
          >
            <p className="notification-message">{n.message}</p>
            <small className="notification-time">
              {n.createdAt?.seconds
                ? new Date(
                    n.createdAt.seconds * 1000
                  ).toLocaleString()
                : ""}
            </small>
          </div>
        ))}
      </div>
    </div>
  );
}
