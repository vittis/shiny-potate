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
		let grid: Space[][] = [];

		for (let row = 0; row < this.rows; row++) {
			let currentRow: Space[] = [];
			for (let col = 0; col < this.columns; col++) {
				currentRow.push({
					pos: { column: col, row: row },
					unit: null,
				});
			}
			grid.push(currentRow);
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
		if (targetBoard.grid?.[row]?.[column]?.unit === null) {
			targetBoard.grid[row][column].unit = unit;
		} else {
			console.log("Space already occupied");
		}
	}

	getAt(row: number, column: number, owner: OWNER): BattleUnit {
		let targetBoard: PlayerBoard = owner === OWNER.TEAM_ONE ? this.team1Board : this.team2Board;

		if (!targetBoard?.grid?.[row]?.[column]?.unit) {
			throw Error(`No unit found at ${column}, ${row}`);
		}

		return targetBoard.grid[row][column].unit;
	}

	getAllUnits(): BattleUnit[] {
		const units: BattleUnit[] = [];
		const boards = [this.team1Board.grid, this.team2Board.grid];
		for (const grid of boards) {
			for (const row of grid) {
				for (const space of row) {
					if (space.unit) {
						units.push(space.unit);
					}
				}
			}
		}
		return units;
	}

	getAllUnitsOfOwner(owner: OWNER): BattleUnit[] {
		const units: BattleUnit[] = [];
		const grid = owner === OWNER.TEAM_ONE ? this.team1Board.grid : this.team2Board.grid;
		for (const row of grid) {
			for (const space of row) {
				if (space.unit) {
					units.push(space.unit);
				}
			}
		}
		return units;
	}

	/* getUnitById(id: string): BattleUnit {
		const unit = this.getAllUnits().find(unit => unit.id === id);
		if (!unit) {
			throw Error(`Tried to getUnitById ${id} that doesnt exist`);
		}
		return unit;
	} */

	printBattlefield() {
		console.log(this.team1Board.grid);
		console.log("------------------------");

		console.log(this.team2Board.grid);

		for (let i = 0; i < this.team1Board.grid.length; i++) {
			for (let j = 0; j < this.team1Board.grid[i].length; j++) {
				const space = this.team1Board.grid[i][j];
				if (!space || !space.unit) continue;

				if (space.unit) {
					process.stdout.write(`(${space.pos.column}, ${space.pos.row}): ${space.unit.id} `);
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
