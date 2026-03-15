import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

type RoomState = {
	canvas: ArrayBuffer;
	code: string;
};

app.prepare().then(() => {
	const httpServer = createServer(handler);

	const io = new Server(httpServer, {
		cors: {
			origin: "http://localhost:3000",
		},
	});

	const rooms: Record<string, RoomState> = {};

	io.on("connection", (socket) => {
		console.log("user connected: " + socket.id);

		socket.on("joinRoom", (roomId: string) => {
			console.log(`Socket ${socket.id} joined room ${roomId}`);
			socket.join(roomId);

			//Initialize new room
			if (!rooms[roomId]) {
				rooms[roomId] = {
					canvas: new ArrayBuffer(0),
					code: "console.log('hello world!');",
				};
			}

			//Emit current room state to new user
			socket.emit("canvasImage", rooms[roomId].canvas);
			socket.emit("codeString", rooms[roomId].code);
		});

		socket.on("canvasImage", (data: ArrayBuffer, roomId: string) => {
			console.log("Received canvas image from client: " + socket.id);
			if (!rooms[roomId]) return;
			rooms[roomId].canvas = data;
			socket.to(roomId).emit("canvasImage", data);
		});

		socket.on("clearCanvas", (roomId: string) => {
			console.log(
				"Received clear canvas event from client: " + socket.id,
			);
			if (!rooms[roomId]) return;
			socket.to(roomId).emit("clearCanvas");
		});

		socket.on("codeString", (data: string, roomId: string) => {
			console.log("Received code string from client: " + socket.id);
			if (!rooms[roomId]) return;
			rooms[roomId].code = data;
			socket.to(roomId).emit("codeString", data);
		});
	});

	httpServer
		.once("error", (err) => {
			console.error(err);
			process.exit(1);
		})
		.listen(port, () => {
			console.log(`> Ready on http://${hostname}:${port}`);
		});
});
