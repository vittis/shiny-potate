import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import { MarkdownTooltip } from "../MarkdownTooltip/MarkdownTooltip";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Components } from "react-markdown";
import { MarkdownContent } from "./MarkdownContent";

export const tierColorMap = {
	"0": "text-gray-400",
	"1": "text-green-400",
	"2": "text-blue-400",
	"3": "text-purple-400",
	"4": "text-yellow-400",
	"5": "text-red-400",
};

const markdownComponents: Partial<Components> = {
	table: ({ children }) => <table className="w-fit">{children}</table>,
	td: ({ children }) => <td className="text-left">{children}</td>,
	th: ({ children }) => <th className="text-left min-w-[50px]">{children}</th>,
	code: ({ children }) => <code className="font-mono text-lg text-amber-300">{children}</code>,
	strong: ({ children }) => (
		<span className="text-[10px] font-semibold font-mono text-stone-400">{children}</span>
	),
	hr: () => <Separator />,
	ul: ({ children }) => <ul className="flex flex-col gap-0.5">{children}</ul>,
	em: ({ children }) => <span className="font-mono text-green-300">{children}</span>,
	h2: ({ children }) => <div className="text-2xl leading-10">{children}</div>,
};

interface MarkdownAnchorProps {
	children?: React.ReactNode;
	href?: string;
	onOpenSubTooltip?: () => void;
}

const MarkdownAnchor = ({ children, href, onOpenSubTooltip }: MarkdownAnchorProps) => {
	const formattedPath = href?.replace(".md", "")?.replace("%20", " ") ?? "";

	return (
		<MarkdownTooltip
			content={<MarkdownContent sourcePath={formattedPath} />}
			onOpenSubTooltip={() => {
				if (onOpenSubTooltip) {
					onOpenSubTooltip();
				}
			}}
		>
			<span className="underline-offset-4 hover:underline font-mono text-primary cursor-pointer">
				{children}
			</span>
		</MarkdownTooltip>
	);
};

interface MarkdownH1Props {
	children?: React.ReactNode;
	tier?: number;
	tags?: string[];
}

const MarkdownH1 = ({ children, tier, tags }: MarkdownH1Props) => {
	return (
		<div className={cn("flex flex-col")}>
			<div className="text-3xl font-mono leading-6">
				{children}
				{typeof tier === "number" && tier >= 0 && (
					<span className={cn("text-[12px] font-semibold font-mono ml-2", tierColorMap[tier])}>
						T{tier}
					</span>
				)}
			</div>
			{tags && (
				<div className="flex gap-1.5 -ml-0.5">
					{tags?.map(tag => (
						<Button key={tag} variant="unstyled">
							<Badge variant="secondary" className="capitalize">
								{tag.toLowerCase()}
							</Badge>
						</Button>
					))}
				</div>
			)}
		</div>
	);
};

export { markdownComponents, MarkdownAnchor, MarkdownH1 };
