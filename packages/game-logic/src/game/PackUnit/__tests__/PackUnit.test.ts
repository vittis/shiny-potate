import data from "@/data";
import { BoardUnit } from "../../BoardUnit/BoardUnit";
import { PackUnit } from "../PackUnit";

vi.mock("@/data", async () => import("./__mocks__"));

describe("PackUnit", () => {
	describe("Upgrade tier", () => {
		it("should change unit base hp as pack unit tier is upgraded", () => {
			/* 
				Unit Base HP - [150, 200, 280, 350]
			*/

			const unit = new BoardUnit(new PackUnit(data.Units.Lumberjack, 1));
			expect(unit.statsManager.baseStats.maxHp).toBe(150);
			unit.upgradePackUnitTier();
			expect(unit.statsManager.baseStats.maxHp).toBe(200);
			unit.upgradePackUnitTier();
			expect(unit.statsManager.baseStats.maxHp).toBe(280);
			unit.upgradePackUnitTier();
			expect(unit.statsManager.baseStats.maxHp).toBe(350);
		});
	});
});
