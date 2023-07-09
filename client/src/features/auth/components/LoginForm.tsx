import { useState } from 'react';
import { LoginStatus, LoginMessage } from '../types';
import { useAppSelector } from '@/hooks';
import { getErrorMsg, getLoginStatus } from '../slices';
import { useAuth } from '../hooks';

export const LoginForm: React.FC = () => {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const loginStatus = useAppSelector(getLoginStatus);
    const errorMsg = useAppSelector(getErrorMsg);
    const { login } = useAuth();

    async function handleSubmit(e: React.FormEvent) {
        console.log('logging in');
        e.preventDefault();

        const loginInfo: LoginMessage = {
            username: usernameInput,
            password: passwordInput,
        };

        await login(loginInfo);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2>Please log in</h2>
            <h3>{errorMsg}</h3>
            <form onSubmit={handleSubmit}>
                <label>
                    <p>Username</p>
                    <input type="text" onChange={(e) => setUsernameInput(e.target.value)} />
                </label>
                <label>
                    <p>Password</p>
                    <input type="password" onChange={(e) => setPasswordInput(e.target.value)} />
                </label>
                <div>
                    <button type="submit" disabled={loginStatus !== LoginStatus.LoggedOut}>
                        Submit
                    </button>
                </div>
            </form>
        </div>
    );
};
