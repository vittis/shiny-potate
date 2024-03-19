import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/utils/useCopyToClipboard";
import { Copy, CopyCheck } from "lucide-react";

const CopyEventHistoryWidget = () => {
	const [copiedText, copy] = useCopyToClipboard();

	console.log({ copiedText });

	const handleCopy = async () => {
		const gameHistory = localStorage.getItem("game") || "";

		await copy(gameHistory);
	};

	const text = copiedText ? "Copied!" : "Event History";

	return (
		<div className="fixed bottom-1/2 right-4">
			<Button variant="outline" onClick={handleCopy}>
				{text}{" "}
				{copiedText ? (
					<CopyCheck className="ml-2" width={16} />
				) : (
					<Copy className="ml-2" width={16} />
				)}
			</Button>
		</div>
	);
};

export { CopyEventHistoryWidget };
