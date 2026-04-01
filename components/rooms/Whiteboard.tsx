"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { DefaultEventsMap } from "socket.io";
import io, { Socket } from "socket.io-client";
import { WhiteboardTools } from "./WhiteboardTools";
import { Separator } from "../ui/separator";
import { saveBoard } from "@/lib/actions";
import html2canvas from "html2canvas-pro";
import { socket } from "@/lib/socket-client";

export enum Tool {
  POINTER = "pointer",
  PENCIL = "pencil",
  ERASER = "eraser",
}
// export type PencilColour = "black" | "red" | "blue" | "green";

export default function Board() {
  const [activeTool, setActiveTool] = useState<Tool>(Tool.POINTER);
  const [pencilColour, setPencilColour] = useState<string>("black");
  const [lineWidth, setLineWidth] = useState([2]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [lastY, setLastY] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const params = useParams();
  const roomId = params.id as string;

  const clearCanvas = () => {
    if (!socket) return;
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit("clearCanvas", roomId);
  };

  // Socket event listeners
  useEffect(() => {
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

    return () => {
      socket.off("canvasImage");
      socket.off("clearCanvas");
    };
  }, [canvasRef]);

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineWidth = lineWidth[0];
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    const startDrawing = (e: { offsetX: number; offsetY: number }) => {
      if (activeTool === Tool.POINTER) return;

      // Set up drawing styles
      if (activeTool === Tool.ERASER) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.strokeStyle = "rgba(0,0,0,1)";
      } else if (activeTool === Tool.PENCIL) {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = pencilColour;
      }
      setIsDrawing(true);

      setLastX(e.offsetX);
      setLastY(e.offsetY);
    };

    const draw = (e: { offsetX: number; offsetY: number }) => {
      if (!isDrawing || activeTool === Tool.POINTER) return;

      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();

      setLastX(e.offsetX);
      setLastY(e.offsetY);

      // setIsDrawing(false);
    };

    const endDrawing = () => {
      if (activeTool === Tool.POINTER) return;

      setIsDrawing(false);
      sendCanvasData();
    };

    const sendCanvasData = () => {
      if (activeTool === Tool.POINTER) return;

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
    // canvas.addEventListener("mouseout", endDrawing);

    // Event listeners for erasing
    // window.addEventListener("keydown", handleKeyDown);

    return () => {
      // Clean up event listeners when component unmounts
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", endDrawing);
      // canvas.removeEventListener("mouseout", endDrawing);
      // window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    canvasRef,
    roomId,
    pencilColour,
    activeTool,
    lineWidth,
    isDrawing,
    lastX,
    lastY,
  ]);

  const handleSave = () => {
    const capture = document.getElementById("capture") as HTMLElement;
    if (!capture) return;

    html2canvas(capture).then((canvas: HTMLCanvasElement) => {
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
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const handleResize = () => {
      ctx.canvas.height = window.innerHeight;
      ctx.canvas.width = window.innerWidth;
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="h-full">
      <WhiteboardTools
        activeTool={activeTool}
        setActiveTool={setActiveTool}
        setPencilColour={setPencilColour}
        setLinewidth={setLineWidth}
        clear={clearCanvas}
        save={handleSave}
      />
      <Separator />
      <canvas
        ref={canvasRef}
        style={{
          backgroundColor: "transparent",
          left: 0,
          position: "absolute",
          pointerEvents: activeTool === Tool.POINTER ? "none" : "auto",
        }}
      />
    </div>
  );
}
