import { getTarget } from "./TargetUtils";
import { TARGET_TYPE } from "./TargetTypes";
import { BoardManager, OWNER } from "../BoardManager/BoardManager";
import { BattleUnit } from "../BattleUnit/BattleUnit";
import { RNG } from "../../utils/math";

// -----------------------------------------------------------------
// TEAM ONE
const unit00 = new BattleUnit();
unit00.setPosition(0, 0); // row 0, col 0
unit00.setOwner(OWNER.TEAM_ONE);

const unit01 = new BattleUnit();
unit01.setPosition(0, 1); // row 0, col 1
unit01.setOwner(OWNER.TEAM_ONE);

const unit10 = new BattleUnit();
unit10.setPosition(1, 0); // row 1, col 0
unit10.setOwner(OWNER.TEAM_ONE);

const unit11 = new BattleUnit();
unit11.setPosition(1, 1); // row 1, col 1
unit11.setOwner(OWNER.TEAM_ONE);

const unit12 = new BattleUnit();
unit12.setPosition(1, 2); // row 1, col 2
unit12.setOwner(OWNER.TEAM_ONE);

// -----------------------------------------------------------------
// TEAM TWO
const enemyUnit00 = new BattleUnit();
enemyUnit00.setPosition(0, 0); // row 0, col 0
enemyUnit00.setOwner(OWNER.TEAM_TWO);

const enemyUnit01 = new BattleUnit();
enemyUnit01.setPosition(0, 1); // row 0, col 1
enemyUnit01.setOwner(OWNER.TEAM_TWO);

const enemyUnit10 = new BattleUnit();
enemyUnit10.setPosition(1, 0); // row 1, col 0
enemyUnit10.setOwner(OWNER.TEAM_TWO);

const enemyUnit11 = new BattleUnit();
enemyUnit11.setPosition(1, 1); // row 1, col 1
enemyUnit11.setOwner(OWNER.TEAM_TWO);

const enemyUnit12 = new BattleUnit();
enemyUnit12.setPosition(1, 2); // row 1, col 2
enemyUnit12.setOwner(OWNER.TEAM_TWO);
// -----------------------------------------------------------------

