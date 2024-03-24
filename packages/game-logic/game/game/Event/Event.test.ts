import { Abilities, Unit } from "../..";
import { Ability } from "../Ability/Ability";
import { BoardManager, OWNER, POSITION } from "../BoardManager";
import { DISABLE } from "../Disable/DisableTypes";
import { TICK_COOLDOWN } from "../StatusEffect/StatusEffectManager";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { TRIGGER_EFFECT_TYPE, TriggerEffect } from "../Trigger/TriggerTypes";
import {
	DamagePayload,
	HealPayload,
	INSTANT_EFFECT_TYPE,
	PossibleEffects,
	SUBEVENT_TYPE,
	StatusEffectPayload,
	TickEffectEvent,
	TickEffectEventPayload,
} from "./EventTypes";
import {
	aggregateEffects,
	calculateEffects,
	getStepEffects,
	getSubEventsFromTickEffects,
	sortAndExecuteEvents,
} from "./EventUtils";

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

describe("Event", () => {
	describe("getStepEffects", () => {
		it.skip("should execute step effects", () => {
			const { bm, unit1 } = setupBoard();

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

			unit1.statusEffectManager.applyStatusEffect({
				name: STATUS_EFFECT.REGEN,
				quantity: 10,
			});

			for (let i = 0; i < TICK_COOLDOWN; i++) unit1.step(i);

			let tickEffect = (unit1.stepEvents[0] as TickEffectEvent).payload as TickEffectEventPayload;

			/* console.log(event);
			console.log(event.payload.subEvents); */

			console.log(getStepEffects([event, unit1.stepEvents[0]]));
			//console.log(getStepEffects([event, unit1.stepEvents[0]])[0].effects);

			//expect(event.payload.subEvents).toEqual(getStepEffects([event]));
		});
	});

	describe("getSubEventsFromTickEffects", () => {
		it("should get subEvents from REGEN tickEffect correctly", () => {
			const bm = new BoardManager();
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
			bm.addToBoard(unit);

			unit.statusEffectManager.applyStatusEffect({
				name: STATUS_EFFECT.REGEN,
				quantity: 10,
			});

			for (let i = 0; i < TICK_COOLDOWN; i++) unit.step(i);

			let tickEffect = (unit.stepEvents[0] as TickEffectEvent).payload as TickEffectEventPayload;

			expect(getSubEventsFromTickEffects(tickEffect)).toHaveLength(2);
			expect(getSubEventsFromTickEffects(tickEffect)[0]).toEqual({
				type: SUBEVENT_TYPE.INSTANT_EFFECT,
				payload: {
					type: INSTANT_EFFECT_TYPE.HEAL,
					targetId: unit.id,
					payload: {
						value: 10,
					},
				},
			});
			expect(getSubEventsFromTickEffects(tickEffect)[1]).toEqual({
				type: SUBEVENT_TYPE.INSTANT_EFFECT,
				payload: {
					type: INSTANT_EFFECT_TYPE.STATUS_EFFECT,
					targetId: unit.id,
					payload: [
						{
							name: STATUS_EFFECT.REGEN,
							quantity: 10,
						},
					],
				},
			});

			sortAndExecuteEvents(bm, unit.serializeEvents());

			for (let i = 0; i < TICK_COOLDOWN; i++) unit.step(i);

			tickEffect = (unit.stepEvents[0] as TickEffectEvent).payload as TickEffectEventPayload;

			expect(getSubEventsFromTickEffects(tickEffect)).toHaveLength(2);
			expect(
				(getSubEventsFromTickEffects(tickEffect)[0].payload.payload as HealPayload).value,
			).toBe(9);
			expect(
				(getSubEventsFromTickEffects(tickEffect)[1].payload.payload as StatusEffectPayload[])[0]
					.quantity,
			).toBe(9);
		});

		it("should get subEvents from POISON tickEffect correctly", () => {
			const bm = new BoardManager();
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
			bm.addToBoard(unit);

			unit.statusEffectManager.applyStatusEffect({
				name: STATUS_EFFECT.POISON,
				quantity: 10,
			});

			for (let i = 0; i < TICK_COOLDOWN; i++) unit.step(i);

			let tickEffect = (unit.stepEvents[0] as TickEffectEvent).payload as TickEffectEventPayload;

			expect(getSubEventsFromTickEffects(tickEffect)).toHaveLength(2);
			expect(getSubEventsFromTickEffects(tickEffect)[0]).toEqual({
				type: SUBEVENT_TYPE.INSTANT_EFFECT,
				payload: {
					type: INSTANT_EFFECT_TYPE.DAMAGE,
					targetId: unit.id,
					payload: {
						value: 10,
					},
				},
			});
			expect(getSubEventsFromTickEffects(tickEffect)[1]).toEqual({
				type: SUBEVENT_TYPE.INSTANT_EFFECT,
				payload: {
					type: INSTANT_EFFECT_TYPE.STATUS_EFFECT,
					targetId: unit.id,
					payload: [
						{
							name: STATUS_EFFECT.POISON,
							quantity: 10,
						},
					],
				},
			});

			sortAndExecuteEvents(bm, unit.serializeEvents());

			for (let i = 0; i < TICK_COOLDOWN; i++) unit.step(i);

			tickEffect = (unit.stepEvents[0] as TickEffectEvent).payload as TickEffectEventPayload;

			expect(getSubEventsFromTickEffects(tickEffect)).toHaveLength(2);
			expect(
				(getSubEventsFromTickEffects(tickEffect)[0].payload.payload as DamagePayload).value,
			).toBe(9);
			expect(
				(getSubEventsFromTickEffects(tickEffect)[1].payload.payload as StatusEffectPayload[])[0]
					.quantity,
			).toBe(9);
		});
	});

	describe("aggregateEffects", () => {
		it("should sum values of damage, heal and shield effects, quantities of each status effect and get only the bigger duration of each disable", () => {
			const effects = [
				{
					type: INSTANT_EFFECT_TYPE.DAMAGE,
					payload: {
						value: 10,
					},
				},
				{
					type: INSTANT_EFFECT_TYPE.DAMAGE,
					payload: {
						value: 15,
					},
				},
				{
					type: INSTANT_EFFECT_TYPE.HEAL,
					payload: {
						value: 10,
					},
				},
				{
					type: INSTANT_EFFECT_TYPE.HEAL,
					payload: {
						value: 15,
					},
				},
				{
					type: INSTANT_EFFECT_TYPE.SHIELD,
					payload: {
						value: 10,
					},
				},
				{
					type: INSTANT_EFFECT_TYPE.SHIELD,
					payload: {
						value: 22,
					},
				},
				{
					type: INSTANT_EFFECT_TYPE.STATUS_EFFECT,
					payload: [
						{
							name: STATUS_EFFECT.ATTACK_POWER,
							quantity: 11,
						},
					],
				},
				{
					type: INSTANT_EFFECT_TYPE.STATUS_EFFECT,
					payload: [
						{
							name: STATUS_EFFECT.ATTACK_POWER,
							quantity: 18,
						},
						{
							name: STATUS_EFFECT.MULTISTRIKE,
							quantity: 1,
						},
					],
				},
				{
					type: INSTANT_EFFECT_TYPE.DISABLE,
					payload: [
						{
							name: DISABLE.STUN,
							duration: 10,
						},
					],
				},
				{
					type: INSTANT_EFFECT_TYPE.DISABLE,
					payload: [
						{
							name: DISABLE.STUN,
							duration: 5,
						},
					],
				},
			] as PossibleEffects[];

			expect(aggregateEffects(effects)).toEqual([
				{
					payload: {
						value: 25,
					},
					type: "DAMAGE",
				},
				{
					payload: {
						value: 25,
					},
					type: "HEAL",
				},
				{
					payload: {
						value: 32,
					},
					type: "SHIELD",
				},
				{
					payload: [
						{
							name: "ATTACK_POWER",
							quantity: 29,
						},
						{
							name: "MULTISTRIKE",
							quantity: 1,
						},
					],
					type: "STATUS_EFFECT",
				},
				{
					payload: [
						{
							duration: 10,
							name: "STUN",
						},
					],
					type: "DISABLE",
				},
			]);
		});
	});

	describe("calculateEffects", () => {
		it("compare damage > heal or shield", () => {
			const effectsDamageAndHeal = [
				{
					type: INSTANT_EFFECT_TYPE.DAMAGE,
					payload: {
						value: 10,
					},
				},
				{
					type: INSTANT_EFFECT_TYPE.HEAL,
					payload: {
						value: 5,
					},
				},
			] as PossibleEffects[];
			const effectsDamageAndShield = [
				{
					type: INSTANT_EFFECT_TYPE.DAMAGE,
					payload: {
						value: 10,
					},
				},
				{
					type: INSTANT_EFFECT_TYPE.SHIELD,
					payload: {
						value: 5,
					},
				},
			] as PossibleEffects[];

			expect(calculateEffects(effectsDamageAndHeal)).toEqual([
				{
					type: INSTANT_EFFECT_TYPE.DAMAGE,
					payload: {
						value: 5,
					},
				},
			]);
			expect(calculateEffects(effectsDamageAndShield)).toEqual(
				calculateEffects(effectsDamageAndHeal),
			);
		});

		it("compare damage < heal or shield", () => {
			const effectsDamageAndHeal = [
				{
					type: INSTANT_EFFECT_TYPE.DAMAGE,
					payload: {
						value: 5,
					},
				},
				{
					type: INSTANT_EFFECT_TYPE.HEAL,
					payload: {
						value: 10,
					},
				},
			] as PossibleEffects[];
			const effectsDamageAndShield = [
				{
					type: INSTANT_EFFECT_TYPE.DAMAGE,
					payload: {
						value: 5,
					},
				},
				{
					type: INSTANT_EFFECT_TYPE.SHIELD,
					payload: {
						value: 10,
					},
				},
			] as PossibleEffects[];

			expect(calculateEffects(effectsDamageAndHeal)).toEqual([
				{
					type: INSTANT_EFFECT_TYPE.HEAL,
					payload: {
						value: 5,
					},
				},
			]);
			expect(calculateEffects(effectsDamageAndShield)).toEqual([
				{
					type: INSTANT_EFFECT_TYPE.SHIELD,
					payload: {
						value: 5,
					},
				},
			]);
		});

		it("compare damage = heal or shield", () => {
			const effectsDamageAndHeal = [
				{
					type: INSTANT_EFFECT_TYPE.DAMAGE,
					payload: {
						value: 10,
					},
				},
				{
					type: INSTANT_EFFECT_TYPE.HEAL,
					payload: {
						value: 10,
					},
				},
			] as PossibleEffects[];
			const effectsDamageAndShield = [
				{
					type: INSTANT_EFFECT_TYPE.DAMAGE,
					payload: {
						value: 10,
					},
				},
				{
					type: INSTANT_EFFECT_TYPE.SHIELD,
					payload: {
						value: 10,
					},
				},
			] as PossibleEffects[];

			expect(calculateEffects(effectsDamageAndHeal)).toEqual([]);
			expect(calculateEffects(effectsDamageAndShield)).toEqual([]);
		});

		it("compare damage > heal and result > shield", () => {
			const effects = [
				{
					type: INSTANT_EFFECT_TYPE.DAMAGE,
					payload: {
						value: 20,
					},
				},
				{
					type: INSTANT_EFFECT_TYPE.HEAL,
					payload: {
						value: 10,
					},
				},
				{
					type: INSTANT_EFFECT_TYPE.SHIELD,
					payload: {
						value: 5,
					},
				},
			] as PossibleEffects[];

			expect(calculateEffects(effects)).toEqual([
				{
					type: INSTANT_EFFECT_TYPE.DAMAGE,
					payload: {
						value: 5,
					},
				},
			]);
		});

		it("compare damage > heal and result < shield", () => {
			const effects = [
				{
					type: INSTANT_EFFECT_TYPE.DAMAGE,
					payload: {
						value: 20,
					},
				},
				{
					type: INSTANT_EFFECT_TYPE.HEAL,
					payload: {
						value: 10,
					},
				},
				{
					type: INSTANT_EFFECT_TYPE.SHIELD,
					payload: {
						value: 15,
					},
				},
			] as PossibleEffects[];

			expect(calculateEffects(effects)).toEqual([
				{
					type: INSTANT_EFFECT_TYPE.SHIELD,
					payload: {
						value: 5,
					},
				},
			]);
		});

		it("compare damage > heal and result = shield", () => {
			const effects = [
				{
					type: INSTANT_EFFECT_TYPE.DAMAGE,
					payload: {
						value: 20,
					},
				},
				{
					type: INSTANT_EFFECT_TYPE.HEAL,
					payload: {
						value: 15,
					},
				},
				{
					type: INSTANT_EFFECT_TYPE.SHIELD,
					payload: {
						value: 5,
					},
				},
			] as PossibleEffects[];

			expect(calculateEffects(effects)).toEqual([]);
		});
	});
});
