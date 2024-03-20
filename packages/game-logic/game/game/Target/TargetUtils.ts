import { BOX, BoardManager, COLUMN, ROW } from "../BoardManager";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { Unit } from "../Unit/Unit";
import { TARGET_TYPE, TargetUnits } from "./TargetTypes";

export const TargetFunctionMap: {
	[key: string]: (bm: BoardManager, unit: Unit) => Unit | Unit[];
} = {
	ADJACENT_ALLIES: getAdjacentAlliesTarget,
	ALL_ALLIES: getAllAlliedUnitsTarget,
	ALL_ENEMIES: getAllEnemyUnitsTarget,
	ALL_UNITS: getAllUnitsTarget,
	BACK_ALLY: getBackAllyTarget,
	DIAGONAL_ALLIES: getDiagonalAlliesTarget,
	FRONT_ALLY: getFrontAllyTarget,
	FURTHEST: getFurthestTarget,
	FURTHEST_BOX: getFurthestBoxTarget,
	FURTHEST_COLUMN: getFurthestColumnTarget,
	FURTHEST_ROW: getFurthestRowTarget,
	LOWEST_HEALTH_ALLY: getLowestHealthAllyTarget,
	LOWEST_HEALTH_ENEMY: getLowestHealthEnemyTarget,
	SAME_COLUMN_ALLIES: getSameColumnAlliesTarget,
	SAME_ROW_ALLIES: getSameRowAlliesTarget,
	SELF: getSelfTarget,
	SIDE_ALLY: getSideAllyTarget,
	STANDARD: getStandardTarget,
	STANDARD_BOX: getStandardBoxTarget,
	STANDARD_COLUMN: getStandardColumnTarget,
	STANDARD_ROW: getStandardRowTarget,
};

export function getTarget(bm: BoardManager, unit: Unit, targetType: TARGET_TYPE): TargetUnits {
	const targetFunction = TargetFunctionMap[targetType];
	if (!targetFunction) throw new Error(`Unknown target type: ${targetType}`);

	let mainTarget: Unit | null = null;
	let secondaryTargets: Unit[] = [];

	const targetTypeString = targetType.toString();

	if (targetTypeString.includes("STANDARD")) {
		mainTarget = getStandardTarget(bm, unit);
	} else if (targetTypeString.includes("FURTHEST")) {
		mainTarget = getFurthestTarget(bm, unit);
	} else if (targetTypeString.includes("LOWEST_HEALTH_ENEMY")) {
		mainTarget = getLowestHealthEnemyTarget(bm, unit);
	}

	if (
		targetType !== TARGET_TYPE.STANDARD &&
		targetType !== TARGET_TYPE.FURTHEST &&
		targetType !== TARGET_TYPE.LOWEST_HEALTH_ENEMY
	) {
		secondaryTargets = (targetFunction(bm, unit) as Unit[]).filter(unit => unit !== mainTarget);
	}

	const targetUnits = {
		mainTarget,
		secondaryTargets,
	} as TargetUnits;

	return targetUnits;
}

function getStandardTarget(bm: BoardManager, unit: Unit): Unit {
	const frontEnemies = bm.getAllAliveUnitsInColumn(bm.getEnemyOwner(unit.owner), COLUMN.FRONT);
	const midEnemies = bm.getAllAliveUnitsInColumn(bm.getEnemyOwner(unit.owner), COLUMN.MID);
	const backEnemies = bm.getAllAliveUnitsInColumn(bm.getEnemyOwner(unit.owner), COLUMN.BACK);

	const closestColumnEnemies = getClosestColumnUnits(frontEnemies, midEnemies, backEnemies);

	const closestColumnEnemiesWithTaunt = getClosestColumnUnits(
		getUnitsWithTaunt(frontEnemies),
		getUnitsWithTaunt(midEnemies),
		getUnitsWithTaunt(backEnemies),
	);

	const possibleTargets =
		closestColumnEnemiesWithTaunt.length > 0 ? closestColumnEnemiesWithTaunt : closestColumnEnemies;

	const target =
		possibleTargets.find(enemyUnit => bm.getUnitRow(enemyUnit) === bm.getUnitRow(unit)) ||
		possibleTargets[0];

	return target as Unit;
}

