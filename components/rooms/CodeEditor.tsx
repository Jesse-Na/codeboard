"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DefaultEventsMap } from "socket.io";
import io, { Socket } from "socket.io-client";
import CodeMirror from '@uiw/react-codemirror';
import { basicSetup } from "codemirror";
import { javascript } from '@codemirror/lang-javascript';
import { CodeEditorTools } from "./CodeEditorTools";

type CodeEditorProps = {
    parentId:string
    theme?: "light" | "dark";
};

export default function CodeEditor({ parentId,theme = 'dark' }: CodeEditorProps) {
    const [codeValue, setCodeValue] = useState<string>("// loading...");
    const [parent,setParent] = useState<HTMLElement|null>(null)
    const [fontSize, setFontSize] = useState<number>(12)
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

        const handler = (data: string) => {
			setCodeValue(data);
        };

		socket.on("codeString", handler);

        return () => {
            socket.off("codeString", handler);
        };
    }, [socket]);

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
    return (
    <div>
        <CodeEditorTools inputSize={setSize} increase={increaseFontSize} decrease={decreaseFontSize}/>
		<CodeMirror 
            value={codeValue}
			height={parent?.clientHeight+'px'}
			width={parent?.clientWidth}
            theme={theme}
            style={{"fontSize": fontSize}}
            extensions={[basicSetup, javascript({ jsx: true })]} 
            onChange={handleChange} 
        />
    </div>
	);
}
