/* import { OWNER } from "../BoardManager/BoardManager";
import { PackUnit } from "../PackUnit/PackUnit";
import { BattleUnitInfo } from "./BattleUnitTypes";
import { EquippedItem } from "../Equipment/EquipmentManager";
import { Ability } from "../Ability/Ability"; */

import { OWNER } from "@/game/BoardManager/BoardManager";
import { nanoid } from "nanoid";

export class BattleUnit {
	id: string;
	owner!: OWNER;

	column!: number;
	row!: number;

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

	setPosition(row: number, column: number) {
		this.column = column;
		this.row = row;
	}

	setOwner(owner: OWNER) {
		this.owner = owner;
	}

	toString() {
		return `${this.row},${this.column}_${this.id}`;
	}
}
