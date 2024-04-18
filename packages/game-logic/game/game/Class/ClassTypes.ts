import { PossibleMods } from "../Mods/ModsTypes";

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

export interface TalentNodeInstance extends ClassNodeInstance, TalentNode {}

// this will be sent to the client
export interface TalentTreeInstance {
	name: string;
	talents: TalentNodeInstance[];
}
