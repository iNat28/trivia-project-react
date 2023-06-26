//import { Socket } from "net";
//import { BSON } from "bson";

export default function Home() {
    //const client = new Socket();

    return (
        <>
        </>
    );
}

/*
type Message = {
    code: number,
    message?: string,
    [key: string]: any
}

function write(client: Socket, code: number, obj: object) {
    client.write(new Uint8Array([code]));
    client.write(BSON.serialize(obj));
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

export default function Home() {
    const client = new Socket();

    client.connect({ host: "127.0.0.1", port: 40200 }, () => {
        console.log("Connected");

        write(client, 10, { username: "t", password: "t" });
    });

    client.on("data", (data) => {
        const msg = decodeData(data);

        console.log(msg);

        switch (msg.code) {
            case 10: {
                setTimeout(() => {write(client, 12, { username: "t" });}, 5000);
                break;
            }
            case 12: {
                console.log("signing out");
            }
            default: {
                client.end();
                client.destroy();
            }
        }
    });

    client.on("end", () => {
        console.log("Disconnected");
    });

    return (
        <>
            <h1>Hello World</h1>
        </>
    );
}
*/