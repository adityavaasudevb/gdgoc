import { Link, useNavigate } from "react-router-dom";
import { logout } from "../firebase/auth";

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 20px",
        borderBottom: "1px solid #ddd",
      }}
    >
      <div>
        <strong>GDGOC</strong>
      </div>

      <div style={{ display: "flex", gap: "16px" }}>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/clubs">Clubs</Link>
        <Link to="/events">Events</Link>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
