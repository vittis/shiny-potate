import data from "@/data";
import { BattleUnit } from "@/game/BattleUnit/BattleUnit";
import { BoardManager, OWNER } from "@/game/BoardManager/BoardManager";
import { BoardUnit } from "@/game/BoardUnit/BoardUnit";
import { generateBattleUnitInfo } from "@/game/BoardUnit/BoardUnitUtils";
import { PackUnit } from "@/game/PackUnit/PackUnit";
import { runGame } from "../GameUtils";

vi.mock("@/data", async () => import("./__mocks__"));

describe("Game", () => {
	it("should run game", () => {
		const bm = new BoardManager(2, 3);

		const boardUnit1 = new BoardUnit(new PackUnit(data.Units.Lumberjack, 2));
		boardUnit1.setPosition(0, 0);

		const boardUnit2 = new BoardUnit(new PackUnit(data.Units.Lumberjack, 3));
		boardUnit2.setPosition(0, 1);

		bm.addToBoard(
			new BattleUnit(generateBattleUnitInfo(boardUnit1, OWNER.TEAM_ONE)),
			OWNER.TEAM_ONE,
		);

		bm.addToBoard(
			new BattleUnit(generateBattleUnitInfo(boardUnit2, OWNER.TEAM_TWO)),
			OWNER.TEAM_TWO,
		);

		const result = runGame(bm);
		console.log(result);
		expect(result).toBeDefined();
	});
});
