import { BattleUnit } from "@/game/BattleUnit/BattleUnit";
import { BoardManager, OWNER, Position } from "@/game/BoardManager/BoardManager";
import { RNG } from "@/utils/math";

export function getSelfTarget(_bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	return [originator];
}

export function getAdjacentAlliesTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	const grid = originator.owner === OWNER.TEAM_ONE ? bm.team1Board.grid : bm.team2Board.grid;
	const { row, column } = originator;

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
		if (pos.row >= 0 && pos.row < grid.length && pos.column >= 0 && pos.column < grid[0].length) {
			const space = grid[pos.row][pos.column];
			if (space?.unit) {
				targets.push(space.unit);
			}
		}
	}

	return targets;
}

export function getFrontAlliesTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	const grid = originator.owner === OWNER.TEAM_ONE ? bm.team1Board.grid : bm.team2Board.grid;

	const frontRow = originator.row - 1;
	const targets: BattleUnit[] = [];

	if (frontRow < 0) return targets;

	const isOddRow = originator.row % 2 === 1;

	const frontPositions: Position[] = isOddRow
		? [
				{ row: frontRow, column: originator.column - 1 },
				{ row: frontRow, column: originator.column },
			]
		: [
				{ row: frontRow, column: originator.column },
				{ row: frontRow, column: originator.column + 1 },
			];

	for (const pos of frontPositions) {
		if (pos.row >= 0 && pos.row < grid.length && pos.column >= 0 && pos.column < grid[0].length) {
			const space = grid[pos.row][pos.column];
			if (space?.unit) {
				targets.push(space.unit);
			}
		}
	}

	return targets;
}

export function getFrontRightTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	const grid = originator.owner === OWNER.TEAM_ONE ? bm.team1Board.grid : bm.team2Board.grid;

	const targets: BattleUnit[] = [];

	const frontRow = originator.row - 1;
	if (frontRow < 0) return targets;

	const isOddRow = originator.row % 2 === 1;

	const targetPos: Position = isOddRow
		? { row: frontRow, column: originator.column }
		: { row: frontRow, column: originator.column + 1 };

	if (
		targetPos.row >= 0 &&
		targetPos.row < grid.length &&
		targetPos.column >= 0 &&
		targetPos.column < grid[0].length
	) {
		const space = grid[targetPos.row][targetPos.column];
		if (space?.unit) {
			targets.push(space.unit);
		}
	}

	return targets;
}

export function getFrontLeftTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	const grid = originator.owner === OWNER.TEAM_ONE ? bm.team1Board.grid : bm.team2Board.grid;

	const targets: BattleUnit[] = [];

	const frontRow = originator.row - 1;
	if (frontRow < 0) return targets;

	const isOddRow = originator.row % 2 === 1;

	const targetPos: Position = isOddRow
		? { row: frontRow, column: originator.column - 1 }
		: { row: frontRow, column: originator.column };

	if (
		targetPos.row >= 0 &&
		targetPos.row < grid.length &&
		targetPos.column >= 0 &&
		targetPos.column < grid[0].length
	) {
		const space = grid[targetPos.row][targetPos.column];
		if (space?.unit) {
			targets.push(space.unit);
		}
	}

	return targets;
}

export function getBackAlliesTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	const grid = originator.owner === OWNER.TEAM_ONE ? bm.team1Board.grid : bm.team2Board.grid;

	const backRow = originator.row + 1;
	const targets: BattleUnit[] = [];

	if (backRow >= grid.length) return targets;

	const isOddRow = originator.row % 2 === 1;

	const backPositions: Position[] = isOddRow
		? [
				{ row: backRow, column: originator.column - 1 },
				{ row: backRow, column: originator.column },
			]
		: [
				{ row: backRow, column: originator.column },
				{ row: backRow, column: originator.column + 1 },
			];

	for (const pos of backPositions) {
		if (pos.row >= 0 && pos.row < grid.length && pos.column >= 0 && pos.column < grid[0].length) {
			const space = grid[pos.row][pos.column];
			if (space?.unit) {
				targets.push(space.unit);
			}
		}
	}

	return targets;
}

