import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;

const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
	const httpServer = createServer(handler);

	const io = new Server(httpServer, {
		cors: {
			origin: "http://localhost:3000",
		},
	});

	let canvasData: string = "";
	let codeData: string = "console.log('hello world!');";
	io.on("connection", (socket) => {
		console.log("user connected: " + socket.id);
		socket.broadcast.emit("canvasImage", canvasData);
		socket.emit("codeString", codeData);

		socket.on("canvasImage", (data: string) => {
			console.log("Received canvas image from client: " + socket.id);
			canvasData = data;
			socket.broadcast.emit("canvasImage", data);
		});

		socket.on("clearCanvas", () => {
			console.log(
				"Received clear canvas event from client: " + socket.id,
			);
			socket.broadcast.emit("clearCanvas");
		});

		socket.on("codeString", (data: string) => {
			console.log("Received code string from client: " + socket.id);
			codeData = data;
			socket.broadcast.emit("codeString", data);
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
