"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Slider } from "@/components/ui/slider";
import {
	IconDeviceFloppy,
	IconEraser,
	IconPencil,
	IconTrash,
} from "@tabler/icons-react";
import { PencilColour, Tool } from "@/components/rooms/Whiteboard";

export default function Toolbar({
	// activeTool,
	setActiveTool,
	setPencilColour,
	clearCanvas,
	lineWidth,
	setLineWidth,
	handleSave,
}: {
	// activeTool: Tool;
	setActiveTool: (tool: Tool) => void;
	setPencilColour: (colour: PencilColour) => void;
	clearCanvas: () => void;
	lineWidth: number[];
	setLineWidth: (width: number[]) => void;
	handleSave: () => void;
}) {
	const [showColourPalette, setShowColourPalette] = useState(false);
	const [showLineWidthSlider, setShowLineWidthSlider] = useState(false);

	const handlePencilClick = () => {
		setActiveTool("pencil")
		// if (activeTool === "pencil") {
		// 	setShowColourPalette(!showColourPalette);
		// 	setShowLineWidthSlider(!showLineWidthSlider);
		// 	return;
		// }

		// setActiveTool("pencil");
		// setShowColourPalette(true);
		// setShowLineWidthSlider(true);
	};

	const changePencilColour = (colour: PencilColour) => {
		setPencilColour(colour);
	};

	const handleEraserClick = () => {
		setActiveTool("eraser")
		// if (activeTool === "eraser") {
		// 	setShowLineWidthSlider(!showLineWidthSlider);
		// 	return;
		// }

		// setActiveTool("eraser");
		// setShowColourPalette(false);
		// setShowLineWidthSlider(true);
	};

	return (
		<div className="absolute top-0 w-0 h-0 p-2">
			<div>
				<ButtonGroup>
					<Button
						size="sm"
						variant={
							activeTool === "pencil" ? "secondary" : "outline"
						}
						onClick={handlePencilClick}
					>
						<IconPencil />
					</Button>
					<Button
						size="sm"
						variant={
							activeTool === "eraser" ? "secondary" : "outline"
						}
						onClick={handleEraserClick}
					>
						<IconEraser />
					</Button>
					<Button size="sm" variant="outline" onClick={clearCanvas}>
						<IconTrash />
					</Button>
					<Button size="sm" variant="outline" onClick={handleSave}>
						<IconDeviceFloppy />
					</Button>
				</ButtonGroup>
				<Slider
					min={0}
					max={100}
					step={1}
					value={lineWidth}
					onValueChange={(value) => setLineWidth(value)}
					className="mt-2 w-25 rounded-full bg-muted"
					hidden={!showLineWidthSlider}
				/>
			</div>
			<div>
				<ButtonGroup hidden={!showColourPalette} className="pt-2">
					<Button
						size="sm"
						variant="outline"
						onClick={() => changePencilColour("black")}
					>
						<div className="h-3 w-3 rounded-full bg-black" />
					</Button>
					<Button
						size="sm"
						variant="outline"
						onClick={() => changePencilColour("red")}
					>
						<div className="h-3 w-3 rounded-full bg-red-500" />
					</Button>
					<Button
						size="sm"
						variant="outline"
						onClick={() => changePencilColour("green")}
					>
						<div className="h-3 w-3 rounded-full bg-green-500" />
					</Button>
					<Button
						size="sm"
						variant="outline"
						onClick={() => changePencilColour("blue")}
					>
						<div className="h-3 w-3 rounded-full bg-blue-500" />
					</Button>
				</ButtonGroup>
			</div>
		</div>
	);
}
