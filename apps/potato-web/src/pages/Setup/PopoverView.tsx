import { Button } from "@/components/ui/button";
import { parseMarkdownWithYamlFrontmatter } from "@/utils/parseMarkdown";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

const PopoverView = ({ sourceName = "Abilities/Attacks/Slash" }) => {
	const [sourcePath, setSourcePath] = useState<string>(sourceName);

	const [content, setContent] = useState<string | undefined>();
	const [metadata, setMetadata] = useState<any | undefined>();

	async function importFile(filePath) {
		try {
			const module = await import(`@obsidian/${filePath}.md`);
			const response = await fetch(module.default);
			const source = await response.text();
			const result = parseMarkdownWithYamlFrontmatter<any>(source);
			if (result.metadata) {
				setMetadata(result.metadata);
			}
			setContent(result.content);
		} catch (error) {
			console.error("Error importing file:", error);
		}
	}

	useEffect(() => {
		importFile(sourcePath);
	}, [sourcePath]);

	return (
		<div>
			{content && (
				<ReactMarkdown
					children={content}
					components={{
						a({ children, href }) {
							return (
								<Button
									variant="link"
									onClick={() => {
										setSourcePath(href?.replace(".md", "") ?? "");
									}}
								>
									{children}
								</Button>
							);
						},
					}}
				/>
			)}
			{metadata && <pre>{JSON.stringify(metadata, null, 2)}</pre>}
		</div>
	);
};

export { PopoverView };
