import { Filter } from "@/game/Mod/ModTypes";

export enum TRIGGER_TYPE {
	ON_BATTLE_START = "ON_BATTLE_START",
	ON_FAINT = "ON_FAINT",
	ON_GAIN = "ON_GAIN",
	ON_HIT = "ON_HIT",
	ON_HIT_TAKEN = "ON_HIT_TAKEN",
	ON_INJURED = "ON_INJURED",
	ON_LAST_STANDING = "ON_LAST_STANDING",
	ON_ROW_LAST_STANDING = "ON_ROW_LAST_STANDING",
	ON_USE = "ON_USE",
	ON_TURN_START = "ON_TURN_START",
}

export type TriggerWithFilters = { trigger: TRIGGER_TYPE; filters: Filter[] };

export type TriggerAbility = {
	id: string;
	sourceId: string | null; // id of the source that created this ability, can be PackUnit or Equipment
	triggers: TriggerWithFilters[];
};
