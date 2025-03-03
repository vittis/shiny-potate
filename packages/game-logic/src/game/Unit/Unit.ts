import { nanoid } from "nanoid";
import { UnitData } from "./UnitTypes";
import { MAX_TIER, Tier } from "../Tier/TierTypes";
import { TAG } from "../Tag/TagTypes";
import { MOD, Mod, PossibleMod } from "../Mod/ModTypes";
import { filterModsByType } from "../Mod/ModsUtils";
import { Hp } from "../Stat/StatTypes";

export class Unit {
	id: string;
	data: UnitData;

	tier: Tier;
	tags: TAG[];

	hp: number;

	implicits: PossibleMod[];
	explicits: PossibleMod[];
	mods: PossibleMod[];

	constructor(data?: UnitData, tier: Tier = 1) {
		if (!data) {
			throw Error(
				"Unit: Unit is undefined. If running from test make sure it's defined in mock files",
			);
		}

		this.id = nanoid(8);
		this.data = data;
		this.tags = data.tags;
		this.tier = tier;
		this.hp = data.hp[tier - 1] || 0;
		this.implicits = data.implicits.filter(mod => mod.minimumTier <= tier);
		this.explicits = [];
		this.mods = [...this.implicits, ...this.explicits];
	}

	getStatMods(): Mod<MOD.STAT>[] {
		return filterModsByType(this.mods, MOD.STAT);
	}

	getEffectMods(): Mod<MOD.EFFECT>[] {
		return filterModsByType(this.mods, MOD.EFFECT);
	}

	getAbilities(): Mod<MOD.ABILITY>[] {
		return filterModsByType(this.mods, MOD.ABILITY);
	}

	canUpgradeTier() {
		return this.tier < MAX_TIER;
	}

	upgradeTier() {
		if (this.canUpgradeTier()) {
			this.tier += 1;

			this.hp = this.data.hp[this.tier - 1] || 0;

			const newTierImplicits = this.data.implicits.filter(mod => mod.minimumTier === this.tier);
			this.implicits = [...this.implicits, ...newTierImplicits];
			this.mods = [...this.mods, ...newTierImplicits];
		}
	}
}
