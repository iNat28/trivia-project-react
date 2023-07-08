import { LoginStatus, useAuth } from '@/features/auth';
import { Debug } from '@/features/debug';
import { Outlet } from 'react-router-dom';

export default function Layout() {
    const { loginStatus } = useAuth();

    if (loginStatus === LoginStatus.Pending) {
        return <div>Pending...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>Header</h1>
            <Debug />
            <Outlet />
        </div>
    );
}
