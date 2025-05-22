import data from "../../data";
import { BoardUnit } from "../BoardUnit/BoardUnit";
import { Equipment } from "../Equipment/Equipment";
import { EQUIPMENT_SLOT } from "../Equipment/EquipmentTypes";
import { PackUnit } from "../PackUnit/PackUnit";

describe("Trigger", () => {
	describe("Add trigger", () => {
		it("should add pack unit mod triggers to trigger manager", () => {
			/* 
				Pack unit has mod with trigger
 			*/
			const unit = new BoardUnit(new PackUnit(data.Units.FarmBoy, 1));

			expect(unit.triggerManager.triggerMods.length).toBe(1);

			const triggerMod = unit.triggerManager.triggerMods[0];

			expect(triggerMod.id).toBe(unit.packUnit.mods[0].id);
			expect(triggerMod.triggers.length).toBe(1);
			expect(triggerMod.triggers[0].trigger).toBe(unit.packUnit.mods[0].triggers[0].trigger);
		});
		it("should add abilities with triggers to trigger manager", () => {
			/* 
				Equip has ability with trigger
 			*/
			const unit = new BoardUnit(new PackUnit(data.Units.Lumberjack, 1));
			const equipment = new Equipment(data.Weapons.HeaterShield, 1);

			unit.equip(equipment, EQUIPMENT_SLOT.OFF_HAND);

			expect(unit.triggerManager.triggerAbilities.length).toBe(1);

			const triggerAbility = unit.triggerManager.triggerAbilities[0];

			expect(triggerAbility.id).toBe(equipment?.ability?.id);
		});
	});
	describe("Update on tier upgrade", () => {
		it("should update trigger when pack unit is upgraded", () => {
			const unit = new BoardUnit(new PackUnit(data.Units.FarmBoy, 1));

			expect(unit.triggerManager.triggerMods.length).toBe(1);

			expect(unit.triggerManager.triggerMods[0].id).toBe(unit.packUnit.mods[0].id);
			expect(unit.triggerManager.triggerMods[0].payload[0].value).toBe(1); // Tier 1 - 1

			unit.upgradePackUnitTier();

			expect(unit.triggerManager.triggerMods[0].id).toBe(unit.packUnit.mods[0].id);
			expect(unit.triggerManager.triggerMods[0].payload[0].value).toBe(2); // Tier 2 - 2
		});
		it("should update trigger when equipment is upgraded", () => {
			const unit = new BoardUnit(new PackUnit(data.Units.Lumberjack, 1));
			const equipment = new Equipment(data.Trinkets.BootsOfHaste, 1);

			unit.equip(equipment, EQUIPMENT_SLOT.TRINKET);

			expect(unit.triggerManager.triggerMods.length).toBeGreaterThan(0);

			expect(unit.triggerManager.triggerMods[0].id).toBe(equipment.mods[1].id);
			expect(unit.triggerManager.triggerMods[0].payload[0].value).toBe(1); // Tier 1 - 1

			unit.upgradeEquipmentTier(equipment.id);

			expect(unit.triggerManager.triggerMods[0].id).toBe(equipment.mods[1].id);
			expect(unit.triggerManager.triggerMods[0].payload[0].value).toBe(2); // Tier 2 - 2
		});
	});
	describe("Receive stat mods", () => {
		it("should receive stat mods that apply and update currentMods - haste", () => {
			/* 
					Equipment has stat mod that gives flat [1, 2, 3, 4] to haste
					Equipment has trigger effect mod that gives flat [1, 2, 3, 4] to haste
					Trigger should update currentMods with haste stat mods, adding both values
				*/
			const unit = new BoardUnit(new PackUnit(data.Units.FortuneTeller, 1));
			const equipment = new Equipment(data.Trinkets.BootsOfHaste, 1);

			unit.equip(equipment, EQUIPMENT_SLOT.TRINKET);

			expect(unit.triggerManager.triggerMods.length).toBeGreaterThan(0);

			expect(unit.statModifiers[0].modId).toBe(equipment.mods[0].id);
			expect(unit.triggerManager.triggerMods[1].id).toBe(equipment.mods[2].id);
			expect(unit.triggerManager.triggerCurrentMods[1].id).toBe(equipment.mods[2].id);

			expect(unit.statModifiers[0].value).toBe(1);
			expect(unit.triggerManager.triggerMods[1].payload[0].value).toBe(1);
			expect(unit.triggerManager.triggerCurrentMods[1].payload[0].value).toBe(2); // 1 + 1 = 2

			unit.upgradeEquipmentTier(equipment.id); // Tier 2

			expect(unit.statModifiers[0].value).toBe(2);
			expect(unit.triggerManager.triggerMods[1].payload[0].value).toBe(2);
			expect(unit.triggerManager.triggerCurrentMods[1].payload[0].value).toBe(4); // 2 + 2 = 4

			unit.upgradeEquipmentTier(equipment.id); // Tier 3

			expect(unit.statModifiers[0].value).toBe(3);
			expect(unit.triggerManager.triggerMods[1].payload[0].value).toBe(3);
			expect(unit.triggerManager.triggerCurrentMods[1].payload[0].value).toBe(6); // 3 + 3 = 6

			unit.upgradeEquipmentTier(equipment.id); // Tier 4

			expect(unit.statModifiers[0].value).toBe(4);
			expect(unit.triggerManager.triggerMods[1].payload[0].value).toBe(4);
			expect(unit.triggerManager.triggerCurrentMods[1].payload[0].value).toBe(8); // 4 + 4 = 8
		});
	});
});
