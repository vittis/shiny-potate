import {
	MOD_TYPE,
	Mod,
	PossibleMods,
	ShopItemMod,
	ShopItemPerkMod,
	ShopItemStatMod,
	ShopItemTieredMod,
} from "../Mods/ModsTypes";
import { Perks } from "../data";
import { EQUIPMENT_TAG, EquipmentStatsData } from "./EquipmentTypes";
import STATS_MOD_CONFIG from "../../data/mods/stats.json";
import { EquipmentStatsDataArraySchema } from "./EquipmentSchema";
import { STAT } from "../Stats/StatsTypes";
import { MOD_LIMIT } from "./ShopEquipment";

export function getAllApplicablePerkMods(tags: EQUIPMENT_TAG[]): ShopItemPerkMod[] {
	let applicableMods: ShopItemPerkMod[] = [];

	Object.keys(Perks).forEach(key => {
		const perkData = Perks[key];

		if (!perkData.tags) {
			return;
		}

		perkData.tags?.forEach(perkTag => {
			if (tags.includes(perkTag.name)) {
				const incomingMod = {
					mod: {
						type: MOD_TYPE.GRANT_PERK,
						payload: {
							name: perkData.name,
						},
					},
					weight: perkTag.weight,
				} as ShopItemPerkMod;

				const alreadyHasMod = applicableMods.find(
					mod => mod.mod.payload.name === incomingMod.mod.payload.name,
				);

				if (!alreadyHasMod) {
					applicableMods.push(incomingMod);
				} else {
					applicableMods = applicableMods.map(mod => {
						if (mod.mod.payload.name === incomingMod.mod.payload.name) {
							return {
								...mod,
								weight: mod.weight + incomingMod.weight,
							};
						}
						return mod;
					});
				}
			}
		});
	});

	return applicableMods;
}

export function getAllApplicableStatMods(tags: EQUIPMENT_TAG[]): ShopItemStatMod[] {
	const statsData = EquipmentStatsDataArraySchema.parse(STATS_MOD_CONFIG) as EquipmentStatsData[];

	let applicableMods: ShopItemStatMod[] = [];

	statsData.forEach(statData => {
		let weight = 0;

		statData.tags.forEach(statTag => {
			if (tags.includes(statTag.name)) {
				weight += statTag.weight;
			}
		});

		if (weight > 0) {
			const statMod = {
				mod: {
					type: MOD_TYPE.GRANT_BASE_STAT,
					payload: {
						name: statData.name,
					},
				},
				weight,
			} as ShopItemStatMod;

			applicableMods.push(statMod);
		}
	});

	return applicableMods;
}

export function getStatModValueFromTier(modStat: STAT, modTier: number): number {
	const statsData = EquipmentStatsDataArraySchema.parse(STATS_MOD_CONFIG) as EquipmentStatsData[];

	const stat = statsData.find(stat => stat.name === modStat);
	if (!stat) throw Error("getStatModValueFromTier: No stat found");

	const modValue = stat.tiers[modTier - 1];
	if (!modValue)
		throw Error(
			"getStatModValueFromTier: No value found for tier " + modTier + " on stat " + modStat,
		);

	return modValue;
}

export function rollRandomMod(remainingMods: ShopItemMod[]): ShopItemMod {
	const totalWeight = remainingMods.reduce((acc, mod) => acc + mod.weight, 0);

	const random = Math.floor(Math.random() * totalWeight) + 1;

	let cumulativeWeight = 0;
	for (const mod of remainingMods) {
		cumulativeWeight += mod.weight;
		if (random <= cumulativeWeight) {
			return mod;
		}
	}

	throw Error("rollRandomMod: No mod selected, this should never happen");
}

export function generateRolledMods(rolledTieredMods: ShopItemTieredMod[]): PossibleMods {
	let rolledMods: PossibleMods = [];

	rolledMods = rolledTieredMods.map(tieredMod => {
		let convertedMod: Mod<MOD_TYPE.GRANT_PERK> | Mod<MOD_TYPE.GRANT_BASE_STAT>;

		if (tieredMod.mod.type === MOD_TYPE.GRANT_PERK) {
			convertedMod = {
				type: MOD_TYPE.GRANT_PERK,
				payload: {
					name: tieredMod.mod.payload.name,
					tier: tieredMod.tier,
				},
				tier: tieredMod.tier,
			} as Mod<MOD_TYPE.GRANT_PERK>;
		} else {
			convertedMod = {
				type: MOD_TYPE.GRANT_BASE_STAT,
				payload: {
					stat: tieredMod.mod.payload.name,
					value: getStatModValueFromTier(tieredMod.mod.payload.name, tieredMod.tier),
				},
				tier: tieredMod.tier,
			} as Mod<MOD_TYPE.GRANT_BASE_STAT>;
		}

		return convertedMod;
	});

	return sortModsByTier(rolledMods);
}

export function sortModsByTier(mods: PossibleMods): PossibleMods {
	return mods.sort((a, b) => {
		// Elements with no tier parameter should come first
		if (!("tier" in a)) return -1;
		if (!("tier" in b)) return 1;

		// Elements with tier = "implicit" should come next
		if (a.tier === "implicit" && b.tier !== "implicit") return -1;
		if (a.tier !== "implicit" && b.tier === "implicit") return 1;

		// Elements with tier as a number should be sorted in descending order
		if (!isNaN(Number(a.tier)) && !isNaN(Number(b.tier))) {
			return Number(b.tier) - Number(a.tier);
		}

		// All other cases maintain their order
		return 0;
	});
}

export function rollTieredMods(applicableMods: ShopItemMod[], tier: number): ShopItemTieredMod[] {
	let rolledMods: ShopItemTieredMod[] = [];
	let remainingMods = applicableMods;
	let remainingTiers = tier * 2 - 1;
	let isFirstMod = true;

	while (remainingTiers > 0) {
		const rolledMod = rollRandomMod(remainingMods);
		remainingMods = remainingMods.filter(mod => mod !== rolledMod);

		let rolledModTier;
		if (isFirstMod) {
			rolledModTier = tier;
			isFirstMod = false;
		} else if (rolledMods.length == MOD_LIMIT - 1) {
			rolledModTier = remainingTiers;
		} else {
			rolledModTier = Math.floor(Math.random() * remainingTiers) + 1;
		}

		const rolledTieredMod = {
			...rolledMod,
			tier: rolledModTier,
		} as ShopItemTieredMod;

		rolledMods.push(rolledTieredMod);
		remainingTiers -= rolledModTier;
	}

	return rolledMods;
}
