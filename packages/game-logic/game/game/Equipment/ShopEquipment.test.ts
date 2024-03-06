import { MOD_TYPE } from "../Mods/ModsTypes";
import { STAT } from "../Stats/StatsTypes";
import { Weapons } from "../data";
import { ShopEquipment } from "./ShopEquipment";

describe("ShopEquipment", () => {
	describe("applicableMods", () => {
		it("should return applicablePerkMods correctly", () => {
			const equip = new ShopEquipment(Weapons.Shortbow, 2);
			const mods = equip.getAllApplicablePerkMods();

			expect(mods.length).toBe(1);
		});

		it("should return applicableStatMods correctly", () => {
			const equip = new ShopEquipment(Weapons.Shortbow, 2);
			const mods = equip.getAllApplicableStatMods();

			expect(mods.length).toBe(4);
		});

		it("should return all applicableMods correctly", () => {
			const equip = new ShopEquipment(Weapons.Shortbow, 5);
			const mods = equip.applicableMods;

			expect(mods.length).toBe(5);
			expect(mods).toStrictEqual([
				...equip.getAllApplicablePerkMods(),
				...equip.getAllApplicableStatMods(),
			]);
		});
	});

	describe("rollTieredMods", () => {
		it("should roll unique mods with the correct tier limit and only one at item tier", () => {
			function hasDuplicateMod(rolledMods: any[]) {
				const nameSet = new Set();
				for (const mod of rolledMods) {
					if (nameSet.has(mod.mod.payload.name)) return true;
					nameSet.add(mod.mod.payload.name);
				}
				return false;
			}

			for (let tier = 1; tier < 6; tier++) {
				const equip = new ShopEquipment(Weapons.Shortbow, tier);
				const rolledMods = equip.rollTieredMods();

				expect(hasDuplicateMod(rolledMods)).toBe(false);

				const totalModTiers = rolledMods.reduce((acc, mod) => acc + mod.tier, 0);
				expect(totalModTiers).toBe(tier * 2 - 1);

				expect(rolledMods[0].tier).toBe(tier);
			}
		});
	});

	describe("rolledMods", () => {
		it("should roll valid PossibleMods", () => {
			for (let tier = 1; tier < 6; tier++) {
				const equip = new ShopEquipment(Weapons.Shortbow, tier);

				equip.rolledMods.forEach(mod => {
					expect([MOD_TYPE.GRANT_PERK, MOD_TYPE.GRANT_BASE_STAT]).toContain(mod.type);

					if (mod.type == MOD_TYPE.GRANT_PERK) {
						expect(mod.payload.name).toBeTypeOf("string");
						expect(mod.payload.tier).toBeTypeOf("number");
					} else if (mod.type == MOD_TYPE.GRANT_BASE_STAT) {
						expect([
							STAT.ATTACK_COOLDOWN,
							STAT.ATTACK_DAMAGE,
							STAT.DAMAGE_REDUCTION,
							STAT.SPELL_COOLDOWN,
							STAT.SPELL_DAMAGE,
						]).toContain(mod.payload.stat);
						expect(mod.payload.value).toBeTypeOf("number");
					}
				});
			}
		});
	});
});
