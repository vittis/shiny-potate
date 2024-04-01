import { BoardManager, OWNER, POSITION } from "../BoardManager";
import { Class } from "../Class/Class";
import { DISABLE } from "../Disable/DisableTypes";
import { Equipment } from "../Equipment/Equipment";
import { EQUIPMENT_SLOT } from "../Equipment/EquipmentTypes";
import { Effect, INSTANT_EFFECT_TYPE } from "../Event/EventTypes";
import { executeStepEffects, getStepEffects } from "../Event/EventUtils";
import { MOD_TYPE } from "../Mods/ModsTypes";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { Weapons, Classes } from "../data";
import { Unit } from "./Unit";

describe("Unit", () => {
	describe("Equipment", () => {
		it("should equip", () => {
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

			unit.equip(new Equipment(Weapons.Shortbow), EQUIPMENT_SLOT.MAIN_HAND);

			expect(unit.equips).toHaveLength(1);

			expect(unit.equips[0].slot).toBe(EQUIPMENT_SLOT.MAIN_HAND);
			expect(unit.equips[0].equip).toBeInstanceOf(Equipment);
			expect(unit.equips[0].equip.data).toEqual(Weapons.Shortbow);
		});

		it("should equip in different slots", () => {
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

			unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);

			expect(unit.equips).toHaveLength(1);

			unit.equip(new Equipment(Weapons.Sword), EQUIPMENT_SLOT.OFF_HAND);
			expect(unit.equips).toHaveLength(2);
		});

		it("should unequip then equip", () => {
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

			unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);
			expect(unit.equips).toHaveLength(1);

			unit.unequip(EQUIPMENT_SLOT.MAIN_HAND);
			expect(unit.equips).toHaveLength(0);

			unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);
			expect(unit.equips).toHaveLength(1);
		});

		it("if equipping on occupied slot, should unequip old equip and equip new one", () => {
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

			const equip1 = new Equipment(Weapons.ShortSpear);
			const equip2 = new Equipment(Weapons.Sword);

			unit.equip(equip1, EQUIPMENT_SLOT.MAIN_HAND);
			expect(unit.equips).toHaveLength(1);
			expect(unit.equips[0].equip).toStrictEqual(equip1);

			unit.equip(equip2, EQUIPMENT_SLOT.MAIN_HAND);
			expect(unit.equips).toHaveLength(1);
			expect(unit.equips[0].equip).toStrictEqual(equip2);
		});

		it("should unequip MAIN_HAND and OFF_HAND weapons when equipping TWO_HANDS weapon", () => {
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

			const equipMainHand = new Equipment(Weapons.ShortSpear);
			const equipOffHand = new Equipment(Weapons.Sword);
			const equipTwoHands = new Equipment(Weapons.Longbow);

			unit.equip(equipMainHand, EQUIPMENT_SLOT.MAIN_HAND);
			unit.equip(equipOffHand, EQUIPMENT_SLOT.OFF_HAND);
			expect(unit.equips).toHaveLength(2);
			expect(unit.equips[0].slot).toStrictEqual(EQUIPMENT_SLOT.MAIN_HAND);
			expect(unit.equips[1].slot).toStrictEqual(EQUIPMENT_SLOT.OFF_HAND);

			unit.equip(equipTwoHands, EQUIPMENT_SLOT.TWO_HANDS);
			expect(unit.equips).toHaveLength(1);
			expect(unit.equips[0].slot).toStrictEqual(EQUIPMENT_SLOT.TWO_HANDS);
		});
	});

	describe("Abilities", () => {
		it("class should give ability", () => {
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

			unit.setClass(new Class(Classes.Ranger));

			expect(unit.abilities).toHaveLength(1);
		});

		it("equipping a weapon should give an ability", () => {
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

			unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);

			expect(unit.equips[0].slot).toBe(EQUIPMENT_SLOT.MAIN_HAND);
			expect(unit.abilities).toHaveLength(1);
		});

		it("unequipping a weapon should remove its ability", () => {
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

			expect(unit.abilities).toHaveLength(0);

			unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);

			expect(unit.abilities).toHaveLength(1);
		});

		it("equipping two weapons should give two abilities", () => {
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

			unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);
			unit.equip(new Equipment(Weapons.Sword), EQUIPMENT_SLOT.OFF_HAND);

			expect(unit.abilities).toHaveLength(2);
		});

		it("throws error when invalid target", () => {
			const bm = new BoardManager();
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);

			unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);

			const ability = unit.abilities[0];

			try {
				for (let i = 0; i < ability.data.cooldown; i++) {
					unit.step(i);
				}
			} catch (e: any) {
				expect(e.message).toBeDefined();
				return;
			}

			expect(true).toBe(false);
		});

		it("uses Short Spear ability: Thrust", () => {
			const bm = new BoardManager();
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
			const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.BOT_MID, bm);
			bm.addToBoard(unit);
			bm.addToBoard(unit2);

			unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);

			const ability = unit.abilities[0];
			expect(ability.data.name).toBe("Thrust");

			for (let i = 0; i < ability.data.cooldown; i++) {
				unit.step(i);
			}

			executeStepEffects(bm, getStepEffects(unit.serializeEvents()));

			expect(ability.progress).toBe(0);
			expect(unit2.stats.hp).not.toBe(unit2.stats.maxHp);
		});

		it("uses Sword ability: Slash", () => {
			const bm = new BoardManager();
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
			const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
			bm.addToBoard(unit);
			bm.addToBoard(unit2);

			unit.equip(new Equipment(Weapons.Sword), EQUIPMENT_SLOT.MAIN_HAND);

			const ability = unit.abilities[0];
			expect(ability.data.name).toBe("Slash");

			for (let i = 0; i < ability.data.cooldown; i++) {
				unit.step(i);
			}

			expect(ability.progress).toBe(0);
			executeStepEffects(bm, getStepEffects(unit.serializeEvents()));

			expect(unit2.stats.hp).not.toBe(unit2.stats.maxHp);
		});
	});

	describe("Stats", () => {
		it("equipping weapon grants stats", () => {
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

			unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);
			expect(unit.statsFromMods.attackDamageModifier).toBe(10);
		});

		it("unequipping weapon removes stats", () => {
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

			expect(unit.statsFromMods.attackDamageModifier).toBe(0);

			unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);
			expect(unit.statsFromMods.attackDamageModifier).toBe(10);

			unit.unequip(EQUIPMENT_SLOT.MAIN_HAND);
			expect(unit.statsFromMods.attackDamageModifier).toBe(0);
		});

		it("if equipping new weapon on occupied slot, should remove stats from old weapon and add stats from new one", () => {
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

			expect(unit.statsFromMods.attackDamageModifier).toBe(0);
			expect(unit.statsFromMods.spellDamageModifier).toBe(0);

			const equip1 = new Equipment(Weapons.ShortSpear);
			const equip2 = new Equipment(Weapons.Wand);

			unit.equip(equip1, EQUIPMENT_SLOT.MAIN_HAND);

			expect(unit.statsFromMods.attackDamageModifier).toBe(10);
			expect(unit.statsFromMods.spellDamageModifier).toBe(0);

			unit.equip(equip2, EQUIPMENT_SLOT.MAIN_HAND);

			expect(unit.statsFromMods.attackDamageModifier).toBe(0);
			expect(unit.statsFromMods.spellDamageModifier).toBe(5);
		});

		it("equipping two items should accumulate stat", () => {
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

			expect(unit.statsFromMods.attackDamageModifier).toBe(0);

			const equip1 = new Equipment(Weapons.ShortSpear);
			const equip2 = new Equipment(Weapons.Sword);

			unit.equip(equip1, EQUIPMENT_SLOT.MAIN_HAND);
			expect(unit.statsFromMods.attackDamageModifier).toBe(10);

			unit.equip(equip2, EQUIPMENT_SLOT.OFF_HAND);
			expect(unit.statsFromMods.attackDamageModifier).toBe(10 + 5);
		});

		it("class should grant stats", () => {
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

			unit.setClass(new Class(Classes.Ranger));
			expect(unit.stats.attackCooldownModifier).toBe(7);
			expect(unit.stats.attackDamageModifier).toBe(7);
		});
	});

	describe("Perks", () => {
		it("equipping a weapon should give a perk", () => {
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

			unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);

			expect(unit.perks).toHaveLength(1);
		});

		it("unequipping a weapon should remove its perk", () => {
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

			unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);

			expect(unit.perks).toHaveLength(1);

			unit.unequip(EQUIPMENT_SLOT.MAIN_HAND);

			expect(unit.perks).toHaveLength(0);
		});

		it("if equipping new weapon on occupied slot, should remove perks from old weapon and add perks from new one", () => {
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

			expect(unit.perks).toStrictEqual([]);

			const equip1 = new Equipment(Weapons.ShortSpear);
			const equip2 = new Equipment(Weapons.Sword);

			unit.equip(equip1, EQUIPMENT_SLOT.MAIN_HAND);

			expect(unit.perks.map(perk => ({ name: perk.data.name, tier: perk.tier }))).toStrictEqual(
				equip1.data.mods
					.filter(mod => mod.type === MOD_TYPE.GRANT_PERK)
					.map(perkMod => perkMod.payload),
			);

			unit.equip(equip2, EQUIPMENT_SLOT.MAIN_HAND);

			expect(unit.perks.map(perk => ({ name: perk.data.name, tier: perk.tier }))).toStrictEqual(
				equip2.data.mods
					.filter(mod => mod.type === MOD_TYPE.GRANT_PERK)
					.map(perkMod => perkMod.payload),
			);
		});
	});

	describe("applyEffect", () => {
		it("apply DAMAGE effect", () => {
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

			const effectDamage = {
				type: INSTANT_EFFECT_TYPE.DAMAGE,
				payload: {
					value: 10,
				},
			} as Effect<INSTANT_EFFECT_TYPE.DAMAGE>;

			unit.applyEffect(effectDamage);

			expect(unit.stats.hp).toBe(unit.stats.maxHp - effectDamage.payload.value);
		});

		it("apply HEAL effect", () => {
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

			const effectDamage = {
				type: INSTANT_EFFECT_TYPE.DAMAGE,
				payload: {
					value: 10,
				},
			} as Effect<INSTANT_EFFECT_TYPE.DAMAGE>;

			const effectHeal = {
				type: INSTANT_EFFECT_TYPE.HEAL,
				payload: {
					value: 10,
				},
			} as Effect<INSTANT_EFFECT_TYPE.HEAL>;

			unit.applyEffect(effectDamage);
			unit.applyEffect(effectHeal);

			expect(unit.stats.hp).toBe(unit.stats.maxHp);
		});

		it("apply SHIELD effect", () => {
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

			const effectShield = {
				type: INSTANT_EFFECT_TYPE.SHIELD,
				payload: {
					value: 10,
				},
			} as Effect<INSTANT_EFFECT_TYPE.SHIELD>;

			unit.applyEffect(effectShield);

			expect(unit.stats.shield).toBe(effectShield.payload.value);
		});

		it("apply STATUS_EFFECT effect", () => {
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

			const effectStatusEffect = {
				type: INSTANT_EFFECT_TYPE.STATUS_EFFECT,
				payload: [
					{
						name: STATUS_EFFECT.FAST,
						quantity: 10,
					},
					{
						name: STATUS_EFFECT.ATTACK_POWER,
						quantity: 10,
					},
				],
			} as Effect<INSTANT_EFFECT_TYPE.STATUS_EFFECT>;

			unit.applyEffect(effectStatusEffect);

			expect(unit.statusEffects).toEqual(effectStatusEffect.payload);
		});

		it("apply DISABLE effect", () => {
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);

			const effectDisable = {
				type: INSTANT_EFFECT_TYPE.DISABLE,
				payload: [
					{
						name: DISABLE.STUN,
						duration: 10,
					},
				],
			} as Effect<INSTANT_EFFECT_TYPE.DISABLE>;

			unit.applyEffect(effectDisable);

			expect(unit.disables).toEqual(effectDisable.payload);
		});
	});
});
