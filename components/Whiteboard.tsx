"use client";

import { useEffect, useRef, useState } from "react";
import { DefaultEventsMap } from "socket.io";
import io, { Socket } from "socket.io-client";

type BoardProps = {
	width?: number;
	height?: number;
};

export default function Board({ width = 600, height = 400 }: BoardProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [socket, setSocket] = useState<Socket<
		DefaultEventsMap,
		DefaultEventsMap
	> | null>(null);

	useEffect(() => {
		const newSocket = io("http://localhost:3000");
		setSocket(newSocket);

		return () => {
			newSocket.close();
		};
	}, []);

	// Socket event listeners
	useEffect(() => {
		if (!socket) return;
		const canvas: HTMLCanvasElement | null = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Event listener for receiving canvas data from the socket
		socket.on("canvasImage", (data: string) => {
			const image = new Image();
			image.src = URL.createObjectURL(new Blob([data]));

			// Draw the image onto the canvas
			image.onload = () => {
				ctx.drawImage(image, 0, 0);
			};
		});

		socket.on("clearCanvas", () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
		});
	}, [canvasRef, socket]);

	useEffect(() => {
		let isDrawing = false;
		let lastX = 0;
		let lastY = 0;

		if (!socket) return;
		const canvas: HTMLCanvasElement | null = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Set up drawing styles
		ctx.strokeStyle = "black";
		ctx.lineWidth = 2;
		ctx.lineJoin = "round";
		ctx.lineCap = "round";

		const startDrawing = (e: { offsetX: number; offsetY: number }) => {
			isDrawing = true;

			[lastX, lastY] = [e.offsetX, e.offsetY];
		};

		const draw = (e: { offsetX: number; offsetY: number }) => {
			if (!isDrawing) return;

			ctx.beginPath();
			ctx.moveTo(lastX, lastY);
			ctx.lineTo(e.offsetX, e.offsetY);
			ctx.stroke();

			[lastX, lastY] = [e.offsetX, e.offsetY];
		};

		const endDrawing = () => {
			isDrawing = false;

			sendCanvasData();
		};

		const clearCanvas = (e: KeyboardEvent) => {
			if (e.key === "c") {
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				socket.emit("clearCanvas");
			} else {
				return;
			}

			e.preventDefault();
		};

		const sendCanvasData = () => {
			canvas.toBlob((blob) => {
				console.log(blob);
				if (blob) {
					blob.arrayBuffer().then((buf) => {
						socket.emit("canvasImage", buf);
					});
				}
			});
		};

		// Event listeners for drawing
		canvas.addEventListener("mousedown", startDrawing);
		canvas.addEventListener("mousemove", draw);
		canvas.addEventListener("mouseup", endDrawing);
		canvas.addEventListener("mouseout", endDrawing);

		// Event listeners for erasing
		window.addEventListener("keydown", clearCanvas);

		return () => {
			// Clean up event listeners when component unmounts
			canvas.removeEventListener("mousedown", startDrawing);
			canvas.removeEventListener("mousemove", draw);
			canvas.removeEventListener("mouseup", endDrawing);
			canvas.removeEventListener("mouseout", endDrawing);
			window.removeEventListener("keydown", clearCanvas);
		};
	}, [canvasRef, socket]);

	return (
		<canvas
			ref={canvasRef}
			width={width}
			height={height}
			style={{ backgroundColor: "white" }}
		/>
	);
}
