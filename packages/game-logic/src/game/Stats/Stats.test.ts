import data from "../../data";
import { BoardUnit } from "../BoardUnit/BoardUnit";
import { PackUnit } from "../PackUnit/PackUnit";

describe("Stats", () => {
	describe("Add stat mods", () => {
		it("should add pack unit stat modifier to the unit", () => {
			const unit = new BoardUnit(new PackUnit(data.Units.Lumberjack, 1));

			expect(unit.statsManager.baseStats.maxHp).toBe(150);
			expect(unit.stats.maxHp).toBe(160);

			expect(unit.statModifiers[0].type).toBe("HP_MODIFIER");
			expect(unit.statModifiers[0].category).toBe("FLAT");
			expect(unit.statModifiers[0].value).toBe(10);
		});
	});
	describe("Test cases", () => {
		it("should correctly calculate hp using stat of different categories as pack unit upgrade tiers", () => {
			/* 
				Test case:

				Unit has Base HP - [150, 200, 280, 350]

				Tier 1 new mod: HP_MODIFIER - FLAT - [10, 20, 30, 40]
				HP = 150 (base t1) + 10 (mod1 t1) = 160

				Tier 2 new mod: HP_MODIFIER - PERCENTAGE - [-, 20, 30, 40]
				HP = 200 (base t2) + 20 (mod1 t2) * 1.2 (mod2 t2) = 264

				Tier 3 new mod: HP_MODIFIER - MULTIPLICATIVE - [-, -, 1.5, 2]
				HP: 280 (base t3) + 30 (mod1 t3) * 1.3 (mod2 t3) * 1.5 (mod3 t3) = 604.5

				Tier 4: no new mods
				HP: 350 (base t4) + 40 (mod1 t4) * 1.4 (mod2 t4) * 2 (mod3 t4) = 1092
			*/

			const unit = new BoardUnit(new PackUnit(data.Units.Lumberjack, 1));
			expect(unit.stats.maxHp).toBe(160);
			unit.upgradePackUnitTier();
			expect(unit.stats.maxHp).toBe(264);
			unit.upgradePackUnitTier();
			expect(unit.stats.maxHp).toBe(604.5);
			unit.upgradePackUnitTier();
			expect(unit.stats.maxHp).toBe(1092);
		});
	});
});
