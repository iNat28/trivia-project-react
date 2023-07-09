import { LoginStatus, getLoginStatus } from '@/features/auth';
import { useAppSelector } from '@/hooks';
import { Navigate, useOutlet } from 'react-router-dom';

export const ProtectedLayout = () => {
    const outlet = useOutlet();
    const loginStatus = useAppSelector(getLoginStatus);

    console.log(loginStatus as LoginStatus);

    if (loginStatus === LoginStatus.Pending || loginStatus === LoginStatus.Init) {
        return <div>Pending...</div>;
    }

    if (loginStatus !== LoginStatus.LoggedIn) {
        return <Navigate to="/" />;
    }

    return (
        <>
            <div>Protected Layout</div>
            {outlet}
        </>
    );
};
