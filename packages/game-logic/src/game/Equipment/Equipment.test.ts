import { Equipment } from "./Equipment";
import { EquipmentManager } from "./EquipmentManager";
import { EQUIPMENT_SLOT } from "./EquipmentTypes";

describe("Equipment", () => {
	describe("equip", () => {
		/* TODO: mock weapon json to do tests
        
        it("should equip correctly", () => {
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
