import { useEffect, useState } from "react";
import { getUserNotifications } from "../firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const data = await getUserNotifications(user.uid);
      setNotifications(data);
    };

    fetchNotifications();
  }, [user]);

  return (
    <div style={{ maxWidth: "600px", margin: "20px auto" }}>
      <h2>Notifications</h2>

      {notifications.length === 0 && (
        <p>No notifications yet.</p>
      )}

      {notifications.map(n => (
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
            {new Date(n.createdAt.seconds * 1000).toLocaleString()}
          </small>
        </div>
      ))}
    </div>
  );
}
