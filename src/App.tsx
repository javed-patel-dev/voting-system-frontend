import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RootState } from "@/store/store";
import AdminDashboard from "./pages/AdminDashboard";
import VoterLanding from "./pages/VoterLanding";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import { ProtectedRoute } from "./components/ProtectedRoutes";
import { PollDetailPage } from "./pages/PollPage";

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
            isAuthenticated
              ? <Navigate to={userRole === "ADMIN" ? "/admin/dashboard" : "/home"} replace />
              : <LoginPage />
          }
        />

        <Route
          path="/register"
          element={
            isAuthenticated
              ? <Navigate to={userRole === "ADMIN" ? "/admin/dashboard" : "/home"} replace />
              : <RegisterPage />
          }
        />

        <Route
          path="/forgot-password"
          element={
            isAuthenticated
              ? <Navigate to={userRole === "ADMIN" ? "/admin/dashboard" : "/home"} replace />
              : <ForgotPasswordPage />
          }
        />

        <Route
          path="/polls"
          element={<PollDetailPage />}
        />

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

        {/* Default redirect */}
        <Route
          path="/"
          element={
            <Navigate to={
              isAuthenticated
                ? (userRole === "ADMIN" ? "/admin/dashboard" : "/home")
                : "/login"
            } replace />
          }
        />

        {/* Catch all other routes */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;