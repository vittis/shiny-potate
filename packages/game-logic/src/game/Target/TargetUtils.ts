import { BattleUnit } from "@/game/BattleUnit/BattleUnit";
import { BoardManager } from "@/game/BoardManager/BoardManager";
import {
	getAdjacentAlliesTarget,
	getAdjacentTarget,
	getBackAlliesTarget,
	getBackLeftTarget,
	getBackRightTarget,
	getConeTarget,
	getFrontAlliesTarget,
	getFrontLeftTarget,
	getFrontRightTarget,
	getLeftAllyTarget,
	getLineTarget,
	getRandomAllyTarget,
	getRandomEnemyTarget,
	getRightAllyTarget,
	getSelfTarget,
	getSideAlliesTarget,
	getSideAllyTarget,
	getSideTarget,
	getSidesTarget,
	getStandardTarget,
} from "@/game/Target/TargetFunctions";
import { TARGET_TYPE } from "@/game/Target/TargetTypes";

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
