import { AbilityManager } from "@/game/Ability/AbilityManager";
import { Equipment } from "@/game/Equipment/Equipment";
import { EquipmentManager } from "@/game/Equipment/EquipmentManager";
import { EQUIPMENT_SLOT } from "@/game/Equipment/EquipmentTypes";
import { PackUnit } from "@/game/PackUnit/PackUnit";
import { StatsManager } from "@/game/Stats/StatsManager";
import { TriggerManager } from "@/game/Trigger/TriggerManager";
import { nanoid } from "nanoid";

export class BoardUnit {
	id: string;

	packUnit: PackUnit;

	equipmentManager: EquipmentManager;
	abilityManager: AbilityManager;
	statsManager: StatsManager;
	triggerManager: TriggerManager;

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
		this.triggerManager = new TriggerManager(this, packUnit, this.abilities);

		this.abilityManager.updateAbilitiesEffectsWithStats(this.statsManager);
	}

	equip(equipment: Equipment, slot: EQUIPMENT_SLOT) {
		this.equipmentManager.equip(equipment, slot);

		const equippedItem = this.equipmentManager.getEquipmentById(equipment.id);

		if (equippedItem) {
			this.statsManager.addStatMods(equipment.getStatMods());
			this.triggerManager.addTriggerMods(equippedItem.equipment.mods);

			const equipmentAbility = equippedItem.equipment.ability;
			if (equipmentAbility) {
				this.abilityManager.addAbilities([equipmentAbility]);
				this.triggerManager.addTriggerAbilities([equipmentAbility]);
			}

			this.abilityManager.updateAbilitiesEffectsWithStats(this.statsManager);
			this.triggerManager.updateTriggerModsWithStats(this.statsManager);
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

		this.triggerManager.removeTriggerModsFromOrigin(this.packUnit.id);
		this.triggerManager.addTriggerAbilities(this.abilities);
		this.triggerManager.addTriggerMods(this.packUnit.mods);
		this.triggerManager.updateTriggerModsWithStats(this.statsManager);
	}

	upgradeEquipmentTier(equipId: string) {
		const equip = this.equipmentManager.getEquipmentById(equipId);

		if (!equip) {
			throw Error("BoardUnit: upgradeEquipmentTier - Didn't find equipment with id: " + equipId);
		}

		equip.equipment.upgradeTier();

		this.statsManager.removeStatModsFromOrigin(equipId);
		this.statsManager.addStatMods(equip.equipment.getStatMods());

		this.abilityManager.addAbilities(
			equip.equipment.getAbilities().filter(a => !this.abilityManager.isAbilityActive(a.name)),
		);
		this.abilityManager.updateAbilitiesEffectsWithStats(this.statsManager);

		this.triggerManager.removeTriggerModsFromOrigin(equipId);
		this.triggerManager.addTriggerAbilities(this.abilities);
		this.triggerManager.addTriggerMods(equip.equipment.mods);
		this.triggerManager.updateTriggerModsWithStats(this.statsManager);
	}
}