function getStandardBoxTarget(bm: BoardManager, unit: Unit): Unit[] {
	const standardTarget = getStandardTarget(bm, unit);

	if (bm.getUnitColumn(standardTarget) === COLUMN.FRONT) {
		const unitsInFrontBox = bm.getAllAliveUnitsInBox(bm.getEnemyOwner(unit.owner), BOX.FRONT);
		return unitsInFrontBox as Unit[];
	}

	const unitsInBackBox = bm.getAllAliveUnitsInBox(bm.getEnemyOwner(unit.owner), BOX.BACK);
	return unitsInBackBox as Unit[];
}

function getStandardColumnTarget(bm: BoardManager, unit: Unit): Unit[] {
	const standardTarget = getStandardTarget(bm, unit);

	const unitsInColumn = bm.getAllAliveUnitsInColumn(
		bm.getEnemyOwner(unit.owner),
		bm.getUnitColumn(standardTarget),
	);

	return unitsInColumn as Unit[];
}

function getStandardRowTarget(bm: BoardManager, unit: Unit): Unit[] {
	const standardTarget = getStandardTarget(bm, unit);

	const unitsInRow = bm.getAllAliveUnitsInRow(
		bm.getEnemyOwner(unit.owner),
		bm.getUnitRow(standardTarget),
	);

	return unitsInRow as Unit[];
}

function getFurthestTarget(bm: BoardManager, unit: Unit): Unit {
	const frontEnemies = bm.getAllAliveUnitsInColumn(bm.getEnemyOwner(unit.owner), COLUMN.FRONT);
	const midEnemies = bm.getAllAliveUnitsInColumn(bm.getEnemyOwner(unit.owner), COLUMN.MID);
	const backEnemies = bm.getAllAliveUnitsInColumn(bm.getEnemyOwner(unit.owner), COLUMN.BACK);

	const furthestColumnEnemies = getFurthestColumnUnits(frontEnemies, midEnemies, backEnemies);

	const furthestColumnEnemiesWithTaunt = getFurthestColumnUnits(
		getUnitsWithTaunt(frontEnemies),
		getUnitsWithTaunt(midEnemies),
		getUnitsWithTaunt(backEnemies),
	);

	const possibleTargets =
		furthestColumnEnemiesWithTaunt.length > 0
			? furthestColumnEnemiesWithTaunt
			: furthestColumnEnemies;

	const target =
		possibleTargets.find(enemyUnit => bm.getUnitRow(enemyUnit) !== bm.getUnitRow(unit)) ||
		possibleTargets[0];

	return target as Unit;
}

function getFurthestBoxTarget(bm: BoardManager, unit: Unit): Unit[] {
	const furthestTarget = getFurthestTarget(bm, unit);

	if (bm.getUnitColumn(furthestTarget) === COLUMN.BACK) {
		const unitsInBackBox = bm.getAllAliveUnitsInBox(bm.getEnemyOwner(unit.owner), BOX.BACK);
		return unitsInBackBox as Unit[];
	}

	const unitsInFrontBox = bm.getAllAliveUnitsInBox(bm.getEnemyOwner(unit.owner), BOX.FRONT);
	return unitsInFrontBox as Unit[];
}

function getFurthestColumnTarget(bm: BoardManager, unit: Unit): Unit[] {
	const furthestTarget = getFurthestTarget(bm, unit);

	const unitsInColumn = bm.getAllAliveUnitsInColumn(
		bm.getEnemyOwner(unit.owner),
		bm.getUnitColumn(furthestTarget),
	);

	return unitsInColumn as Unit[];
}

function getFurthestRowTarget(bm: BoardManager, unit: Unit): Unit[] {
	const furthestTarget = getFurthestTarget(bm, unit);

	const unitsInRow = bm.getAllAliveUnitsInRow(
		bm.getEnemyOwner(unit.owner),
		bm.getUnitRow(furthestTarget),
	);

	return unitsInRow as Unit[];
}

function getSameRowAlliesTarget(bm: BoardManager, unit: Unit): Unit[] {
	const alliedUnitsInSameRow = bm.getAllAliveUnitsInRow(unit.owner, bm.getUnitRow(unit));

	return alliedUnitsInSameRow as Unit[];
}

function getSameColumnAlliesTarget(bm: BoardManager, unit: Unit): Unit[] {
	const alliedUnitsInSameColumn = bm.getAllAliveUnitsInColumn(unit.owner, bm.getUnitColumn(unit));

	return alliedUnitsInSameColumn as Unit[];
}

function getSideAllyTarget(bm: BoardManager, unit: Unit): Unit[] {
	const unitsInColumn = bm.getAllAliveUnitsInColumn(unit.owner, bm.getUnitColumn(unit));

	const alliedUnitInColumn = unitsInColumn.filter(alliedUnit => alliedUnit.id !== unit.id);

	return alliedUnitInColumn as Unit[];
}

