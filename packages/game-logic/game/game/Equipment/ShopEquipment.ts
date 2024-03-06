import { nanoid } from "nanoid";
import { EquipmentDataSchema, EquipmentStatsDataArraySchema } from "./EquipmentSchema";
import { EquipmentData, EquipmentStatsData } from "./EquipmentTypes";
import {
	MOD_TYPE,
	PossibleMods,
	ShopItemPerkMod,
	ShopItemStatMod,
	ShopItemMod,
	ShopItemTieredMod,
} from "../Mods/ModsTypes";
import { Perks } from "../data";
import Stats from "../../data/mods/stats.json";
import { aS } from "vitest/dist/reporters-QGe8gs4b.js";

const MOD_LIMIT = 4;

export class ShopEquipment {
	id: string;
	data: EquipmentData;

	tier: number;
	rolledMods!: PossibleMods;

	applicableMods: ShopItemMod[] = [];

	constructor(data: EquipmentData, tier: number) {
		if (!data) {
			throw Error(
				"Equipment data is undefined. If running from test make sure it's defined in mock files",
			);
		}
		const parsedData = EquipmentDataSchema.parse(data);
		this.data = parsedData;
		this.id = nanoid(8);
		this.tier = tier;

		this.applicableMods = [...this.getAllApplicablePerkMods(), ...this.getAllApplicableStatMods()];
	}

	getAllApplicablePerkMods(): ShopItemPerkMod[] {
		let applicableMods: ShopItemPerkMod[] = [];

		Object.keys(Perks).forEach(key => {
			const perkData = Perks[key];

			if (!perkData.tags) {
				return;
			}

			perkData.tags?.forEach(perkTag => {
				if (this.data.tags.includes(perkTag.name)) {
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

	getAllApplicableStatMods(): ShopItemStatMod[] {
		const statsData = EquipmentStatsDataArraySchema.parse(Stats) as EquipmentStatsData[];

		let applicableMods: ShopItemStatMod[] = [];

		statsData.forEach(statData => {
			let weight = 0;

			statData.tags.forEach(statTag => {
				if (this.data.tags.includes(statTag.name)) {
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

	rollMods(): ShopItemTieredMod[] {
		let rolledMods: ShopItemTieredMod[] = [];
		let remainingMods = this.applicableMods;
		let remainingTiers = this.tier * 2 - 1;
		let isFirstMod = true;

		while (remainingTiers > 0) {
			const rolledMod = this.rollRandomMod(remainingMods);
			remainingMods = remainingMods.filter(mod => mod !== rolledMod);

			let rolledModTier;
			if (isFirstMod) {
				rolledModTier = this.tier;
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

	rollRandomMod(remainingMods: ShopItemMod[]): ShopItemMod {
		const totalWeight = remainingMods.reduce((acc, mod) => acc + mod.weight, 0);

		const random = Math.floor(Math.random() * totalWeight) + 1;

		let cumulativeWeight = 0;
		for (const mod of remainingMods) {
			cumulativeWeight += mod.weight;
			if (random <= cumulativeWeight) {
				return mod;
			}
		}

		// TODO improve return to remove below
		return remainingMods[0];
	}
}
