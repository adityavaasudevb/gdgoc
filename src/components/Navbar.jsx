import { Link, useNavigate } from "react-router-dom";
import { logout } from "../firebase/auth";
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getUserNotifications } from "../firebase/firestore";
import { useLocation } from "react-router-dom";
import "./Navbar.css";  // ✅ ENSURE THIS LINE EXISTS

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
    <nav className="club-navbar">
      <div className="club-logo">
        <strong>GRIET HUB</strong>
      </div>

      <div className="club-nav-links">
        <Link to="/dashboard" className={({ isActive }) => `club-nav-link ${isActive ? 'club-active' : ''}`}>
          Dashboard
        </Link>
        <Link to="/clubs" className={({ isActive }) => `club-nav-link ${isActive ? 'club-active' : ''}`}>
          Clubs
        </Link>
        <Link to="/events" className={({ isActive }) => `club-nav-link ${isActive ? 'club-active' : ''}`}>
          Events
        </Link>
        <Link to="/past-events" className={({ isActive }) => `club-nav-link ${isActive ? 'club-active' : ''}`}>
          Past Events
        </Link>
        <Link 
          to="/notifications" 
          state={{ clearBadge: true }} 
          className="club-nav-link club-notification-link"
        >
          Notifications
          {unreadCount > 0 && (
            <span className="club-notification-badge">{unreadCount}</span>
          )}
        </Link>
        <button className="club-logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}
