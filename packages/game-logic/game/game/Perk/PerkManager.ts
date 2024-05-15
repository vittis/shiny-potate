import { Class } from "../Class/Class";
import { Equipment } from "../Equipment/Equipment";
import { Perk } from "./Perk";

interface ActivePerk {
	perk: Perk;
	sources: { id: string; tier: number }[];
}

export class PerkManager {
	private activePerks: ActivePerk[] = [];

	constructor() {}

	get perks() {
		return this.getPerks();
	}

	removeAllPerks() {
		this.activePerks = [];
	}

	addPerksFromSource(perks: Perk[], sourceId: string) {
		perks.forEach(perk => {
			const perkAlreadyActive = this.activePerks.find(
				activePerk => activePerk.perk.data.name === perk.data.name,
			);

			if (perkAlreadyActive) {
				perkAlreadyActive.perk.updateTier(perkAlreadyActive.perk.tier + perk.tier);
				perkAlreadyActive.sources.push({ id: sourceId, tier: perk.tier });
			} else {
				this.activePerks.push({ perk, sources: [{ id: sourceId, tier: perk.tier }] });
			}
		});
	}

	removePerksFromSource(sourceId: string) {
		this.activePerks = this.activePerks.reduce((arr: ActivePerk[], activePerk) => {
			const perkFromSource = activePerk.sources.find(source => source.id === sourceId);

			if (perkFromSource) {
				activePerk.sources = activePerk.sources.filter(source => source.id !== sourceId);
				if (activePerk.sources.length == 0) {
					return arr;
				}

				const newTier = activePerk.sources.reduce((acc, source) => acc + source.tier, 0);

				activePerk.perk.updateTier(newTier);
			}

			arr.push(activePerk);
			return arr;
		}, []);
	}

	getPerks() {
		return this.activePerks.map(perk => perk.perk);
	}
}
