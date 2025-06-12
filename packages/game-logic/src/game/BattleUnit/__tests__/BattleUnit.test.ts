import data from "@/data";
import { BattleUnit } from "@/game/BattleUnit/BattleUnit";
import { OWNER } from "@/game/BoardManager/BoardManager";
import { BoardUnit } from "@/game/BoardUnit/BoardUnit";
import { generateBattleUnitInfo } from "@/game/BoardUnit/BoardUnitUtils";
import { PackUnit } from "@/game/PackUnit/PackUnit";

vi.mock("@/data", async () => import("./__mocks__"));

describe("BattleUnit", () => {
	it("should create a battle unit with the correct properties", () => {
		const boardUnit = new BoardUnit(new PackUnit(data.Units.Lumberjack, 1));

		const battleUnit = new BattleUnit(generateBattleUnitInfo(boardUnit, OWNER.TEAM_ONE));
		expect(battleUnit).toBeDefined();
		expect(battleUnit.id).toBeDefined();
		expect(battleUnit.owner).toBe(OWNER.TEAM_ONE);
		expect(battleUnit.packUnit).toBe(boardUnit.packUnit);
		expect(battleUnit.equipment).toBe(boardUnit.equipment);
		expect(battleUnit.abilities).toBe(boardUnit.abilities);
	});
});
