import { Perk } from "./Perk";
import { Classes, Perks, Weapons } from "../data";
import { BoardManager, OWNER, POSITION } from "../BoardManager";
import { Unit } from "../Unit/Unit";
import { Equipment } from "../Equipment/Equipment";
import { EQUIPMENT_SLOT } from "../Equipment/EquipmentTypes";
import { runGame } from "../Game";
import { TriggerEffectEvent } from "../Event/EventTypes";
import { Class } from "../Class/Class";
import { TRIGGER_EFFECT_TYPE, TriggerEffect } from "../Trigger/TriggerTypes";

describe("Perk", () => {
	it("should create", () => {
		const perk = new Perk(Perks.FocusedMind);
		expect(perk).toBeDefined();
	});

	it("should create perk with condition", () => {
		const perk = new Perk(Perks.Berserk);
		expect(perk).toBeDefined();
	});

	it("getTriggerEffects", () => {
		const perk = new Perk(Perks.FocusedMind);

		expect(perk.getTriggerEffects()).toEqual([
			{
				payload: [{ name: "FOCUS", quantity: 5 }],
				target: "SELF",
				conditions: [],
				trigger: "BATTLE_START",
				type: "STATUS_EFFECT",
			},
		]);
	});

	it.skip("perk with condition works", () => {
		const perk = new Perk(Perks.FocusedMind);

		/* expect(perk.getTriggerEffects()).toEqual([
      {
        payload: [{ name: "FOCUS", quantity: 5 }],
        target: "SELF",
        trigger: "BATTLE_START",
        type: "STATUS_EFFECT",
      },
    ]); */
	});

	// TODO: also test with damage, heal, shield and disable
	it("perks with dynamic quantity apply correct value", () => {
		for (let tier = 1; tier <= 5; tier++) {
			const perk = new Perk(Perks.PreyTheWeak, tier);

			expect(
				(perk.getTriggerEffects() as TriggerEffect<TRIGGER_EFFECT_TYPE.STATUS_EFFECT>[])[0]
					.payload[0].quantity,
			).toEqual(Perks.PreyTheWeak.tiers[0].values[tier - 1]);
		}
	});

	describe("BERSERK", () => {
		it("generate event if condition is met", () => {
			const bm = new BoardManager();

			const unit1 = new Unit(OWNER.TEAM_ONE, POSITION.BOT_FRONT, bm);
			unit1.equip(new Equipment(Weapons.Sword), EQUIPMENT_SLOT.MAIN_HAND);
			bm.addToBoard(unit1);

			const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.BOT_FRONT, bm);
			//unit2.equip(new Equipment(Weapons.Wand), EQUIPMENT_SLOT.MAIN_HAND);
			bm.addToBoard(unit2);

			const { eventHistory } = runGame(bm);

			const berserkEvent = eventHistory.find(
				e => e.type === "TRIGGER_EFFECT" && e.trigger === "BATTLE_START",
			) as TriggerEffectEvent;

			expect(berserkEvent).toBeDefined();
			expect(berserkEvent.subEvents[0].payload.type).toBe("STATUS_EFFECT");
			expect(berserkEvent.subEvents[0].payload.payload).toEqual([
				{ name: "ATTACK_POWER", quantity: 5 },
				{ name: "VULNERABLE", quantity: 5 },
			]);
		});

		it("should not generate event if condition is not met", () => {
			const bm = new BoardManager();

			const unit1 = new Unit(OWNER.TEAM_ONE, POSITION.BOT_BACK, bm);
			unit1.equip(new Equipment(Weapons.Sword), EQUIPMENT_SLOT.MAIN_HAND);
			bm.addToBoard(unit1);

			const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.BOT_FRONT, bm);
			//unit2.equip(new Equipment(Weapons.Wand), EQUIPMENT_SLOT.MAIN_HAND);
			bm.addToBoard(unit2);

			const { eventHistory } = runGame(bm);

			const berserkEvent = eventHistory.find(
				e => e.type === "TRIGGER_EFFECT" && e.trigger === "BATTLE_START",
			) as TriggerEffectEvent;

			expect(berserkEvent).not.toBeDefined();
		});
	});

	describe("RANGED PROFICIENCY", () => {
		it("generate event if condition is met", () => {
			const bm = new BoardManager();

			const unit1 = new Unit(OWNER.TEAM_ONE, POSITION.BOT_FRONT, bm);
			unit1.equip(new Equipment(Weapons.Shortbow), EQUIPMENT_SLOT.MAIN_HAND);
			unit1.setClass(new Class(Classes.Ranger));
			bm.addToBoard(unit1);

			const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.BOT_FRONT, bm);
			//unit2.equip(new Equipment(Weapons.Wand), EQUIPMENT_SLOT.MAIN_HAND);
			bm.addToBoard(unit2);

			const { eventHistory } = runGame(bm);

			const event = eventHistory.find(
				e => e.type === "TRIGGER_EFFECT" && e.trigger === "BATTLE_START",
			) as TriggerEffectEvent;

			expect(event).toBeDefined();
			expect(event.subEvents[0].payload.type).toBe("STATUS_EFFECT");
			expect(event.subEvents[0].payload.payload).toEqual([{ name: "FAST", quantity: 5 }]);
		});

		it("should not generate event if condition is not met", () => {
			const bm = new BoardManager();

			const unit1 = new Unit(OWNER.TEAM_ONE, POSITION.BOT_BACK, bm);
			unit1.equip(new Equipment(Weapons.Sword), EQUIPMENT_SLOT.MAIN_HAND);
			unit1.setClass(new Class(Classes.Ranger));
			bm.addToBoard(unit1);

			const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.BOT_FRONT, bm);
			//unit2.equip(new Equipment(Weapons.Wand), EQUIPMENT_SLOT.MAIN_HAND);
			bm.addToBoard(unit2);

			const { eventHistory } = runGame(bm);

			const event = eventHistory.find(
				e => e.type === "TRIGGER_EFFECT" && e.trigger === "BATTLE_START",
			) as TriggerEffectEvent;

			expect(event).not.toBeDefined();
		});
	});
});
