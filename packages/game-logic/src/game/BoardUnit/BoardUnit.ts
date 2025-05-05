import { nanoid } from "nanoid";
import { PackUnit } from "../PackUnit/PackUnit";
import { EquipmentManager } from "../Equipment/EquipmentManager";
import { AbilityManager } from "../Ability/AbilityManager";
import { StatsManager } from "../Stats/StatsManager";

export class BoardUnit {
	id: string;

	packUnit: PackUnit;

	equipmentManager: EquipmentManager;
	abilityManager: AbilityManager;
	statsManager: StatsManager;

	get equipment() {
		return this.equipmentManager.equipments;
	}

	get abilities() {
		return this.abilityManager.abilities;
	}

	get stats() {
		return this.statsManager.stats;
	}

	get statModifiers() {
		return this.statsManager.fixedModifiers;
	}

	constructor(packUnit: PackUnit) {
		this.id = nanoid(8);
		this.packUnit = packUnit;
		this.equipmentManager = new EquipmentManager();
		this.abilityManager = new AbilityManager();
		this.statsManager = new StatsManager(packUnit);
	}

	equip() {
		// TODO: equip
	}
}
