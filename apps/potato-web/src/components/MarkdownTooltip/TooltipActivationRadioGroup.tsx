import { useState } from "react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useTooltipStore } from "./useTooltipStore";

const TooltipActivationRadioGroup = () => {
	const { tooltipMode, setTooltipMode } = useTooltipStore();
	const [value, setValue] = useState(tooltipMode);

	function onValueChange(value: string) {
		setTooltipMode(value as "hover" | "click");
		setValue(value as "hover" | "click");
	}

	return (
		<div className="flex gap-4 bg-secondary py-1.5 px-4 rounded-md text-sm">
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
	);
};

export { TooltipActivationRadioGroup };
