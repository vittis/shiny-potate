import { Loader2Icon } from "lucide-react";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import { VariantProps, cva } from "class-variance-authority";

interface UnlockButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof unlockButtonVariants> {
	children: React.ReactNode;
	disabled?: boolean;
	isLoading?: boolean;
	icon: React.ReactNode;
	onClick?: () => void;
	className?: string;
}

const unlockButtonVariants = cva(
	"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			size: {
				sm: "w-[48px] h-[48px] text-sm",
				default: "w-[160px] h-[48px] text-lg",
				lg: "w-[320px] h-[75px] text-2xl",
			},
		},
		defaultVariants: {
			size: "default",
		},
	},
);

const UnlockButton = ({
	children,
	isLoading = false,
	icon,
	size,
	className,
	...props
}: UnlockButtonProps) => {
	const disabled = props.disabled || isLoading;
	return (
		<Button
			variant="ghost"
			className={cn(
				unlockButtonVariants({ size }),
				"group relative inline-flex items-center justify-center overflow-hidden rounded border-2 border-b-4 border-input px-6 font-medium text-black shadow-md transition duration-300 ease-out",
				className,
			)}
			{...props}
			disabled={disabled}
		>
			<span
				className={cn(
					"ease absolute inset-0 h-full w-full -translate-x-full text-white duration-300 group-hover:translate-x-0",
					disabled && "hidden !-translate-x-[101%]",
				)}
			>
				<div
					className={cn(
						"flex h-full w-full items-center justify-center",
						!disabled && "animate-black-swoosh",
					)}
				>
					{icon}
				</div>
			</span>
			<span
				className={cn(
					"absolute flex h-full w-full items-center justify-center font-mono text-foreground",
					!disabled &&
						"ease transform bg-background transition-all duration-300 group-hover:translate-x-full",
				)}
			>
				{isLoading ? <Loader2Icon size={32} className="animate-spin" /> : children}
			</span>
			<span className="invisible relative"></span>
		</Button>
	);
};

export { UnlockButton };
