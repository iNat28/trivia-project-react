import { Server, Socket } from "socket.io";
import { createServer } from "http";
import BSON from "bson";
import net from "net";

const hostname = 'localhost';
const port = 3001;

const server = createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World');
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000"
  }
});

type Message = {
  code: number,
  message?: string,
  [key: string]: any
}

type LogIn = {
  username: string,
  password: string
}

type LogOut = {
  username: string
}

type UserInfo = {
  isLoggedIn: boolean,
  username?: string
}

function decodeData(data: Buffer): Message {
  let msg: Message = { code: data[0] };

  const msgLen = data.readIntLE(1, 4);

  if (msgLen > 0) {
      msg = {
          code: msg.code,
          ...BSON.deserialize(data.subarray(1))
      };
  }

  return msg;
}

let sockets: Socket[] = []

io.on("connection", (socket) => {
  sockets.push(socket);
    console.log("user connected, total sockets count:", sockets.length);

    const client = net.createConnection({ host: "127.0.0.1", port: 40200 });
    const userInfo: UserInfo = {
      isLoggedIn: false
    };

    function write(code: number, obj: object) {
      client.write(new Uint8Array([code]));
      client.write(BSON.serialize(obj));
    }

    client.on("connect", () => {
      console.log("connected to backend");
      socket.emit("connect-backend-success");
    })

    client.on("error", (err) => {
      console.log("error: ");
      console.log(err);
      socket.emit("error", err);
    })

    client.on("close", (hadError) => {
      if (hadError) {
        console.log("error connecting to backend")
      } else {
        console.log("closed backend")
      }
    })

    /*
    client.on("end", () => {
      console.log("ended backend");
    })
    */

    client.on("data", (data) => {
      const msg = decodeData(data);

      console.log(msg);

      switch (msg.code) {
          case 10: {
              console.log("logged in");
              userInfo.isLoggedIn = true;
              socket.emit("login-success");
              break;
          }
          case 12: {
              console.log("logged out");
              userInfo.isLoggedIn = false;
              socket.emit("logout-success");
              break;
          }
          default: {
              console.log("error", msg);
              socket.emit("error", msg);
          }
      }
  });

    socket.on("login", (logIn: LogIn) => {
      if (userInfo.isLoggedIn) {
        console.log("user already logged in");
        socket.emit("error", "user already logged in")
        return;
      }
      
      console.log(logIn);
      write(10, logIn); // check arg
    })

    function logOut() {
      if (!userInfo.isLoggedIn) {
        console.log("user not logged in");
        return;
      }

      const logOutMsg: LogOut = { username: userInfo.username }
      write(12, logOutMsg);
    }

    socket.on("logout", logOut)

    socket.on("disconnect", () => {
      console.log("user disconnected, total sockets count:", sockets.length);
      if (userInfo.isLoggedIn) {
        logOut();
      }
      client.destroy();
      sockets = sockets.filter((currSocket) => currSocket.id != socket.id);
    })
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});