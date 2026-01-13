import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from '../components/ProtectedRoute';
import RejectedRoute from '../components/RejectedRoute';
import Login from "../pages/Auth/Login.jsx";
import Register from "../pages/Auth/Register.jsx";
import Profile from "../pages/User/Profile.jsx";
import HomePage from "../pages/Home/Home.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import CreatePost from "../pages/Post/CreatePost.jsx";
import DetailPost from "../pages/Post/DetailPost.jsx";
import ChangePassword from "../pages/Auth/ChangePassword.jsx";
import { Dashboard } from "../pages/Admin/Dashboard.jsx";
import AdminUsers from "../pages/Admin/AdminUsers.jsx";
import { AdminPosts } from "../pages/Admin/AdminPosts.jsx";
import { AdminSettings } from "../pages/Admin/AdminSettings.jsx";
import AdminLayout from "../layouts/AdminLayout.jsx";
import AccessDenied from "../pages/AccessDenied.jsx";
import UpdateProfile from "@/pages/User/UpdateProfile";

const router = createBrowserRouter([
    // Access Denied
    {
        element: <AccessDenied />,
        path: "/access-denied"
    },
    // Public Route

    // Rejected Route
    {
        element: <RejectedRoute />,
        children: [
            {
                path: "/login",
                element: <Login />
            },
            {
                path: "/register",
                element: <Register />
            },
        ]
    },

    // Protected Route
    {
        element: <ProtectedRoute />,
        children: [
            {
                element: <MainLayout />,
                children: [
                    { path: "/", element: <HomePage /> },
                    { path: "/home", element: <HomePage /> },
                    { path: "/profile", element: <Profile /> },
                    { path: "/update-profile", element: <UpdateProfile /> },
                    { path: "/change-password", element: <ChangePassword /> },
                    { path: "/create-post", element: <CreatePost /> },
                    { path: "post/:slug", element: <DetailPost />, }
                    // { path: "/create-post", element: <WritePost /> },
                ]
            }
        ],
    },
    {
        element: <ProtectedRoute allowedRoles={["admin"]} />,
        children: [
            {
                path: "/admin",
                element: <AdminLayout />,
                children: [
                    { index: true, element: <Dashboard /> },
                    { path: "users", element: <AdminUsers /> },
                    { path: "posts", element: <AdminPosts /> },
                    { path: "settings", element: <AdminSettings /> },
                ]
            }
        ]
    }
])

export default router;