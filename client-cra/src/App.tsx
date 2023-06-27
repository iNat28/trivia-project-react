import logo from './logo.svg';
import './App.css';
import Home from './Home';
import { LoginInfo, login, loginInfo, setLoginInfo, socket } from './socket';
import { SetStateAction, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Login } from './components/Login';
import Layout from './components/Layout';
import { Dashboard } from './routes/dashboard';

function storeUserInfo(loginInfo: LoginInfo | undefined) {
    if (!loginInfo) {
        console.log('error: loginInfo undefined');
        return;
    }
    sessionStorage.setItem('user', JSON.stringify(loginInfo));
}

function lookupUserInfo(): LoginInfo | undefined {
    const userInfoStr = sessionStorage.getItem('user');
    if (!userInfoStr) {
        return undefined;
    }
    return JSON.parse(userInfoStr);
}

type DashboardProps = {
    setIsConnectedNode: React.Dispatch<SetStateAction<boolean>>;
    setIsConnectedBack: React.Dispatch<SetStateAction<boolean>>;
};

export const App: React.FC<DashboardProps> = ({ setIsConnectedNode, setIsConnectedBack }) => {
    const [storedUserInfo, setStoredUserInfo] = useState(lookupUserInfo());
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        function onConnect() {
            console.log('connected!');
            setIsConnectedNode(true);
        }

        function onDisconnect() {
            console.log('disconnected');
            setIsConnectedNode(false);
            setIsConnectedBack(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('login-success', () => {
            console.log('login success!');
            setIsLoggedIn(true);
            if (!storedUserInfo) {
                storeUserInfo(loginInfo);
                setStoredUserInfo(loginInfo);
            }
        });
        socket.on('logout-success', () => {
            console.log('log out success!');
        });
        socket.on('error', (err) => {
            console.log('error: ', err);
        });
        socket.on('error-connecting-backend', () => {
            console.log('error connecting to backend');
            setIsConnectedBack(false);
        });
        socket.on('connect-backend-success', () => {
            setIsConnectedBack(true);
        });

        if (!isLoggedIn) {
            setLoginInfo(storedUserInfo);
            login();
        }

        return () => {
            socket.off();
        };
    }, [storedUserInfo]);

    if (!isLoggedIn) {
        return <Login />;
    }

    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
            </Route>
        </Routes>
    );
};

/*
export default function App() {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [isConnectedBack, setIsConnectedBack] = useState(false);
    //const [fooEvents, setFooEvents] = useState([]);

    useEffect(() => {
        function onConnect() {
            console.log('connected!');
            setIsConnected(true);
        }

        function onDisconnect() {
            console.log('disconnected');
            setIsConnected(false);
            setIsConnectedBack(false);
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);
        socket.on('login-success', () => {
            console.log('login success!');
        });
        socket.on('logout-success', () => {
            console.log('log out success!');
        });
        socket.on('error', (err) => {
            console.log('error: ', err);
        });
        socket.on('error-connecting-backend', () => {
            console.log('error connecting to backend');
            setIsConnectedBack(false);
        });
        socket.on('connect-backend-success', () => {
            setIsConnectedBack(true);
        });

        return () => {
            socket.off();
        };
    }, []);

    function logIn() {
        console.log('logging in');
        socket.emit('login', { username: 't', password: 't' });
    }

    function logOut() {
        socket.emit('logout');
    }

    return (
        <>
            <h1>Application</h1>
        </>
    );

    /*
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
                    Learn React
                </a>
            </header>
            <p>connected: {'' + isConnected}</p>
            <p>connected to backend: {'' + isConnectedBack}</p>
            <button onClick={logIn}></button>
            <hr></hr>
            <button onClick={logOut}></button>
            <Home />
        </div>
    );
}
*/
