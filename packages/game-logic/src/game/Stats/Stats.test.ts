import data from "../../data";
import { BoardUnit } from "../BoardUnit/BoardUnit";
import { PackUnit } from "../PackUnit/PackUnit";

describe("Stats", () => {
	describe("Equip grants stats modifier", () => {
		it("should add a stat modifier to the unit", () => {
			const unit = new BoardUnit(new PackUnit(data.Units.Lumberjack, 1));

			console.log("unit", unit);

			console.log("hp", unit.stats.hp);

			expect(unit.stats.maxHp).toBe(160);

			expect(unit.statsManager.activeStatMods).toBe([]);

			// TODO: fix this test
			// hp original 150, make stat modifier of hp work and the result should be 160
		});
	});
});
