import Dashboard from '@/components/Dashboard';
import { ProtectedLayout } from '@/components/ProtectedLayout';
import { RouteObject } from 'react-router-dom';

export const protectedRoutes: RouteObject = {
    Component: ProtectedLayout,
    children: [
        {
            path: 'dashboard',
            Component: Dashboard,
        },
    ],
};
