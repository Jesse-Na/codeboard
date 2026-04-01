import { IconDeviceFloppy, IconMinus, IconPlus } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { RefObject, useEffect, useState } from "react";

type CodeEditorToolsProps = {
  increase: () => void;
  decrease: () => void;
  inputSize: (n: number) => void;
  languageUpdate: (s: string) => void;
  selected: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleDownload: () => void;
  handleSave: () => void;
  handleUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const languageDropdownOptions = [
  { label: "JavaScript", value: "js" },
  { label: "Python", value: "py" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
  { label: "C", value: "c" },
  { label: "JSON", value: "json" },
];

export function CodeEditorTools({
  inputSize,
  increase,
  decrease,
  languageUpdate,
  selected,
  fileInputRef,
  handleDownload,
  handleUpload,
  handleSave,
}: CodeEditorToolsProps) {
  const [size, setSize] = useState<number>(12);

  const increaseSize = () => {
    increase();
    setSize(size + 2);
  };

  const decreaseSize = () => {
    decrease();
    setSize(size - 2);
  };

  const updateSize = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSize(Number(e.target.value));
    inputSize(Number(e.target.value));
  };

  return (
    <header
      style={{ backgroundColor: "rgb(144, 161, 185)" }}
      className="sticky top-0 py-4 z-50"
    >
      <div className="flex w-full gap-1 px-2 lg:gap-2 lg:px-6">
        <div className="mx-auto grid w-full max-w-xs gap-3">
          <div className="flex justify-between gap-2">
            <Label htmlFor="select-language">Language</Label>
          </div>
          <Select value={selected} onValueChange={languageUpdate}>
            <SelectTrigger className="w-[180px] cursor-pointer">
              <SelectValue />
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
        <div className="mx-auto grid w-full max-w-xs gap-3">
          <div className="flex justify-between gap-2">
            <Label htmlFor="button-group=text-size">Text Size</Label>
          </div>
          <ButtonGroup
            orientation="horizontal"
            aria-label="Media controls"
            className="h-fit"
          >
            <Button className="cursor-pointer" variant="outline" size="icon" onClick={decreaseSize}>
              <IconMinus />
            </Button>
            <Input type="numeric" value={size} onChange={updateSize}></Input>
            <Button className="cursor-pointer" variant="outline" size="icon" onClick={increaseSize}>
              <IconPlus />
            </Button>
          </ButtonGroup>
        </div>
        <div>
          <div className="mx-auto max-w-xs gap-3 flex row">
            {/* Upload button */}
            <Button
              className="h-9 cursor-pointer"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload Code
            </Button>

            {/* Download button */}
            <Button className="h-9 cursor-pointer" onClick={handleDownload}>
              Download Code
            </Button>

            <Button className="h-9 cursor-pointer" onClick={handleSave}>
              <IconDeviceFloppy />
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".js,.py,.java,.cpp,.c,.json,.txt"
            onChange={handleUpload}
          />
        </div>
      </div>
    </header>
  );
}
