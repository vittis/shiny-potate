import { Loader2Icon } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

interface UnlockButtonProps extends VariantProps<typeof unlockButtonVariants> {
	children: React.ReactNode;
	isLoading?: boolean;
	icon: React.ReactNode;
	onClick?: () => void;
}

const unlockButtonVariants = cva("", {
	variants: {
		size: {
			default: "w-[150px] h-[48px] text-lg",
			lg: "w-[320px] h-[75px] text-2xl",
		},
	},
	defaultVariants: {
		size: "default",
	},
});

const UnlockButton = ({ children, isLoading = false, icon, onClick, size }: UnlockButtonProps) => {
	return (
		<Button
			disabled={isLoading}
			onClick={onClick}
			variant="ghost"
			className={cn(
				unlockButtonVariants({ size }),
				"border-2 border-b-4 border-input relative inline-flex items-center justify-center px-6 overflow-hidden font-medium text-black transition duration-300 ease-out rounded shadow-md group",
			)}
		>
			<span
				className={cn(
					"absolute inset-0 duration-300 w-full h-full text-white -translate-x-full group-hover:translate-x-0 ease",
					isLoading && "!-translate-x-[101%] hidden",
				)}
			>
				<div
					className={cn(
						"w-full h-full flex items-center justify-center",
						!isLoading && "animate-black-swoosh",
					)}
				>
					{icon}
				</div>
			</span>
			<span
				className={cn(
					"font-mono absolute flex items-center justify-center w-full h-full text-foreground",
					!isLoading &&
						"bg-background transition-all duration-300 transform group-hover:translate-x-full ease",
					isLoading && "",
				)}
			>
				{isLoading ? <Loader2Icon size={32} className="animate-spin" /> : children}
			</span>
			<span className="relative invisible"></span>
		</Button>
	);
};

export { UnlockButton };
