"use client";

import Whiteboard from "@/components/rooms/Whiteboard";
import CodeEditor from "@/components/rooms/CodeEditor";

export default function EditorSection() {
  return (
    <div id="capture" className="flex flex-row w-full h-full">
      <div className="w-full" id="codeeditorui">
        <CodeEditor parentId="codeeditorui" />
      </div>
      <div id="whiteboardui" className="w-full">
        <Whiteboard />
      </div>
    </div>
  );
}
