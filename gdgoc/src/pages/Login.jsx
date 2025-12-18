import { signInWithGoogle, logout } from "../firebase/auth";
import { useNavigate } from "react-router-dom";

export default function Login() {
  // 1️⃣ Initialize navigate here, at the top of your component
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const result = await signInWithGoogle();
      const email = result.user.email;

      // 2️⃣ College email restriction
      if (!email.endsWith("@grietcollege.com")) {
        alert("Please use your college email");
        await logout();
        return;
      }

      console.log(result.user.email);

      // 3️⃣ Redirect after successful login
      navigate("/dashboard"); // ← exactly here

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
