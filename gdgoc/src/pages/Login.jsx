import { signInWithGoogle, logout } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db, getClubs } from "../firebase/firestore";

/*
  Login Page
  - Supports STUDENT + CLUB ADMIN login
  - Clean UI
  - No logic regression
*/

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      const email = result.user.email;

      // 🔍 Check admin emails from clubs
      const clubs = await getClubs();
      const isAdminEmail = clubs.some((club) =>
        club.adminEmails?.includes(email)
      );

      // 🎓 Student email check
      const isStudentEmail = email.endsWith("@grietcollege.com");

      // ❌ Block invalid users
      if (!isStudentEmail && !isAdminEmail) {
        alert("Please use a valid college or club admin email");
        await logout();
        return;
      }

      // 👤 Ensure user doc exists (DO NOT overwrite bookmarks)
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
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(180deg, #f9fafb, #eef2f7)",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "#ffffff",
          padding: "40px 36px",
          borderRadius: "14px",
          boxShadow: "0 20px 40px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            marginBottom: "10px",
            fontSize: "32px",
            fontWeight: "700",
            color: "#111827",
          }}
        >
          GRIET Hub
        </h1>

        <p
          style={{
            color: "#6b7280",
            fontSize: "16px",
            marginBottom: "28px",
            lineHeight: "1.6",
          }}
        >
          One secure platform for campus clubs, events, and opportunities
        </p>

        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "14px",
            fontSize: "16px",
            fontWeight: "600",
            background: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            boxShadow: "0 6px 14px rgba(37,99,235,0.3)",
          }}
        >
          Sign in with Google
        </button>

        <p
          style={{
            marginTop: "20px",
            fontSize: "14px",
            color: "#6b7280",
          }}
        >
          🔒 Access restricted to GRIET students & club admins
        </p>
      </div>
    </div>
  );
}