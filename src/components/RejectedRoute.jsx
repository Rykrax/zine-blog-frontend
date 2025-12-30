import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from "../providers/AuthProvider";
import { Spin } from 'antd';

const RejectedRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (user) {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default RejectedRoute;