import { RefObject, useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { IconDeviceFloppy, IconEraser, IconPencil, IconTrash }from "@tabler/icons-react"
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PencilColour, Tool } from "@/components/rooms/Whiteboard";
import { InputGroup } from "@/components/ui/input-group";

type WhiteboardToolsProps={
	canvasRef: RefObject<HTMLCanvasElement | null>;
	clear:() => void
	erase:() => void
	pencil:() => void
	save:() => void
	// activeTool: Tool;
	// setActiveTool: (tool: Tool) => void;
	// setPencilColour: (colour: PencilColour) => void;
	// clearCanvas: () => void;
	// linewidth: number[];
	// setLinewidth: (width: number[]) => void;
	// handleSave: () => void;
	
}
export function WhiteboardTools({
		pencil, 
		erase, 
		clear, 
		canvasRef, 
		save,
		// activeTool , 
		// setActiveTool, 
		// setPencilColour,
		// clearCanvas,
		// linewidth,
		// setLinewidth,
		// handleSave,
	}: WhiteboardToolsProps) {
	const [ctx,setCTX] = useState<CanvasRenderingContext2D|null>(null)
	const [lineWidth, setLineWidth] = useState<number>(2)
	const [colour, setColour] = useState<string>("black")

	useEffect(() => {
		const canvas: HTMLCanvasElement | null = canvasRef.current;
		if (!canvas) return;
		setCTX(canvas.getContext("2d"));
		if (!ctx) return;
	}, [canvasRef,ctx]);

//   const updateColour = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
// 	if (ctx) ctx.strokeStyle = value;   
// 	setColour(value) 
//   };

//   const updateLineWidth = (e: number[]) => {
//     setLineWidth(e[0])
// 	if (ctx) ctx.lineWidth = e[0];    
//   };

  const updateColour = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
	console.log(value)
	if (ctx) ctx.strokeStyle = value;   
	setColour(value) 
  };

  const updateLineWidth = (e: number[]) => {
    setLineWidth(e[0])
	if (ctx) ctx.lineWidth = e[0];    
  };

  const useEraser = () =>{
	erase()
	if (ctx) ctx.strokeStyle = "rgba(0,0,0,1)";

  }

  const usePencil = () =>{
	pencil()
	if (ctx) ctx.strokeStyle = colour;
  }

  const clearCanvas = () =>{
	clear()
  }


  return (
    <header style={{backgroundColor:"rgb(226, 232, 240)"}} className="flex items-center gap-2 py-4">
      <div className="flex w-full items-center gap-1 px-2 lg:gap-2 lg:px-6">
			
			<div className="mx-auto grid w-full max-w-xs gap-3">
				<div className="flex items-center justify-between gap-2">
					<Label htmlFor="input-colour-picket">Tools</Label>
				</div>

				<div className="flex ">
					<ToggleGroup type="single"
						size="sm"
						defaultValue="draw"
						variant="outline"
						spacing={2}
					>
						<ToggleGroupItem value="draw" aria-label="Toggle draw" onClick={usePencil}><IconPencil/></ToggleGroupItem>
						<ToggleGroupItem value="erase" aria-label="Toggle erase" onClick={useEraser}><IconEraser/></ToggleGroupItem>
					</ToggleGroup>
					<Button onClick={clearCanvas}><IconTrash/></Button>
				</div>
			</div>
			
			<div className="mx-auto grid w-full max-w-xs gap-3">
				<div className="flex items-center justify-between gap-2">
					<Label htmlFor="input-colour-picket">Line Colour</Label>
				</div>
				<Input type="color" onChange={updateColour}></Input>
			</div>
			
			<div className="mx-auto grid w-full max-w-xs gap-3">
				<div className="flex items-center justify-between gap-2">
					<Label htmlFor="slider-brush-size">Line Width</Label>
					<svg height="30" width="30">
						<circle r={15} cx="15" cy="15" stroke="black" fill="grey" opacity={0.3}/>
						<circle r={lineWidth/2} cx="15" cy="15" fill={colour} />
					</svg> 
				</div>
				<div>
					<Slider
						defaultValue={[4]}
						max={30}
						min={2}
						step={1}
						className="mx-auto w-full max-w-xs"
						onValueChange={updateLineWidth}
						style={{color:'red'}}
					/>
				</div>
			</div>
			<div className="gap-3">
				<Button size="lg" onClick={save}>
					Save 
					<IconDeviceFloppy />
				</Button>
			</div>
      </div>
    </header>

  )
}
