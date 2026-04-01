"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { DefaultEventsMap } from "socket.io";
import io, { Socket } from "socket.io-client";
import CodeMirror from "@uiw/react-codemirror";
import { basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { python } from "@codemirror/lang-python";
import { java } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp";
import { json } from "@codemirror/lang-json";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { saveCode } from "@/lib/actions";
import { IconDeviceFloppy } from "@tabler/icons-react";
import { CodeEditorTools } from "./CodeEditorTools";
import { socket } from "@/lib/socket-client";

type CodeEditorProps = {
  parentId: string;
  theme?: "light" | "dark";
  language: string;
};

const languageDropdownOptions = [
  { label: "JavaScript", value: "js" },
  { label: "Python", value: "py" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
  { label: "C", value: "c" },
  { label: "JSON", value: "json" },
];

const languageExtensions: {
  [key: string]: { extension: any; file_ext: string };
} = {
  js: { extension: javascript({ jsx: true }), file_ext: ".js" },
  py: { extension: python(), file_ext: ".py" },
  java: { extension: java(), file_ext: ".java" },
  cpp: { extension: cpp(), file_ext: ".cpp" },
  c: { extension: cpp(), file_ext: ".c" },
  json: { extension: json(), file_ext: ".json" },
};

export default function CodeEditor({
  parentId,
  theme = "dark",
  language = "js",
}: CodeEditorProps) {
  const [codeValue, setCodeValue] = useState<string>("// loading...");
  const [langSelected, setLangSelected] = useState<string>(language);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [parent, setParent] = useState<HTMLElement | null>(null);
  const [fontSize, setFontSize] = useState<number>(12);
  const [width, setWidth] = useState<number>(600);
  const params = useParams();
  const roomId = params.id as string;

  const updateWidth = () => {
    setWidth(parent?.clientWidth || width);
  };

  useEffect(() => {
    setParent(document.getElementById(parentId));
    updateWidth();
    if (parent) new ResizeObserver(updateWidth).observe(parent);
  }, [parent]);

  // Event listener for receiving code editor data from the socket
  useEffect(() => {
    const codeHandler = (data: string) => {
      setCodeValue(data);
    };

    const langHandler = (data: string) => {
      setLangSelected(data);
    };

    socket.on("codeString", codeHandler);
    socket.on("languageChange", langHandler);

    return () => {
      socket.off("codeString", codeHandler);
      socket.off("languageChange", langHandler);
    };
  }, []);

  //When code editor is updated
  const handleChange = (value: string) => {
    // No need to set and emit value again if the update was remote and was already set
    if (value === codeValue) return;

    setCodeValue(value);

    if (socket) {
      socket.emit("codeString", value, roomId);
    }
  };

  //When language dropdown is updated
  const handleLangChange = (value: string) => {
    if (value === langSelected) return;

    setLangSelected(value);

    if (socket) {
      socket.emit("languageChange", value, roomId);
    }
  };

  //When Upload File button is clicked, upload code file
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    const fileContents: string = await selectedFile.text();
    handleChange(fileContents);

    //Update language selected based on file type
    const ext = selectedFile.name.split(".").pop();
    if (ext && languageExtensions[ext]) {
      handleLangChange(ext);
    }

    //Reset input for fresh state next time
    e.target.value = "";
  };

  //When Download Code button is clicked, download code file
  const handleDownload = () => {
    const file = new Blob([codeValue], {
      type: "text/plain;charset=utf-8",
    });
    const url = URL.createObjectURL(file);
    const element = document.createElement("a");
    element.download = "code" + languageExtensions[langSelected].file_ext;
    element.href = url;
    element.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    const fileBlob = new Blob([codeValue], {
      type: "text/plain;charset=utf-8",
    });

    const file = new File(
      [fileBlob],
      "code" + languageExtensions[langSelected].file_ext,
      {
        type: fileBlob.type,
      },
    );

    try {
      await saveCode(Number(roomId), file);
      alert("Code saved successfully!");
    } catch (error) {
      alert("Error saving code: " + error);
    }
  };

  const increaseFontSize = () => {
    setFontSize(fontSize + 2);
  };

  const decreaseFontSize = () => {
    setFontSize(fontSize - 2);
  };

  const setSize = (size: number) => {
    setFontSize(size);
  };

  return (
    <div>
      <CodeEditorTools
        inputSize={setSize}
        increase={increaseFontSize}
        decrease={decreaseFontSize}
        languageUpdate={handleLangChange}
        selected={langSelected}
        handleDownload={handleDownload}
        handleUpload={handleUpload}
        fileInputRef={fileInputRef}
        handleSave={handleSave}
      />
      <CodeMirror
        value={codeValue}
        height={parent?.clientHeight + "px"}
        width={width + "px"}
        theme={theme}
        extensions={[basicSetup, languageExtensions[langSelected].extension]}
        style={{ fontSize: fontSize }}
        onChange={handleChange}
      />
    </div>
  );
}
