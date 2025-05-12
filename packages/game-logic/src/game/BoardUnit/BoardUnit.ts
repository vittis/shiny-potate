import { nanoid } from "nanoid";
import { PackUnit } from "../PackUnit/PackUnit";
import { EquipmentManager } from "../Equipment/EquipmentManager";
import { AbilityManager } from "../Ability/AbilityManager";
import { StatsManager } from "../Stats/StatsManager";
import { Equipment } from "../Equipment/Equipment";
import { EQUIPMENT_SLOT } from "../Equipment/EquipmentTypes";

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
		return this.statsManager.activeStatModifiers;
	}

	constructor(packUnit: PackUnit) {
		this.id = nanoid(8);
		this.packUnit = packUnit;
		this.equipmentManager = new EquipmentManager();
		this.abilityManager = new AbilityManager(packUnit);
		this.statsManager = new StatsManager(packUnit);

		this.abilityManager.updateAbilitiesEffectsWithStats(this.statsManager);
	}

	equip(equipment: Equipment, slot: EQUIPMENT_SLOT) {
		this.equipmentManager.equip(equipment, slot);

		const equippedItem = this.equipmentManager.getEquipmentById(equipment.id);

		if (equippedItem) {
			this.statsManager.addStatMods(equipment.getStatMods());

			const equipmentAbility = equippedItem.equipment.ability;
			if (equipmentAbility) {
				this.abilityManager.addAbilities([equipmentAbility]);
			}

			this.abilityManager.updateAbilitiesEffectsWithStats(this.statsManager);
		}
	}

	upgradePackUnitTier() {
		this.packUnit.upgradeTier();

		this.statsManager.setBaseStats(this.packUnit);
		this.statsManager.removeStatModsFromOrigin(this.packUnit.id);
		this.statsManager.addStatMods(this.packUnit.getStatMods());

		this.abilityManager.upgradeAbilitiesFromSource(this.packUnit.id);
		this.abilityManager.addAbilities(
			this.packUnit.getAbilities().filter(a => !this.abilityManager.isAbilityActive(a.name)),
		);

		this.abilityManager.updateAbilitiesEffectsWithStats(this.statsManager);
	}

	upgradeEquipmentTier(equipId: string) {
		const equip = this.equipmentManager.getEquipmentById(equipId);

		if (equip) {
			equip.equipment.upgradeTier();

			this.statsManager.removeStatModsFromOrigin(equipId);
			this.statsManager.addStatMods(equip.equipment.getStatMods());

			this.abilityManager.addAbilities(
				equip.equipment.getAbilities().filter(a => !this.abilityManager.isAbilityActive(a.name)),
			);

			this.abilityManager.updateAbilitiesEffectsWithStats(this.statsManager);
		}
	}
}
