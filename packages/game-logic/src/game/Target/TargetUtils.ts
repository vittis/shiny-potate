import { BattleUnit } from "../BattleUnit/BattleUnit";
import { BoardManager, Position, Space } from "../BoardManager/BoardManager";
import { TARGET_TYPE } from "./TargetTypes";

export const TargetFunctionMap = {
	SELF: getSelfTarget,
	ADJACENT_ALLIES: getAdjacentAlliesTarget,
	BACK_ALLY: getBackAllyTarget,
	FRONT_ALLY: getFrontAllyTarget,
	LEFT_ALLY: getLeftAllyTarget,
	RANDOM_ALLY: getRandomAllyTarget,
	RIGHT_ALLY: getRightAllyTarget,
	SIDE_ALLIES: getSideAlliesTarget,
	ADJACENT: getAdjacentTarget,
	CONE: getConeTarget,
	LINE: getLineTarget,
	RANDOM_ENEMY: getRandomEnemyTarget,
	SIDE: getSideTarget,
	SIDES: getSidesTarget,
	STANDARD: getStandardTarget,
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

function getSelfTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	return [originator];
}

function getAdjacentAlliesTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	// Implement logic for getting adjacent allies
	return [];
}

function getBackAllyTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	// Implement logic for getting back ally
	return [];
}

function getFrontAllyTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	// Implement logic for getting front ally
	return [];
}

function getLeftAllyTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	// Implement logic for getting left ally
	return [];
}

function getRandomAllyTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	// Implement logic for getting random ally
	return [];
}

function getRightAllyTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	// Implement logic for getting right ally
	return [];
}

function getSideAlliesTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	// Implement logic for getting side allies
	return [];
}

function getAdjacentTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	// Implement logic for getting adjacent target
	return [];
}

function getConeTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	// Implement logic for getting cone target
	return [];
}

function getLineTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	// Implement logic for getting line target
	return [];
}

function getRandomEnemyTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	// Implement logic for getting random enemy
	return [];
}

function getSideTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	// Implement logic for getting side target
	return [];
}

function getSidesTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	// Implement logic for getting sides target
	return [];
}

function getStandardTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	// Implement logic for getting standard target
	return [];
}
