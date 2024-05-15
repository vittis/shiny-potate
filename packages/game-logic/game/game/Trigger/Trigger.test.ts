import { TARGET_TYPE } from "../Target/TargetTypes";
import { BoardManager, OWNER, POSITION } from "../BoardManager";
import { Equipment } from "../Equipment/Equipment";
import { EQUIPMENT_SLOT } from "../Equipment/EquipmentTypes";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { Unit } from "../Unit/Unit";
import { Abilities, Trinkets, Weapons } from "../data";
import { TriggerManager } from "./TriggerManager";
import { PossibleTriggerEffect, TRIGGER, TRIGGER_EFFECT_TYPE } from "./TriggerTypes";
import { executeStepEffects, getEventsFromIntents, getStepEffects } from "../Event/EventUtils";
import { Ability } from "../Ability/Ability";

describe("Triggers", () => {
	// TODO: redo these adds using updateTriggerEffects passing unit after adding perks to it
	describe.skip("TriggerManager", () => {
		it("should add", () => {
			const manager = new TriggerManager();
			/* manager.addTriggerEffectsFromSource(effectsMock, "sourceId"); */
			expect(manager.triggerEffects).toHaveLength(2);
		});

		it("should remove", () => {
			const manager = new TriggerManager();

			/* manager.addTriggerEffectsFromSource(effectsMock, "sourceId");
			manager.removeTriggerEffectsFromSource("sourceId"); */

			expect(manager.triggerEffects).toHaveLength(0);
		});

		it("should get all trigers of type", () => {
			const manager = new TriggerManager();

			/* manager.addTriggerEffectsFromSource(effectsMock, "sourceId"); */
			const effects = manager.getAllEffectsForTrigger(TRIGGER.BATTLE_START);

			expect(effects).toHaveLength(1);
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
		it("should generate event and apply trigger effect on BATTLE START (FOCUSED MIND effect from SHORT SPEAR)", () => {
			const bm = new BoardManager();

			const unit = new Unit(OWNER.TEAM_ONE, POSITION.BOT_MID, bm);
			bm.addToBoard(unit);

			unit.equip(new Equipment(Weapons.ShortSpear), EQUIPMENT_SLOT.MAIN_HAND);

			unit.triggerManager.onTrigger(TRIGGER.BATTLE_START, unit, bm);

			expect(unit.statusEffects).toHaveLength(0);

			executeStepEffects(bm, getStepEffects(getEventsFromIntents(bm, unit.serializeIntents())));

			expect(unit.statusEffects).toHaveLength(1);
			expect(unit.statusEffects[0].name).toBe(STATUS_EFFECT.FOCUS);
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

			expect(unit.perks[1].data.effects[0].trigger).toBe(TRIGGER.ON_HIT);
			expect(unit2.statusEffectManager.hasStatusEffect(STATUS_EFFECT.VULNERABLE)).toBe(false);

			const ability = unit.abilities[0];
			const event = ability.use(unit);

			executeStepEffects(bm, getStepEffects([event]));

			expect(unit2.statusEffectManager.hasStatusEffect(STATUS_EFFECT.VULNERABLE)).toBe(true);
		});
	});

	describe("ON_ATTACK_HIT", () => {
		it("should generate event and apply trigger effect on attack hit (Venomous Strikes)", () => {
			const bm = new BoardManager();
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.BOT_MID, bm);
			const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.BOT_MID, bm);
			bm.addToBoard(unit);
			bm.addToBoard(unit2);
			unit.equip(new Equipment(Weapons.VenomousDagger), EQUIPMENT_SLOT.MAIN_HAND);

			expect(unit.perks[0].data.effects[0].trigger).toBe(TRIGGER.ON_ATTACK_HIT);
			expect(unit2.statusEffectManager.hasStatusEffect(STATUS_EFFECT.POISON)).toBe(false);

			const ability = unit.abilities[0];
			const event = ability.use(unit);

			executeStepEffects(bm, getStepEffects([event]));

			expect(unit2.statusEffectManager.hasStatusEffect(STATUS_EFFECT.POISON)).toBe(true);
		});
	});

	describe("ON_HIT_TAKEN", () => {
		it("should generate event and apply trigger effect on hit taken (Solo Strength)", () => {
			const bm = new BoardManager();
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.BOT_MID, bm);
			const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.BOT_MID, bm);
			bm.addToBoard(unit);
			bm.addToBoard(unit2);
			unit.equip(new Equipment(Trinkets.SagesBrandNewHat), EQUIPMENT_SLOT.TRINKET);

			expect(unit.perks[0].data.effects[0].trigger).toBe(TRIGGER.ON_HIT_TAKEN);
			expect(unit.statusEffectManager.hasStatusEffect(STATUS_EFFECT.ATTACK_POWER)).toBe(false);

			const ability = new Ability(Abilities.Stab);
			const event = ability.use(unit2);

			executeStepEffects(bm, getStepEffects([event]));

			expect(unit.statusEffectManager.hasStatusEffect(STATUS_EFFECT.ATTACK_POWER)).toBe(true);
		});

		it("should not generate event and apply trigger effect when not isolated (Solo Strength)", () => {
			const bm = new BoardManager();
			const unit = new Unit(OWNER.TEAM_ONE, POSITION.BOT_MID, bm);
			const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.BOT_MID, bm);
			const unit3 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_MID, bm);
			bm.addToBoard(unit);
			bm.addToBoard(unit2);
			bm.addToBoard(unit3);
			unit.equip(new Equipment(Trinkets.SagesBrandNewHat), EQUIPMENT_SLOT.TRINKET);

			expect(unit.perks[0].data.effects[0].trigger).toBe(TRIGGER.ON_HIT_TAKEN);
			expect(unit.statusEffectManager.hasStatusEffect(STATUS_EFFECT.ATTACK_POWER)).toBe(false);

			const ability = new Ability(Abilities.Stab);
			const event = ability.use(unit2);

			executeStepEffects(bm, getStepEffects([event]));

			expect(unit.statusEffectManager.hasStatusEffect(STATUS_EFFECT.ATTACK_POWER)).toBe(false);
		});
	});
});
