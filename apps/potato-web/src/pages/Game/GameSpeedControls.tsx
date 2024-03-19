import { Slider } from "@/components/ui/slider";
import { useGameControlsStore } from "@/services/features/Game/useGameControlsStore";

const GameSpeedControls = () => {
	const { stepTime, animationSpeed, setAnimationSpeed, setStepTime } = useGameControlsStore();

	return (
		<div className="fixed bottom-4 right-4 flex flex-col gap-8">
			<div>
				<div className="mb-4">Step time: {`${stepTime / 1000}s`}</div>
				<Slider
					value={[stepTime]}
					min={10}
					max={500}
					step={5}
					className="w-[200px]"
					onValueChange={value => setStepTime(value[0])}
				/>
			</div>

			<div>
				<div className="mb-4">Animation modifier: {`${Math.round(animationSpeed * 100)}%`}</div>
				<Slider
					value={[animationSpeed]}
					max={2}
					min={0.1}
					step={0.05}
					className="w-[200px]"
					onValueChange={value => setAnimationSpeed(value[0])}
				/>
			</div>
		</div>
	);
};

export { GameSpeedControls };
