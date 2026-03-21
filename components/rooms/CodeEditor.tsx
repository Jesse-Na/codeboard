"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { DefaultEventsMap } from "socket.io";
import io, { Socket } from "socket.io-client";
import CodeMirror from '@uiw/react-codemirror';
import { basicSetup } from "codemirror";
import { javascript } from '@codemirror/lang-javascript';
import { CodeEditorTools } from "./CodeEditorTools";
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

type CodeEditorProps = {
    parentId:string
    theme?: "light" | "dark";
    language?: string;
};

export default function CodeEditor({ parentId,theme = 'dark', language = 'js' }: CodeEditorProps) {
    const [parent,setParent] = useState<HTMLElement|null>(null)
    const [fontSize, setFontSize] = useState<number>(12)
    const languageDropdownOptions = [
    { label: "JavaScript", value: "js" },
    { label: "Python", value: "py" },
    { label: "Java", value: "java" },
    { label: "C++", value: "cpp"},
    { label: "JSON", value: "json"},
]

const languageExtensions: { [key: string]: { extension: any, file_ext: string } } = {
    js: {extension: javascript({ jsx: true }), file_ext: '.js'},
    py: {extension: python(), file_ext: '.py'},
    java: {extension: java(), file_ext: '.java'},
    cpp: {extension: cpp(), file_ext: '.cpp'},
    json: {extension: json(), file_ext: '.json'},
};


    
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

    const increaseFontSize = () =>{
        setFontSize(fontSize+2)
    }

    const decreaseFontSize = () =>{
        setFontSize(fontSize-2)
    }

    const setSize=(size:number)=>{
        setFontSize(size)
    }
    //When language dropdown is updated
    const handleLangChange = (value: string) => {
        if (value === langSelected) return;

        setLangSelected(value);

        if (socket) {
            socket.emit("languageChange", value, roomId);
        }
    }

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
    }

    //When Download Code button is clicked, download code file
    const handleDownload = () => {
        const file = new Blob([codeValue], {type: "text/plain;charset=utf-8"});
        const url = URL.createObjectURL(file);
        const element = document.createElement("a");
        element.download = "main" + languageExtensions[langSelected].file_ext;
        element.href = url;
        element.click();
        URL.revokeObjectURL(url);
    }

    return (
    <div>
        <CodeEditorTools inputSize={setSize} increase={increaseFontSize} decrease={decreaseFontSize}/>
		<CodeMirror 
            value={codeValue}
			height={parent?.clientHeight+'px'}
			width={parent?.clientWidth+'px'}
            theme={theme}
            style={{"fontSize": fontSize}}
            extensions={[basicSetup, javascript({ jsx: true })]} 
            onChange={handleChange} 
        />
    </div>
    )
}
