import data from "../../data";
import { BoardUnit } from "../BoardUnit/BoardUnit";
import { Equipment } from "../Equipment/Equipment";
import { EQUIPMENT_SLOT } from "../Equipment/EquipmentTypes";
import { INSTANT_EFFECT, MOD } from "../Mod/ModTypes";
import { PackUnit } from "../PackUnit/PackUnit";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { Ability } from "./Ability";

describe("Ability", () => {
	describe("Receive ability", () => {
		it("unit should receive ability linked to equipment", () => {
			const unit = new BoardUnit(new PackUnit(data.Units.Lumberjack, 1));
			const equipment = new Equipment(data.Weapons.CeremonialMace, 2);

			unit.equip(equipment, EQUIPMENT_SLOT.MAIN_HAND);

			expect(unit.abilities).toHaveLength(1);
			expect(unit.abilities[0].name).toBe(equipment.ability && equipment.ability.name);
			expect(unit.abilities[0].sourceId).toBe(equipment.id);
			expect(unit.abilities[0].isLinkedToSource).toBeTruthy();
		});
		it("unit should receive ability from gain ability mod on pack unit", () => {
			const packUnit = new PackUnit(data.Units.Lumberjack, 4);
			const unit = new BoardUnit(packUnit);

			expect(unit.abilities).toHaveLength(1);
			expect(unit.abilities[0].name).toBe(packUnit.getAbilities()[0].name);
			expect(unit.abilities[0].sourceId).toBe(packUnit.id);
			expect(unit.abilities[0].isLinkedToSource).toBeFalsy();
		});
		it("unit should receive ability from gain ability mod on pack unit when pack unit upgrades tier", () => {
			// Pack unit starts at tier 3 and ability is received on tier 4

			const packUnit = new PackUnit(data.Units.Lumberjack, 3);
			const unit = new BoardUnit(packUnit);

			expect(unit.abilities).toHaveLength(0);
			unit.upgradePackUnitTier();
			expect(unit.abilities).toHaveLength(1);
			expect(unit.abilities[0].name).toBe(packUnit.getAbilities()[0].name);
			expect(unit.abilities[0].sourceId).toBe(packUnit.id);
			expect(unit.abilities[0].isLinkedToSource).toBeFalsy();
		});
	});
	describe("Upgrade tier", () => {
		it("should change cooldown and effect value when ability is upgraded", () => {
			/* 
				Ability CD - [-, 60, 50, 40], Damage - [-, 30, 40, 50]
			*/

			const ability = new Ability(data.Abilities.RoundSwing, 2);

			expect(ability.cooldown).toBe(60);
			expect(ability.effects[0].payload[0].value).toBe(30);
			ability.upgradeTier();
			expect(ability.tier).toBe(3);
			expect(ability.cooldown).toBe(50);
			expect(ability.effects[0].payload[0].value).toBe(40);
			ability.upgradeTier();
			expect(ability.tier).toBe(4);
			expect(ability.cooldown).toBe(40);
			expect(ability.effects[0].payload[0].value).toBe(50);
		});
		it("should upgrade ability tier when equip with ability is upgraded", () => {
			const unit = new BoardUnit(new PackUnit(data.Units.Lumberjack, 1));
			const equipment = new Equipment(data.Weapons.CeremonialMace, 2);

			unit.equip(equipment, EQUIPMENT_SLOT.MAIN_HAND);

			expect(unit.abilities[0].sourceId).toBe(equipment.id);

			expect(unit.abilities[0].tier).toBe(equipment.tier); // Tier 2
			unit.upgradeEquipmentTier(equipment.id);
			expect(unit.abilities[0].tier).toBe(equipment.tier); // Tier 3
			unit.upgradeEquipmentTier(equipment.id);
			expect(unit.abilities[0].tier).toBe(equipment.tier); // Tier 4
		});
		it("should upgrade ability tier when pack unit with gain ability mod is upgraded", () => {
			const unit = new BoardUnit(new PackUnit(data.Units.FortuneTeller, 1));

			expect(unit.abilities[0].sourceId).toBe(unit.packUnit.id);

			expect(unit.abilities[0].tier).toBe(unit.packUnit.tier); // Tier 1
			unit.upgradePackUnitTier();
			expect(unit.abilities[0].tier).toBe(unit.packUnit.tier); // Tier 2
			unit.upgradePackUnitTier();
			expect(unit.abilities[0].tier).toBe(unit.packUnit.tier); // Tier 3
			unit.upgradePackUnitTier();
			expect(unit.abilities[0].tier).toBe(unit.packUnit.tier); // Tier 4
		});
	});
	describe("Receive tags from origin", () => {
		it("should receive tags from origin pack unit", () => {
			const unit = new BoardUnit(new PackUnit(data.Units.FortuneTeller, 1));

			const ability = unit.abilities[0];

			expect(ability.sourceId).toBe(unit.packUnit.id);

			expect(ability.tags).toEqual(expect.arrayContaining(unit.packUnit.tags));
		});
		it("should receive tags from origin equipment", () => {
			const unit = new BoardUnit(new PackUnit(data.Units.Lumberjack, 1));
			const equipment = new Equipment(data.Weapons.CeremonialMace, 2);

			unit.equip(equipment, EQUIPMENT_SLOT.MAIN_HAND);

			const ability = unit.abilities[0];

			expect(ability.sourceId).toBe(equipment.id);

			expect(ability.tags).toEqual(expect.arrayContaining(equipment.tags));
		});
	});
	describe("Receive stat mods", () => {
		it("should receive stat mods that apply and update currentEffects - damage", () => {
			/* 
				Pack unit has stat mod that gives +20% damage to Axe tag and equip has Axe tag
				Equipment ability should inherit the Axe tag from the equipment and apply the stat mod
				Ability damage should be 20% more, going from 20 to 24
				*same test as in Tags.test.ts
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
		it("should receive stat mods that apply and update currentEffects - status effect", () => {
			/* 
				Pack unit has ability that applies 1 HASTE and 1 SLOW
				Equipment has stat mod that gives +1 to HASTE
				Ability should receive stat mod, now applying 2 HASTE and 1 SLOW
			*/
			const unit = new BoardUnit(new PackUnit(data.Units.FortuneTeller, 1));
			const equipment = new Equipment(data.Trinkets.BootsOfHaste, 1);

			unit.equip(equipment, EQUIPMENT_SLOT.TRINKET);

			const ability = unit.abilities[0];

			expect(ability.sourceId).toBe(unit.packUnit.id);

			function findStatusEffect(effects: typeof ability.effects, status: STATUS_EFFECT) {
				return effects.find(
					effect =>
						effect.type === MOD.EFFECT &&
						effect.payload[0].effect === INSTANT_EFFECT.STATUS_EFFECT &&
						effect.payload[0].statusEffect === status,
				);
			}

			const slowEffect = findStatusEffect(ability.effects, STATUS_EFFECT.SLOW);
			const hasteEffect = findStatusEffect(ability.effects, STATUS_EFFECT.HASTE);
			const slowCurrentEffect = findStatusEffect(ability.currentEffects, STATUS_EFFECT.SLOW);
			const hasteCurrentEffect = findStatusEffect(ability.currentEffects, STATUS_EFFECT.HASTE);

			expect(slowEffect && slowEffect.payload[0].value).toEqual(1);
			expect(slowCurrentEffect && slowCurrentEffect.payload[0].value).toEqual(1);
			expect(hasteEffect && hasteEffect.payload[0].value).toEqual(1);
			expect(hasteCurrentEffect && hasteCurrentEffect.payload[0].value).toEqual(2);
		});
	});
});
