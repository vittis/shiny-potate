import { TARGET_TYPE } from "../Target/TargetTypes";
import { BoardManager, OWNER, POSITION } from "../BoardManager";
import { Equipment } from "../Equipment/Equipment";
import { EQUIPMENT_SLOT } from "../Equipment/EquipmentTypes";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { Unit } from "../Unit/Unit";
import { Weapons } from "../data";
import { TriggerManager } from "./TriggerManager";
import { PossibleTriggerEffect, TRIGGER, TRIGGER_EFFECT_TYPE } from "./TriggerTypes";
import { executeStepEffects, getEventsFromIntents, getStepEffects } from "../Event/EventUtils";

const effectsMock: PossibleTriggerEffect[] = [
	{
		type: TRIGGER_EFFECT_TYPE.STATUS_EFFECT,
		trigger: TRIGGER.ON_HIT,
		target: TARGET_TYPE.HIT_TARGET,
		conditions: [],
		payload: [
			{
				name: STATUS_EFFECT.VULNERABLE,
				quantity: 20,
			},
		],
	},
	{
		type: TRIGGER_EFFECT_TYPE.STATUS_EFFECT,
		trigger: TRIGGER.BATTLE_START,
		target: TARGET_TYPE.SELF,
		conditions: [],
		payload: [
			{
				name: STATUS_EFFECT.ATTACK_POWER,
				quantity: 20,
			},
		],
	},
];

describe("Triggers", () => {
	describe("TriggerManager", () => {
		it("should add", () => {
			const manager = new TriggerManager();
			manager.addTriggerEffectsFromSource(effectsMock, "sourceId");
			expect(manager.triggerEffects).toHaveLength(2);
		});

		it("should remove", () => {
			const manager = new TriggerManager();

			manager.addTriggerEffectsFromSource(effectsMock, "sourceId");
			manager.removeTriggerEffectsFromSource("sourceId");

			expect(manager.triggerEffects).toHaveLength(0);
		});

		it("should get all trigers of type", () => {
			const manager = new TriggerManager();

			manager.addTriggerEffectsFromSource(effectsMock, "sourceId");
			const effects = manager.getAllEffectsForTrigger(TRIGGER.BATTLE_START);

			expect(effects).toHaveLength(1);
		});
	});

	describe("From equipment", () => {
		it("should add trigger effect for AXE", () => {
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.BOT_MID);

			unit.equip(new Equipment(Weapons.Axe), EQUIPMENT_SLOT.MAIN_HAND);

			expect(unit.triggerEffects).toHaveLength(3);

			expect(unit.triggerEffects[0].effect).toEqual({
				type: "STATUS_EFFECT",
				trigger: "ON_HIT",
				target: "HIT_TARGET",
				conditions: [],
				payload: [
					{
						name: "VULNERABLE",
						quantity: 20,
					},
				],
			});
		});
	});

	describe("From perk", () => {
		// todo fix this test by using a weapon that only gives focused mind
		it.skip("should add trigger effect from FOCUSED MIND (from WAND)", () => {
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.BOT_MID);

			unit.equip(new Equipment(Weapons.Wand), EQUIPMENT_SLOT.MAIN_HAND);

			expect(unit.triggerEffects).toHaveLength(1);

			expect(unit.triggerEffects[0].effect).toEqual({
				type: "STATUS_EFFECT",
				trigger: "BATTLE_START",
				target: "SELF",
				payload: [{ name: "FOCUS", quantity: 5 }],
			});
		});
	});

	describe("BATTLE_START", () => {
		it("should generate event and apply trigger effect on battle start (from AXE)", () => {
			const bm = new BoardManager();

			const unit = new Unit(OWNER.TEAM_ONE, POSITION.BOT_MID, bm);
			bm.addToBoard(unit);

			unit.equip(new Equipment(Weapons.Axe), EQUIPMENT_SLOT.MAIN_HAND);

			unit.triggerManager.onTrigger(TRIGGER.BATTLE_START, unit, bm);

			executeStepEffects(bm, getStepEffects(getEventsFromIntents(bm, unit.serializeIntents())));

			expect(unit.statusEffects).toHaveLength(2);

			expect(unit.stats.hp).toBe(unit.stats.maxHp - 50);
		});
	});

	describe("ON_HIT", () => {
		it("should generate event and apply trigger effect on hit (Prey The Weak)", () => {
			const bm = new BoardManager();
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.BOT_MID, bm);
			const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.BOT_MID, bm);
			bm.addToBoard(unit);
			bm.addToBoard(unit2);
			unit.equip(new Equipment(Weapons.Longbow), EQUIPMENT_SLOT.TWO_HANDS);

			expect(unit2.statusEffectManager.hasStatusEffect(STATUS_EFFECT.VULNERABLE)).toBe(false);

			const ability = unit.abilities[0];
			const event = ability.use(unit);

			executeStepEffects(bm, getStepEffects([event]));

			expect(unit2.statusEffectManager.hasStatusEffect(STATUS_EFFECT.VULNERABLE)).toBe(true);
		});
	});
});
