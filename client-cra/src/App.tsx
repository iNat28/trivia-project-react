import './App.css';
import Home from './Home';
import { Route, Routes } from 'react-router-dom';
import { Login } from './components/Login';
import Layout from './components/Layout';
import { Dashboard } from './routes/dashboard';
import { useAppSelector } from './hooks';
import { Debug } from './components/Debug';
import { LoginStatus, isLoggedIn } from './clientSlice';

export const App: React.FC = () => {
    const _isLoggedIn = useAppSelector(isLoggedIn);

    switch (_isLoggedIn) {
        case LoginStatus.LoggedOut:
            return (
                <Debug>
                    <Login />
                </Debug>
            );
        case LoginStatus.Pending:
            return (
                <Debug>
                    <h1>Logging In...</h1>
                </Debug>
            );
        case LoginStatus.LoggedIn:
            return (
                <Debug>
                    <Routes>
                        <Route element={<Layout />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                        </Route>
                    </Routes>
                </Debug>
            );
        default:
            return (
                <Debug>
                    <h1>Error with Login Status</h1>
                </Debug>
            );
    }
};
