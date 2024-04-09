import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { MarkdownAnchor, MarkdownH1, markdownComponents } from "./MarkdownComponents";
import { Loader2 } from "lucide-react";

interface MarkdownWrapperProps {
	content?: string;
	tier?: number;
	tags?: string[];
	onOpenSubTooltip?: () => void;
}

const MarkdownWrapper = ({ content, tier, tags, onOpenSubTooltip }: MarkdownWrapperProps) => {
	if (!content) {
		return <Loader2 className="mx-auto my-20 w-80 animate-spin" />;
	}
	return (
		<div className="bg-pattern-gradient p-3 text-sm">
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				className="flex flex-col gap-2.5"
				children={content}
				components={{
					...markdownComponents,
					h1: props => <MarkdownH1 {...props} tier={tier} tags={tags} />,
					a: props => <MarkdownAnchor {...props} onOpenSubTooltip={onOpenSubTooltip} />,
				}}
			/>
		</div>
	);
};

export { MarkdownWrapper };
