import { OWNER, POSITION } from "../BoardManager";
import { MOD_TYPE } from "../Mods/ModsTypes";
import { STAT } from "../Stats/StatsTypes";
import { Unit } from "../Unit/Unit";
import { Weapons } from "../data";
import { Equipment } from "./Equipment";
import { EquipmentManager } from "./EquipmentManager";
import { EQUIPMENT_SLOT } from "./EquipmentTypes";
import { ShopEquipment } from "./ShopEquipment";

describe("Equipment", () => {
	describe("equip", () => {
		it("should equip correctly", () => {
			const equipManager = new EquipmentManager();

			const equip = new Equipment(Weapons.Shortbow);
			const slot = EQUIPMENT_SLOT.MAIN_HAND;

			equipManager.equip(equip, slot);

			expect(equipManager.equips[0]).toStrictEqual({ slot, equip });
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
		});

		it("should not be able to equip TWO_HANDS if equipped with MAIN_HAND and vice versa", () => {
			const equipManager = new EquipmentManager();

			const equipMainHand = new Equipment(Weapons.Shortbow);
			const equipTwoHands = new Equipment(Weapons.Longbow);

			equipManager.equip(equipMainHand, EQUIPMENT_SLOT.MAIN_HAND);

			expect(equipManager.isSlotOccupied(EQUIPMENT_SLOT.TWO_HANDS)).toBeTruthy();
			expect(() => equipManager.equip(equipTwoHands, EQUIPMENT_SLOT.TWO_HANDS)).toThrowError(
				"EquipmentManager: ALREADY EQUIPPED THIS SLOT MAN: " +
					EQUIPMENT_SLOT.TWO_HANDS +
					" " +
					equipTwoHands.data.name,
			);

			equipManager.unequip(EQUIPMENT_SLOT.MAIN_HAND);
			equipManager.equip(equipTwoHands, EQUIPMENT_SLOT.TWO_HANDS);

			expect(equipManager.isSlotOccupied(EQUIPMENT_SLOT.MAIN_HAND)).toBeTruthy();
			expect(() => equipManager.equip(equipMainHand, EQUIPMENT_SLOT.MAIN_HAND)).toThrowError(
				"EquipmentManager: ALREADY EQUIPPED THIS SLOT MAN: " +
					EQUIPMENT_SLOT.MAIN_HAND +
					" " +
					equipMainHand.data.name,
			);
		});
	});

	describe("unequip", () => {
		it("should unequip correctly", () => {
			const equipManager = new EquipmentManager();

			const equip = new Equipment(Weapons.Shortbow);
			const slot = EQUIPMENT_SLOT.MAIN_HAND;

			equipManager.equip(equip, slot);

			expect(equipManager.equips[0]).toStrictEqual({ slot, equip });

			equipManager.unequip(slot);

			expect(equipManager.equips).toStrictEqual([]);
		});

		it("should not be able to unequip empty slot", () => {
			const equipManager = new EquipmentManager();

			const slot = EQUIPMENT_SLOT.MAIN_HAND;

			expect(() => equipManager.unequip(slot)).toThrowError(
				"EquipmentManager: NO EQUIP IN THIS SLOT MAN " + slot,
			);
		});

		it("should unequip MAIN_HAND / OFF_HAND if unequipping TWO_HANDS and vice versa", () => {
			const equipManager = new EquipmentManager();

			const equipOneHand = new Equipment(Weapons.Sword);
			const equipTwoHands = new Equipment(Weapons.Longbow);

			equipManager.equip(equipOneHand, EQUIPMENT_SLOT.MAIN_HAND);
			equipManager.equip(equipOneHand, EQUIPMENT_SLOT.OFF_HAND);

			expect(equipManager.unequip(EQUIPMENT_SLOT.TWO_HANDS)).toStrictEqual([
				{ equip: equipOneHand, slot: EQUIPMENT_SLOT.MAIN_HAND },
				{ equip: equipOneHand, slot: EQUIPMENT_SLOT.OFF_HAND },
			]);

			equipManager.equip(equipTwoHands, EQUIPMENT_SLOT.TWO_HANDS);

			expect(equipManager.unequip(EQUIPMENT_SLOT.MAIN_HAND)).toStrictEqual([
				{ equip: equipTwoHands, slot: EQUIPMENT_SLOT.TWO_HANDS },
			]);
		});
	});
});