import { RootState } from "@/store/store";
import { useSelector } from "react-redux";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/ProtectedRoutes";
import AdminDashboard from "./pages/AdminDashboard";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import LoginPage from "./pages/LoginPage";
import { PollDetailPage } from "./pages/PollPage";
import ProfilePage from "./pages/ProfilePage";
import RegisterPage from "./pages/RegisterPage";
import VoterLanding from "./pages/VoterLanding";

function App() {
  const auth = useSelector((state: RootState) => state.auth);

  console.log("Auth state:", auth);

  // Helper function to determine if user is authenticated
  const isAuthenticated = Boolean(auth.token && auth.decodedToken);
  const userRole = auth.decodedToken?.role;

  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to={userRole === "ADMIN" ? "/admin/dashboard" : "/home"} replace />
            ) : (
              <LoginPage />
            )
          }
        />

        <Route
          path="/register"
          element={
            isAuthenticated ? (
              <Navigate to={userRole === "ADMIN" ? "/admin/dashboard" : "/home"} replace />
            ) : (
              <RegisterPage />
            )
          }
        />

        <Route
          path="/forgot-password"
          element={
            isAuthenticated ? (
              <Navigate to={userRole === "ADMIN" ? "/admin/dashboard" : "/home"} replace />
            ) : (
              <ForgotPasswordPage />
            )
          }
        />

        <Route path="/polls/:pollId" element={<PollDetailPage />} />

        {/* Protected Admin route */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADMIN"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Protected Voter route */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowedRoles={["VOTER", "CANDIDATE"]}>
              <VoterLanding />
            </ProtectedRoute>
          }
        />

        {/* Profile page - accessible by all authenticated users */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={["VOTER", "ADMIN"]}>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route
          path="/"
          element={
            <Navigate
              to={
                isAuthenticated ? (userRole === "ADMIN" ? "/admin/dashboard" : "/home") : "/login"
              }
              replace
            />
          }
        />

        {/* Catch all other routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
