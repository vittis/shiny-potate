import { nanoid } from "nanoid";
import { PackUnit } from "../PackUnit/PackUnit";
import { EquipmentManager } from "../Equipment/EquipmentManager";
import { AbilityManager } from "../Ability/AbilityManager";

export class BoardUnit {
	id: string;

	packUnit: PackUnit;

	equipmentManager: EquipmentManager;
	abilityManager: AbilityManager;

	get equipment() {
		return this.equipmentManager.equipments;
	}

	get abilities() {
		return this.abilityManager.abilities;
	}

	constructor(packUnit: PackUnit) {
		this.id = nanoid(8);
		this.packUnit = packUnit;
		this.equipmentManager = new EquipmentManager();
		this.abilityManager = new AbilityManager();
	}
}
