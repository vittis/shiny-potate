import { Button } from "@/components/ui/button";
import { useCopyToClipboard } from "@/utils/useCopyToClipboard";
import { Copy, CopyCheck } from "lucide-react";

interface CopyEventHistoryWidgetProps {
	gameData?: any;
}

const CopyEventHistoryWidget = ({ gameData }: CopyEventHistoryWidgetProps) => {
	const [copiedText, copy] = useCopyToClipboard();

	const handleCopy = async () => {
		if (!gameData) {
			const gameHistory = localStorage.getItem("game") || "";

			await copy(gameHistory);
			return;
		}

		await copy(JSON.stringify(gameData));
	};

	const text = copiedText ? "Copied!" : "Event History";

	return (
		<div className="fixed right-4 top-24">
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
