import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { importMarkdownFile } from "./MarkdownContentUtils";

interface MarkdownContentProps {
	sourcePath: string;
}

const MarkdownContent = ({ sourcePath }: MarkdownContentProps) => {
	const [currentPath, setCurrentPath] = useState<string>(sourcePath);

	const [content, setContent] = useState<string | undefined>();
	const [metadata, setMetadata] = useState<any | undefined>();

	useEffect(() => {
		async function importFile(filePath) {
			const { content, metadata } = await importMarkdownFile(filePath);
			if (metadata) {
				setMetadata(metadata);
			}
			setContent(content);
		}
		importFile(currentPath);
	}, [currentPath]);

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
										setCurrentPath(href?.replace(".md", "") ?? "");
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

export { MarkdownContent };
