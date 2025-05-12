import data from "../../data";
import { BoardUnit } from "../BoardUnit/BoardUnit";
import { Equipment } from "../Equipment/Equipment";
import { EQUIPMENT_SLOT } from "../Equipment/EquipmentTypes";
import { PackUnit } from "../PackUnit/PackUnit";

describe("Tags", () => {
	describe("Receive stat mod with tag", () => {
		it("ability should receive stat mod if tag applies", () => {
			/* 
				Pack unit has stat mod that gives +20% damage to Axe tag and equip has Axe tag
				Equipment ability should inherit the Axe tag from the equipment and apply the stat mod
				Ability damage should be 20% more, going from 20 to 24
 			*/
			const unit = new BoardUnit(new PackUnit(data.Units.Lumberjack, 1));
			const equipment = new Equipment(data.Weapons.WoodcuttersAxe, 1);

			unit.equip(equipment, EQUIPMENT_SLOT.MAIN_HAND);

			const ability = unit.abilities[0];

			expect(ability.sourceId).toBe(equipment.id);
			expect(ability.tags).toEqual(expect.arrayContaining(equipment.tags));
			expect(ability.currentEffects[0].payload[0].value).toEqual(
				ability.effects[0].payload[0].value * 1.2, // 20 * 1.2 = 24
			);
		});
		it("ability should not receive stat mod if tag doesn't apply", () => {
			/* 
				Pack unit has stat mod that gives +20% damage to Axe tag and equip / ability doesn't have this tag
				Ability should not have the stat mod, it's damage should stay the same at 20
 			*/
			const unit = new BoardUnit(new PackUnit(data.Units.Lumberjack, 1));
			const equipment = new Equipment(data.Weapons.CeremonialMace, 1);

			unit.equip(equipment, EQUIPMENT_SLOT.MAIN_HAND);

			const ability = unit.abilities[0];

			expect(ability.sourceId).toBe(equipment.id);
			expect(ability.tags).toEqual(expect.arrayContaining(equipment.tags));
			expect(ability.currentEffects[0].payload[0].value).toEqual(
				ability.effects[0].payload[0].value, // 20 = 20
			);
		});
	});
});
