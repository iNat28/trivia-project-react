import { AuthProvider } from '@/features/auth';
import { router } from '@/routes';
import store from '@/stores/store';
import { Suspense } from 'react';
import { Provider } from 'react-redux';
import { RouterProvider } from 'react-router-dom';

export default function AppProvider() {
    return (
        <Suspense fallback={<div>Loading.....</div>}>
            <Provider store={store}>
                <AuthProvider>
                    <RouterProvider router={router} />
                </AuthProvider>
            </Provider>
        </Suspense>
    );
}
