import { Navigate, Outlet } from 'react-router-dom';
import { LoginStatus } from '../types';
import { useAppSelector } from '@/hooks';
import { getLoginStatus } from '../slices';

export const AuthLayout = () => {
    const loginStatus = useAppSelector(getLoginStatus);

    if (loginStatus === LoginStatus.LoggedIn) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};
