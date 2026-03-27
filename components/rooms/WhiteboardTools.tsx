import { RefObject } from "react";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  IconDeviceFloppy,
  IconEraser,
  IconHandFinger,
  IconPencil,
  IconTrash,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Tool } from "@/components/rooms/Whiteboard";
import { ButtonGroup } from "../ui/button-group";

type WhiteboardToolsProps = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  clear: () => void;
  // pencil: () => void;
  save: () => void;
  activeTool: Tool;
  setActiveTool: (tool: Tool) => void;
  setPencilColour: (colour: string) => void;
  // clearCanvas: () => void;
  setLinewidth: (width: number[]) => void;
  // handleSave: () => void;
};
export function WhiteboardTools({
  // pencil,
  clear,
  save,
  activeTool,
  setActiveTool,
  setPencilColour,
  // clearCanvas,
  setLinewidth,
  // handleSave,
}: WhiteboardToolsProps) {
  return (
    <header
      style={{ backgroundColor: "rgb(226, 232, 240)" }}
      className="z-40 sticky top-0 flex items-center py-4"
    >
      <div className="flex w-full items-center gap-1 px-2 lg:px-6">
        <div className="mx-auto grid w-full max-w-xs gap-3">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="input-colour-picket">Tools</Label>
          </div>

          <div className="flex ">
            <ButtonGroup>
              <Button
                size="sm"
                variant={activeTool === Tool.POINTER ? "secondary" : "outline"}
                onClick={() => setActiveTool(Tool.POINTER)}
              >
                <IconHandFinger />
              </Button>
              <Button
                size="sm"
                variant={activeTool === Tool.PENCIL ? "secondary" : "outline"}
                onClick={() => setActiveTool(Tool.PENCIL)}
              >
                <IconPencil />
              </Button>
              <Button
                size="sm"
                variant={activeTool === Tool.ERASER ? "secondary" : "outline"}
                onClick={() => setActiveTool(Tool.ERASER)}
              >
                <IconEraser />
              </Button>
              <Button size="sm" variant="outline" onClick={clear}>
                <IconTrash />
              </Button>
              {/*<Button size="sm" variant="outline" onClick={handleSave}>
                <IconDeviceFloppy />
              </Button>*/}
            </ButtonGroup>
          </div>
        </div>

        <div className="mx-auto grid w-full max-w-xs gap-3">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="input-colour-picket">Line Colour</Label>
          </div>
          <Input
            type="color"
            onChange={(e) => setPencilColour(e.target.value)}
          ></Input>
        </div>

        <div className="mx-auto grid w-full max-w-xs gap-3">
          <div className="flex items-center justify-between gap-2">
            <Label htmlFor="slider-brush-size">Line Width</Label>
          </div>
          <div>
            <Slider
              defaultValue={[4]}
              max={30}
              min={2}
              step={1}
              className="mx-auto w-full max-w-xs"
              onValueChange={(e) => setLinewidth(e)}
              style={{ color: "red" }}
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
  );
}
