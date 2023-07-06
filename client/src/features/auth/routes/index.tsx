import { RouteObject } from 'react-router-dom';
import { LoginForm } from '../components/LoginForm';
import { AuthLayout } from '../components/AuthLayout';

export const authRoutes: RouteObject[] = [
    {
        Component: AuthLayout,
        children: [
            {
                path: 'login',
                Component: LoginForm,
            },
        ],
    },
];
