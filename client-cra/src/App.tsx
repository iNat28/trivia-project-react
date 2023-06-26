import logo from "./logo.svg";
import "./App.css";
import Home from "./Home";
import { socket } from "./socket";
import { useEffect, useState } from "react";

function App() {
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [isConnectedBack, setIsConnectedBack] = useState(false);
    //const [fooEvents, setFooEvents] = useState([]);

    useEffect(() => {
        function onConnect() {
            console.log("connected!");
            setIsConnected(true);
        }

        function onDisconnect() {
            console.log("disconnected");
            setIsConnected(false);
            setIsConnectedBack(false);
        }

        socket.on("connect", onConnect);
        socket.on("disconnect", onDisconnect);
        socket.on("login-success", () => {
            console.log("login success!");
        });
        socket.on("logout-success", () => {
            console.log("log out success!");
        });
        socket.on("error", (err) => {
            console.log("error: ", err);
        });
        socket.on("connect-backend-success", () => {
            setIsConnectedBack(true);
        });
        

        return () => {
            socket.off();
        };
    }, []);

    function logIn() {
        console.log("logging in");
        socket.emit("login", { username: "t", password: "t" });
    }

    function logOut() {
        socket.emit("logout");
    }

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
          Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
          Learn React
                </a>
            </header>
            <p>connected: { "" + isConnected }</p>
            <p>connected to backend: { "" + isConnectedBack }</p>
            <button onClick={logIn}></button>
            <hr></hr>
            <button onClick={logOut}></button>
            <Home />
        </div>
    );
}

export default App;
