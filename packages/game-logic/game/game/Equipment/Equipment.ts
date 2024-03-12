import { nanoid } from "nanoid";
import { Ability } from "../Ability/Ability";
import { getAbilitiesInstancesFromMods } from "../Ability/AbilityUtils";
import { MOD_TYPE, Mod } from "../Mods/ModsTypes";
import { Perk } from "../Perk/Perk";
import { getPerksInstancesFromMods } from "../Perk/PerkUtils";
import { filterStatsMods } from "../Stats/StatsUtils";
import { EquipmentDataSchema } from "./EquipmentSchema";
import { EquipmentData } from "./EquipmentTypes";

export class Equipment {
	id: string;
	data: EquipmentData;

	constructor(data: EquipmentData) {
		if (!data) {
			throw Error(
				"Equipment: Equipment data is undefined. If running from test make sure it's defined in mock files",
			);
		}
		try {
			const parsedData = EquipmentDataSchema.parse(data);
			this.data = parsedData;
			this.id = nanoid(8);
		} catch (e: any) {
			throw Error(`Equipment: ${data.name} data is invalid. ${e?.message}`);
		}
	}

	getGrantedAbilities(): Ability[] {
		return getAbilitiesInstancesFromMods(this.data.mods);
	}

	getStatsMods(): Mod<MOD_TYPE.GRANT_BASE_STAT>[] {
		return filterStatsMods(this.data.mods);
	}

	getGrantedPerks(): Perk[] {
		return getPerksInstancesFromMods(this.data.mods);
	}

	getTriggerEffects() {
		return this.data.effects;
	}
}
