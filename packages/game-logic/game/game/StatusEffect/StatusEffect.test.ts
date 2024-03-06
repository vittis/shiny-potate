import { BoardManager, OWNER, POSITION } from "../BoardManager";
import { Equipment } from "../Equipment/Equipment";
import { EQUIPMENT_SLOT } from "../Equipment/EquipmentTypes";
import { EVENT_TYPE, TickEffectEvent } from "../Event/EventTypes";
import { sortAndExecuteEvents } from "../Event/EventUtils";
import { Unit } from "../Unit/Unit";
import { useAbility } from "../_tests_/testsUtils";
import { Weapons } from "../data";
import { StatusEffectManager, TICK_COOLDOWN } from "./StatusEffectManager";
import { STATUS_EFFECT } from "./StatusEffectTypes";

describe("StatusEffect", () => {
	describe("StatusEffectManager", () => {
		test("applies status effect", () => {
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

		test("applies multiple status effect", () => {
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

		test("applying same status effect adds to quantity", () => {
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

		test("removes one stack", () => {
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

		test("removes all stacks", () => {
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
		test("should apply VULNERABLE status effect on hit", () => {
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

		test("should modify damageReductionModifier when with VULNERABLE", () => {
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
		test("should apply ATTACK_POWER status effect on hit", () => {
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
		test("should create POISON tick effect events and lose HP", () => {
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

		test("should create REGEN tick effect events and heal HP", () => {
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

		test("removing POISON or REGEN should reset tick progress", () => {
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
});
