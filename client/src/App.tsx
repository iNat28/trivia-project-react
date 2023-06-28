import './App.css';
import Home from './Home';
import { Route, Routes } from 'react-router-dom';
import { Login } from './components/Login';
import Layout from './components/Layout';
import { Dashboard } from './routes/dashboard';
import { useAppSelector } from './hooks';
import { Debug } from './components/Debug';
import { LoginStatus, errorMsg, isLoggedIn } from './clientSlice';

export const App: React.FC = () => {
    const _isLoggedIn = useAppSelector(isLoggedIn);
    const _errorMsg = useAppSelector(errorMsg);

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
        case LoginStatus.Error:
            return (
                <Debug>
                    <>
                        <h1>Error Logging In</h1>
                        {_errorMsg && <p>{_errorMsg}</p>}
                        <Login />
                    </>
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
