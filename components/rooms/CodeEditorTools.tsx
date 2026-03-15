import { IconMinus, IconPlus } from "@tabler/icons-react"
import { Button } from "../ui/button"
import { ButtonGroup } from "../ui/button-group"
import { Label } from "../ui/label"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "../ui/select"
import { Input } from "../ui/input"
import { useState } from "react"

type CodeEditorToolsProps={
	increase:()=>void
	decrease:()=>void
	inputSize:(n:number)=>void
}
export function CodeEditorTools({inputSize, increase, decrease}: CodeEditorToolsProps) {
	const [size, setSize] = useState<number>(12)
	const Languages = [
		{ label: "JavaScript", value: "js" },
		{ label: "C", value: "c" },
		{ label: "C#", value: "cs" },
	]
	const increaseSize = () => {
		increase()
		setSize(size+2)
	}

	const decreaseSize = () =>{
		decrease()
		setSize(size-2)
	}

	const updateSize =(e: React.ChangeEvent<HTMLInputElement>)=>{
		setSize(Number(e.target.value))
		inputSize(Number(e.target.value))
	}

  	return (
		<header style={{backgroundColor:"rgb(144, 161, 185)"}} className="flex gap-2 py-4">
			<div className="flex w-full gap-1 px-2 lg:gap-2 lg:px-6">
				<div className="mx-auto grid w-full max-w-xs gap-3">
					<div className="flex justify-between gap-2">
						<Label htmlFor="select-language">Language</Label>
					</div>
					<Select items={Languages} defaultValue="js">
						<SelectTrigger className="w-[180px]">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								{Languages.map((item) => (
									<SelectItem key={item.value} value={item.value}>
										{item.label}
									</SelectItem>
								))}setSize(size+2)
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
						<Button variant="outline" size="icon" onClick={increaseSize}><IconPlus /></Button>
						<Input type="numeric" value={size} onChange={updateSize}></Input>
						<Button variant="outline" size="icon" onClick={decreaseSize}><IconMinus /></Button>
					</ButtonGroup>
				</div>
			</div>
		</header>
	)
}
