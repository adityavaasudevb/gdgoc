import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clubs from "./pages/Clubs";
import Events from "./pages/Events";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import ClubDetail from "./pages/ClubDetail";
import PastEvents from "./pages/PastEvents.jsx";
import Notifications from "./pages/Notifications";
import ChatWidget from "./components/ChatWidget"; // ✅ import


/*
  AppRoutes:
  - Handles routing
  - Shows Navbar only when user is logged in
  - Mounts ChatWidget globally (important)
*/
function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      {/* Show navbar only after login */}
      {user && <Navbar />}

      {/* Main app routes */}
      <Routes>
        <Route path="/" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clubs"
          element={
            <ProtectedRoute>
              <Clubs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />

        <Route
          path="/clubs/:clubId"
          element={
            <ProtectedRoute>
              <ClubDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/past-events"
          element={
            <ProtectedRoute>
              <PastEvents />
            </ProtectedRoute>
          }
        />

        <Route
          path="/notifications"
          element={
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* 🤖 Floating Gemini Chat Assistant (only after login) */}
{user && <ChatWidget />}

    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}
