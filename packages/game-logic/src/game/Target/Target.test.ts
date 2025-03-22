import { getTarget } from "./TargetUtils";
import { TARGET_TYPE } from "./TargetTypes";
import { BoardManager, OWNER } from "../BoardManager/BoardManager";
import { BattleUnit } from "../BattleUnit/BattleUnit";

const unit00 = new BattleUnit();
unit00.setPosition(0, 0); // row 0, col 0

const unit01 = new BattleUnit();
unit01.setPosition(0, 1); // row 0, col 1

const unit10 = new BattleUnit();
unit10.setPosition(1, 0); // row 1, col 0

const unit11 = new BattleUnit();
unit11.setPosition(1, 1); // row 1, col 1

const unit21 = new BattleUnit();
unit21.setPosition(1, 2); // col2 2, col 1



describe("Target", () => {
	describe("getTarget", () => {
		let bm: BoardManager;

		beforeAll(() => {
			bm = new BoardManager(2, 3);
			bm.addToBoard(unit00, OWNER.TEAM_ONE);
			bm.addToBoard(unit01, OWNER.TEAM_ONE);
			bm.addToBoard(unit10, OWNER.TEAM_ONE);
			bm.addToBoard(unit11, OWNER.TEAM_ONE);
			bm.addToBoard(unit21, OWNER.TEAM_ONE);
		});

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
			expect(ids2.sort()).toEqual([unit00.id, unit21.id, unit11.id].sort());

			const result3 = getTarget(bm, bm.getAt(1, 0, OWNER.TEAM_ONE), TARGET_TYPE.ADJACENT_ALLIES);
			const ids3 = result3.map(unit => unit.id);
			expect(ids3).toEqual([unit00.id, unit11.id]);

			const result4 = getTarget(bm, bm.getAt(1, 1, OWNER.TEAM_ONE), TARGET_TYPE.ADJACENT_ALLIES);
			const ids4 = result4.map(unit => unit.id);
			expect(ids4.sort()).toEqual([unit00.id, unit01.id, unit10.id, unit21.id].sort());

			const result5 = getTarget(bm, bm.getAt(1, 2, OWNER.TEAM_ONE), TARGET_TYPE.ADJACENT_ALLIES);
			const ids5 = result5.map(unit => unit.id);
			expect(ids5.sort()).toEqual([unit01.id, unit11.id].sort());
		});

		it("FRONT_ALLIES", () => {
			const result = getTarget(bm, bm.getAt(0, 1, OWNER.TEAM_ONE), TARGET_TYPE.FRONT_ALLIES);
			const ids = result.map(unit => unit.id)
			expect(ids.sort()).toEqual([].sort());

			const result2 = getTarget(bm, bm.getAt(1, 1, OWNER.TEAM_ONE), TARGET_TYPE.FRONT_ALLIES);
			const ids2 = result2.map(unit => unit.id)
			expect(ids2.sort()).toEqual([unit01.id, unit00.id].sort());

			const result3 = getTarget(bm, bm.getAt(0, 0, OWNER.TEAM_ONE), TARGET_TYPE.FRONT_ALLIES);
			const ids3 = result3.map(unit => unit.id)
			expect(ids3.sort()).toEqual([].sort());

			const result4 = getTarget(bm, bm.getAt(1, 0, OWNER.TEAM_ONE), TARGET_TYPE.FRONT_ALLIES);
			const ids4 = result4.map(unit => unit.id)
			expect(ids4.sort()).toEqual([unit00.id].sort());

			const result5 = getTarget(bm, bm.getAt(1, 2, OWNER.TEAM_ONE), TARGET_TYPE.FRONT_ALLIES);
			const ids5 = result5.map(unit => unit.id)
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

		/*
				it("FRONT_RIGHT", () => {
					const result = getTarget(bm, mockOriginator, TARGET_TYPE.FRONT_RIGHT);
					expect(result).toEqual([]); // Adjust based on actual implementation
				});
		
				it("FRONT_LEFT", () => {
					const result = getTarget(bm, mockOriginator, TARGET_TYPE.FRONT_LEFT);
					expect(result).toEqual([]); // Adjust based on actual implementation
				});
		
				it("BACK_ALLIES", () => {
					const result = getTarget(bm, mockOriginator, TARGET_TYPE.BACK_ALLIES);
					expect(result).toEqual([]); // Adjust based on actual implementation
				});
		
				it("BACK_RIGHT", () => {
					const result = getTarget(bm, mockOriginator, TARGET_TYPE.BACK_RIGHT);
					expect(result).toEqual([]); // Adjust based on actual implementation
				});
		
				it("BACK_LEFT", () => {
					const result = getTarget(bm, mockOriginator, TARGET_TYPE.BACK_LEFT);
					expect(result).toEqual([]); // Adjust based on actual implementation
				});
		
				it("LEFT_ALLY", () => {
					const result = getTarget(bm, mockOriginator, TARGET_TYPE.LEFT_ALLY);
					expect(result).toEqual([]); // Adjust based on actual implementation
				});
		
				it("RANDOM_ALLY", () => {
					const result = getTarget(bm, mockOriginator, TARGET_TYPE.RANDOM_ALLY);
					expect(result).toEqual([]); // Adjust based on actual implementation
				});
		
				it("RIGHT_ALLY", () => {
					const result = getTarget(bm, mockOriginator, TARGET_TYPE.RIGHT_ALLY);
					expect(result).toEqual([]); // Adjust based on actual implementation
				});
		
				it("SIDE_ALLIES", () => {
					const result = getTarget(bm, mockOriginator, TARGET_TYPE.SIDE_ALLIES);
					expect(result).toEqual([]); // Adjust based on actual implementation
				});
		
				it("ADJACENT", () => {
					const result = getTarget(bm, mockOriginator, TARGET_TYPE.ADJACENT);
					expect(result).toEqual([]); // Adjust based on actual implementation
				});
		
				it("CONE", () => {
					const result = getTarget(bm, mockOriginator, TARGET_TYPE.CONE);
					expect(result).toEqual([]); // Adjust based on actual implementation
				});
		
				it("LINE", () => {
					const result = getTarget(bm, mockOriginator, TARGET_TYPE.LINE);
					expect(result).toEqual([]); // Adjust based on actual implementation
				});
		
				it("RANDOM_ENEMY", () => {
					const result = getTarget(bm, mockOriginator, TARGET_TYPE.RANDOM_ENEMY);
					expect(result).toEqual([]); // Adjust based on actual implementation
				});
		
				it("SIDE", () => {
					const result = getTarget(bm, mockOriginator, TARGET_TYPE.SIDE);
					expect(result).toEqual([]); // Adjust based on actual implementation
				});
		
				it("SIDES", () => {
					const result = getTarget(bm, mockOriginator, TARGET_TYPE.SIDES);
					expect(result).toEqual([]); // Adjust based on actual implementation
				});
		
				it("STANDARD", () => {
					const result = getTarget(bm, mockOriginator, TARGET_TYPE.STANDARD);
					expect(result).toEqual([]); // Adjust based on actual implementation
				}); */
	});
});
