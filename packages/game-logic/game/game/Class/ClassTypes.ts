import { PossibleMods } from "../Mods/ModsTypes";
import { STAT } from "../Stats/StatsTypes";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { TARGET_TYPE } from "../Target/TargetTypes";

// TODO better type and logic for this
export interface AbilityModifier {
	trigger?: {
		name: string;
		remove?: boolean;
	}[];
	target?: {
		name: string;
		remove?: boolean;
	}[];
	status_effect?: {
		name: STATUS_EFFECT;
		target: TARGET_TYPE;
		value: number;
		remove?: boolean;
	}[];
	stats?: {
		name: STAT;
		target: TARGET_TYPE;
		value: number;
		remove?: boolean;
	}[];
	heal?: {
		target: TARGET_TYPE;
		value: number;
		remove?: boolean;
	}[];
	shield?: {
		target: TARGET_TYPE;
		value: number;
		remove?: boolean;
	}[];
}

export interface ClassNode {
	mods: PossibleMods;
	description: string;
}

export interface TalentNode extends ClassNode {
	tier: number;
	req: number;
}

// this represents the JSON of the class
export interface ClassData {
	name: string;
	hp: number;
	base: ClassNode[];
	utility: ClassNode[];
	tree: {
		name: string;
		talents: TalentNode[];
	}[];
}

export interface ClassNodeInstance extends ClassNode {
	id: string;
	obtained: boolean;
}

interface TalentNodeInstance extends ClassNodeInstance, TalentNode {}

// this will be sent to the client
export interface TalentTreeInstance {
	name: string;
	talents: TalentNodeInstance[];
}
