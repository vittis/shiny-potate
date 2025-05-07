import { FILTER_TYPE } from "../Ability/AbilityTypes";
import { TAG } from "../Tag/TagTypes";
import { TARGET_TYPE } from "../Target/TargetTypes";
import { convertModTemplateToMod } from "./ModsUtils";
import { MOD, ModTemplate } from "./ModTypes";

describe("Mods", () => {
	describe.skip("utils functions", () => {
		// TODO: finish test
		/* it("convertModTemplateToMod", () => {
			const id = "1";
			const tier = 3;
			const statModTemplate: ModTemplate<MOD.STAT> = {
				minimumTier: 1,
				type: MOD.STAT,
				// TODO: replace with correct target
				targets: [TARGET_TYPE.SELF],
				conditions: [],
				payload: {
					stat: "COOLDOWN_MODIFIER",
					category: "PERCENTAGE",
					values: [
						{
							ref: "BASE",
							values: [-10, -20, -30, -40, -50],
						},
					],
					quantity: [
						{
							ref: "BASE",
							filters: [
								{
									type: FILTER_TYPE.ABILITY,
									payload: {
										tags: [TAG.SUPPORT],
										target: TARGET_TYPE.SELF,
									},
								},
							],
						},
					],
				},
			};

			expect(convertModTemplateToMod(statModTemplate, id, tier)).toBe(1);
		}); */
		/* it("should equip correctly", () => {
			const equipManager = new EquipmentManager();

			const equipment = new Equipment(Weapons.Shortbow);
			const slot = EQUIPMENT_SLOT.MAIN_HAND;

			equipManager.equip(equipment, slot);

			expect(equipManager.equipments[0]).toStrictEqual({ slot, equipment });
		});

		it("should not be able to equip on invalid slot", () => {
			const equipManager = new EquipmentManager();

			const equip = new Equipment(Weapons.Shortbow);
			const slot = EQUIPMENT_SLOT.TRINKET;

			expect(equipManager.canEquipOnSlot(equip, slot)).toBeFalsy();

			expect(() => equipManager.equip(equip, slot)).toThrowError(
				"EquipmentManager: CANT EQUIP ON THIS SLOT MAN: " + slot + " " + equip.data.name,
			);
		});

		it("should not be able to equip on already equipped slot", () => {
			const equipManager = new EquipmentManager();

			const equip1 = new Equipment(Weapons.Shortbow);
			const equip2 = new Equipment(Weapons.Sword);
			const slot = EQUIPMENT_SLOT.MAIN_HAND;

			expect(equipManager.canEquipOnSlot(equip1, slot)).toBeTruthy();
			expect(equipManager.canEquipOnSlot(equip2, slot)).toBeTruthy();

			equipManager.equip(equip1, slot);

			expect(() => equipManager.equip(equip2, slot)).toThrowError(
				"EquipmentManager: ALREADY EQUIPPED THIS SLOT MAN: " + slot + " " + equip2.data.name,
			);
		}); */
	});
});
