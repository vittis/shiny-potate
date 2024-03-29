import { nanoid } from "nanoid";
import { Ability } from "../Ability/Ability";
import { getAbilitiesInstancesFromMods } from "../Ability/AbilityUtils";
import { MOD_TYPE, Mod, PossibleMods, ShopItemMod } from "../Mods/ModsTypes";
import { Perk } from "../Perk/Perk";
import { getPerksInstancesFromMods } from "../Perk/PerkUtils";
import { filterStatsMods } from "../Stats/StatsUtils";
import { EquipmentDataSchema } from "./EquipmentSchema";
import { EquipmentData, EquipmentInstance } from "./EquipmentTypes";
import {
	generateRolledMods,
	getAllApplicablePerkMods,
	getAllApplicableStatMods,
	rollTieredMods,
} from "./EquipmentUtils";

export class Equipment {
	id: string;
	data: EquipmentData;

	tier: number;
	rolledMods: PossibleMods;

	applicableMods: ShopItemMod[] = [];

	constructor(data: EquipmentData, tier = 0) {
		if (!data) {
			throw Error(
				"Equipment: Equipment data is undefined. If running from test make sure it's defined in mock files",
			);
		}
		try {
			const parsedData = EquipmentDataSchema.parse(data);
			this.data = parsedData;
		} catch (e: any) {
			throw Error(`Equipment: ${data.name} data is invalid. ${e?.message}`);
		}
		this.id = nanoid(8);
		this.tier = tier;

		this.applicableMods = [
			...getAllApplicablePerkMods(data.tags),
			...getAllApplicableStatMods(data.tags),
		];
		this.rolledMods = generateRolledMods(rollTieredMods(this.applicableMods, this.tier));
	}

	getMods() {
		return [...this.data.mods, ...this.rolledMods];
	}

	getGrantedAbilities(): Ability[] {
		return getAbilitiesInstancesFromMods(this.getMods());
	}

	getStatsMods(): Mod<MOD_TYPE.GRANT_BASE_STAT>[] {
		return filterStatsMods(this.getMods());
	}

	getGrantedPerks(): Perk[] {
		return getPerksInstancesFromMods(this.getMods());
	}

	getTriggerEffects() {
		return this.data.effects;
	}

	serialize(): EquipmentInstance {
		return {
			...this.data,
			tier: this.tier,
			mods: [...this.data.mods, ...this.rolledMods],
		};
	}
}
