import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { importMarkdownFile, modToMarkdown } from "./MarkdownContentUtils";
import { Badge } from "@/components/ui/badge";
import { MarkdownTooltip } from "../MarkdownTooltip/MarkdownTooltip";
import { Separator } from "../ui/separator";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

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
				className="flex flex-col gap-2.5"
				children={content}
				components={{
					code: ({ children }) => (
						<code className="font-mono text-lg text-amber-300">{children}</code>
					),
					strong: ({ children }) => (
						<span className="text-[10px] font-semibold font-mono text-stone-400">{children}</span>
					),
					hr: () => <Separator />,
					ul: ({ children }) => <ul className="flex flex-col gap-0.5">{children}</ul>,
					em: ({ children }) => <span className="font-mono text-green-300">{children}</span>,
					h1: ({ children }) => (
						<div className={cn("flex flex-col" /* , !weapon && "mb-3" */)}>
							<div className="text-3xl font-mono leading-6">
								{children}
								{weapon?.data?.tier >= 0 && (
									<span className="text-[12px] font-semibold font-mono text-indigo-300 ml-2">
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
