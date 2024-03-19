import { BoardManager, OWNER, POSITION } from "../BoardManager";
import { Class } from "../Class/Class";
import { Equipment } from "../Equipment/Equipment";
import { EQUIPMENT_SLOT } from "../Equipment/EquipmentTypes";
import { EVENT_TYPE, INSTANT_EFFECT_TYPE, UseAbilityEvent } from "../Event/EventTypes";
import { sortAndExecuteEvents } from "../Event/EventUtils";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { TRIGGER_EFFECT_TYPE, TriggerEffect } from "../Trigger/TriggerTypes";
import { Unit } from "../Unit/Unit";
import { Abilities, Classes, Weapons } from "../data";
import { Ability } from "./Ability";

function setupBoard() {
	const bm = new BoardManager();
	const unit1 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
	const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
	const unit3 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_MID, bm);
	const unit4 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_BACK, bm);
	bm.addToBoard(unit1);
	bm.addToBoard(unit2);
	bm.addToBoard(unit3);
	bm.addToBoard(unit4);
	return { bm, unit1, unit2, unit3, unit4 };
}

describe("Ability", () => {
	describe("Events", () => {
		describe("USE_ABILITY Event", () => {
			it("should generate main event info", () => {
				const { unit1, unit2 } = setupBoard();

				const ability = new Ability(Abilities.Thrust);
				const event = ability.use(unit1);

				expect(event.actorId).toBe(unit1.id);
				expect(event.payload.name).toBe(ability.data.name);
				expect(event.payload.targetsId).toEqual([unit2.id]);
			});

			describe("DAMAGE subEvent", () => {
				it("should generate DAMAGE subEvent", () => {
					const { unit1, unit2 } = setupBoard();

					const ability = new Ability(Abilities.Thrust);
					const event = ability.use(unit1);

					const effects = ability.data.effects as TriggerEffect<TRIGGER_EFFECT_TYPE.DAMAGE>[];

					expect(event.payload.subEvents).toHaveLength(1);
					expect(event.payload.subEvents[0]).toEqual({
						type: "INSTANT_EFFECT",
						payload: {
							type: "DAMAGE",
							targetId: unit2.id,
							payload: { value: effects[0].payload.value },
						},
					});
				});

				it("should calculate correct damage if target has damage reduction modifier", () => {
					const { unit1, unit2 } = setupBoard();

					// receives damage reduction
					unit2.setClass(new Class(Classes.Blacksmith));

					const ability = new Ability(Abilities.Thrust);
					const event = ability.use(unit1);

					const effects = ability.data.effects as TriggerEffect<TRIGGER_EFFECT_TYPE.DAMAGE>[];

					const rawDamage = effects[0].payload.value;
					const finalDamage =
						rawDamage +
						(rawDamage * (unit1.stats.attackDamageModifier - unit2.stats.damageReductionModifier)) /
							100;

					expect(event.payload.subEvents).toHaveLength(1);
					expect(event.payload.subEvents[0]).toEqual({
						type: "INSTANT_EFFECT",
						payload: {
							type: "DAMAGE",
							targetId: unit2.id,
							payload: {
								value: finalDamage,
							},
						},
					});
				});

				it("should calculate correct damage if target has damage reduction modifier and attacker has attack damage modifier", () => {
					const { unit1, unit2 } = setupBoard();

					unit1.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);

					// receives damage reduction
					unit2.setClass(new Class(Classes.Blacksmith));

					const ability = new Ability(Abilities.Thrust);
					const event = ability.use(unit1);

					const effects = ability.data.effects as TriggerEffect<TRIGGER_EFFECT_TYPE.DAMAGE>[];

					const rawDamage = effects[0].payload.value;
					const finalDamage =
						rawDamage +
						(rawDamage * (unit1.stats.attackDamageModifier - unit2.stats.damageReductionModifier)) /
							100;

					expect(event.payload.subEvents).toHaveLength(1);
					expect(event.payload.subEvents[0]).toEqual({
						type: "INSTANT_EFFECT",
						payload: {
							type: "DAMAGE",
							targetId: unit2.id,
							payload: {
								value: finalDamage,
							},
						},
					});
				});
			});
		});

		describe("Disarming Shot (Apply VULNERABLE on hit)", () => {
			it("should generate STATUS_EFFECT subEvent", () => {
				const { unit1, unit2 } = setupBoard();

				const ability = new Ability(Abilities.DisarmingShot);
				const event = ability.use(unit1);

				expect(event.payload.subEvents).toHaveLength(2);

				const effectVulnerable = ability.data
					.effects[1] as TriggerEffect<TRIGGER_EFFECT_TYPE.STATUS_EFFECT>;

				expect(event.payload.subEvents[1]).toEqual({
					type: "INSTANT_EFFECT",
					payload: {
						type: "STATUS_EFFECT",
						targetId: unit2.id,
						payload: [
							{
								name: "VULNERABLE",
								quantity: effectVulnerable.payload[0].quantity,
							},
						],
					},
				});
			});
		});

		describe("Empowering Strike (Apply ATTACK_POWER on SELF and VULNERABLE on target)", () => {
			it("should generate STATUS_EFFECT subEvents correctly", () => {
				const { unit1, unit2 } = setupBoard();

				const ability = new Ability(Abilities.EmpoweringStrike);
				const event = ability.use(unit1);

				expect(event.payload.subEvents).toHaveLength(3);

				const effectDamage = ability.data.effects[0] as TriggerEffect<TRIGGER_EFFECT_TYPE.DAMAGE>;
				const effectAttackPower = ability.data
					.effects[1] as TriggerEffect<TRIGGER_EFFECT_TYPE.STATUS_EFFECT>;
				const effectVulnerable = ability.data
					.effects[2] as TriggerEffect<TRIGGER_EFFECT_TYPE.STATUS_EFFECT>;

				expect(event.payload.subEvents[0]).toEqual({
					type: "INSTANT_EFFECT",
					payload: {
						type: "DAMAGE",
						targetId: unit2.id,
						payload: {
							value: effectDamage.payload.value,
						},
					},
				});
				expect(event.payload.subEvents[1]).toEqual({
					type: "INSTANT_EFFECT",
					payload: {
						type: "STATUS_EFFECT",
						targetId: unit1.id,
						payload: [
							{
								name: "ATTACK_POWER",
								quantity: effectAttackPower.payload[0].quantity,
							},
						],
					},
				});
				expect(event.payload.subEvents[2]).toEqual({
					type: "INSTANT_EFFECT",
					payload: {
						type: "STATUS_EFFECT",
						targetId: unit2.id,
						payload: [
							{
								name: "VULNERABLE",
								quantity: effectVulnerable.payload[0].quantity,
							},
						],
					},
				});
			});

			it("should give more damage with each hit calculating ATTACK_POWER and VULNERABLE correctly", () => {
				const { unit1, unit2 } = setupBoard();
				const ability = new Ability(Abilities.EmpoweringStrike);

				const damageValue = (ability.data.effects[0] as TriggerEffect<TRIGGER_EFFECT_TYPE.DAMAGE>)
					.payload.value as number;
				const attackPowerQuantity = (
					ability.data.effects[1] as TriggerEffect<TRIGGER_EFFECT_TYPE.STATUS_EFFECT>
				).payload[0].quantity as number;
				const vulnerableQuantity = (
					ability.data.effects[2] as TriggerEffect<TRIGGER_EFFECT_TYPE.STATUS_EFFECT>
				).payload[0].quantity as number;

				expect(unit1.stats.attackDamageModifier).toBe(0);
				expect(unit2.stats.damageReductionModifier).toBe(0);
				expect(unit2.stats.hp).toBe(unit2.stats.maxHp);

				unit1.applyEvent(ability.use(unit1)); // 1st hit
				const hitDamage1 = damageValue;

				expect(unit1.stats.attackDamageModifier).toBe(attackPowerQuantity);
				expect(unit2.stats.damageReductionModifier).toBe(vulnerableQuantity * -1);
				expect(unit2.stats.hp).toBe(unit2.stats.maxHp - hitDamage1);

				unit1.applyEvent(ability.use(unit1)); // 2nd hit
				const hitDamage2 =
					damageValue +
					Math.round((damageValue * (attackPowerQuantity + vulnerableQuantity)) / 100);

				expect(unit1.stats.attackDamageModifier).toBe(attackPowerQuantity * 2);
				expect(unit2.stats.damageReductionModifier).toBe(vulnerableQuantity * 2 * -1);
				expect(unit2.stats.hp).toBe(unit2.stats.maxHp - hitDamage1 - hitDamage2);

				unit1.applyEvent(ability.use(unit1)); // 3rd hit
				const hitDamage3 =
					damageValue +
					Math.round((damageValue * (attackPowerQuantity * 2 + vulnerableQuantity * 2)) / 100);

				expect(unit1.stats.attackDamageModifier).toBe(attackPowerQuantity * 3);
				expect(unit2.stats.damageReductionModifier).toBe(vulnerableQuantity * 3 * -1);
				expect(unit2.stats.hp).toBe(unit2.stats.maxHp - hitDamage1 - hitDamage2 - hitDamage3);
			});
		});

		describe("Reinforce Allies (Apply SHIELD on ADJACENT_ALLIES on use)", () => {
			it("should generate SHIELD subEvent on multiple units", () => {
				const { unit1, unit3, unit4 } = setupBoard();

				const ability = new Ability(Abilities.ReinforceAllies);
				const event = ability.use(unit3);

				const effects = ability.data.effects as TriggerEffect<TRIGGER_EFFECT_TYPE.SHIELD>[];

				expect(event.actorId).toBe(unit3.id);
				expect(event.payload.name).toBe(ability.data.name);
				expect(event.payload.targetsId).toEqual([unit1.id, unit4.id]);
				expect(event.payload.subEvents[0]).toEqual({
					type: "INSTANT_EFFECT",
					payload: {
						type: "SHIELD",
						targetId: unit1.id,
						payload: {
							value: effects[0].payload.value,
						},
					},
				});
				expect(event.payload.subEvents[1].payload.targetId).toEqual(unit4.id);
				//expect(unit3.stats.shield).toBe(effects[0].payload.value);
			});
		});

		describe("Blessed Beacon (Apply HEAL and REGEN on ADJACENT_ALLIES on use)", () => {
			it("should generate HEAL and REGEN subEvents", () => {
				const { unit1, unit3 } = setupBoard();

				const ability = new Ability(Abilities.BlessedBeacon);
				const event = ability.use(unit1);

				const effectsStatusEffect = ability.data
					.effects as TriggerEffect<TRIGGER_EFFECT_TYPE.STATUS_EFFECT>[];
				const effectsHeal = ability.data.effects as TriggerEffect<TRIGGER_EFFECT_TYPE.HEAL>[];

				expect(event.actorId).toBe(unit1.id);
				expect(event.payload.name).toBe(ability.data.name);
				expect(event.payload.targetsId).toEqual([unit3.id]);
				expect(event.payload.subEvents[0]).toEqual({
					type: "INSTANT_EFFECT",
					payload: {
						type: "STATUS_EFFECT",
						targetId: unit3.id,
						payload: [
							{
								name: "REGEN",
								quantity: effectsStatusEffect[0].payload[0].quantity,
							},
						],
					},
				});
				expect(event.payload.subEvents[1]).toEqual({
					type: "INSTANT_EFFECT",
					payload: {
						type: "HEAL",
						targetId: unit3.id,
						payload: {
							value: effectsHeal[1].payload.value,
						},
					},
				});
			});
		});

		describe("Phalanx Fury (Apply DAMAGE on STANDARD_ROW on hit)", () => {
			it("should generate DAMAGE subEvent on multiple units", () => {
				const { unit1, unit2, unit3, unit4 } = setupBoard();

				unit1.setClass(new Class(Classes.Blacksmith));

				const ability = new Ability(Abilities.PhalanxFury);
				const event = ability.use(unit2);

				const effects = ability.data.effects as TriggerEffect<TRIGGER_EFFECT_TYPE.DAMAGE>[];

				const rawDamage = effects[0].payload.value;
				const finalDamageUnit1 =
					rawDamage +
					(rawDamage * (unit2.stats.attackDamageModifier - unit1.stats.damageReductionModifier)) /
						100;

				expect(event.actorId).toBe(unit2.id);
				expect(event.payload.name).toBe(ability.data.name);
				expect(event.payload.targetsId).toEqual([unit1.id, unit3.id, unit4.id]);
				expect(event.payload.subEvents[0]).toEqual({
					type: "INSTANT_EFFECT",
					payload: {
						type: "DAMAGE",
						targetId: unit1.id,
						payload: {
							value: finalDamageUnit1,
						},
					},
				});
				expect(event.payload.subEvents[1]).toEqual({
					type: "INSTANT_EFFECT",
					payload: {
						type: "DAMAGE",
						targetId: unit3.id,
						payload: {
							value: rawDamage,
						},
					},
				});
				expect(event.payload.subEvents[2].payload.targetId).toEqual(unit4.id);
			});
		});

		describe("Arcane Studies (apply SPELL_POTENCY and FOCUS to SELF)", () => {
			it("should generate STATUS_EFFECT subEvents correctly", () => {
				const { unit1 } = setupBoard();

				const ability = new Ability(Abilities.ArcaneStudies);
				const event = ability.use(unit1);

				expect(event.payload.subEvents).toHaveLength(2);

				const effectSpellPotency = ability.data
					.effects[0] as TriggerEffect<TRIGGER_EFFECT_TYPE.STATUS_EFFECT>;
				const effectFocus = ability.data
					.effects[0] as TriggerEffect<TRIGGER_EFFECT_TYPE.STATUS_EFFECT>;

				expect(event.payload.subEvents[0]).toEqual({
					type: "INSTANT_EFFECT",
					payload: {
						type: "STATUS_EFFECT",
						targetId: unit1.id,
						payload: [
							{
								name: "SPELL_POTENCY",
								quantity: effectSpellPotency.payload[0].quantity,
							},
						],
					},
				});
				expect(event.payload.subEvents[1]).toEqual({
					type: "INSTANT_EFFECT",
					payload: {
						type: "STATUS_EFFECT",
						targetId: unit1.id,
						payload: [
							{
								name: "FOCUS",
								quantity: effectFocus.payload[0].quantity,
							},
						],
					},
				});
			});

			it("should give more damage using spell if has SPELL_POTENCY and also receive FOCUS buff", () => {
				const { unit1, unit2 } = setupBoard();

				const arcaneStudies = new Ability(Abilities.ArcaneStudies);
				const darkBolt = new Ability(Abilities.DarkBolt);

				const spellPotencyQuantity = (
					arcaneStudies.data.effects[0] as TriggerEffect<TRIGGER_EFFECT_TYPE.STATUS_EFFECT>
				).payload[0].quantity as number;
				const focusQuantity = (
					arcaneStudies.data.effects[0] as TriggerEffect<TRIGGER_EFFECT_TYPE.STATUS_EFFECT>
				).payload[0].quantity as number;
				const damageValue = (darkBolt.data.effects[0] as TriggerEffect<TRIGGER_EFFECT_TYPE.DAMAGE>)
					.payload.value as number;

				expect(unit1.stats.spellCooldownModifier).toBe(0);
				expect(unit1.stats.spellDamageModifier).toBe(0);
				expect(unit2.stats.hp).toBe(unit2.stats.maxHp);

				unit1.applyEvent(darkBolt.use(unit1));
				const hitDamage1 = damageValue;
				expect(unit2.stats.hp).toBe(unit2.stats.maxHp - hitDamage1);

				unit1.applyEvent(arcaneStudies.use(unit1));
				expect(unit1.stats.spellCooldownModifier).toBe(focusQuantity);
				expect(unit1.stats.spellDamageModifier).toBe(spellPotencyQuantity);

				unit1.applyEvent(darkBolt.use(unit1));
				const hitDamage2 = damageValue + Math.round((damageValue * spellPotencyQuantity) / 100);
				expect(unit2.stats.hp).toBe(unit2.stats.maxHp - hitDamage1 - hitDamage2);

				unit1.applyEvent(arcaneStudies.use(unit1));
				expect(unit1.stats.spellCooldownModifier).toBe(focusQuantity * 2);
				expect(unit1.stats.spellDamageModifier).toBe(spellPotencyQuantity * 2);

				unit1.applyEvent(darkBolt.use(unit1));
				const hitDamage3 = damageValue + Math.round((damageValue * spellPotencyQuantity * 2) / 100);
				expect(unit2.stats.hp).toBe(unit2.stats.maxHp - hitDamage1 - hitDamage2 - hitDamage3);

				unit1.applyEvent(arcaneStudies.use(unit1));
				expect(unit1.stats.spellCooldownModifier).toBe(focusQuantity * 3);
				expect(unit1.stats.spellDamageModifier).toBe(spellPotencyQuantity * 3);
			});
		});

		describe("Summon Crab (apply STURDY and THORN to ADJACENT_ALLIES)", () => {
			it("should generate STATUS_EFFECT subEvents correctly for multiple units", () => {
				const { unit1, unit3, unit4 } = setupBoard();

				const ability = new Ability(Abilities.SummonCrab);
				const event = ability.use(unit3);

				expect(event.payload.subEvents).toHaveLength(2);

				const effectSturdy = (
					ability.data.effects[0] as TriggerEffect<TRIGGER_EFFECT_TYPE.STATUS_EFFECT>
				).payload[0];
				const effectThorn = (
					ability.data.effects[0] as TriggerEffect<TRIGGER_EFFECT_TYPE.STATUS_EFFECT>
				).payload[1];

				expect(event.payload.subEvents[0]).toEqual({
					type: "INSTANT_EFFECT",
					payload: {
						type: "STATUS_EFFECT",
						targetId: unit1.id,
						payload: [
							{
								name: "STURDY",
								quantity: effectSturdy.quantity,
							},
							{
								name: "THORN",
								quantity: effectThorn.quantity,
							},
						],
					},
				});
				expect(event.payload.subEvents[1]).toEqual({
					type: "INSTANT_EFFECT",
					payload: {
						type: "STATUS_EFFECT",
						targetId: unit4.id,
						payload: [
							{
								name: "STURDY",
								quantity: effectSturdy.quantity,
							},
							{
								name: "THORN",
								quantity: effectThorn.quantity,
							},
						],
					},
				});
			});
		});

		it("should receive less damage and return damage when attacked if has STURDY and THORN", () => {
			const { unit1, unit2, unit3 } = setupBoard();

			const summonCrab = new Ability(Abilities.SummonCrab);
			const thrust = new Ability(Abilities.Thrust);

			const effectSturdyQuantity = (
				summonCrab.data.effects[0] as TriggerEffect<TRIGGER_EFFECT_TYPE.STATUS_EFFECT>
			).payload[0].quantity as number;
			const effectThornQuantity = (
				summonCrab.data.effects[0] as TriggerEffect<TRIGGER_EFFECT_TYPE.STATUS_EFFECT>
			).payload[1].quantity as number;
			const damageValue = (thrust.data.effects[0] as TriggerEffect<TRIGGER_EFFECT_TYPE.DAMAGE>)
				.payload.value as number;

			expect(unit1.stats.damageReductionModifier).toBe(0);
			expect(unit1.stats.hp).toBe(unit2.stats.maxHp);
			expect(unit2.stats.hp).toBe(unit2.stats.maxHp);

			unit2.applyEvent(thrust.use(unit2));
			const hitDamage1 = damageValue;
			expect(unit1.stats.hp).toBe(unit1.stats.maxHp - hitDamage1);
			expect(unit2.stats.hp).toBe(unit2.stats.maxHp);

			unit3.applyEvent(summonCrab.use(unit3));
			expect(unit1.stats.damageReductionModifier).toBe(effectSturdyQuantity);

			unit2.applyEvent(thrust.use(unit2));
			const hitDamage2 = damageValue - Math.round((damageValue * effectSturdyQuantity) / 100);
			expect(unit1.stats.hp).toBe(unit1.stats.maxHp - hitDamage1 - hitDamage2);
			expect(unit2.stats.hp).toBe(unit2.stats.maxHp - effectThornQuantity);

			unit3.applyEvent(summonCrab.use(unit3));
			expect(unit1.stats.damageReductionModifier).toBe(effectSturdyQuantity * 2);

			unit2.applyEvent(thrust.use(unit2));
			const hitDamage3 = damageValue - Math.round((damageValue * effectSturdyQuantity * 2) / 100);
			expect(unit1.stats.hp).toBe(unit1.stats.maxHp - hitDamage1 - hitDamage2 - hitDamage3);
			expect(unit2.stats.hp).toBe(
				unit2.stats.maxHp - effectThornQuantity - effectThornQuantity * 2,
			);

			unit3.applyEvent(summonCrab.use(unit3));
			expect(unit1.stats.damageReductionModifier).toBe(effectSturdyQuantity * 3);
		});
	});

	describe("Careful Preparation (apply MULTISTRIKE to SELF)", () => {
		it("should generate STATUS_EFFECT subEvent correctly", () => {
			const { unit1 } = setupBoard();

			const ability = new Ability(Abilities.CarefulPreparation);
			const event = ability.use(unit1);

			expect(event.payload.subEvents).toHaveLength(1);

			const effectMultistrike = (
				ability.data.effects[0] as TriggerEffect<TRIGGER_EFFECT_TYPE.STATUS_EFFECT>
			).payload[0];

			expect(event.payload.subEvents[0]).toEqual({
				type: "INSTANT_EFFECT",
				payload: {
					type: "STATUS_EFFECT",
					targetId: unit1.id,
					payload: [
						{
							name: "MULTISTRIKE",
							quantity: effectMultistrike.quantity,
						},
					],
				},
			});
		});

		it("should cast next ability extra times for the number of MULTISTRIKE stacks and then remove all stacks", () => {
			const bm = new BoardManager();
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
			unit.equip(new Equipment(Weapons.Shortbow), EQUIPMENT_SLOT.MAIN_HAND);
			bm.addToBoard(unit);
			const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
			bm.addToBoard(unit2);

			const ability = new Ability(Abilities.CarefulPreparation);
			const event = ability.use(unit);

			const multistrikeQuantity = (
				ability.data.effects[0] as TriggerEffect<TRIGGER_EFFECT_TYPE.STATUS_EFFECT>
			).payload[0].quantity as number;

			sortAndExecuteEvents(bm, [event]);

			expect(unit.statusEffects[0].name).toBe(STATUS_EFFECT.MULTISTRIKE);
			expect(unit.statusEffects[0].quantity).toBe(multistrikeQuantity);

			for (let i = 0; i < unit.abilities[0].cooldown; i++) unit.step(i);

			expect(unit.stepEvents.length).toBe(multistrikeQuantity + 1);
			expect(unit.stepEvents[0].type).toBe(EVENT_TYPE.USE_ABILITY);
			expect((unit.stepEvents[0] as UseAbilityEvent).payload.name).toBe(
				unit.abilities[0].data.name,
			);
			for (let i = 1; i <= multistrikeQuantity; i++) {
				expect(unit.stepEvents[0]).toStrictEqual(unit.stepEvents[i]);
			}

			sortAndExecuteEvents(bm, unit.stepEvents);

			expect(unit.statusEffectManager.hasStatusEffect(STATUS_EFFECT.MULTISTRIKE)).toBeFalsy();
		});
	});

	describe("Summon Boar (STUN)", () => {
		it("should generate STUN subEvent correctly", () => {
			const { unit1, unit2 } = setupBoard();

			const ability = new Ability(Abilities.SummonBoar);
			const event = ability.use(unit1);

			expect(event.payload.subEvents).toHaveLength(2);
			expect(event.payload.subEvents[0].payload.type).toBe(INSTANT_EFFECT_TYPE.DAMAGE);

			const durationStun = (ability.data.effects[1] as TriggerEffect<TRIGGER_EFFECT_TYPE.DISABLE>)
				.payload[0].duration;

			expect(event.payload.subEvents[1]).toEqual({
				type: "INSTANT_EFFECT",
				payload: {
					type: "DISABLE",
					targetId: unit2.id,
					payload: [
						{
							name: "STUN",
							duration: durationStun,
						},
					],
				},
			});
		});

		it("should not decrease ability cooldown while STUNNED", () => {
			const bm = new BoardManager();
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
			bm.addToBoard(unit);
			const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
			bm.addToBoard(unit2);

			unit.equip(new Equipment(Weapons.Shortbow), EQUIPMENT_SLOT.MAIN_HAND);

			expect(unit.abilities[0].progress).toBe(0);

			for (let i = 0; i < 10; i++) unit.step(i);

			expect(unit.abilities[0].progress).toBe(10);

			for (let i = 0; i < unit.abilities[0].cooldown - 10; i++) unit.step(i);

			expect(unit.stepEvents.length).toBe(1);
			expect(unit.stepEvents[0].type).toBe(EVENT_TYPE.USE_ABILITY);

			const ability = new Ability(Abilities.SummonBoar);
			const event = ability.use(unit2);

			sortAndExecuteEvents(bm, [event]);

			const durationStun = (ability.data.effects[1] as TriggerEffect<TRIGGER_EFFECT_TYPE.DISABLE>)
				.payload[0].duration;

			expect(unit.abilities[0].progress).toBe(0);

			for (let i = 0; i < durationStun; i++) unit.step(i);

			expect(unit.abilities[0].progress).toBe(0);
		});
	});
});
