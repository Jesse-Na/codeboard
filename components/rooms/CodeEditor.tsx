"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { DefaultEventsMap } from "socket.io";
import io, { Socket } from "socket.io-client";
import CodeMirror from "@uiw/react-codemirror";
import { basicSetup } from "codemirror";
import { javascript } from '@codemirror/lang-javascript';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { json } from '@codemirror/lang-json';
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

type CodeEditorProps = {
	width?: number;
	height?: number;
    theme?: "light" | "dark";
    language?: string;
};

const languageDropdownOptions = [
    { label: "JavaScript", value: "js" },
    { label: "Python", value: "py" },
    { label: "Java", value: "java" },
    { label: "C++", value: "cpp"},
    { label: "JSON", value: "json"},
]

const languageExtensions: {
	[key: string]: { extension: any; file_ext: string };
} = {
	js: { extension: javascript({ jsx: true }), file_ext: ".js" },
	py: { extension: python(), file_ext: ".py" },
	java: { extension: java(), file_ext: ".java" },
	cpp: { extension: cpp(), file_ext: ".cpp" },
	json: { extension: json(), file_ext: ".json" },
};

export default function CodeEditor({ width = 600, height = 400, theme = 'dark', language = 'js' }: CodeEditorProps) {
    
    const [codeValue, setCodeValue] = useState<string>("// loading...");
    const [langSelected, setLangSelected] = useState<string>(language);
    const fileInputRef = useRef<HTMLInputElement>(null);

	const params = useParams();
	const roomId = params.id as string;

	const [socket, setSocket] = useState<Socket<
		DefaultEventsMap,
		DefaultEventsMap
	> | null>(null);

    useEffect(() => {
        setParent(document.getElementById(parentId));
        console.log(parent)
    }, []);

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

	// Event listener for receiving code editor data from the socket
	useEffect(() => {
		if (!socket) return;

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
	}, [socket]);

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

    return (
        <div className="flex flex-col items-start">
            {/* Code editor */}
            <CodeMirror 
                value={codeValue}
                width={`${width}px`}
                height={`${height}px`}
                theme={theme}
                extensions={[basicSetup, languageExtensions[langSelected].extension]} 
                onChange={handleChange} 
            />

            <div className="flex w-full items-center justify-between mb-1 pt-2">
                {/* Language dropdown */}
                <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium">Language:</span>
                    
                    <Select 
                        value={langSelected} 
                        onValueChange={handleLangChange}
                    >
                        <SelectTrigger className="w-[180px] h-8">
                            <SelectValue placeholder="Language"/>
                        </SelectTrigger>

                        <SelectContent>
                            <SelectGroup>
                                {languageDropdownOptions.map((item) => (
                                    <SelectItem key={item.value} value={item.value}>
                                        {item.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex gap-2">
                    {/* Upload button */}
                    <Button className="h-9" onClick={() => fileInputRef.current?.click()}>
                        Upload Code
                    </Button>

                    {/* Download button */}
                    <Button className="h-9" onClick={handleDownload}>
                        Download Code
                    </Button>
                </div>
                
                <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".js,.py,.java,.cpp,.json,.txt"
                    onChange={handleUpload}
                />
            </div>
        </div>
	);
}
