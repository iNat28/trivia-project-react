import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { Debug } from './components/Debug';

/*
const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Root />}>
            <Route path="dashboard" element={<Dashboard />} />
        </Route>,
    ),
);
*/
const router = createBrowserRouter([
    {
        path: '*',
        Component: Debug,
    },
]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
/*
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
);
*/
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
