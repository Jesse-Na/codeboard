"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { DefaultEventsMap } from "socket.io";
import io, { Socket } from "socket.io-client";
import { WhiteboardTools } from "./WhiteboardTools";
import { Separator } from "../ui/separator";
import { saveBoard } from "@/lib/actions";

type BoardProps = {
  height?: number;
  width?: number;
};

export enum Tool {
  POINTER = "pointer",
  PENCIL = "pencil",
  ERASER = "eraser",
}
// export type PencilColour = "black" | "red" | "blue" | "green";

export default function Board({ width = 600, height = 400 }: BoardProps) {
  const [activeTool, setActiveTool] = useState<Tool>(Tool.POINTER);
  const [pencilColour, setPencilColour] = useState<string>("black");
  const [lineWidth, setLineWidth] = useState([2]);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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
    const newSocket = io(
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000",
    );
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

    if (activeTool === Tool.POINTER) return;
    if (!socket) return;
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = lineWidth[0];
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    const startDrawing = (e: { offsetX: number; offsetY: number }) => {
      // Set up drawing styles
      if (activeTool === Tool.ERASER) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(0,0,0,1)";
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = pencilColour;
      }
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

    // const handleKeyDown = (e: KeyboardEvent) => {
    // 	if (e.key === "e") {
    // 		setActiveTool("eraser");
    // 	} else if (e.key === "p") {
    // 		setActiveTool("pencil");
    // 	} else if (e.key === "c") {
    // 		clearCanvas();
    // 	} else {
    // 		return;
    // 	}

    // 	e.preventDefault();
    // };

    // Event listeners for drawing
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", endDrawing);
    canvas.addEventListener("mouseout", endDrawing);

    // Event listeners for erasing
    // window.addEventListener("keydown", handleKeyDown);

    return () => {
      // Clean up event listeners when component unmounts
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", endDrawing);
      canvas.removeEventListener("mouseout", endDrawing);
      // window.removeEventListener("keydown", handleKeyDown);
    };
  }, [canvasRef, socket, roomId, pencilColour, activeTool, lineWidth]);

  const handleSave = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    canvas.toBlob(
      (blob) => {
        if (blob) {
          const file = new File([blob], "board.png", {
            type: "image/png",
          });
          try {
            saveBoard(Number(roomId), file);
            alert("Board saved successfully!");
          } catch (error) {
            alert("Error saving board: " + error);
          }
        }
      },
      "image/png",
      1,
    );
  };

  return (
    <div className="h-full">
      <WhiteboardTools
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        setPencilColour={setPencilColour}
        setLinewidth={setLineWidth}
        clear={clearCanvas}
        canvasRef={canvasRef}
        save={handleSave}
      />
      <Separator />
      <canvas
        ref={canvasRef}
        height={Math.max(
          window.innerHeight,
          document.getElementById("whiteboardui")?.offsetHeight ?? 0,
        )}
        width={window.innerWidth}
        style={{
          backgroundColor: "transparent",
          left: 0,
          top: 150,
          position: "absolute",
          pointerEvents: activeTool === Tool.POINTER ? "none" : "auto",
        }}
      />
    </div>
  );
}
