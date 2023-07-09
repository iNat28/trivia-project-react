import Dashboard from '@/components/Dashboard';
import { ProtectedLayout } from '@/components/ProtectedLayout';
import { mainMenuRoutes } from '@/features/main';
import { RouteObject } from 'react-router-dom';

export const protectedRoutes: RouteObject = {
    Component: ProtectedLayout,
    path: 'main',
    children: [
        {
            path: 'dashboard',
            Component: Dashboard,
        },
        ...mainMenuRoutes,
    ],
};
