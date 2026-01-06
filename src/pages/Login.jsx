import { signInWithGoogle, logout } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firestore";
import { getClubs } from "../firebase/firestore";

export default function Login() {
  // 1️⃣ Initialize navigate here, at the top of your component
  const navigate = useNavigate();

  const handleLogin = async () => {
  try {
    const result = await signInWithGoogle();
    const email = result.user.email;

    // Fetch clubs to check admin emails
    const clubs = await getClubs();
    const isAdminEmail = clubs.some(
      (club) => club.adminEmails?.includes(email)
    );

    const isStudentEmail = email.endsWith("@grietcollege.com");

    if (!isStudentEmail && !isAdminEmail) {
      alert("Please use a valid college or club admin email");
      await logout();
      return;
    }

    // Ensure user document exists (DO NOT reset bookmarks)
    await setDoc(
      doc(db, "users", result.user.uid),
      {
        email: email,
      },
      { merge: true }
    );

    navigate("/dashboard");
  } catch (error) {
    console.error(error);
  }
};


  return (
    <div>
      <h2>Login Page</h2>
      <button onClick={handleLogin}>Sign in with Google</button>
    </div>
  );
}
