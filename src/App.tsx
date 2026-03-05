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

        {/* Protected Voter/Candidate route */}
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
            <ProtectedRoute allowedRoles={["VOTER", "ADMIN", "CANDIDATE"]}>
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

        {/* Unauthorized page */}
        <Route
          path="/unauthorized"
          element={
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
              <div className="text-center p-8 bg-white rounded-lg shadow-lg max-w-md">
                <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
                <p className="text-gray-600 mb-6">
                  You do not have permission to access this page.
                </p>
                <button
                  onClick={() => window.history.back()}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          }
        />

        {/* Catch all other routes */}
        <Route path="*" element={<Navigate to={isAuthenticated ? "/home" : "/login"} replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
