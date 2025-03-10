import { nanoid } from "nanoid";
/* import { OWNER } from "../BoardManager/BoardManager";
import { PackUnit } from "../PackUnit/PackUnit";
import { BattleUnitInfo } from "./BattleUnitTypes";
import { EquippedItem } from "../Equipment/EquipmentManager";
import { Ability } from "../Ability/Ability"; */

export class BattleUnit {
	id: string;
	/* owner: OWNER; */

	column: number = -1;
	row: number = -1;

	/* packUnit: PackUnit;
	equipment: EquippedItem[];
	abilities: Ability[]; */

	// comment battleUnitInfo not to break game
	constructor(/* battleUnitInfo: BattleUnitInfo */) {
		this.id = nanoid(8);
		/* this.owner = battleUnitInfo.owner;
		this.packUnit = battleUnitInfo.packUnit;
		this.equipment = battleUnitInfo.equipment;
		this.abilities = battleUnitInfo.abilities; */
	}

	setPosition(column: number, row: number) {
		this.column = column;
		this.row = row;
	}

	toString() {
		return `X`;
	}
}
