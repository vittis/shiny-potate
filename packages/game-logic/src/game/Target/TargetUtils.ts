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
	const grid =
		bm.team1Board.grid.some(row =>
			row.some(space => space.unit?.id === originator.id)
		)
			? bm.team1Board.grid
			: bm.team2Board.grid; const { row, column } = originator;

	const adjacentPositions: Position[] = [
		{ row: row - 1, column },
		{ row: row - 1, column: column - 1 },
		{ row, column: column - 1 },
		{ row: row + 1, column },
		{ row: row + 1, column: column + 1 },
		{ row, column: column + 1 },
	];

	const targets: BattleUnit[] = [];

	for (const pos of adjacentPositions) {
		if (
			pos.row >= 0 && pos.row < grid.length &&
			pos.column >= 0 && pos.column < grid[0].length
		) {
			const space = grid[pos.row][pos.column];
			if (space?.unit) {
				targets.push(space.unit);
			}
		}
	}

	return targets;
}


export function getFrontAlliesTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	const grid =
		bm.team1Board.grid.some(row =>
			row.some(space => space.unit?.id === originator.id)
		)
			? bm.team1Board.grid
			: bm.team2Board.grid;
	const { row, column } = originator;

	const frontRow = row - 1;
	const targets: BattleUnit[] = [];

	if (frontRow < 0) return targets;

	const isOddRow = row % 2 === 1;

	const frontPositions: Position[] = isOddRow
		? [
			{ row: frontRow, column: column - 1 },
			{ row: frontRow, column },
		]
		: [
			{ row: frontRow, column },
			{ row: frontRow, column: column + 1 }
		];

	for (const pos of frontPositions) {
		if (
			pos.row >= 0 && pos.row < grid.length &&
			pos.column >= 0 && pos.column < grid[0].length
		) {
			const space = grid[pos.row][pos.column];
			if (space?.unit) {
				targets.push(space.unit);
			}
		}
	}

	return targets;
}

function getFrontRightTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	const grid =
		bm.team1Board.grid.some(row =>
			row.some(space => space.unit?.id === originator.id)
		)
			? bm.team1Board.grid
			: bm.team2Board.grid;

	const { row, column } = originator;
	const targets: BattleUnit[] = [];

	const frontRow = row - 1;
	if (frontRow < 0) return targets;

	const isOddRow = row % 2 === 1;

	const targetPos: Position = isOddRow
		? { row: frontRow, column }
		: { row: frontRow, column: column + 1 };

	if (
		targetPos.row >= 0 && targetPos.row < grid.length &&
		targetPos.column >= 0 && targetPos.column < grid[0].length
	) {
		const space = grid[targetPos.row][targetPos.column];
		if (space?.unit) {
			targets.push(space.unit);
		}
	}

	return targets;
}


function getFrontLeftTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	const grid =
		bm.team1Board.grid.some(row =>
			row.some(space => space.unit?.id === originator.id)
		)
			? bm.team1Board.grid
			: bm.team2Board.grid;

	const { row, column } = originator;
	const targets: BattleUnit[] = [];

	const frontRow = row - 1;
	if (frontRow < 0) return targets;

	const isOddRow = row % 2 === 1;

	const targetPos: Position = isOddRow
		? { row: frontRow, column: column - 1 }
		: { row: frontRow, column };

	if (
		targetPos.row >= 0 && targetPos.row < grid.length &&
		targetPos.column >= 0 && targetPos.column < grid[0].length
	) {
		const space = grid[targetPos.row][targetPos.column];
		if (space?.unit) {
			targets.push(space.unit);
		}
	}

	return targets;
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
