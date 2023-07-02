import { useState } from 'react';
import { useAppDispatch } from '@/hooks';
import { login } from '../slices/authSlice';
import { LoginMessage } from '../types';

export const Login: React.FC = () => {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const dispatch = useAppDispatch();

    async function handleSubmit(e: React.FormEvent) {
        console.log('logging in');
        e.preventDefault();

        const userInfo: LoginMessage = {
            username: usernameInput,
            password: passwordInput,
        };

        const response = await dispatch(login(userInfo));
        console.log('done', response);
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <h2>Please log in</h2>
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
                    <button type="submit">Submit</button>
                </div>
            </form>
        </div>
    );
};
