import { useSelector } from "react-redux";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { RootState } from "@/store/store";
import AdminDashboard from "./pages/AdminDashboard";
import VoterLanding from "./pages/VoterLanding";
import LoginPage from "./pages/LoginPage";

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
              ? <Navigate to={userRole === "ADMIN" ? "/admin/dashboard" : "/voter/home"} replace />
              : <LoginPage />
          }
        />

        {/* Protected Admin route */}
        <Route
          path="/admin/dashboard"
          element={
            isAuthenticated && userRole === "ADMIN"
              ? <AdminDashboard />
              : <Navigate to="/login" replace />
          }
        />

        {/* Protected Voter route */}
        <Route
          path="/voter/home"
          element={
            isAuthenticated && userRole === "VOTER"
              ? <VoterLanding />
              : <Navigate to="/login" replace />
          }
        />

        {/* Default redirect */}
        <Route
          path="/"
          element={
            <Navigate to={
              isAuthenticated
                ? (userRole === "ADMIN" ? "/admin/dashboard" : "/voter/home")
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