import Layout from '@/components/Layout';
import { createBrowserRouter } from 'react-router-dom';
import { publicRoutes } from './public';
import { protectedRoutes } from './protected';

export const router = createBrowserRouter([
    {
        path: '/',
        Component: Layout,
        errorElement: <div>Error!</div>,
        children: [publicRoutes, protectedRoutes],
    },
]);
