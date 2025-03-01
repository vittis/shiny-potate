import { nanoid } from "nanoid";
import { Tier } from "../Tier/TierTypes";
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

	// values from data, sepa nem precisa
	minimumTier: Tier;

	constructor(data: EquipmentData, tier: Tier = 1) {
		if (!data) {
			throw Error(
				"Equipment: Equipment data is undefined. If running from test make sure it's defined in mock files",
			);
		}

		this.data = data;
		this.id = nanoid(8);
		this.tags = data.tags;
		this.minimumTier = data.minimumTier;
		this.tier = tier;
		this.slots = data.slots;
		this.equippedSlot = undefined; // sepa sempre inicializa sem estar equipado?
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
}
