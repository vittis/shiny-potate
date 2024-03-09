import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { importMarkdownFile, modToMarkdown } from "./MarkdownContentUtils";
import { Badge } from "@/components/ui/badge";
import { MarkdownTooltip } from "../MarkdownTooltip/MarkdownTooltip";
import { Separator } from "../ui/separator";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import remarkGfm from "remark-gfm";

export const tierColorMap = {
	"0": "text-gray-400",
	"1": "text-green-400",
	"2": "text-blue-400",
	"3": "text-purple-400",
	"4": "text-yellow-400",
	"5": "text-red-400",
};

interface MarkdownContentProps {
	sourcePath: string;
	parentTooltipSetOpen?: (open: boolean) => void;
	weapon?: any; // todo decouple
}

const MarkdownContent = ({ sourcePath, parentTooltipSetOpen, weapon }: MarkdownContentProps) => {
	const [content, setContent] = useState<string | undefined>();
	const [metadata, setMetadata] = useState<{ tags?: string[] }>();

	useEffect(() => {
		async function importFile(filePath) {
			const { content: markdownContent, metadata } = await importMarkdownFile(filePath);

			if (metadata) {
				setMetadata(metadata);
			}
			if (!weapon) {
				setContent(markdownContent);
				return;
			}

			let contentFromWeaponData = `# ${weapon.data.name}\n`;

			let implicits = weapon?.data?.mods?.filter(mod => mod.tier === "implicit");
			contentFromWeaponData += implicits?.map(mod => modToMarkdown(mod)).join("\n");
			if (weapon?.data?.tier > 0) {
				let rolledMods = weapon?.data?.mods?.filter(mod => mod.tier !== "implicit");
				contentFromWeaponData += "\n---\n";
				contentFromWeaponData += rolledMods?.map(mod => modToMarkdown(mod)).join("\n");
			}

			setContent(contentFromWeaponData);

			//setContent(content + "\n---\n" + contentFromWeaponData);
		}
		importFile(sourcePath);
	}, []);

	if (!content) {
		return <Loader2 className="animate-spin mx-auto w-80 my-20" />;
	}

	return (
		<div className="bg-pattern-gradient p-3">
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				className="flex flex-col gap-2.5"
				children={content}
				components={{
					table: ({ children }) => <table className="w-fit">{children}</table>,
					td: ({ children }) => <td className="text-left">{children}</td>,
					th: ({ children }) => <th className="text-left min-w-[50px]">{children}</th>,
					code: ({ children }) => (
						<code className="font-mono text-lg text-amber-300">{children}</code>
					),
					strong: ({ children }) => (
						<span className="text-[10px] font-semibold font-mono text-stone-400">{children}</span>
					),
					hr: () => <Separator />,
					ul: ({ children }) => <ul className="flex flex-col gap-0.5">{children}</ul>,
					em: ({ children }) => <span className="font-mono text-green-300">{children}</span>,
					h2: ({ children }) => <div className="text-2xl leading-10">{children}</div>,
					h1: ({ children }) => (
						<div className={cn("flex flex-col" /* , !weapon && "mb-3" */)}>
							<div className="text-3xl font-mono leading-6">
								{children}
								{weapon?.data?.tier >= 0 && (
									<span
										className={cn(
											"text-[12px] font-semibold font-mono ml-2",
											tierColorMap[weapon?.data?.tier],
										)}
									>
										T{weapon?.data?.tier}
									</span>
								)}
							</div>
							{weapon?.data?.tags && (
								<div className="flex gap-1.5 -ml-0.5">
									{weapon?.data?.tags?.map(tag => (
										<Button key={tag} variant="unstyled">
											<Badge variant="secondary" className="capitalize">
												{tag.toLowerCase()}
											</Badge>
										</Button>
									))}
								</div>
							)}

							{!weapon && metadata?.tags && (
								<div className="flex gap-1.5 mt-1 -ml-0.5">
									{metadata.tags.map(tag => (
										<Button key={tag} variant="unstyled">
											<Badge variant="secondary" className="capitalize">
												{tag}
											</Badge>
										</Button>
									))}
								</div>
							)}
						</div>
					),
					a: ({ children, href }) => {
						const formattedPath = href?.replace(".md", "")?.replace("%20", " ") ?? "";

						return (
							<MarkdownTooltip
								sourcePath={formattedPath}
								onOpenChange={() => {
									if (parentTooltipSetOpen) {
										parentTooltipSetOpen(true);
									}
								}}
							>
								<span className="underline-offset-4 hover:underline font-mono text-primary cursor-pointer">
									{children}
								</span>
							</MarkdownTooltip>
						);
					},
				}}
			/>

			{/* {metadata && <pre className="mt-4">{JSON.stringify(metadata, null, 2)}</pre>} */}
		</div>
	);
};

export { MarkdownContent };

/* 

'# Shortbow\n' +
'\n' +
'- Gain attack: [Disarming Shot](Abilities/Attacks/Disarming%20Shot.md)\n' +
'- *+15%* increased [Attack Interval Recovery](Stats/Attack%20Cooldown.md) \n' +
'- *+15%* increased [Spell Interval Recovery](Stats/Spell%20Cooldown.md)\n' +
'\n' +
'---\n' +
'\n' +
'kkk'

*/
