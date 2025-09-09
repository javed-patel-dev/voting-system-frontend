import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "../pages/LoginPage.tsx";

const router = createBrowserRouter([
    { path: "/login", element: <LoginPage /> },
]);

export default function AppRoutes() {
    return <RouterProvider router={router} />;
}
