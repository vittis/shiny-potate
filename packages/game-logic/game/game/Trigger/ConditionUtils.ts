import { BoardManager } from "../BoardManager";
import { EQUIPMENT_SLOT, EQUIPMENT_TAG } from "../Equipment/EquipmentTypes";
import { TARGET_TYPE } from "../Target/TargetTypes";
import { getAdjacentAlliesTarget, getAllTargetUnits } from "../Target/TargetUtils";
import { Unit } from "../Unit/Unit";
import { BOARD_POSITION, EFFECT_CONDITION_TYPE, PossibleTriggerEffect } from "./TriggerTypes";

export function canUseEffect(effect: PossibleTriggerEffect, unit: Unit, bm: BoardManager): boolean {
	let canUseEffect = true;

	if (effect.conditions.length > 0) {
		canUseEffect = effect.conditions.every(condition => {
			if (condition.type === EFFECT_CONDITION_TYPE.POSITION) {
				return isPositionConditionValid(
					bm,
					unit,
					condition.payload.target,
					condition.payload.position,
				);
			} else if (condition.type === EFFECT_CONDITION_TYPE.EQUIPMENT) {
				return isEquipmentConditionValid(
					bm,
					unit,
					condition.payload.target,
					condition.payload.slots,
					condition.payload.tags,
				);
			}
		});
	}

	return canUseEffect;
}

export function isPositionConditionValid(
	bm: BoardManager,
	unit: Unit,
	target: TARGET_TYPE,
	position: BOARD_POSITION,
) {
	const targetUnits = bm.getTarget(unit, target);

	if (getAllTargetUnits(targetUnits).length === 0) {
		return false;
	}

	const targetUnit = getAllTargetUnits(targetUnits)[0];

	if (position === BOARD_POSITION.FRONT) {
		return bm.getUnitColumn(targetUnit) === 0;
	}

	if (position === BOARD_POSITION.BACK) {
		return bm.getUnitColumn(targetUnit) === 2;
	}

	if (position === BOARD_POSITION.ISOLATED) {
		return getAdjacentAlliesTarget(bm, targetUnit).length === 0;
	}

	return true;
}

export function isEquipmentConditionValid(
	bm: BoardManager,
	unit: Unit,
	target: TARGET_TYPE,
	slots: EQUIPMENT_SLOT[],
	tags: EQUIPMENT_TAG[],
) {
	const targetUnits = bm.getTarget(unit, target);

	if (getAllTargetUnits(targetUnits).length === 0) {
		return false;
	}

	const targetUnit = getAllTargetUnits(targetUnits)[0];

	let isValid = false;

	targetUnit.equips.forEach(equip => {
		if (slots.includes(equip.slot) && tags.every(tag => equip.equip.data.tags.includes(tag))) {
			isValid = true;
		}
	});

	return isValid;
}
