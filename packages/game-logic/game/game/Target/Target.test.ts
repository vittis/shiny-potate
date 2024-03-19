import { BoardManager, OWNER, POSITION } from "../BoardManager";
import { Equipment } from "../Equipment/Equipment";
import { EQUIPMENT_SLOT } from "../Equipment/EquipmentTypes";
import { sortAndExecuteEvents } from "../Event/EventUtils";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { Unit } from "../Unit/Unit";
import { Weapons } from "../data";
import { TARGET_TYPE } from "./TargetTypes";
import { getAllTargetUnits } from "./TargetUtils";

describe("Target", () => {
	const bm = new BoardManager();

	const unit00 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
	const unit01 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_MID, bm);
	const unit02 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_BACK, bm);
	const unit03 = new Unit(OWNER.TEAM_ONE, POSITION.BOT_FRONT, bm);
	const unit04 = new Unit(OWNER.TEAM_ONE, POSITION.BOT_MID, bm);
	const unit05 = new Unit(OWNER.TEAM_ONE, POSITION.BOT_BACK, bm);

	const unit10 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
	const unit11 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_MID, bm);
	const unit12 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_BACK, bm);
	const unit13 = new Unit(OWNER.TEAM_TWO, POSITION.BOT_FRONT, bm);
	const unit14 = new Unit(OWNER.TEAM_TWO, POSITION.BOT_MID, bm);
	const unit15 = new Unit(OWNER.TEAM_TWO, POSITION.BOT_BACK, bm);

	bm.addToBoard(unit00);
	bm.addToBoard(unit01);
	bm.addToBoard(unit02);
	bm.addToBoard(unit03);
	bm.addToBoard(unit04);
	bm.addToBoard(unit05);
	bm.addToBoard(unit10);
	bm.addToBoard(unit11);
	bm.addToBoard(unit12);
	bm.addToBoard(unit13);
	bm.addToBoard(unit14);
	bm.addToBoard(unit15);

	/* Board
      02 01 00 | 10 11 12
      05 04 03 | 13 14 15
  */

	// unit00 attacks unit10 to make health related tests
	unit00.equip(new Equipment(Weapons.Sword), EQUIPMENT_SLOT.MAIN_HAND);
	const ability = unit00.abilities[0];
	for (let i = 0; i < ability.data.cooldown; i++) {
		unit00.step(i);
	}
	sortAndExecuteEvents(bm, unit00.serializeEvents());

	// create board with only one unit
	const bmEmpty = new BoardManager();
	const unitAlone = new Unit(OWNER.TEAM_ONE, POSITION.TOP_MID, bmEmpty);
	bmEmpty.addToBoard(unitAlone);

	describe("Target Types", () => {
		it("ADJACENT_ALLIES should work", () => {
			const targetUnits = bm.getTarget(unit01, TARGET_TYPE.ADJACENT_ALLIES);

			expect(targetUnits.mainTarget).toBeNull();
			expect(targetUnits.secondaryTargets).toHaveLength(3);
			expect(targetUnits.secondaryTargets).toContain(unit00);
			expect(targetUnits.secondaryTargets).toContain(unit02);
			expect(targetUnits.secondaryTargets).toContain(unit04);
		});

		it("ALL_ALLIES should work", () => {
			const targetUnits = bm.getTarget(unit00, TARGET_TYPE.ALL_ALLIES);

			expect(targetUnits.mainTarget).toBeNull();
			expect(targetUnits.secondaryTargets).toHaveLength(6);
			expect(targetUnits.secondaryTargets).toContain(unit00);
			expect(targetUnits.secondaryTargets).toContain(unit01);
			expect(targetUnits.secondaryTargets).toContain(unit02);
			expect(targetUnits.secondaryTargets).toContain(unit03);
			expect(targetUnits.secondaryTargets).toContain(unit04);
			expect(targetUnits.secondaryTargets).toContain(unit05);
		});

		it("ALL_ENEMIES should work", () => {
			const targetUnits = bm.getTarget(unit00, TARGET_TYPE.ALL_ENEMIES);

			expect(targetUnits.mainTarget).toBeNull();
			expect(targetUnits.secondaryTargets).toHaveLength(6);
			expect(targetUnits.secondaryTargets).toContain(unit10);
			expect(targetUnits.secondaryTargets).toContain(unit11);
			expect(targetUnits.secondaryTargets).toContain(unit12);
			expect(targetUnits.secondaryTargets).toContain(unit13);
			expect(targetUnits.secondaryTargets).toContain(unit14);
			expect(targetUnits.secondaryTargets).toContain(unit15);
		});

		it("ALL_UNITS should work", () => {
			const targetUnits = bm.getTarget(unit00, TARGET_TYPE.ALL_UNITS);

			expect(targetUnits.mainTarget).toBeNull();
			expect(targetUnits.secondaryTargets).toHaveLength(12);
			expect(targetUnits.secondaryTargets).toContain(unit00);
			expect(targetUnits.secondaryTargets).toContain(unit01);
			expect(targetUnits.secondaryTargets).toContain(unit02);
			expect(targetUnits.secondaryTargets).toContain(unit03);
			expect(targetUnits.secondaryTargets).toContain(unit04);
			expect(targetUnits.secondaryTargets).toContain(unit05);
			expect(targetUnits.secondaryTargets).toContain(unit10);
			expect(targetUnits.secondaryTargets).toContain(unit11);
			expect(targetUnits.secondaryTargets).toContain(unit12);
			expect(targetUnits.secondaryTargets).toContain(unit13);
			expect(targetUnits.secondaryTargets).toContain(unit14);
			expect(targetUnits.secondaryTargets).toContain(unit15);
		});

		it("BACK_ALLY should work", () => {
			const targetUnitsWhenHaveBackAlly = bm.getTarget(unit00, TARGET_TYPE.BACK_ALLY);

			expect(targetUnitsWhenHaveBackAlly.mainTarget).toBeNull();
			expect(targetUnitsWhenHaveBackAlly.secondaryTargets).toHaveLength(1);
			expect(targetUnitsWhenHaveBackAlly.secondaryTargets).toContain(unit01);

			const targetUnitsWhenOnBackColumn = bm.getTarget(unit02, TARGET_TYPE.BACK_ALLY);

			expect(targetUnitsWhenOnBackColumn.mainTarget).toBeNull();
			expect(targetUnitsWhenOnBackColumn.secondaryTargets).toHaveLength(0);

			const targetUnitsWhenNoBackAlly = bmEmpty.getTarget(unitAlone, TARGET_TYPE.BACK_ALLY);

			expect(targetUnitsWhenNoBackAlly.mainTarget).toBeNull();
			expect(targetUnitsWhenNoBackAlly.secondaryTargets).toHaveLength(0);
		});

		it("DIAGONAL_ALLIES should work", () => {
			const targetUnitsWhenMid = bm.getTarget(unit01, TARGET_TYPE.DIAGONAL_ALLIES);

			expect(targetUnitsWhenMid.mainTarget).toBeNull();
			expect(targetUnitsWhenMid.secondaryTargets).toHaveLength(2);
			expect(targetUnitsWhenMid.secondaryTargets).toContain(unit03);
			expect(targetUnitsWhenMid.secondaryTargets).toContain(unit05);

			const targetUnitsWhenFrontOrBot = bm.getTarget(unit00, TARGET_TYPE.DIAGONAL_ALLIES);

			expect(targetUnitsWhenFrontOrBot.mainTarget).toBeNull();
			expect(targetUnitsWhenFrontOrBot.secondaryTargets).toHaveLength(1);
			expect(targetUnitsWhenFrontOrBot.secondaryTargets).toContain(unit04);
		});

		it("FRONT_ALLY should work", () => {
			const targetUnitsWhenHaveFrontAlly = bm.getTarget(unit02, TARGET_TYPE.FRONT_ALLY);

			expect(targetUnitsWhenHaveFrontAlly.mainTarget).toBeNull();
			expect(targetUnitsWhenHaveFrontAlly.secondaryTargets).toHaveLength(1);
			expect(targetUnitsWhenHaveFrontAlly.secondaryTargets).toContain(unit01);

			const targetUnitsWhenOnFrontColumn = bm.getTarget(unit00, TARGET_TYPE.FRONT_ALLY);

			expect(targetUnitsWhenOnFrontColumn.mainTarget).toBeNull();
			expect(targetUnitsWhenOnFrontColumn.secondaryTargets).toHaveLength(0);

			const targetUnitsWhenNoFrontAlly = bmEmpty.getTarget(unitAlone, TARGET_TYPE.FRONT_ALLY);

			expect(targetUnitsWhenNoFrontAlly.mainTarget).toBeNull();
			expect(targetUnitsWhenNoFrontAlly.secondaryTargets).toHaveLength(0);
		});

		it("FURTHEST should work", () => {
			const targetUnits = bm.getTarget(unit00, TARGET_TYPE.FURTHEST);

			expect(targetUnits.mainTarget).toBe(unit15);
			expect(targetUnits.secondaryTargets).toHaveLength(0);
		});

		it("FURTHEST_BOX should work", () => {
			const targetUnits = bm.getTarget(unit00, TARGET_TYPE.FURTHEST_BOX);

			expect(targetUnits.mainTarget).toBe(unit15);
			expect(targetUnits.secondaryTargets).not.toContain(unit15);
			expect(targetUnits.secondaryTargets).toHaveLength(3);
			expect(targetUnits.secondaryTargets).toContain(unit11);
			expect(targetUnits.secondaryTargets).toContain(unit12);
			expect(targetUnits.secondaryTargets).toContain(unit14);
		});

		it("FURTHEST_COLUMN should work", () => {
			const targetUnits = bm.getTarget(unit00, TARGET_TYPE.FURTHEST_COLUMN);

			expect(targetUnits.mainTarget).toBe(unit15);
			expect(targetUnits.secondaryTargets).not.toContain(unit15);
			expect(targetUnits.secondaryTargets).toHaveLength(1);
			expect(targetUnits.secondaryTargets).toContain(unit12);
		});

		it("FURTHEST_ROW should work", () => {
			const targetUnits = bm.getTarget(unit00, TARGET_TYPE.FURTHEST_ROW);

			expect(targetUnits.mainTarget).toBe(unit15);
			expect(targetUnits.secondaryTargets).not.toContain(unit15);
			expect(targetUnits.secondaryTargets).toHaveLength(2);
			expect(targetUnits.secondaryTargets).toContain(unit13);
			expect(targetUnits.secondaryTargets).toContain(unit14);
		});

		it("LOWEST_HEALTH_ALLY should work", () => {
			const targetUnits = bm.getTarget(unit11, TARGET_TYPE.LOWEST_HEALTH_ALLY);

			expect(targetUnits.mainTarget).toBeNull();
			expect(targetUnits.secondaryTargets).toHaveLength(1);
			expect(targetUnits.secondaryTargets).toContain(unit10);
		});

		it("LOWEST_HEALTH_ENEMY should work", () => {
			const targetUnits = bm.getTarget(unit00, TARGET_TYPE.LOWEST_HEALTH_ENEMY);

			expect(targetUnits.mainTarget).toBe(unit10);
			expect(targetUnits.secondaryTargets).toHaveLength(0);
		});

		it("SAME_COLUMN_ALLIES should work", () => {
			const targetUnits = bm.getTarget(unit00, TARGET_TYPE.SAME_COLUMN_ALLIES);

			expect(targetUnits.mainTarget).toBeNull();
			expect(targetUnits.secondaryTargets).toHaveLength(2);
			expect(targetUnits.secondaryTargets).toContain(unit00);
			expect(targetUnits.secondaryTargets).toContain(unit03);
		});

		it("SAME_ROW_ALLIES should work", () => {
			const targetUnits = bm.getTarget(unit00, TARGET_TYPE.SAME_ROW_ALLIES);

			expect(targetUnits.mainTarget).toBeNull();
			expect(targetUnits.secondaryTargets).toHaveLength(3);
			expect(targetUnits.secondaryTargets).toContain(unit00);
			expect(targetUnits.secondaryTargets).toContain(unit01);
			expect(targetUnits.secondaryTargets).toContain(unit02);
		});

		it("SELF should work", () => {
			const targetUnits = bm.getTarget(unit00, TARGET_TYPE.SELF);

			expect(targetUnits.mainTarget).toBeNull();
			expect(targetUnits.secondaryTargets).toHaveLength(1);
			expect(targetUnits.secondaryTargets).toContain(unit00);
		});

		it("SIDE_ALLY should work", () => {
			const targetUnitsWhenHaveSideAlly = bm.getTarget(unit00, TARGET_TYPE.SIDE_ALLY);

			expect(targetUnitsWhenHaveSideAlly.mainTarget).toBeNull();
			expect(targetUnitsWhenHaveSideAlly.secondaryTargets).toHaveLength(1);
			expect(targetUnitsWhenHaveSideAlly.secondaryTargets).toContain(unit03);

			const targetUnitsWhenNoSideAlly = bmEmpty.getTarget(unitAlone, TARGET_TYPE.SIDE_ALLY);

			expect(targetUnitsWhenNoSideAlly.mainTarget).toBeNull();
			expect(targetUnitsWhenNoSideAlly.secondaryTargets).toHaveLength(0);
		});

		it("STANDARD should work", () => {
			const targetUnits = bm.getTarget(unit00, TARGET_TYPE.STANDARD);

			expect(targetUnits.mainTarget).toBe(unit10);
			expect(targetUnits.secondaryTargets).toHaveLength(0);
		});

		it("STANDARD_BOX should work", () => {
			const targetUnits = bm.getTarget(unit00, TARGET_TYPE.STANDARD_BOX);

			expect(targetUnits.mainTarget).toBe(unit10);
			expect(targetUnits.secondaryTargets).not.toContain(unit10);
			expect(targetUnits.secondaryTargets).toHaveLength(3);
			expect(targetUnits.secondaryTargets).toContain(unit11);
			expect(targetUnits.secondaryTargets).toContain(unit13);
			expect(targetUnits.secondaryTargets).toContain(unit14);
		});

		it("STANDARD_COLUMN should work", () => {
			const targetUnits = bm.getTarget(unit00, TARGET_TYPE.STANDARD_COLUMN);

			expect(targetUnits.mainTarget).toBe(unit10);
			expect(targetUnits.secondaryTargets).not.toContain(unit10);
			expect(targetUnits.secondaryTargets).toHaveLength(1);
			expect(targetUnits.secondaryTargets).toContain(unit13);
		});

		it("STANDARD_ROW should work", () => {
			const targetUnits = bm.getTarget(unit00, TARGET_TYPE.STANDARD_ROW);

			expect(targetUnits.mainTarget).toBe(unit10);
			expect(targetUnits.secondaryTargets).not.toContain(unit10);
			expect(targetUnits.secondaryTargets).toHaveLength(2);
			expect(targetUnits.secondaryTargets).toContain(unit11);
			expect(targetUnits.secondaryTargets).toContain(unit12);
		});
	});

	describe("Target Types with Taunt", () => {
		beforeAll(() => {
			// Apply TAUNT to 2 units to test target functions with taunt units
			[unit11, unit14].forEach(unit =>
				unit.statusEffectManager.applyStatusEffect({
					name: STATUS_EFFECT.TAUNT,
					quantity: 1,
				}),
			);

			/* Board
				02 01 00 | 10 11(T) 12
      			05 04 03 | 13 14(T) 15
			*/
		});

		it("ALL_ENEMIES should work the same with TAUNT enemies", () => {
			const targetUnits = bm.getTarget(unit00, TARGET_TYPE.ALL_ENEMIES);

			expect(targetUnits.mainTarget).toBeNull();
			expect(targetUnits.secondaryTargets).toHaveLength(6);
			expect(targetUnits.secondaryTargets).toContain(unit10);
			expect(targetUnits.secondaryTargets).toContain(unit11);
			expect(targetUnits.secondaryTargets).toContain(unit12);
			expect(targetUnits.secondaryTargets).toContain(unit13);
			expect(targetUnits.secondaryTargets).toContain(unit14);
			expect(targetUnits.secondaryTargets).toContain(unit15);
		});

		it("FURTHEST should work with TAUNT enemies", () => {
			const targetUnits = bm.getTarget(unit00, TARGET_TYPE.FURTHEST);

			expect(targetUnits.mainTarget).toBe(unit14);
			expect(targetUnits.secondaryTargets).toHaveLength(0);
		});

		it("FURTHEST_BOX should work with TAUNT enemies", () => {
			const targetUnits = bm.getTarget(unit00, TARGET_TYPE.FURTHEST_BOX);

			expect(targetUnits.mainTarget).toBe(unit14);
			expect(targetUnits.secondaryTargets).not.toContain(unit14);
			expect(targetUnits.secondaryTargets).toHaveLength(3);
			expect(targetUnits.secondaryTargets).toContain(unit10);
			expect(targetUnits.secondaryTargets).toContain(unit11);
			expect(targetUnits.secondaryTargets).toContain(unit13);
		});

		it("FURTHEST_COLUMN should work with TAUNT enemies", () => {
			const targetUnits = bm.getTarget(unit00, TARGET_TYPE.FURTHEST_COLUMN);

			expect(targetUnits.mainTarget).toBe(unit14);
			expect(targetUnits.secondaryTargets).not.toContain(unit14);
			expect(targetUnits.secondaryTargets).toHaveLength(1);
			expect(targetUnits.secondaryTargets).toContain(unit11);
		});

		it("FURTHEST_ROW should work with TAUNT enemies", () => {
			const targetUnits = bm.getTarget(unit00, TARGET_TYPE.FURTHEST_ROW);

			expect(targetUnits.mainTarget).toBe(unit14);
			expect(targetUnits.secondaryTargets).not.toContain(unit14);
			expect(targetUnits.secondaryTargets).toHaveLength(2);
			expect(targetUnits.secondaryTargets).toContain(unit13);
			expect(targetUnits.secondaryTargets).toContain(unit15);
		});

		it("LOWEST_HEALTH_ENEMY should work with TAUNT enemies", () => {
			const targetUnitsFullHealth = bm.getTarget(unit00, TARGET_TYPE.LOWEST_HEALTH_ENEMY);

			expect(targetUnitsFullHealth.mainTarget).toBe(unit11);
			expect(targetUnitsFullHealth.secondaryTargets).toHaveLength(0);

			unit14.receiveDamage(10);

			const targetUnitsWhenOneIsDamaged = bm.getTarget(unit00, TARGET_TYPE.LOWEST_HEALTH_ENEMY);

			expect(targetUnitsWhenOneIsDamaged.mainTarget).toBe(unit14);
			expect(targetUnitsWhenOneIsDamaged.secondaryTargets).toHaveLength(0);
		});

		it("STANDARD should work with TAUNT enemies", () => {
			const targetUnits = bm.getTarget(unit00, TARGET_TYPE.STANDARD);

			expect(targetUnits.mainTarget).toBe(unit11);
			expect(targetUnits.secondaryTargets).toHaveLength(0);
		});

		it("STANDARD_BOX should work with TAUNT enemies", () => {
			const targetUnits = bm.getTarget(unit00, TARGET_TYPE.STANDARD_BOX);

			expect(targetUnits.mainTarget).toBe(unit11);
			expect(targetUnits.secondaryTargets).not.toContain(unit11);
			expect(targetUnits.secondaryTargets).toHaveLength(3);
			expect(targetUnits.secondaryTargets).toContain(unit12);
			expect(targetUnits.secondaryTargets).toContain(unit14);
			expect(targetUnits.secondaryTargets).toContain(unit15);
		});

		it("STANDARD_COLUMN should work with TAUNT enemies", () => {
			const targetUnits = bm.getTarget(unit00, TARGET_TYPE.STANDARD_COLUMN);

			expect(targetUnits.mainTarget).toBe(unit11);
			expect(targetUnits.secondaryTargets).not.toContain(unit11);
			expect(targetUnits.secondaryTargets).toHaveLength(1);
			expect(targetUnits.secondaryTargets).toContain(unit14);
		});

		it("STANDARD_ROW should work with TAUNT enemies", () => {
			const targetUnits = bm.getTarget(unit00, TARGET_TYPE.STANDARD_ROW);

			expect(targetUnits.mainTarget).toBe(unit11);
			expect(targetUnits.secondaryTargets).not.toContain(unit11);
			expect(targetUnits.secondaryTargets).toHaveLength(2);
			expect(targetUnits.secondaryTargets).toContain(unit10);
			expect(targetUnits.secondaryTargets).toContain(unit12);
		});

		afterAll(() => {
			[unit11, unit14].forEach(unit =>
				unit.statusEffectManager.removeAllStacks(STATUS_EFFECT.TAUNT),
			);
		});
	});

	describe("Target Utils", () => {
		it("getAllTargetUnits", () => {
			const targetUnits = bm.getTarget(unit00, TARGET_TYPE.FURTHEST_BOX);

			const allTargets = getAllTargetUnits(targetUnits);

			expect(allTargets.length).toBe(4);
			expect(allTargets).toContain(unit15);
			expect(allTargets).toContain(unit11);
			expect(allTargets).toContain(unit12);
			expect(allTargets).toContain(unit14);
		});
	});
});
