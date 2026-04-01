"use client";

import Whiteboard from "@/components/rooms/Whiteboard";
import CodeEditor from "@/components/rooms/CodeEditor";
import { useEffect } from "react";
import { socket } from "@/lib/socket-client";

type EditorSectionProps = {
  lang: string;
  roomId: number;
};

export default function EditorSection({ lang, roomId }: EditorSectionProps) {
  useEffect(() => {
    socket.connect();
    socket.emit("joinRoom", roomId.toString(), lang);

    return () => {
      socket.disconnect();
    };
  }, [lang, roomId]);

  return (
    <div id="capture" className="flex flex-row w-full h-full">
      <div className="w-full" id="codeeditorui">
        <CodeEditor parentId="codeeditorui" language={lang} />
      </div>
      <div id="whiteboardui" className="w-full">
        <Whiteboard />
      </div>
    </div>
  );
}
