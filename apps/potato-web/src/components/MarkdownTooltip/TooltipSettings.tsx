import { useState } from "react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useTooltipStore } from "./useTooltipStore";
import { Slider } from "../ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Settings } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";

const TooltipSettigs = () => {
	const { tooltipMode, setTooltipMode, hoverDelay, setHoverDelay } = useTooltipStore();
	const [value, setValue] = useState(tooltipMode);
	const [sliderValue, setSliderValue] = useState(hoverDelay);

	function onValueChange(value: string) {
		setTooltipMode(value as "hover" | "click");
		setValue(value as "hover" | "click");
	}

	function onSliderValueChange(value: number[]) {
		setHoverDelay(value[0]);
		setSliderValue(value[0]);
	}

	return (
		<>
			<Popover>
				<TooltipProvider delayDuration={0}>
					<Tooltip>
						<TooltipTrigger asChild>
							<PopoverTrigger asChild>
								<Button size="icon" variant="ghost">
									<Settings size={18} />
								</Button>
							</PopoverTrigger>
						</TooltipTrigger>
						<TooltipContent>Change tooltip settings</TooltipContent>
					</Tooltip>
				</TooltipProvider>
				<PopoverContent>
					<div className=" flex flex-col gap-2.5 rounded-md font-mono text-sm">
						<div className="flex gap-4">
							<div>Tooltip Mode:</div>
							<RadioGroup value={value} className="flex" onValueChange={onValueChange}>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="hover" id="r1" />
									<Label htmlFor="r1">Hover</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="click" id="r2" />
									<Label htmlFor="r2">Click</Label>
								</div>
							</RadioGroup>
						</div>
						{value === "hover" && (
							<div className="flex gap-4">
								<div>Hover Delay:</div>
								<Slider
									value={[sliderValue]}
									max={2000}
									step={10}
									className="max-w-[90px]"
									onValueChange={onSliderValueChange}
								/>
								<div className="w-[10px] text-slate-300">{`${sliderValue / 1000}s`}</div>
							</div>
						)}
					</div>
				</PopoverContent>
			</Popover>
		</>
	);
};

export { TooltipSettigs };