describe("Target", () => {
	describe("getTarget", () => {
		let bm: BoardManager;

		beforeAll(() => {
			bm = new BoardManager(3, 3);
			bm.addToBoard(unit00, OWNER.TEAM_ONE);
			bm.addToBoard(unit01, OWNER.TEAM_ONE);
			bm.addToBoard(unit10, OWNER.TEAM_ONE);
			bm.addToBoard(unit11, OWNER.TEAM_ONE);
			bm.addToBoard(unit12, OWNER.TEAM_ONE);

			bm.addToBoard(enemyUnit00, OWNER.TEAM_TWO);
			bm.addToBoard(enemyUnit01, OWNER.TEAM_TWO);
			bm.addToBoard(enemyUnit10, OWNER.TEAM_TWO);
			bm.addToBoard(enemyUnit11, OWNER.TEAM_TWO);
			bm.addToBoard(enemyUnit12, OWNER.TEAM_TWO);
		});

		describe("Allies", () => {
			it("SELF", () => {
				const originator = bm.getAt(0, 0, OWNER.TEAM_ONE);
				const result = getTarget(bm, originator, TARGET_TYPE.SELF);
				expect(result).toEqual([originator]);
			});

			it("ADJACENT_ALLIES", () => {
				const result = getTarget(bm, bm.getAt(0, 0, OWNER.TEAM_ONE), TARGET_TYPE.ADJACENT_ALLIES);
				const ids = result.map(unit => unit.id);
				expect(ids.sort()).toEqual([unit01.id, unit11.id, unit10.id].sort());

				const result2 = getTarget(bm, bm.getAt(0, 1, OWNER.TEAM_ONE), TARGET_TYPE.ADJACENT_ALLIES);
				const ids2 = result2.map(unit => unit.id);
				expect(ids2.sort()).toEqual([unit00.id, unit12.id, unit11.id].sort());

				const result3 = getTarget(bm, bm.getAt(1, 0, OWNER.TEAM_ONE), TARGET_TYPE.ADJACENT_ALLIES);
				const ids3 = result3.map(unit => unit.id);
				expect(ids3).toEqual([unit00.id, unit11.id]);

				const result4 = getTarget(bm, bm.getAt(1, 1, OWNER.TEAM_ONE), TARGET_TYPE.ADJACENT_ALLIES);
				const ids4 = result4.map(unit => unit.id);
				expect(ids4.sort()).toEqual([unit00.id, unit01.id, unit10.id, unit12.id].sort());

				const result5 = getTarget(bm, bm.getAt(1, 2, OWNER.TEAM_ONE), TARGET_TYPE.ADJACENT_ALLIES);
				const ids5 = result5.map(unit => unit.id);
				expect(ids5.sort()).toEqual([unit01.id, unit11.id].sort());
			});

			it("FRONT_ALLIES", () => {
				const result = getTarget(bm, bm.getAt(0, 1, OWNER.TEAM_ONE), TARGET_TYPE.FRONT_ALLIES);
				const ids = result.map(unit => unit.id);
				expect(ids.sort()).toEqual([]);

				const result2 = getTarget(bm, bm.getAt(1, 1, OWNER.TEAM_ONE), TARGET_TYPE.FRONT_ALLIES);
				const ids2 = result2.map(unit => unit.id);
				expect(ids2.sort()).toEqual([unit01.id, unit00.id].sort());

				const result3 = getTarget(bm, bm.getAt(0, 0, OWNER.TEAM_ONE), TARGET_TYPE.FRONT_ALLIES);
				const ids3 = result3.map(unit => unit.id);
				expect(ids3.sort()).toEqual([]);

				const result4 = getTarget(bm, bm.getAt(1, 0, OWNER.TEAM_ONE), TARGET_TYPE.FRONT_ALLIES);
				const ids4 = result4.map(unit => unit.id);
				expect(ids4.sort()).toEqual([unit00.id].sort());

				const result5 = getTarget(bm, bm.getAt(1, 2, OWNER.TEAM_ONE), TARGET_TYPE.FRONT_ALLIES);
				const ids5 = result5.map(unit => unit.id);
				expect(ids5.sort()).toEqual([unit01.id].sort());
			});
			it("FRONT_RIGHT", () => {
				const result1 = getTarget(bm, bm.getAt(1, 1, OWNER.TEAM_ONE), TARGET_TYPE.FRONT_RIGHT);
				expect(result1.map(u => u.id)).toEqual([unit01.id]);

				const result2 = getTarget(bm, bm.getAt(1, 0, OWNER.TEAM_ONE), TARGET_TYPE.FRONT_RIGHT);
				expect(result2.map(u => u.id)).toEqual([unit00.id]);

				const result3 = getTarget(bm, bm.getAt(1, 2, OWNER.TEAM_ONE), TARGET_TYPE.FRONT_RIGHT);
				expect(result3).toEqual([]);

				const result4 = getTarget(bm, bm.getAt(0, 0, OWNER.TEAM_ONE), TARGET_TYPE.FRONT_RIGHT);
				expect(result4).toEqual([]);

				const result5 = getTarget(bm, bm.getAt(0, 1, OWNER.TEAM_ONE), TARGET_TYPE.FRONT_RIGHT);
				expect(result5).toEqual([]);
			});
			it("FRONT_LEFT", () => {
				const result1 = getTarget(bm, bm.getAt(1, 1, OWNER.TEAM_ONE), TARGET_TYPE.FRONT_LEFT);
				expect(result1.map(u => u.id)).toEqual([unit00.id]);

				const result2 = getTarget(bm, bm.getAt(1, 2, OWNER.TEAM_ONE), TARGET_TYPE.FRONT_LEFT);
				expect(result2.map(u => u.id)).toEqual([unit01.id]);

				const result3 = getTarget(bm, bm.getAt(1, 0, OWNER.TEAM_ONE), TARGET_TYPE.FRONT_LEFT);
				expect(result3).toEqual([]);

				const result4 = getTarget(bm, bm.getAt(0, 0, OWNER.TEAM_ONE), TARGET_TYPE.FRONT_LEFT);
				expect(result4).toEqual([]);

				const result5 = getTarget(bm, bm.getAt(0, 1, OWNER.TEAM_ONE), TARGET_TYPE.FRONT_LEFT);
				expect(result5).toEqual([]);
			});

			it("BACK_ALLIES", () => {
				const result1 = getTarget(bm, bm.getAt(0, 0, OWNER.TEAM_ONE), TARGET_TYPE.BACK_ALLIES);
				expect(result1.map(u => u.id).sort()).toEqual([unit10.id, unit11.id].sort());

				const result2 = getTarget(bm, bm.getAt(0, 1, OWNER.TEAM_ONE), TARGET_TYPE.BACK_ALLIES);
				expect(result2.map(u => u.id).sort()).toEqual([unit11.id, unit12.id].sort());

				const result3 = getTarget(bm, bm.getAt(1, 1, OWNER.TEAM_ONE), TARGET_TYPE.BACK_ALLIES);
				expect(result3).toEqual([]);

				const result4 = getTarget(bm, bm.getAt(1, 0, OWNER.TEAM_ONE), TARGET_TYPE.BACK_ALLIES);
				expect(result4).toEqual([]);

				const result5 = getTarget(bm, bm.getAt(1, 2, OWNER.TEAM_ONE), TARGET_TYPE.BACK_ALLIES);
				expect(result5).toEqual([]);
			});

			it("BACK_RIGHT", () => {
				const result1 = getTarget(bm, bm.getAt(0, 0, OWNER.TEAM_ONE), TARGET_TYPE.BACK_RIGHT);
				expect(result1.map(u => u.id)).toEqual([unit11.id]);

				const result2 = getTarget(bm, bm.getAt(0, 1, OWNER.TEAM_ONE), TARGET_TYPE.BACK_RIGHT);
				expect(result2.map(u => u.id)).toEqual([unit12.id]);

				const result3 = getTarget(bm, bm.getAt(1, 0, OWNER.TEAM_ONE), TARGET_TYPE.BACK_RIGHT);
				expect(result3).toEqual([]);

				const result4 = getTarget(bm, bm.getAt(1, 1, OWNER.TEAM_ONE), TARGET_TYPE.BACK_RIGHT);
				expect(result4).toEqual([]);

				const result5 = getTarget(bm, bm.getAt(1, 2, OWNER.TEAM_ONE), TARGET_TYPE.BACK_RIGHT);
				expect(result5).toEqual([]);
			});

			it("BACK_LEFT", () => {
				const result1 = getTarget(bm, bm.getAt(0, 1, OWNER.TEAM_ONE), TARGET_TYPE.BACK_LEFT);
				expect(result1.map(u => u.id)).toEqual([unit11.id]);

				const result2 = getTarget(bm, bm.getAt(0, 0, OWNER.TEAM_ONE), TARGET_TYPE.BACK_LEFT);
				expect(result2.map(u => u.id)).toEqual([unit10.id]);

				const result3 = getTarget(bm, bm.getAt(1, 0, OWNER.TEAM_ONE), TARGET_TYPE.BACK_LEFT);
				expect(result3).toEqual([]);

				const result4 = getTarget(bm, bm.getAt(1, 1, OWNER.TEAM_ONE), TARGET_TYPE.BACK_LEFT);
				expect(result4).toEqual([]);

				const result5 = getTarget(bm, bm.getAt(1, 2, OWNER.TEAM_ONE), TARGET_TYPE.BACK_LEFT);
				expect(result5).toEqual([]);
			});

			it("LEFT_ALLY", () => {
				const result1 = getTarget(bm, bm.getAt(0, 1, OWNER.TEAM_ONE), TARGET_TYPE.LEFT_ALLY);
				expect(result1.map(u => u.id)).toEqual([unit00.id]);

				const result2 = getTarget(bm, bm.getAt(1, 1, OWNER.TEAM_ONE), TARGET_TYPE.LEFT_ALLY);
				expect(result2.map(u => u.id)).toEqual([unit10.id]);

				const result3 = getTarget(bm, bm.getAt(1, 2, OWNER.TEAM_ONE), TARGET_TYPE.LEFT_ALLY);
				expect(result3.map(u => u.id)).toEqual([unit11.id]);

				const result4 = getTarget(bm, bm.getAt(0, 0, OWNER.TEAM_ONE), TARGET_TYPE.LEFT_ALLY);
				expect(result4).toEqual([]);

				const result5 = getTarget(bm, bm.getAt(1, 0, OWNER.TEAM_ONE), TARGET_TYPE.LEFT_ALLY);
				expect(result5).toEqual([]);
			});

			it("RIGHT_ALLY", () => {
				const result1 = getTarget(bm, bm.getAt(0, 0, OWNER.TEAM_ONE), TARGET_TYPE.RIGHT_ALLY);
				expect(result1.map(u => u.id)).toEqual([unit01.id]);

				const result2 = getTarget(bm, bm.getAt(1, 0, OWNER.TEAM_ONE), TARGET_TYPE.RIGHT_ALLY);
				expect(result2.map(u => u.id)).toEqual([unit11.id]);

				const result3 = getTarget(bm, bm.getAt(1, 1, OWNER.TEAM_ONE), TARGET_TYPE.RIGHT_ALLY);
				expect(result3.map(u => u.id)).toEqual([unit12.id]);

				const result4 = getTarget(bm, bm.getAt(0, 1, OWNER.TEAM_ONE), TARGET_TYPE.RIGHT_ALLY);
				expect(result4.map(u => u.id)).toEqual([]);

				const result5 = getTarget(bm, bm.getAt(1, 2, OWNER.TEAM_ONE), TARGET_TYPE.RIGHT_ALLY);
				expect(result5.map(u => u.id)).toEqual([]);
			});

			it("SIDE_ALLIES", () => {
				const result1 = getTarget(bm, bm.getAt(0, 0, OWNER.TEAM_ONE), TARGET_TYPE.SIDE_ALLIES);
				expect(result1.map(u => u.id)).toEqual([unit01.id]);

				const result2 = getTarget(bm, bm.getAt(1, 0, OWNER.TEAM_ONE), TARGET_TYPE.SIDE_ALLIES);
				expect(result2.map(u => u.id)).toEqual([unit11.id]);

				const result3 = getTarget(bm, bm.getAt(1, 1, OWNER.TEAM_ONE), TARGET_TYPE.SIDE_ALLIES);
				expect(result3.map(u => u.id).sort()).toEqual([unit10.id, unit12.id].sort());

				const result4 = getTarget(bm, bm.getAt(0, 1, OWNER.TEAM_ONE), TARGET_TYPE.SIDE_ALLIES);
				expect(result4.map(u => u.id)).toEqual([unit00.id]);

				const result5 = getTarget(bm, bm.getAt(1, 2, OWNER.TEAM_ONE), TARGET_TYPE.SIDE_ALLIES);
				expect(result5.map(u => u.id)).toEqual([unit11.id]);
			});

			it("RANDOM_ALLY", () => {
				vitest.spyOn(RNG, "between").mockReturnValue(0);
				const result1 = getTarget(bm, bm.getAt(0, 0, OWNER.TEAM_ONE), TARGET_TYPE.RANDOM_ALLY);
				expect(result1.map(u => u.id)).toEqual([unit01.id]);

				vitest.spyOn(RNG, "between").mockReturnValue(1);
				const result2 = getTarget(bm, bm.getAt(0, 0, OWNER.TEAM_ONE), TARGET_TYPE.RANDOM_ALLY);
				expect(result2.map(u => u.id)).toEqual([unit10.id]);

				vitest.spyOn(RNG, "between").mockReturnValue(2);
				const result3 = getTarget(bm, bm.getAt(0, 0, OWNER.TEAM_ONE), TARGET_TYPE.RANDOM_ALLY);
				expect(result3.map(u => u.id)).toEqual([unit11.id]);

				vitest.spyOn(RNG, "between").mockReturnValue(3);
				const result4 = getTarget(bm, bm.getAt(0, 0, OWNER.TEAM_ONE), TARGET_TYPE.RANDOM_ALLY);
				expect(result4.map(u => u.id)).toEqual([unit12.id]);
			});
		});

		describe("Enemies", () => {
			it("STANDARD", () => {
				vitest.spyOn(RNG, "between").mockReturnValue(0);
				const result1 = getTarget(bm, bm.getAt(0, 0, OWNER.TEAM_ONE), TARGET_TYPE.STANDARD);
				expect(result1.map(u => u.id).sort()).toEqual([enemyUnit00.id]);

				vitest.spyOn(RNG, "between").mockReturnValue(1);
				const result2 = getTarget(bm, bm.getAt(0, 0, OWNER.TEAM_ONE), TARGET_TYPE.STANDARD);
				expect(result2.map(u => u.id).sort()).toEqual([enemyUnit01.id]);
			});
		});
	});
});