function getFrontAllyTarget(bm: BoardManager, unit: Unit): Unit[] {
	if (bm.getUnitColumn(unit) === COLUMN.FRONT) {
		return [];
	}

	const frontAlly = bm.getUnitByPosition(unit.owner, unit.position - 1);

	return frontAlly as Unit[];
}

function getBackAllyTarget(bm: BoardManager, unit: Unit): Unit[] {
	if (bm.getUnitColumn(unit) === COLUMN.BACK) {
		return [];
	}

	const backAlly = bm.getUnitByPosition(unit.owner, unit.position + 1);

	return backAlly as Unit[];
}

function getAdjacentAlliesTarget(bm: BoardManager, unit: Unit): Unit[] {
	const adjacentAllies = [
		...getFrontAllyTarget(bm, unit),
		...getBackAllyTarget(bm, unit),
		...getSideAllyTarget(bm, unit),
	];

	return adjacentAllies as Unit[];
}

function getDiagonalAlliesTarget(bm: BoardManager, unit: Unit): Unit[] {
	const alliedUnitsInAnotherRow = bm.getAllAliveUnitsInRow(
		unit.owner,
		bm.getUnitRow(unit) === ROW.BOT ? ROW.TOP : ROW.BOT,
	);

	const diagonalAllies = alliedUnitsInAnotherRow.filter(
		alliedUnit =>
			bm.getUnitColumn(alliedUnit) === bm.getUnitColumn(unit) - 1 ||
			bm.getUnitColumn(alliedUnit) === bm.getUnitColumn(unit) + 1,
	);

	return diagonalAllies as Unit[];
}

function getAllUnitsTarget(bm: BoardManager, unit: Unit): Unit[] {
	const allUnits = bm.getAllAliveUnits();

	return allUnits as Unit[];
}

function getAllAlliedUnitsTarget(bm: BoardManager, unit: Unit): Unit[] {
	const allAlliedUnits = bm.getAllAliveUnitsOfOwner(unit.owner);

	return allAlliedUnits as Unit[];
}

function getAllEnemyUnitsTarget(bm: BoardManager, unit: Unit): Unit[] {
	const allEnemyUnits = bm.getAllAliveUnitsOfOwner(bm.getEnemyOwner(unit.owner));

	return allEnemyUnits as Unit[];
}

function getSelfTarget(bm: BoardManager, unit: Unit): Unit[] {
	return [unit];
}

// TODO: check whether to get lowest health flat or %
function getLowestHealthAllyTarget(bm: BoardManager, unit: Unit): Unit[] {
	const allAlliedUnits = getAllAlliedUnitsTarget(bm, unit);

	const lowestHealthUnit = allAlliedUnits.reduce((prev, curr) => {
		if (curr.stats.hp < prev.stats.hp) {
			return curr;
		} else {
			return prev;
		}
	});

	return [lowestHealthUnit] as Unit[];
}

// TODO: check whether to get lowest health flat or %
function getLowestHealthEnemyTarget(bm: BoardManager, unit: Unit): Unit {
	const allEnemyUnits = getAllEnemyUnitsTarget(bm, unit);
	const allEnemyUnitsWithTaunt = getUnitsWithTaunt(allEnemyUnits);

	const possibleTargets =
		allEnemyUnitsWithTaunt.length > 0 ? allEnemyUnitsWithTaunt : allEnemyUnits;

	const lowestHealthUnit = possibleTargets.reduce((prev, curr) => {
		if (curr.stats.hp < prev.stats.hp) {
			return curr;
		} else {
			return prev;
		}
	});

	return lowestHealthUnit as Unit;
}

function getUnitsWithTaunt(units: Unit[]): Unit[] {
	return units.filter(unit => unit.statusEffectManager.hasStatusEffect(STATUS_EFFECT.TAUNT));
}

function getClosestColumnUnits(front: Unit[], mid: Unit[], back: Unit[]): Unit[] {
	return front.length > 0 ? front : mid.length > 0 ? mid : back;
}

function getFurthestColumnUnits(front: Unit[], mid: Unit[], back: Unit[]): Unit[] {
	return back.length > 0 ? back : mid.length > 0 ? mid : front;
}

export function getAllTargetUnits(targetUnits: TargetUnits): Unit[] {
	return [targetUnits.mainTarget, ...targetUnits.secondaryTargets].filter(
		target => target !== null,
	) as Unit[];
}
