import data from "@/data";
import { BoardUnit } from "@/game/BoardUnit/BoardUnit";
import { Equipment } from "@/game/Equipment/Equipment";
import { EQUIPMENT_SLOT } from "@/game/Equipment/EquipmentTypes";
import { PackUnit } from "@/game/PackUnit/PackUnit";

vi.mock("@/data", async () => import("./__mocks__"));

describe("Equipment", () => {
	describe("Equip", () => {
		it("should equip correctly", () => {
			const unit = new BoardUnit(new PackUnit(data.Units.Lumberjack, 1));
			const equipment = new Equipment(data.Weapons.CeremonialMace, 1);
			const slot = EQUIPMENT_SLOT.MAIN_HAND;

			unit.equip(equipment, slot);

			expect(unit.equipment[0].slot).toStrictEqual(slot);
			expect(unit.equipment[0].equipment.id).toStrictEqual(equipment.id);
		});
		it("should not be able to equip on invalid slot", () => {
			const unit = new BoardUnit(new PackUnit(data.Units.Lumberjack, 1));
			const equipment = new Equipment(data.Weapons.CeremonialMace, 1);
			const slot = EQUIPMENT_SLOT.TRINKET;

			expect(unit.equipmentManager.canEquipOnSlot(equipment, slot)).toBeFalsy();

			expect(() => unit.equip(equipment, slot)).toThrowError(
				"EquipmentManager: equip - CANT EQUIP ON THIS SLOT MAN: " +
					slot +
					" " +
					equipment.data.name,
			);
		});
		it("should not be able to equip on already equipped slot", () => {
			const unit = new BoardUnit(new PackUnit(data.Units.Lumberjack, 1));
			const equip1 = new Equipment(data.Weapons.CeremonialMace, 1);
			const equip2 = new Equipment(data.Weapons.CeremonialMace, 1);
			const slot = EQUIPMENT_SLOT.MAIN_HAND;

			expect(unit.equipmentManager.canEquipOnSlot(equip1, slot)).toBeTruthy();
			expect(unit.equipmentManager.canEquipOnSlot(equip2, slot)).toBeTruthy();

			unit.equipmentManager.equip(equip1, slot);

			expect(() => unit.equipmentManager.equip(equip2, slot)).toThrowError(
				"EquipmentManager: equip - ALREADY EQUIPPED THIS SLOT MAN: " +
					slot +
					" " +
					equip2.data.name,
			);
		});
	});
	describe("Upgrade tier", () => {
		it("should change unit shield with stat mod as equip tier is upgraded", () => {
			/* 
				Equipment Shield Stat Mod Flat - [25, 60, 100, 150]
			*/

			const unit = new BoardUnit(new PackUnit(data.Units.Lumberjack, 1));
			const equipment = new Equipment(data.Weapons.CeremonialMace, 1);

			expect(unit.stats.shield).toBe(0);
			unit.equip(equipment, EQUIPMENT_SLOT.MAIN_HAND);
			expect(unit.stats.shield).toBe(25);
			unit.upgradeEquipmentTier(equipment.id);
			expect(unit.stats.shield).toBe(60);
			unit.upgradeEquipmentTier(equipment.id);
			expect(unit.stats.shield).toBe(100);
			unit.upgradeEquipmentTier(equipment.id);
			expect(unit.stats.shield).toBe(150);
		});
	});
});
