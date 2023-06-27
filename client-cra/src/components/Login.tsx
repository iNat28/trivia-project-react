import { useState, Dispatch, SetStateAction } from 'react';
import { LoginInfo, client, login, loginInfo, setLoginInfo, socket } from '../socket';

export const Login: React.FC = () => {
    const [usernameInput, setUsernameInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');

    async function handleSubmit(e: React.FormEvent) {
        console.log('logging in');
        e.preventDefault();
        setLoginInfo({ username: usernameInput, password: passwordInput });
        login();
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
