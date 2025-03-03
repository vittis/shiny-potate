import { STATUS_EFFECT } from "./StatusEffect/StatusEffectTypes";
import { TARGET_TYPE, TargetUnits } from "./Target/TargetTypes";
import { getTarget } from "./Target/TargetUtils";
import { Unit } from "./Unit/Unit";

export enum OWNER {
	TEAM_ONE = 0,
	TEAM_TWO = 1,
}

export enum POSITION {
	TOP_FRONT = 0,
	TOP_MID = 1,
	TOP_BACK = 2,
	BOT_FRONT = 3,
	BOT_MID = 4,
	BOT_BACK = 5,
}

export enum ROW {
	TOP = 0,
	BOT = 1,
}

export enum COLUMN {
	FRONT = 0,
	MID = 1,
	BACK = 2,
}

export enum BOX {
	FRONT = 0,
	BACK = 1,
}

type Board = [
	[
		Unit | undefined,
		Unit | undefined,
		Unit | undefined,
		Unit | undefined,
		Unit | undefined,
		Unit | undefined,
	],
	[
		Unit | undefined,
		Unit | undefined,
		Unit | undefined,
		Unit | undefined,
		Unit | undefined,
		Unit | undefined,
	],
];

// return unit if it not died
function checkForDead(unit?: Unit) {
	return !unit?.isDead ? unit : undefined;
}

export class BoardManager {
	private board: Board;

	constructor() {
		this.board = [
			[undefined, undefined, undefined, undefined, undefined, undefined],
			[undefined, undefined, undefined, undefined, undefined, undefined],
		];
	}

	addToBoard(unit: Unit) {
		const position = unit.position;
		const owner = unit.owner;

		if (this.board[owner][position]) {
			throw Error(`Ja tem cara ai ${owner} ${position}`);
		}
		this.board[owner][position] = unit;
	}

	getUnit(owner: OWNER, position: POSITION): Unit {
		if (!this.board[owner][position]) {
			throw Error(`Tried to getUnit ${owner} ${position} that doesnt exist`);
		}

		return this.board[owner][position] as Unit;
	}

	getAllUnits(): Unit[] {
		return this.board[OWNER.TEAM_ONE]
			.concat(this.board[OWNER.TEAM_TWO])
			.filter(tile => !!tile) as Unit[];
	}

	getAllUnitsOfOwner(owner: OWNER): Unit[] {
		return this.board[owner].filter(tile => !!tile) as Unit[];
	}

	getAllAliveUnits(): Unit[] {
		return this.getAllUnits().filter(unit => !unit?.isDead) as Unit[];
	}

	getAllDeadUnits(): Unit[] {
		return this.getAllUnits().filter(unit => unit?.isDead) as Unit[];
	}

	getAllAliveUnitsOfOwner(owner: OWNER): Unit[] {
		return this.getAllUnitsOfOwner(owner).filter(unit => !unit?.isDead) as Unit[];
	}

	getAllDeadUnitsOfOwner(owner: OWNER): Unit[] {
		return this.getAllUnitsOfOwner(owner).filter(unit => unit?.isDead) as Unit[];
	}

	getEnemyOwner(owner: OWNER): OWNER {
		if (owner === OWNER.TEAM_ONE) return OWNER.TEAM_TWO;
		else return OWNER.TEAM_ONE;
	}

	getUnitRow(unit: Unit): number {
		const isTop =
			unit.position === POSITION.TOP_FRONT ||
			unit.position === POSITION.TOP_MID ||
			unit.position === POSITION.TOP_BACK;

		return isTop ? ROW.TOP : ROW.BOT;
	}

	getUnitColumn(unit: Unit): number {
		const isFront = unit.position === 0 || unit.position === 3;
		const isMid = unit.position === 1 || unit.position === 4;
		return isFront ? COLUMN.FRONT : isMid ? COLUMN.MID : COLUMN.BACK;
	}

	getAllUnitsInRow(owner: OWNER, row: number): Unit[] {
		const unitsInRow = this.getAllUnitsOfOwner(owner).filter(unit => this.getUnitRow(unit) === row);

		return unitsInRow;
	}

	getAllUnitsInColumn(owner: OWNER, column: number): Unit[] {
		const unitsInColumn = this.getAllUnitsOfOwner(owner).filter(
			unit => this.getUnitColumn(unit) === column,
		);

		return unitsInColumn;
	}

	getAllAliveUnitsInColumn(owner: OWNER, column: number): Unit[] {
		const unitsInColumn = this.getAllAliveUnitsOfOwner(owner).filter(
			unit => this.getUnitColumn(unit) === column,
		);

		return unitsInColumn;
	}

	getAllAliveUnitsInRow(owner: OWNER, row: number): Unit[] {
		const unitsInRow = this.getAllAliveUnitsOfOwner(owner).filter(
			unit => this.getUnitRow(unit) === row,
		);

		return unitsInRow;
	}

	getAllAliveUnitsInBox(owner: OWNER, box: BOX): Unit[] {
		if (box === BOX.FRONT) {
			const unitsInFrontBox = this.getAllAliveUnitsInColumn(owner, COLUMN.FRONT).concat(
				this.getAllAliveUnitsInColumn(owner, COLUMN.MID),
			);

			return unitsInFrontBox;
		}

		const unitsInBackBox = this.getAllAliveUnitsInColumn(owner, COLUMN.BACK).concat(
			this.getAllAliveUnitsInColumn(owner, COLUMN.MID),
		);

		return unitsInBackBox;
	}

	getUnitByPosition(owner: OWNER, position: POSITION): Unit[] {
		const unit = this.board[owner][position];
		if (!unit) {
			/* throw Error(
        `Tried to getUnitByPosition ${owner} ${position} that doesnt exist`
      ); */
			return [];
		}
		return [unit];
	}

	getUnitById(id: string): Unit {
		const unit = this.getAllUnits().find(unit => unit.id === id);
		if (!unit) {
			/* console.trace("show"); */
			throw Error(`Tried to getUnitById ${id} that doesnt exist`);
		}
		return unit;
	}

	// TODO remove from bm?
	getTarget(unit: Unit, targetType: TARGET_TYPE = TARGET_TYPE.STANDARD): TargetUnits {
		const targetUnits = getTarget(this, unit, targetType);

		return targetUnits;
	}
}
