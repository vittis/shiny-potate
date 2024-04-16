import { ClassData, ClassNodeInstance, TalentTreeInstance } from "./ClassTypes";
import { ClassDataSchema } from "./ClassSchema";
import { getAbilitiesInstancesFromMods } from "../Ability/AbilityUtils";
import { Ability } from "../Ability/Ability";
import { Mod, MOD_TYPE } from "../Mods/ModsTypes";
import { filterStatsMods } from "../Stats/StatsUtils";
import { filterAndInstantiatePerksFromMods } from "../Perk/PerkUtils";
import { Perk } from "../Perk/Perk";
import { nanoid } from "nanoid";

export class Class {
	data: ClassData;
	talentTreesInstance: TalentTreeInstance[]; // adds 'id' and 'obtained' to nodes
	utilityNodes: ClassNodeInstance[];

	constructor(data: ClassData) {
		try {
			const parsedData = ClassDataSchema.parse(data);
			this.data = parsedData;
		} catch (e: any) {
			throw Error(`Class: ${data.name} data is invalid. ${e?.message}`);
		}

		this.utilityNodes = data.utility.map(node => {
			return {
				...node,
				id: nanoid(8),
				obtained: false,
			};
		});

		this.talentTreesInstance = data.tree.map(tree => {
			return {
				name: tree.name,
				talents: tree.talents.map(talent => {
					return {
						...talent,
						id: nanoid(8),
						obtained: false,
					};
				}),
			};
		});
	}

	getBaseHp() {
		return this.data.hp;
	}

	getStatsMods(): Mod<MOD_TYPE.GRANT_BASE_STAT>[] {
		return this.data.base.reduce(
			(acc, node) => [...acc, ...filterStatsMods(node.mods)],
			[] as Mod<MOD_TYPE.GRANT_BASE_STAT>[],
		);
	}

	getClassBaseAbilities() {
		return this.data.base.reduce((acc, node) => {
			const abilitiesOfNode = getAbilitiesInstancesFromMods(node.mods);

			return [...acc, ...abilitiesOfNode];
		}, [] as Ability[]);
	}

	getPerks() {
		const basePerks = this.data.base.reduce((acc, node) => {
			return [...acc, ...filterAndInstantiatePerksFromMods(node.mods)];
		}, [] as Perk[]);

		const talentPerks = this.talentTreesInstance.reduce((acc, tree) => {
			return [
				...acc,
				...tree.talents.reduce((acc, talent) => {
					if (talent.obtained) {
						return [...acc, ...filterAndInstantiatePerksFromMods(talent.mods)];
					}
					return acc;
				}, [] as Perk[]),
			];
		}, [] as Perk[]);

		return [...basePerks, ...talentPerks];
	}

	obtainTalentNode(talentId: string) {
		this.talentTreesInstance = this.talentTreesInstance.map(tree => {
			return {
				...tree,
				talents: tree.talents.map(talent => {
					if (talent.id === talentId) {
						return {
							...talent,
							obtained: true,
						};
					}
					return talent;
				}),
			};
		});
	}

	serialize() {
		return {
			data: this.data,
			talentTree: this.talentTreesInstance,
			utilityNodes: this.utilityNodes,
		};
	}
}