export function getBackRightTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	const grid = originator.owner === OWNER.TEAM_ONE ? bm.team1Board.grid : bm.team2Board.grid;

	const targets: BattleUnit[] = [];

	const backRow = originator.row + 1;
	if (backRow >= grid.length) return targets;

	const isOddRow = originator.row % 2 === 1;

	const targetPos: Position = isOddRow
		? { row: backRow, column: originator.column }
		: { row: backRow, column: originator.column + 1 };

	if (
		targetPos.row >= 0 &&
		targetPos.row < grid.length &&
		targetPos.column >= 0 &&
		targetPos.column < grid[0].length
	) {
		const space = grid[targetPos.row][targetPos.column];
		if (space?.unit) {
			targets.push(space.unit);
		}
	}

	return targets;
}

export function getBackLeftTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	const grid = originator.owner === OWNER.TEAM_ONE ? bm.team1Board.grid : bm.team2Board.grid;

	const targets: BattleUnit[] = [];

	const backRow = originator.row + 1;
	if (backRow >= grid.length) return targets;

	const isOddRow = originator.row % 2 === 1;

	const targetPos: Position = isOddRow
		? { row: backRow, column: originator.column - 1 }
		: { row: backRow, column: originator.column };

	if (
		targetPos.row >= 0 &&
		targetPos.row < grid.length &&
		targetPos.column >= 0 &&
		targetPos.column < grid[0].length
	) {
		const space = grid[targetPos.row][targetPos.column];
		if (space?.unit) {
			targets.push(space.unit);
		}
	}

	return targets;
}

export function getLeftAllyTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	const grid = originator.owner === OWNER.TEAM_ONE ? bm.team1Board.grid : bm.team2Board.grid;

	const leftColumn = originator.column - 1;

	if (leftColumn < 0) {
		return [];
	}

	const target = grid[originator.row][leftColumn].unit;

	if (!target) {
		return [];
	}

	return [target];
}

export function getRightAllyTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	const grid = originator.owner === OWNER.TEAM_ONE ? bm.team1Board.grid : bm.team2Board.grid;

	const rightColumn = originator.column + 1;

	if (rightColumn >= grid[0].length) {
		return [];
	}

	const target = grid[originator.row][rightColumn].unit;

	if (!target) {
		return [];
	}

	return [target];
}

export function getSideAlliesTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	const grid = originator.owner === OWNER.TEAM_ONE ? bm.team1Board.grid : bm.team2Board.grid;

	const leftColumn = originator.column - 1;
	const rightColumn = originator.column + 1;

	const targets: BattleUnit[] = [];

	if (leftColumn >= 0) {
		const leftTarget = grid[originator.row][leftColumn].unit;
		if (leftTarget) {
			targets.push(leftTarget);
		}
	}

	if (rightColumn < grid[0].length) {
		const rightTarget = grid[originator.row][rightColumn].unit;
		if (rightTarget) {
			targets.push(rightTarget);
		}
	}

	return targets;
}

export function getRandomAllyTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	const allies = bm.getAllUnitsOfOwner(originator.owner).filter(ally => ally.id !== originator.id);
	if (allies.length === 0) {
		return [];
	}
	const randomIndex = RNG.between(0, allies.length - 1);
	const randomAlly = allies[randomIndex];
	return [randomAlly];
}

export function getAdjacentTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	// Implement logic for getting adjacent target
	return [];
}

export function getConeTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	// Implement logic for getting cone target
	return [];
}

export function getLineTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	// Implement logic for getting line target
	return [];
}

export function getRandomEnemyTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	// Implement logic for getting random enemy
	return [];
}

export function getSideTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	// Implement logic for getting side target
	return [];
}

export function getSidesTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	// Implement logic for getting sides target
	return [];
}

export function getSideAllyTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	return [];
}

export function getStandardTarget(bm: BoardManager, originator: BattleUnit): BattleUnit[] {
	const grid = originator.owner === OWNER.TEAM_ONE ? bm.team2Board.grid : bm.team1Board.grid;

	const randomFrontEnemy = grid[0][RNG.between(0, grid[0].length - 1)].unit;
	if (randomFrontEnemy) {
		return [randomFrontEnemy];
	}

	const randomBackEnemy = grid[grid.length - 1][RNG.between(0, grid[0].length - 1)].unit;
	if (randomBackEnemy) {
		return [randomBackEnemy];
	}
	return [];
}
