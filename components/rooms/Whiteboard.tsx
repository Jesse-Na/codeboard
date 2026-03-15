"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { DefaultEventsMap } from "socket.io";
import io, { Socket } from "socket.io-client";
import { WhiteboardTools } from "./WhiteboardTools";
import { Separator } from "../ui/separator";

type BoardProps = {
	parentId: string;
	height?: number;
	width?:number
};

export default function Board({ parentId, height, width }: BoardProps) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [parent,setParent] = useState<HTMLElement|null>(null)
	const params = useParams();
	let isErasing = false

    const roomId = params.id as string;
	useEffect(() => {
        setParent(document.getElementById(parentId));
    }, []);


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
		let startErasing = true;
		let lastX = 0;
		let lastY = 0;

		if (!socket) return;
		const canvas: HTMLCanvasElement | null = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Set up drawing styles
		ctx.strokeStyle = "black";
		ctx.lineWidth = 4;
		ctx.lineJoin = "round";
		ctx.lineCap = "round";

		const startDrawing = (e: { offsetX: number; offsetY: number }) => {
			if (isErasing){
				console.log('erasing')
				startErasing = true
			}
			else{
				isDrawing = true;
				[lastX, lastY] = [e.offsetX, e.offsetY];
			}
		};

		const draw = (e: { offsetX: number; offsetY: number }) => {
			if (isErasing && startErasing){
				ctx.clearRect(lastX, lastY, ctx.lineWidth*2, ctx.lineWidth*2);
				ctx.stroke()
			}
			else if (!isDrawing) return;
			else{
				ctx.beginPath();
				ctx.moveTo(lastX, lastY);
				ctx.lineTo(e.offsetX, e.offsetY);
				ctx.stroke();
			}
			[lastX, lastY] = [e.offsetX, e.offsetY];
		};

		const endDrawing = () => {
			isDrawing = false;
			startErasing = false;
			sendCanvasData();
		};

		// Event listeners for drawing
		canvas.addEventListener("mousedown", startDrawing);
		canvas.addEventListener("mousemove", draw);
		canvas.addEventListener("mouseup", endDrawing);
		canvas.addEventListener("mouseout", endDrawing);

		return () => {
			// Clean up event listeners when component unmounts
			canvas.removeEventListener("mousedown", startDrawing);
			canvas.removeEventListener("mousemove", draw);
			canvas.removeEventListener("mouseup", endDrawing);
			canvas.removeEventListener("mouseout", endDrawing);
			window.removeEventListener("keydown", clearCanvas);
		};
	}, [canvasRef, socket]);

	const clearCanvas = () => {
		if(!socket)return
		const canvas: HTMLCanvasElement | null = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;
		
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		socket.emit("clearCanvas", roomId);
	};

	const startErase =() =>{
		isErasing = true;
	}
	const startPencil =() =>{
		isErasing = false;
	}

	const sendCanvasData = () => {
		if(!socket)return
		const canvas: HTMLCanvasElement | null = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		canvas.toBlob((blob) => {
		console.log(blob)
		if (blob) {
				blob.arrayBuffer().then((buf) => {
					socket.emit("canvasImage", buf, roomId);	
				});
			}
		});
	};

	return (
		<div>
			<WhiteboardTools erase={startErase} pencil={startPencil} clear={clearCanvas} canvasRef={canvasRef} />
			<Separator/>
			<canvas
				ref={canvasRef}
				height={(parent?.clientHeight)}
				width={parent?.clientWidth}
				style={{backgroundColor: "white" }}
			/>
		</div>
	);
}
