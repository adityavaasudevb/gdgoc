import { Link, useNavigate } from "react-router-dom";
import { logout } from "../firebase/auth";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserNotifications } from "../firebase/firestore";
import { useLocation } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const location = useLocation();

useEffect(() => {
  if (location.state?.clearBadge) {
    setUnreadCount(0);
  }
}, [location]);

  // 🔔 Fetch unread notifications
  useEffect(() => {
    if (!user) return;

    const fetchUnread = async () => {
      const data = await getUserNotifications(user.uid);
      const unread = data.filter((n) => !n.read).length;
      setUnreadCount(unread);
    };

    fetchUnread();
  }, [user]);

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 20px",
        borderBottom: "1px solid #ddd",
      }}
    >
      <strong>GDGOC</strong>

      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/clubs">Clubs</Link>
        <Link to="/events">Events</Link>
        <Link to="/past-events">Past Events</Link>
        <Link to="/notifications" state={{ clearBadge: true }} style={{ position: "relative" }}>

          Notifications
          {unreadCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-6px",
                right: "-10px",
                background: "red",
                color: "white",
                borderRadius: "50%",
                padding: "2px 6px",
                fontSize: "12px",
              }}
            >
              {unreadCount}
            </span>
          )}
        </Link>

        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
