import { BattleUnit } from "../BattleUnit/BattleUnit";
import { BoardManager, Position, Space } from "../BoardManager/BoardManager";
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
	const grid = bm.team1Board.grid;
	const { row, column } = originator;
	const adjacentPositions: Position[] = [
		{ row: row - 1, column },
		{ row: row + 1, column },
		{ row, column: column - 1 },
		{ row, column: column + 1 },
	];

	const targets: BattleUnit[] = [];
	for (const pos of adjacentPositions) {
		const space: Space = grid[pos.row][pos.column];
		if (space.unit) {
			targets.push(space.unit);
		}
	}

	return targets;
}

export function getFrontAlliesTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	console.log(bm.team1Board);

	return [];
}

function getFrontRightTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	return [];
}

function getFrontLeftTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	return [];
}

function getBackAlliesTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	return [];
}

function getBackRightTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	return [];
}

function getBackLeftTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
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
