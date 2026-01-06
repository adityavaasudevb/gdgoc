import { signInWithGoogle, logout } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db, getClubs } from "../firebase/firestore";
import "./Login.css";
/*
  Login Page
  - Dashboard / Clubs theme
  - Black + Orange
  - No logic changes
*/

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      const email = result.user.email;

      const clubs = await getClubs();
      const isAdminEmail = clubs.some((club) =>
        club.adminEmails?.includes(email)
      );

      const isStudentEmail = email.endsWith("@grietcollege.com");

      if (!isStudentEmail && !isAdminEmail) {
        alert("Please use a valid college or club admin email");
        await logout();
        return;
      }

      await setDoc(
        doc(db, "users", result.user.uid),
        { email },
        { merge: true }
      );

      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-title">GRIET HUB</h1>

        <p className="login-subtitle">
          One secure platform for campus clubs, events, and opportunities
        </p>

        <button className="login-btn" onClick={handleLogin}>
          Sign in with Google
        </button>

        <p className="login-note">
          🔒 Access restricted to GRIET students & club admins
        </p>
      </div>
    </div>
  );
}