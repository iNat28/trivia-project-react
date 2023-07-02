import './App.css';
import Home from './Home';
import { Route, Routes } from 'react-router-dom';
import { Login } from './features/auth/components/LoginForm';
import Layout from './components/Layout';
import { Dashboard } from './routes/dashboard';
import { useAppDispatch, useAppSelector, useListeners } from './hooks';
import { Debug } from '@/features/debug/components/Debug';
import { LoginStatus, errorMsg, isLoggedIn, login, setErrorMsg, setLoginStatus } from '@/features/auth';
import { lookupUserInfo } from './features/auth/api/login';

export const App: React.FC = () => {
    const _isLoggedIn = useAppSelector(isLoggedIn);
    const _errorMsg = useAppSelector(errorMsg);
    const dispatch = useAppDispatch();

    useListeners([
        [
            'connect-backend-success',
            async () => {
                const loginInfo = lookupUserInfo();
                if (!loginInfo) {
                    return;
                }
                await dispatch(login(loginInfo));
            },
        ],
        [
            'error-connecting-backend',
            () => {
                dispatch(setLoginStatus(LoginStatus.Error));
                dispatch(setErrorMsg('error connecting to backend'));
            },
        ],
    ]);

    switch (_isLoggedIn) {
        case LoginStatus.LoggedOut: {
            return (
                <Debug>
                    <Login />
                </Debug>
            );
        }

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
