import { NavLink } from 'react-router-dom';
import { useAuth } from '@/features/auth';

export default function Home() {
    const { userInfo } = useAuth();

    return (
        <>
            <div>Welcome{userInfo && ' ' + userInfo.username}!</div>
            <hr />
            <NavLink to={'/dashboard'} replace={true}>
                Dashboard
            </NavLink>
            <hr />
            <NavLink to={'/login'} replace={true}>
                Login
            </NavLink>
            <hr />
            <NavLink to={'/shh'} replace={true}>
                Shh
            </NavLink>
        </>
    );
}
