import { Ability } from "@/game/Ability/Ability";
import { findMatchingAbility } from "@/game/Ability/AbilityUtils";
import { EQUIPMENT_SLOT, EquipmentData } from "@/game/Equipment/EquipmentTypes";
import { convertModTemplateToMod, filterModsByType } from "@/game/Mod/ModsUtils";
import { Mod, MOD, PossibleMod } from "@/game/Mod/ModTypes";
import { TAG } from "@/game/Tag/TagTypes";
import { MAX_TIER, Tier } from "@/game/Tier/TierTypes";
import { nanoid } from "nanoid";

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
		this.ability = data.ability
			? new Ability(findMatchingAbility(data.ability), tier, this)
			: undefined;
		this.implicits = data.implicits
			.filter(mod => !mod.minimumTier || mod.minimumTier <= tier)
			.map(mod => convertModTemplateToMod(mod, tier, this.id));
		this.explicits = []; // sera que alguns itens podem já vir com mods extras?
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

			if (this.ability) this.ability.upgradeTier();

			this.implicits = this.data.implicits
				.filter(mod => !mod.minimumTier || mod.minimumTier <= this.tier)
				.map(mod => convertModTemplateToMod(mod, this.tier, this.id));
			this.mods = [...this.implicits, ...this.explicits];
		}
	}
}
