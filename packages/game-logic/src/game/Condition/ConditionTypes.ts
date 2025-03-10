import { EQUIPMENT_SLOT } from "../Equipment/EquipmentTypes";
import { TAG } from "../Tag/TagTypes";
import { TARGET_TYPE } from "../Target/TargetTypes";

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
	target: TARGET_TYPE;
	slots: EQUIPMENT_SLOT[];
	tags: TAG[];
	amount?: number;
};
