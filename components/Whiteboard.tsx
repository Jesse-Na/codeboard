"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { DefaultEventsMap } from "socket.io";
import io, { Socket } from "socket.io-client";
import Toolbar from "./WhiteboardToolbar";

type BoardProps = {
	width?: number;
	height?: number;
};

export type Tool = "pencil" | "eraser";
export type PencilColour = "black" | "red" | "blue" | "green";

export default function Board({ width = 600, height = 400 }: BoardProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [activeTool, setActiveTool] = useState<Tool>("pencil");
	const [pencilColour, setPencilColour] = useState<PencilColour>("black");
	const [lineWidth, setLineWidth] = useState([2]);

	const params = useParams();
	const roomId = params.id as string;

	const [socket, setSocket] = useState<Socket<
		DefaultEventsMap,
		DefaultEventsMap
	> | null>(null);

	const clearCanvas = () => {
		if (!socket) return;
		const canvas: HTMLCanvasElement | null = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		socket.emit("clearCanvas", roomId);
	};

	useEffect(() => {
		const newSocket = io("http://localhost:3000");
		setSocket(newSocket);

		return () => {
			newSocket.close();
		};
	}, []);

	//Join correct room once socket connects
	useEffect(() => {
		if (!socket) return;

		socket.emit("joinRoom", roomId);
	}, [socket, roomId]);

	// Socket event listeners
	useEffect(() => {
		if (!socket) return;
		const canvas: HTMLCanvasElement | null = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Event listener for receiving canvas data from the socket
		socket.on("canvasImage", (data: ArrayBuffer) => {
			createImageBitmap(new Blob([data], { type: "image/png" })).then(
				(imageBitmap) => {
					ctx.globalCompositeOperation = "source-over";
					ctx.clearRect(0, 0, canvas.width, canvas.height);
					ctx.drawImage(imageBitmap, 0, 0);
				},
			);
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
		if (activeTool === "eraser") {
			ctx.globalCompositeOperation = "destination-out";
			ctx.strokeStyle = "rgba(0,0,0,1)";
		} else {
			ctx.globalCompositeOperation = "source-over";
			ctx.strokeStyle = pencilColour;
		}
		ctx.lineWidth = lineWidth[0];
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

		const sendCanvasData = () => {
			canvas.toBlob(
				(blob) => {
					if (blob) {
						blob.arrayBuffer().then((buf) => {
							socket.emit("canvasImage", buf, roomId);
						});
					}
				},
				"image/png",
				1,
			);
		};

		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "e") {
				setActiveTool("eraser");
			} else if (e.key === "p") {
				setActiveTool("pencil");
			} else if (e.key === "c") {
				clearCanvas();
			} else {
				return;
			}

			e.preventDefault();
		};

		// Event listeners for drawing
		canvas.addEventListener("mousedown", startDrawing);
		canvas.addEventListener("mousemove", draw);
		canvas.addEventListener("mouseup", endDrawing);
		canvas.addEventListener("mouseout", endDrawing);

		// Event listeners for erasing
		window.addEventListener("keydown", handleKeyDown);

		return () => {
			// Clean up event listeners when component unmounts
			canvas.removeEventListener("mousedown", startDrawing);
			canvas.removeEventListener("mousemove", draw);
			canvas.removeEventListener("mouseup", endDrawing);
			canvas.removeEventListener("mouseout", endDrawing);
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [canvasRef, socket, roomId, pencilColour, activeTool, lineWidth]);

	return (
		<div
			className={`relative items-center gap-4 rounded-md border bg-background`}
		>
			<Toolbar
				activeTool={activeTool}
				setActiveTool={setActiveTool}
				setPencilColour={setPencilColour}
				clearCanvas={clearCanvas}
				lineWidth={lineWidth}
				setLineWidth={setLineWidth}
			/>
			<canvas
				ref={canvasRef}
				width={width}
				height={height}
				style={{ backgroundColor: "white" }}
			/>
		</div>
	);
}
