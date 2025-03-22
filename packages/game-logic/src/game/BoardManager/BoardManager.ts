import { BattleUnit } from "../BattleUnit/BattleUnit";

export enum OWNER {
	TEAM_ONE = 0,
	TEAM_TWO = 1,
}

export type Position = {
	column: number;
	row: number;
};

export type Space = {
	pos: Position;
	unit: BattleUnit | null;
};

type PlayerBoard = {
	grid: Space[][];
	owner: OWNER;
	isInverted: boolean;
};

export class BoardManager {
	rows: number;
	columns: number;

	team1Board: PlayerBoard;
	team2Board: PlayerBoard;

	constructor(rows: number, columns: number) {
		this.rows = rows;
		this.columns = columns;

		this.team1Board = {
			grid: this.createEmptyGrid(),
			owner: OWNER.TEAM_ONE,
			isInverted: false,
		};

		this.team2Board = {
			grid: this.createEmptyGrid(),
			owner: OWNER.TEAM_TWO,
			isInverted: false,
		};
	}

	createEmptyGrid(): Space[][] {
		let grid: Space[][] = new Array(this.rows)
			.fill(null)
			.map(() => new Array(this.columns).fill(null));

		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.columns; j++) {
				grid[i][j] = {
					pos: { column: j, row: i },
					unit: null,
				};
			}
		}

		return grid;
	}

	addToBoard(unit: BattleUnit, owner: OWNER) {
		const column = unit.column;
		const row = unit.row;

		if (column === -1 || row === -1) {
			throw Error("Unit position has not been initialized");
		}

		let targetBoard: PlayerBoard = owner === OWNER.TEAM_ONE ? this.team1Board : this.team2Board;
		if (targetBoard.grid[row][column].unit === null) {
			targetBoard.grid[row][column].unit = unit;
		} else {
			console.log("Space already occupied");
		}
	}

	getAt(column: number, row: number, owner: OWNER): BattleUnit {
		let targetBoard: PlayerBoard = owner === OWNER.TEAM_ONE ? this.team1Board : this.team2Board;

		if (!targetBoard?.grid?.[row]?.[column]?.unit) {
			throw Error(`No unit found at ${column}, ${row}`);
		}

		return targetBoard.grid[row][column].unit;
	}

	/* getUnit(owner: OWNER, position: POSITION): Unit {}

	getAllUnits(): Unit[] {}

	getAllUnitsOfOwner(owner: OWNER): Unit[] {}

	getUnitByPosition(owner: OWNER, position: POSITION): Unit[] {}

	getUnitById(id: string): Unit {
		const unit = this.getAllUnits().find(unit => unit.id === id);
		if (!unit) {
			throw Error(`Tried to getUnitById ${id} that doesnt exist`);
		}
		return unit;
	} */

	printBattlefield() {
		console.log(this.team1Board.grid);
		console.log(this.team2Board.grid);

		for (let i = 0; i < this.team1Board.grid.length; i++) {
			for (let j = 0; j < this.team1Board.grid[i].length; j++) {
				const space = this.team1Board.grid[i][j];
				if (space.unit) {
					process.stdout.write(`${space.unit} `);
				} else {
					process.stdout.write(`(${space.pos.column}, ${space.pos.row}) `);
				}
			}
			process.stdout.write("\n");
		}

		console.log("------------------------");

		for (let i = 0; i < this.team2Board.grid.length; i++) {
			for (let j = 0; j < this.team2Board.grid[i].length; j++) {
				const space = this.team2Board.grid[i][j];
				if (space.unit) {
					process.stdout.write(`${space.unit} `);
				} else {
					process.stdout.write(`(${space.pos.column}, ${space.pos.row}) `);
				}
			}
			process.stdout.write("\n");
		}
	}
}
