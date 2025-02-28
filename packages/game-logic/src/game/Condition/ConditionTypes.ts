import { TAG } from "../Tag/TagTypes";

export enum CONDITION {
	EQUIPMENT = "EQUIPMENT",
	POSITION = "POSITION",
}

export type PossibleCondition = Condition<CONDITION.EQUIPMENT> | Condition<CONDITION.POSITION>;

export type Condition<T extends CONDITION> = {
	type: T;
	payload: ConditionPayloadMap[T];
};

export type ConditionPayloadMap = {
	[CONDITION.EQUIPMENT]: ConditionEquipmentPayload;
	[CONDITION.POSITION]: ConditionPositionPayload;
};

export type ConditionPositionPayload = {
	// TODO: think about how to implement this
};
export type ConditionEquipmentPayload = {
	target: string; // TODO: replace with TARGET enum
	slots: string[]; // TODO: replace with EQUIPMENT_SLOT enum
	tags: TAG[];
	amount?: number;
};
