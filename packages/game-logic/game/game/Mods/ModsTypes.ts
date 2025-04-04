import { ABILITY_CATEGORY } from "../Ability/AbilityTypes";
import { EQUIPMENT_TAG } from "../Equipment/EquipmentTypes";
import { STAT } from "../Stats/StatsTypes";

export enum MOD_TYPE {
	GRANT_ABILITY = "GRANT_ABILITY",
	GRANT_PERK = "GRANT_PERK",
	GRANT_BASE_STAT = "GRANT_BASE_STAT",
	GRANT_ABILITY_MODIFIER = "GRANT_ABILITY_MODIFIER",
}

export interface GrantAbilityPayload {
	name: string;
	type: ABILITY_CATEGORY;
}

export interface GrantPerkPayload {
	name: string;
	tier?: number;
}

export interface GrantBaseStatPayload {
	stat: STAT;
	value: number;
}

export interface GrantAbilityModifierPayload {
	name: string;
	modifier: string;
}

export type ModPayloadMap = {
	[MOD_TYPE.GRANT_ABILITY]: GrantAbilityPayload;
	[MOD_TYPE.GRANT_PERK]: GrantPerkPayload;
	[MOD_TYPE.GRANT_BASE_STAT]: GrantBaseStatPayload;
	[MOD_TYPE.GRANT_ABILITY_MODIFIER]: GrantAbilityModifierPayload;
};

export interface Mod<T extends MOD_TYPE> {
	type: T;
	payload: ModPayloadMap[T];
	tier?: number | "implicit";
}

export type PossibleMods = Array<
	| Mod<MOD_TYPE.GRANT_ABILITY>
	| Mod<MOD_TYPE.GRANT_PERK>
	| Mod<MOD_TYPE.GRANT_BASE_STAT>
	| Mod<MOD_TYPE.GRANT_ABILITY_MODIFIER>
>;

export interface ModTag {
	name: EQUIPMENT_TAG;
	weight: number;
}

export type ShopItemMod = ShopItemPerkMod | ShopItemStatMod;

export interface ShopItemPerkMod {
	mod: Mod<MOD_TYPE.GRANT_PERK>;
	weight: number;
}

export interface ShopItemStatMod {
	mod: {
		type: MOD_TYPE.GRANT_BASE_STAT;
		payload: {
			name: STAT;
		};
	};
	weight: number;
}

export type ShopItemTieredMod = ShopItemMod & {
	tier: number;
};
