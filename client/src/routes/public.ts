import Home from '@/components/Home';
import { PublicLayout } from '@/components/PublicLayout';
import { authRoutes } from '@/features/auth';
import { RouteObject } from 'react-router-dom';

export const publicRoutes: RouteObject = {
    Component: PublicLayout,
    children: [
        {
            path: '',
            Component: Home,
        },
        ...authRoutes,
    ],
};
