import { createBrowserRouter } from "react-router-dom";
import ProtectedRoute from '../components/ProtectedRoute';
import RejectedRoute from '../components/RejectedRoute';
import Login from "../pages/Auth/Login.jsx";
import Register from "../pages/Auth/Register.jsx";
import Profile from "../pages/User/Profile.jsx";
import HomePage from "../pages/Home/Home.jsx";

const router = createBrowserRouter([

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
                path: "/",
                element: <HomePage />,
            },
            {
                path: "/profile",
                element: <Profile />
            },
            {
                path: "/home",
                element: <HomePage />
            }
            // {
            //     path: '/create-post',
            //     element: <WritePost />,
            // },
        ],
    },
])

export default router;