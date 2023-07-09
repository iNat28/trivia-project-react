import { LoginStatus, useAuth } from '@/features/auth';
import { Navigate, Outlet } from 'react-router-dom';

export const PublicLayout = () => {
    const { loginStatus } = useAuth();

    if (loginStatus === LoginStatus.LoggedIn) {
        return <Navigate to="/main" />;
    }

    return (
        <>
            <div>Public Layout</div>
            <Outlet />
        </>
    );
};
