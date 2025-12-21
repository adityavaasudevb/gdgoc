import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Clubs from "./pages/Clubs";
import Events from "./pages/Events";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/AuthContext";
import Chatbot from "./pages/Chatbot";
import ClubDetail from "./pages/ClubDetail";
import PastEvents from "./pages/PastEvents.jsx";
import Notifications from "./pages/Notifications";

function AppRoutes() {
  const { user } = useAuth();

  return (
    <>
      {user && <Navbar />}
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
          path="/chatbot"
          element={
            <ProtectedRoute>
              <Chatbot />
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
        <Route path="/notifications" element={<Notifications />} />

      </Routes>
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
