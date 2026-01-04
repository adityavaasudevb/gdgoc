import { useEffect, useState } from "react";
import {
  getUserNotifications,
  markNotificationsAsRead,
} from "../firebase/firestore";
import { useAuth } from "../context/AuthContext";

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
    <div style={{ maxWidth: "600px", margin: "20px auto" }}>
      <h2>Notifications</h2>

      {notifications.length === 0 && (
        <p>No notifications yet.</p>
      )}

      {notifications.map((n) => (
        <div
          key={n.id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            margin: "10px 0",
            borderRadius: "6px",
            background: n.read ? "#fafafa" : "#fff",
          }}
        >
          <p>{n.message}</p>
          <small>
            {n.createdAt?.seconds
              ? new Date(n.createdAt.seconds * 1000).toLocaleString()
              : ""}
          </small>
        </div>
      ))}
    </div>
  );
}
