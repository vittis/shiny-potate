import {
	getSelfTarget,
	getAdjacentAlliesTarget,
	getFrontAlliesTarget,
	getFrontRightTarget,
	getFrontLeftTarget,
	getBackAlliesTarget,
	getBackRightTarget,
	getBackLeftTarget,
	getLeftAllyTarget,
	getRandomAllyTarget,
	getRightAllyTarget,
	getSideAlliesTarget,
	getAdjacentTarget,
	getConeTarget,
	getLineTarget,
	getRandomEnemyTarget,
	getSideTarget,
	getSidesTarget,
	getStandardTarget,
	getSideAllyTarget,
} from "./TargetFunctions";
import { RNG } from "../../utils/math";
import { BattleUnit } from "../BattleUnit/BattleUnit";
import { BoardManager, OWNER, Position, Space } from "../BoardManager/BoardManager";
import { TARGET_TYPE } from "./TargetTypes";

export const TargetFunctionMap: {
	[key in TARGET_TYPE]: (bm: BoardManager, originator: BattleUnit) => BattleUnit[];
} = {
	SELF: getSelfTarget,
	ADJACENT_ALLIES: getAdjacentAlliesTarget,
	FRONT_ALLIES: getFrontAlliesTarget,
	FRONT_RIGHT: getFrontRightTarget,
	FRONT_LEFT: getFrontLeftTarget,
	BACK_ALLIES: getBackAlliesTarget,
	BACK_RIGHT: getBackRightTarget,
	BACK_LEFT: getBackLeftTarget,
	LEFT_ALLY: getLeftAllyTarget,
	RANDOM_ALLY: getRandomAllyTarget,
	RIGHT_ALLY: getRightAllyTarget,
	SIDE_ALLIES: getSideAlliesTarget,
	SIDE_ALLY: getSideAllyTarget,
	STANDARD: getStandardTarget,
	ADJACENT: getAdjacentTarget,
	CONE: getConeTarget,
	LINE: getLineTarget,
	RANDOM_ENEMY: getRandomEnemyTarget,
	SIDE: getSideTarget,
	SIDES: getSidesTarget,
};

export function getTarget(
	bm: BoardManager,
	originator: BattleUnit,
	targetType: TARGET_TYPE,
): BattleUnit[] {
	const targetFunction = TargetFunctionMap[targetType];
	if (!targetFunction) {
		throw new Error(`Target function for ${targetType} not found`);
	}
	return targetFunction(bm, originator);
}
