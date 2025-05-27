import { Ability } from "@/game/Ability/Ability";
import { findMatchingAbility } from "@/game/Ability/AbilityUtils";
import { convertModTemplateToMod, filterModsByType } from "@/game/Mod/ModsUtils";
import { Mod, MOD, PossibleMod } from "@/game/Mod/ModTypes";
import { PackUnitData } from "@/game/PackUnit/PackUnitTypes";
import { TAG } from "@/game/Tag/TagTypes";
import { MAX_TIER, Tier } from "@/game/Tier/TierTypes";
import { nanoid } from "nanoid";

export class PackUnit {
	id: string;
	data: PackUnitData;

	tier: Tier;
	tags: TAG[];

	hp: number;

	implicits: PossibleMod[];
	explicits: PossibleMod[];
	mods: PossibleMod[];

	constructor(data?: PackUnitData, tier: Tier = 1) {
		if (!data) {
			throw Error(
				"PackUnit: PackUnit is undefined. If running from test make sure it's defined in mock files",
			);
		}

		this.id = nanoid(8);
		this.data = data;
		this.tags = data.tags;
		this.tier = tier;
		this.hp = data.hp[tier - 1] || 0;
		this.implicits = data.implicits
			.filter(mod => !mod.minimumTier || mod.minimumTier <= tier)
			.map(mod => convertModTemplateToMod(mod, tier, this.id));
		this.explicits = [];
		this.mods = [...this.implicits, ...this.explicits];
	}

	getStatMods(): Mod<MOD.STAT>[] {
		return filterModsByType(this.mods, MOD.STAT);
	}

	getEffectMods(): Mod<MOD.EFFECT>[] {
		return filterModsByType(this.mods, MOD.EFFECT);
	}

	getAbilities(): Ability[] {
		const gainAbilityMods = filterModsByType(
			this.mods,
			MOD.GAIN_ABILITY,
		) as Mod<MOD.GAIN_ABILITY>[];
		const abilityNames = gainAbilityMods.flatMap(mod => mod.payload.map(p => p.name));
		const abilities = abilityNames.map(name => {
			return new Ability(findMatchingAbility(name), this.tier, this);
		});
		return abilities;
	}

	canUpgradeTier() {
		return this.tier < MAX_TIER;
	}

	upgradeTier() {
		if (this.canUpgradeTier()) {
			this.tier += 1;
			this.hp = this.data.hp[this.tier - 1] || 0;
			this.implicits = this.data.implicits
				.filter(mod => !mod.minimumTier || mod.minimumTier <= this.tier)
				.map(mod => convertModTemplateToMod(mod, this.tier, this.id));
			this.mods = [...this.implicits, ...this.explicits];
		}
	}
}
