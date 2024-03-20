import { Ability } from "../Ability/Ability";
import { BoardManager, OWNER, POSITION } from "../BoardManager";
import { Equipment } from "../Equipment/Equipment";
import { EQUIPMENT_SLOT } from "../Equipment/EquipmentTypes";
import { EVENT_TYPE, INSTANT_EFFECT_TYPE, SubEvent, TickEffectEvent } from "../Event/EventTypes";
import { sortAndExecuteEvents } from "../Event/EventUtils";
import { Unit } from "../Unit/Unit";
import { useAbility } from "../_tests_/testsUtils";
import { Abilities, Weapons } from "../data";
import { StatusEffectManager, TICK_COOLDOWN } from "./StatusEffectManager";
import { STATUS_EFFECT } from "./StatusEffectTypes";

describe("StatusEffect", () => {
	describe("StatusEffectManager", () => {
		it("applies status effect", () => {
			const manager = new StatusEffectManager();

			manager.applyStatusEffect({
				name: STATUS_EFFECT.ATTACK_POWER,
				quantity: 10,
			});

			expect(manager.activeStatusEffects).toEqual([
				{
					name: STATUS_EFFECT.ATTACK_POWER,
					quantity: 10,
				},
			]);
		});

		it("applies multiple status effect", () => {
			const manager = new StatusEffectManager();

			manager.applyStatusEffect({
				name: STATUS_EFFECT.ATTACK_POWER,
				quantity: 10,
			});

			manager.applyStatusEffect({
				name: STATUS_EFFECT.SPELL_POTENCY,
				quantity: 10,
			});

			expect(manager.activeStatusEffects).toEqual([
				{
					name: STATUS_EFFECT.ATTACK_POWER,
					quantity: 10,
				},
				{
					name: STATUS_EFFECT.SPELL_POTENCY,
					quantity: 10,
				},
			]);
		});

		it("applying same status effect adds to quantity", () => {
			const manager = new StatusEffectManager();

			manager.applyStatusEffect({
				name: STATUS_EFFECT.ATTACK_POWER,
				quantity: 10,
			});

			manager.applyStatusEffect({
				name: STATUS_EFFECT.ATTACK_POWER,
				quantity: 20,
			});

			expect(manager.activeStatusEffects).toEqual([
				{
					name: STATUS_EFFECT.ATTACK_POWER,
					quantity: 30,
				},
			]);
		});

		it("removes one stack", () => {
			const manager = new StatusEffectManager();

			manager.applyStatusEffect({
				name: STATUS_EFFECT.ATTACK_POWER,
				quantity: 2,
			});

			manager.removeStacks(STATUS_EFFECT.ATTACK_POWER, 1);

			expect(manager.activeStatusEffects).toEqual([
				{
					name: STATUS_EFFECT.ATTACK_POWER,
					quantity: 1,
				},
			]);

			manager.removeStacks(STATUS_EFFECT.ATTACK_POWER, 1);

			expect(manager.activeStatusEffects).toEqual([]);
		});

		it("removes all stacks", () => {
			const manager = new StatusEffectManager();

			manager.applyStatusEffect({
				name: STATUS_EFFECT.ATTACK_POWER,
				quantity: 10,
			});

			manager.removeAllStacks(STATUS_EFFECT.ATTACK_POWER);

			expect(manager.activeStatusEffects).toEqual([]);
		});
	});

	describe("VULNERABLE (Shortbow)", () => {
		it("should apply VULNERABLE status effect on hit", () => {
			const bm = new BoardManager();
			const unit1 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
			unit1.equip(new Equipment(Weapons.Shortbow), EQUIPMENT_SLOT.MAIN_HAND);
			bm.addToBoard(unit1);

			const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
			bm.addToBoard(unit2);

			useAbility(unit1);
			sortAndExecuteEvents(bm, unit1.serializeEvents());

			expect(unit2.statusEffects).toEqual([
				{
					name: STATUS_EFFECT.VULNERABLE,
					quantity: 15,
				},
			]);
		});

		it("should modify damageReductionModifier when with VULNERABLE", () => {
			const bm = new BoardManager();
			const unit1 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
			unit1.equip(new Equipment(Weapons.Shortbow), EQUIPMENT_SLOT.MAIN_HAND);
			bm.addToBoard(unit1);

			const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
			bm.addToBoard(unit2);

			useAbility(unit1);
			sortAndExecuteEvents(bm, unit1.serializeEvents());

			expect(unit2.stats.damageReductionModifier).toBe(-15);
		});
	});

	describe("ATTACK_POWER (Axe)", () => {
		it("should apply ATTACK_POWER status effect on hit", () => {
			const bm = new BoardManager();
			const unit1 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
			unit1.equip(new Equipment(Weapons.Axe), EQUIPMENT_SLOT.MAIN_HAND);
			bm.addToBoard(unit1);

			const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
			bm.addToBoard(unit2);

			useAbility(unit1);
			sortAndExecuteEvents(bm, unit1.serializeEvents());

			expect(unit1.statusEffects).toEqual([
				{
					name: STATUS_EFFECT.ATTACK_POWER,
					quantity: 10,
				},
			]);
		});
	});

	describe("TICK_EFFECT event", () => {
		it("should create POISON tick effect events and lose HP", () => {
			const bm = new BoardManager();
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
			bm.addToBoard(unit);

			expect(unit.stats.hp).toBe(unit.stats.maxHp);

			unit.statusEffectManager.applyStatusEffect({
				name: STATUS_EFFECT.POISON,
				quantity: 10,
			});

			for (let i = 0; i < TICK_COOLDOWN; i++) unit.step(i);

			expect(unit.stepEvents[0]).toStrictEqual({
				actorId: unit.id,
				payload: {
					payload: {
						decrement: 1,
						value: 10,
					},
					targetId: unit.id,
					type: STATUS_EFFECT.POISON,
				},
				step: TICK_COOLDOWN - 1,
				type: EVENT_TYPE.TICK_EFFECT,
			});

			sortAndExecuteEvents(bm, unit.serializeEvents());
			expect(unit.stats.hp).toBe(unit.stats.maxHp - 10);

			for (let i = 0; i < TICK_COOLDOWN; i++) unit.step(i);
			expect((unit.stepEvents[0] as TickEffectEvent).payload?.payload.value).toBe(9);
			sortAndExecuteEvents(bm, unit.serializeEvents());
			expect(unit.stats.hp).toBe(unit.stats.maxHp - 10 - 9);

			for (let i = 0; i < TICK_COOLDOWN; i++) unit.step(i);
			expect((unit.stepEvents[0] as TickEffectEvent).payload?.payload.value).toBe(8);
			sortAndExecuteEvents(bm, unit.serializeEvents());
			expect(unit.stats.hp).toBe(unit.stats.maxHp - 10 - 9 - 8);
		});

		it("should create REGEN tick effect events and heal HP", () => {
			const bm = new BoardManager();
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
			bm.addToBoard(unit);

			unit.receiveDamage(20);

			expect(unit.stats.hp).toBe(unit.stats.maxHp - 20);

			unit.statusEffectManager.applyStatusEffect({
				name: STATUS_EFFECT.REGEN,
				quantity: 10,
			});

			for (let i = 0; i < TICK_COOLDOWN; i++) unit.step(i);

			expect(unit.stepEvents[0]).toStrictEqual({
				actorId: unit.id,
				payload: {
					payload: {
						decrement: 1,
						value: 10,
					},
					targetId: unit.id,
					type: STATUS_EFFECT.REGEN,
				},
				step: TICK_COOLDOWN - 1,
				type: EVENT_TYPE.TICK_EFFECT,
			});

			sortAndExecuteEvents(bm, unit.serializeEvents());
			expect(unit.stats.hp).toBe(unit.stats.maxHp - 20 + 10);

			for (let i = 0; i < TICK_COOLDOWN; i++) unit.step(i);
			expect((unit.stepEvents[0] as TickEffectEvent).payload?.payload.value).toBe(9);
			sortAndExecuteEvents(bm, unit.serializeEvents());
			expect(unit.stats.hp).toBe(unit.stats.maxHp - 20 + 10 + 9);

			for (let i = 0; i < TICK_COOLDOWN; i++) unit.step(i);
			expect((unit.stepEvents[0] as TickEffectEvent).payload?.payload.value).toBe(8);
			sortAndExecuteEvents(bm, unit.serializeEvents());
			expect(unit.stats.hp).toBe(unit.stats.maxHp);

			for (let i = 0; i < TICK_COOLDOWN; i++) unit.step(i);
			expect((unit.stepEvents[0] as TickEffectEvent).payload?.payload.value).toBe(7);
			sortAndExecuteEvents(bm, unit.serializeEvents());
			expect(unit.stats.hp).toBe(unit.stats.maxHp);
		});

		it("removing POISON or REGEN should reset tick progress", () => {
			const bm = new BoardManager();
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
			bm.addToBoard(unit);

			unit.statusEffectManager.applyStatusEffect({
				name: STATUS_EFFECT.POISON,
				quantity: 10,
			});
			unit.statusEffectManager.applyStatusEffect({
				name: STATUS_EFFECT.REGEN,
				quantity: 10,
			});

			for (let i = 0; i < 3; i++) unit.step(i);

			expect(unit.statusEffectManager.poisonTickProgress).toBe(3);
			expect(unit.statusEffectManager.regenTickProgress).toBe(3);

			unit.statusEffectManager.removeAllStacks(STATUS_EFFECT.POISON);
			expect(unit.statusEffectManager.poisonTickProgress).toBe(0);

			unit.statusEffectManager.removeStacks(STATUS_EFFECT.REGEN, 5);
			expect(unit.statusEffectManager.regenTickProgress).toBe(3);
			unit.statusEffectManager.removeStacks(STATUS_EFFECT.REGEN, 5);
			expect(unit.statusEffectManager.regenTickProgress).toBe(0);
		});
	});

	describe("ability COOLDOWN effects (FAST, FOCUS, SLOW)", () => {
		it("should correctly calculate attackCooldownModifier when applying FAST multiple times", () => {
			const bm = new BoardManager();
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);

			unit.equip(new Equipment(Weapons.Dagger), EQUIPMENT_SLOT.MAIN_HAND);
			bm.addToBoard(unit);

			expect(unit.stats.attackCooldownModifier).toBe(15);
			expect(unit.abilities[0].cooldown).toBe(
				Math.round(Abilities.Stab.cooldown - Abilities.Stab.cooldown * (15 / 100)),
			);

			const fastQuantity = 10;

			const fastSubEvent = {
				type: "INSTANT_EFFECT",
				payload: {
					type: "STATUS_EFFECT",
					targetId: unit.id,
					payload: [
						{
							name: "FAST",
							quantity: fastQuantity,
						},
					],
				},
			} as SubEvent;

			unit.applySubEvents([fastSubEvent]);

			expect(unit.stats.attackCooldownModifier).toBe(15 + fastQuantity);
			expect(unit.abilities[0].cooldown).toBe(
				Math.round(Abilities.Stab.cooldown - Abilities.Stab.cooldown * ((15 + fastQuantity) / 100)),
			);

			unit.applySubEvents([fastSubEvent, fastSubEvent]);

			expect(unit.stats.attackCooldownModifier).toBe(15 + fastQuantity * 3);
			expect(unit.abilities[0].cooldown).toBe(
				Math.round(
					Abilities.Stab.cooldown - Abilities.Stab.cooldown * ((15 + fastQuantity * 3) / 100),
				),
			);
		});

		it("should correctly calculate spellCooldownModifier when applying FOCUS multiple times", () => {
			const bm = new BoardManager();
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);

			unit.equip(new Equipment(Weapons.Staff), EQUIPMENT_SLOT.TWO_HANDS);
			bm.addToBoard(unit);

			expect(unit.stats.spellCooldownModifier).toBe(0);
			expect(unit.abilities[0].cooldown).toBe(Math.round(Abilities.Fireball.cooldown));

			const focusQuantity = 10;

			const focusSubEvent = {
				type: "INSTANT_EFFECT",
				payload: {
					type: "STATUS_EFFECT",
					targetId: unit.id,
					payload: [
						{
							name: "FOCUS",
							quantity: focusQuantity,
						},
					],
				},
			} as SubEvent;

			unit.applySubEvents([focusSubEvent]);

			expect(unit.stats.spellCooldownModifier).toBe(focusQuantity);
			expect(unit.abilities[0].cooldown).toBe(
				Math.round(
					Abilities.Fireball.cooldown - Abilities.Fireball.cooldown * (focusQuantity / 100),
				),
			);

			unit.applySubEvents([focusSubEvent, focusSubEvent]);

			expect(unit.stats.spellCooldownModifier).toBe(focusQuantity * 3);
			expect(unit.abilities[0].cooldown).toBe(
				Math.round(
					Abilities.Fireball.cooldown - Abilities.Fireball.cooldown * ((focusQuantity * 3) / 100),
				),
			);
		});

		it("should correctly calculate attackCooldownModifier and spellCooldownModifier when applying SLOW multiple times", () => {
			const bm = new BoardManager();
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);

			unit.equip(new Equipment(Weapons.Wand), EQUIPMENT_SLOT.MAIN_HAND);
			unit.equip(new Equipment(Weapons.Dagger), EQUIPMENT_SLOT.OFF_HAND);
			bm.addToBoard(unit);

			expect(unit.stats.spellCooldownModifier).toBe(0);
			expect(unit.stats.attackCooldownModifier).toBe(15);
			expect(unit.abilities[0].cooldown).toBe(Math.round(Abilities.BastionBond.cooldown));
			expect(unit.abilities[1].cooldown).toBe(
				Math.round(Abilities.Stab.cooldown - Abilities.Stab.cooldown * (15 / 100)),
			);

			const slowQuantity = 10;

			const slowSubEvent = {
				type: "INSTANT_EFFECT",
				payload: {
					type: "STATUS_EFFECT",
					targetId: unit.id,
					payload: [
						{
							name: "SLOW",
							quantity: slowQuantity,
						},
					],
				},
			} as SubEvent;

			unit.applySubEvents([slowSubEvent]);

			expect(unit.stats.spellCooldownModifier).toBe(-slowQuantity);
			expect(unit.abilities[0].cooldown).toBe(
				Math.round(
					Abilities.BastionBond.cooldown + Abilities.BastionBond.cooldown * (slowQuantity / 100),
				),
			);
			expect(unit.stats.attackCooldownModifier).toBe(15 - slowQuantity);
			expect(unit.abilities[1].cooldown).toBe(
				Math.round(
					Abilities.Stab.cooldown + Abilities.Stab.cooldown * (((15 - slowQuantity) * -1) / 100),
				),
			);

			unit.applySubEvents([slowSubEvent, slowSubEvent]);

			expect(unit.stats.spellCooldownModifier).toBe(-slowQuantity * 3);
			expect(unit.abilities[0].cooldown).toBe(
				Math.round(
					Abilities.BastionBond.cooldown +
						Abilities.BastionBond.cooldown * ((slowQuantity * 3) / 100),
				),
			);
			expect(unit.stats.attackCooldownModifier).toBe(15 - slowQuantity * 3);
			expect(unit.abilities[1].cooldown).toBe(
				Math.round(
					Abilities.Stab.cooldown +
						Abilities.Stab.cooldown * (((15 - slowQuantity * 3) * -1) / 100),
				),
			);
		});

		it("should correctly calculate attackCooldownModifier applying FAST and SLOW simultaneously", () => {
			const bm = new BoardManager();
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);

			unit.equip(new Equipment(Weapons.Dagger), EQUIPMENT_SLOT.MAIN_HAND);
			bm.addToBoard(unit);

			expect(unit.stats.attackCooldownModifier).toBe(15);
			expect(unit.abilities[0].cooldown).toBe(
				Math.round(Abilities.Stab.cooldown - Abilities.Stab.cooldown * (15 / 100)),
			);

			const slowQuantity = 25;
			const fastQuantity = 10;

			const slowSubEvent = {
				type: "INSTANT_EFFECT",
				payload: {
					type: "STATUS_EFFECT",
					targetId: unit.id,
					payload: [
						{
							name: "SLOW",
							quantity: slowQuantity,
						},
					],
				},
			} as SubEvent;
			const fastSubEvent = {
				type: "INSTANT_EFFECT",
				payload: {
					type: "STATUS_EFFECT",
					targetId: unit.id,
					payload: [
						{
							name: "FAST",
							quantity: fastQuantity,
						},
					],
				},
			} as SubEvent;

			unit.applySubEvents([slowSubEvent]);

			expect(unit.stats.attackCooldownModifier).toBe(15 - slowQuantity);
			expect(unit.abilities[0].cooldown).toBe(
				Math.round(Abilities.Stab.cooldown - Abilities.Stab.cooldown * ((15 - slowQuantity) / 100)),
			);

			unit.applySubEvents([fastSubEvent]);

			expect(unit.stats.attackCooldownModifier).toBe(15 - slowQuantity + fastQuantity);
			expect(unit.abilities[0].cooldown).toBe(
				Math.round(
					Abilities.Stab.cooldown -
						Abilities.Stab.cooldown * ((15 - slowQuantity + fastQuantity) / 100),
				),
			);
		});

		describe("TAUNT", () => {
			it("STANDARD target should focus unit with TAUNT even if it's furthest", () => {
				const bm = new BoardManager();
				const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
				const unitCloser = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
				const unitFurther = new Unit(OWNER.TEAM_TWO, POSITION.BOT_BACK, bm);

				bm.addToBoard(unit);
				bm.addToBoard(unitCloser);
				bm.addToBoard(unitFurther);

				const ability = new Ability(Abilities.Stab);
				const eventBeforeTaunt = ability.use(unit);

				expect(eventBeforeTaunt.payload.targetsId).toContain(unitCloser.id);
				expect(eventBeforeTaunt.payload.targetsId).not.toContain(unitFurther.id);

				unitFurther.statusEffectManager.applyStatusEffect({
					name: STATUS_EFFECT.TAUNT,
					quantity: 1,
				});

				const eventAfterTaunt = ability.use(unit);

				expect(eventAfterTaunt.payload.targetsId).not.toContain(unitCloser.id);
				expect(eventAfterTaunt.payload.targetsId).toContain(unitFurther.id);
			});

			it("when hit main target with TAUNT should lose taunt stack", () => {
				const bm = new BoardManager();
				const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
				const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.BOT_BACK, bm);

				bm.addToBoard(unit);
				bm.addToBoard(unit2);

				unit2.statusEffectManager.applyStatusEffect({
					name: STATUS_EFFECT.TAUNT,
					quantity: 1,
				});

				expect(unit2.statusEffectManager.hasStatusEffect(STATUS_EFFECT.TAUNT)).toBeTruthy();

				const ability = new Ability(Abilities.Stab);
				const event = ability.use(unit);

				expect(event.payload.subEvents.length).toBe(2);
				expect(event.payload.subEvents[0].payload.type).toBe(INSTANT_EFFECT_TYPE.DAMAGE);
				expect(event.payload.subEvents[1]).toEqual({
					type: "INSTANT_EFFECT",
					payload: {
						type: "STATUS_EFFECT",
						targetId: unit2.id,
						payload: [
							{
								name: "TAUNT",
								quantity: -1,
							},
						],
					},
				});

				sortAndExecuteEvents(bm, [event]);

				expect(unit2.statusEffectManager.hasStatusEffect(STATUS_EFFECT.TAUNT)).toBeFalsy();
			});
		});
	});
});
