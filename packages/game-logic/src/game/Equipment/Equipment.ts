import { nanoid } from "nanoid";
import { MAX_TIER, Tier } from "../Tier/TierTypes";
import { EQUIPMENT_SLOT, EquipmentData } from "./EquipmentTypes";
import { TAG } from "../Tag/TagTypes";
import { Ability } from "../Ability/Ability";
import { MOD, Mod, PossibleMod } from "../Mod/ModTypes";
import { filterModsByType } from "../Mod/ModsUtils";

export class Equipment {
	id: string;
	data: EquipmentData;

	tier: Tier;
	tags: TAG[];

	slots: EQUIPMENT_SLOT[];
	equippedSlot?: EQUIPMENT_SLOT;

	ability?: Ability;

	implicits: PossibleMod[];
	explicits: PossibleMod[];
	mods: PossibleMod[];

	constructor(data: EquipmentData, tier: Tier = 1) {
		if (!data) {
			throw Error(
				"Equipment: Equipment data is undefined. If running from test make sure it's defined in mock files",
			);
		}

		this.id = nanoid(8);
		this.data = data;
		this.tags = data.tags;
		this.tier = tier;
		this.slots = data.slots;
		this.equippedSlot = undefined; // sepa sempre inicializa sem estar equipado ou passa opcional?
		this.ability = undefined; // data.ability ? new Ability(data.ability, tier) : undefined; TODO: implement this
		this.implicits = data.implicits;
		this.explicits = []; // sera que alguns itens podem já vir com mods extras?
		this.mods = [...this.implicits, ...this.explicits];
	}

	getStatMods(): Mod<MOD.STAT>[] {
		return filterModsByType(this.mods, MOD.STAT);
	}

	getEffectMods(): Mod<MOD.EFFECT>[] {
		return filterModsByType(this.mods, MOD.EFFECT);
	}

	canUpgradeTier() {
		return this.tier < MAX_TIER;
	}

	upgradeTier() {
		if (this.canUpgradeTier()) {
			this.tier += 1;

			const newTierImplicits = this.data.implicits.filter(mod => mod.minimumTier === this.tier);
			this.implicits = [...this.implicits, ...newTierImplicits];
			this.mods = [...this.mods, ...newTierImplicits];
		}
	}
}
