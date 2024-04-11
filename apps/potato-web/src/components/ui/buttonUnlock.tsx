import { Loader2Icon } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

interface UnlockButtonProps extends VariantProps<typeof unlockButtonVariants> {
	children: React.ReactNode;
	isLoading?: boolean;
	icon: React.ReactNode;
	onClick?: () => void;
	className?: string;
}

const unlockButtonVariants = cva("", {
	variants: {
		size: {
			sm: "w-[48px] h-[48px] text-sm",
			default: "w-[150px] h-[48px] text-lg",
			lg: "w-[320px] h-[75px] text-2xl",
		},
	},
	defaultVariants: {
		size: "default",
	},
});

const UnlockButton = ({
	children,
	isLoading = false,
	icon,
	onClick,
	size,
	className,
}: UnlockButtonProps) => {
	return (
		<Button
			disabled={isLoading}
			onClick={onClick}
			variant="ghost"
			className={cn(
				unlockButtonVariants({ size }),
				"group relative inline-flex items-center justify-center overflow-hidden rounded border-2 border-b-4 border-input px-6 font-medium text-black shadow-md transition duration-300 ease-out",
				className,
			)}
		>
			<span
				className={cn(
					"ease absolute inset-0 h-full w-full -translate-x-full text-white duration-300 group-hover:translate-x-0",
					isLoading && "hidden !-translate-x-[101%]",
				)}
			>
				<div
					className={cn(
						"flex h-full w-full items-center justify-center",
						!isLoading && "animate-black-swoosh",
					)}
				>
					{icon}
				</div>
			</span>
			<span
				className={cn(
					"absolute flex h-full w-full items-center justify-center font-mono text-foreground",
					!isLoading &&
						"ease transform bg-background transition-all duration-300 group-hover:translate-x-full",
					isLoading && "",
				)}
			>
				{isLoading ? <Loader2Icon size={32} className="animate-spin" /> : children}
			</span>
			<span className="invisible relative"></span>
		</Button>
	);
};

export { UnlockButton };
