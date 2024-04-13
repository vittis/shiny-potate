import { Abilities, Unit } from "../..";
import { Ability } from "../Ability/Ability";
import { BoardManager, OWNER, POSITION } from "../BoardManager";
import { DISABLE } from "../Disable/DisableTypes";
import { TICK_COOLDOWN } from "../StatusEffect/StatusEffectManager";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import {
	DamagePayload,
	DisablePayload,
	EVENT_TYPE,
	HealPayload,
	INSTANT_EFFECT_TYPE,
	PossibleEffect,
	SUBEVENT_TYPE,
	ShieldPayload,
	StatusEffectPayload,
	SubEvent,
	TickEffectEvent,
	TickEffectEventPayload,
} from "./EventTypes";
import {
	aggregateEffects,
	calculateEffects,
	executeStepEffects,
	getDeathIntents,
	getEventsFromIntents,
	getStepEffects,
	getSubEventsFromTickEffects,
} from "./EventUtils";

describe("Event", () => {
	describe("getStepEffects", () => {
		it("convert DAMAGE event to stepEffect", () => {
			const bm = new BoardManager();
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
			const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.BOT_BACK, bm);

			bm.addToBoard(unit);
			bm.addToBoard(unit2);

			const ability = new Ability(Abilities.Stab);
			const event = ability.use(unit);

			expect(getStepEffects([event])).toEqual({
				step: 1,
				units: [
					{
						unitId: unit2.id,
						effects: [
							{
								type: INSTANT_EFFECT_TYPE.DAMAGE,
								payload: {
									value: (ability.data.effects[0].payload as DamagePayload).value,
								},
							},
						],
					},
				],
			});
		});

		it("convert HEAL event to stepEffect and cancel it's effect with DAMAGE", () => {
			const bm = new BoardManager();
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
			const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.BOT_BACK, bm);

			bm.addToBoard(unit);
			bm.addToBoard(unit2);

			// Ability deals 45 damage and gives 15 heal to self
			const ability = new Ability(Abilities.DarkBolt);
			const event1 = ability.use(unit);
			const event2 = ability.use(unit2);

			expect(getStepEffects([event1])).toEqual({
				step: 1,
				units: [
					{
						unitId: unit2.id,
						effects: [
							{
								type: INSTANT_EFFECT_TYPE.DAMAGE,
								payload: {
									value: (ability.data.effects[0].payload as DamagePayload).value,
								},
							},
						],
					},
					{
						unitId: unit.id,
						effects: [
							{
								type: INSTANT_EFFECT_TYPE.HEAL,
								payload: {
									value: (ability.data.effects[1].payload as ShieldPayload).value,
								},
							},
						],
					},
				],
			});
			expect(getStepEffects([event1, event2])).toEqual({
				step: 1,
				units: [
					{
						unitId: unit2.id,
						effects: [
							{
								type: INSTANT_EFFECT_TYPE.DAMAGE,
								payload: {
									value:
										(ability.data.effects[0].payload as DamagePayload).value -
										(ability.data.effects[1].payload as HealPayload).value,
								},
							},
						],
					},
					{
						unitId: unit.id,
						effects: [
							{
								type: INSTANT_EFFECT_TYPE.DAMAGE,
								payload: {
									value:
										(ability.data.effects[0].payload as DamagePayload).value -
										(ability.data.effects[1].payload as HealPayload).value,
								},
							},
						],
					},
				],
			});
		});

		it("convert SHIELD event to stepEffect and cancel it's effect with DAMAGE", () => {
			const bm = new BoardManager();
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
			const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.BOT_BACK, bm);

			bm.addToBoard(unit);
			bm.addToBoard(unit2);

			// Ability deals 30 damage and gives 30 shield to self
			const ability = new Ability(Abilities.BalancedStrike);
			const event1 = ability.use(unit);
			const event2 = ability.use(unit2);

			expect(getStepEffects([event1])).toEqual({
				step: 1,
				units: [
					{
						unitId: unit2.id,
						effects: [
							{
								type: INSTANT_EFFECT_TYPE.DAMAGE,
								payload: {
									value: (ability.data.effects[0].payload as DamagePayload).value,
								},
							},
						],
					},
					{
						unitId: unit.id,
						effects: [
							{
								type: INSTANT_EFFECT_TYPE.SHIELD,
								payload: {
									value: (ability.data.effects[1].payload as ShieldPayload).value,
								},
							},
						],
					},
				],
			});
			expect(getStepEffects([event1, event2])).toEqual({
				step: 1,
				units: [
					{
						unitId: unit2.id,
						effects: [],
					},
					{
						unitId: unit.id,
						effects: [],
					},
				],
			});
		});

		it("convert STATUS_EFFECT event to stepEffect", () => {
			const bm = new BoardManager();
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);

			bm.addToBoard(unit);

			const ability = new Ability(Abilities.ArcaneStudies);
			const event = ability.use(unit);

			expect(getStepEffects([event])).toEqual({
				step: 1,
				units: [
					{
						unitId: unit.id,
						effects: [
							{
								type: INSTANT_EFFECT_TYPE.STATUS_EFFECT,
								payload: [
									{
										name: STATUS_EFFECT.SPELL_POTENCY,
										quantity: (ability.data.effects[0].payload as StatusEffectPayload[])[0]
											.quantity,
									},
									{
										name: STATUS_EFFECT.FOCUS,
										quantity: (ability.data.effects[1].payload as StatusEffectPayload[])[0]
											.quantity,
									},
								],
							},
						],
					},
				],
			});
		});

		it("convert DISABLE event to stepEffect", () => {
			const bm = new BoardManager();
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
			const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);

			bm.addToBoard(unit);
			bm.addToBoard(unit2);

			const ability = new Ability(Abilities.SummonBoar);
			const event = ability.use(unit);

			expect(getStepEffects([event])).toEqual({
				step: 1,
				units: [
					{
						unitId: unit2.id,
						effects: [
							{
								type: INSTANT_EFFECT_TYPE.DAMAGE,
								payload: {
									value: (ability.data.effects[0].payload as DamagePayload).value,
								},
							},
							{
								type: INSTANT_EFFECT_TYPE.DISABLE,
								payload: [
									{
										name: DISABLE.STUN,
										duration: (ability.data.effects[1].payload as DisablePayload[])[0].duration,
									},
								],
							},
						],
					},
				],
			});
		});
	});

	describe("getDeathIntents", () => {
		it("should get FAINT event", () => {
			const bm = new BoardManager();
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);

			bm.addToBoard(unit);

			unit.receiveDamage(unit.stats.maxHp);
			expect(unit.stats.hp).toEqual(0);
			expect(getDeathIntents(bm).get(unit.id)).toEqual([
				{
					step: 1,
					type: EVENT_TYPE.FAINT,
					actorId: unit.id,
				},
			]);
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

			let tickEffect = (unit.stepIntents[0] as TickEffectEvent).payload as TickEffectEventPayload;

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
							quantity: -1,
						},
					],
				},
			});

			executeStepEffects(bm, getStepEffects(getEventsFromIntents(bm, unit.serializeIntents())));

			for (let i = 0; i < TICK_COOLDOWN; i++) unit.step(i);

			tickEffect = (unit.stepIntents[0] as TickEffectEvent).payload as TickEffectEventPayload;

			expect(getSubEventsFromTickEffects(tickEffect)).toHaveLength(2);
			expect(
				(getSubEventsFromTickEffects(tickEffect)[0].payload.payload as HealPayload).value,
			).toBe(9);
			expect(
				(getSubEventsFromTickEffects(tickEffect)[1].payload.payload as StatusEffectPayload[])[0]
					.quantity,
			).toBe(-1);
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

			let tickEffect = (unit.stepIntents[0] as TickEffectEvent).payload as TickEffectEventPayload;

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
							quantity: -1,
						},
					],
				},
			});

			executeStepEffects(bm, getStepEffects(getEventsFromIntents(bm, unit.serializeIntents())));

			for (let i = 0; i < TICK_COOLDOWN; i++) unit.step(i);

			tickEffect = (unit.stepIntents[0] as TickEffectEvent).payload as TickEffectEventPayload;

			expect(getSubEventsFromTickEffects(tickEffect)).toHaveLength(2);
			expect(
				(getSubEventsFromTickEffects(tickEffect)[0].payload.payload as DamagePayload).value,
			).toBe(9);
			expect(
				(getSubEventsFromTickEffects(tickEffect)[1].payload.payload as StatusEffectPayload[])[0]
					.quantity,
			).toBe(-1);
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
			] as PossibleEffect[];

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
			] as PossibleEffect[];
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
			] as PossibleEffect[];

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
			] as PossibleEffect[];
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
			] as PossibleEffect[];

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
			] as PossibleEffect[];
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
			] as PossibleEffect[];

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
			] as PossibleEffect[];

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
			] as PossibleEffect[];

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
			] as PossibleEffect[];

			expect(calculateEffects(effects)).toEqual([]);
		});
	});
});
