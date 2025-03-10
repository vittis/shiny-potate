import { PackUnit } from "../PackUnit/PackUnit";

export class BattleUnit {
	/* packUnit: PackUnit; */

	column: number = -1;
	row: number = -1;

	constructor(/* packUnit: PackUnit */) {
		/* this.packUnit = packUnit; */
	}

	setPosition(column: number, row: number) {
		this.column = column;
		this.row = row;
	}

	toString() {
		return `X`;
	}
}
