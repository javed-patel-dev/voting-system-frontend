import { useState } from "react";
import { useDispatch } from "react-redux";
import authService from "@/services/authService.ts";
import decodeJWT from "@/utils/jwt.ts";
import { setAuth } from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await authService.login(email, password);

            if (response.success) {
                const { token } = response.data;
                localStorage.setItem("token", token);

                const decoded = decodeJWT(token);

                // Validate decoded token
                if (!decoded || !decoded.role) {
                    throw new Error("Invalid token structure");
                }

                dispatch(setAuth({ token, decodedToken: decoded }));

                // Navigate based on role
                if (decoded.role === "ADMIN") {
                    navigate("/admin/dashboard");
                } else if (decoded.role === "VOTER") {
                    navigate("/voter/home");
                } else {
                    setError("Unknown user role");
                }
            } else {
                setError(response.message || "Login failed");
            }
        } catch (error) {
            console.error("Login error:", error);
            setError(error instanceof Error ? error.message : "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">Login</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    disabled={loading}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded"
                    disabled={loading}
                />
                <button
                    onClick={handleLogin}
                    disabled={loading || !email || !password}
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </div>
        </div>
    );
}