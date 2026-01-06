import { useEffect, useState } from "react";
import {
  getUserNotifications,
  markNotificationsAsRead,
} from "../firebase/firestore";
import { useAuth } from "../context/AuthContext";
import "./Notifications.css";

export default function Notifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!user) return;

    const fetchAndMark = async () => {
      const data = await getUserNotifications(user.uid);
      setNotifications(data);
      await markNotificationsAsRead(user.uid);
    };

    fetchAndMark();
  }, [user]);

  return (
    <div className="notif-page">
      <div className="notif-bg-gradient" />

      <div className="notif-header">
        <h2>Notifications</h2>
        {notifications.length > 0 && (
          <span className="notif-pill">{notifications.length}</span>
        )}
      </div>

      {notifications.length === 0 && (
        <p className="notif-empty">You&apos;re all caught up ✨</p>
      )}

      <div className="notif-list">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`notif-card ${n.read ? "notif-read" : "notif-unread"}`}
          >
            <div className="notif-accent" />
            <div className="notif-main">
              <p className="notif-message">{n.message}</p>
              <small className="notif-time">
                {n.createdAt?.seconds
                  ? new Date(n.createdAt.seconds * 1000).toLocaleString()
                  : ""}
              </small>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
