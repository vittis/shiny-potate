import { useEffect, useState } from "react";
import { importMarkdownFile } from "./MarkdownContentUtils";
import { MarkdownWrapper } from "./MarkdownWrapper";

interface MarkdownContentProps {
	sourcePath: string;
	parentTooltipSetOpen?: (open: boolean) => void;
}

const MarkdownContent = ({ sourcePath, parentTooltipSetOpen }: MarkdownContentProps) => {
	const [content, setContent] = useState<string | undefined>();
	const [metadata, setMetadata] = useState<{ tags?: string[] }>();

	useEffect(() => {
		async function importFile(filePath) {
			const { content: markdownContent, metadata } = await importMarkdownFile(filePath);

			if (metadata) {
				setMetadata(metadata);
			}

			setContent(markdownContent);
		}
		importFile(sourcePath);
	}, []);

	return (
		<MarkdownWrapper
			content={content}
			tags={metadata?.tags}
			parentTooltipSetOpen={parentTooltipSetOpen}
		/>
	);
};

export { MarkdownContent };
