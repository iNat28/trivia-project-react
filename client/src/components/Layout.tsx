import { Debug } from '@/features/debug';
import { Outlet } from 'react-router-dom';

export default function Layout() {
    return (
        <div style={{ padding: '20px' }}>
            <h1>Header</h1>
            <Debug />
            <Outlet />
        </div>
    );
}
