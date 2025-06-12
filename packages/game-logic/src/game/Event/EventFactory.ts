import { BattleUnit } from "@/game/BattleUnit/BattleUnit";
import { BoardManager } from "@/game/BoardManager/BoardManager";
import { SubEvent, SUBEVENT_TYPE } from "@/game/Event/EventTypes";
import { INSTANT_EFFECT, MOD, ModEffectPayload, PossibleAbilityMod } from "@/game/Mod/ModTypes";
import { getTarget } from "@/game/Target/TargetUtils";

export function generateSubEvents(unit: BattleUnit, effects: PossibleAbilityMod[], bm: BoardManager): SubEvent[] {
	let subEvents: SubEvent[] = [];

	effects.forEach(effect => {
		const targets = effect.targets.flatMap(target => {
			return getTarget(bm, unit, target.target);
		});

		if (effect.type === MOD.EFFECT) {
			effect.payload.forEach(payload => {
				if (payload.effect === INSTANT_EFFECT.DAMAGE) {
					subEvents.push(createDamageSubEvent(targets, payload));
				}
			});
		}
	});

	return subEvents;
}

export function createDamageSubEvent(targets: BattleUnit[], payload: ModEffectPayload) {
	const subEvent = {
		type: SUBEVENT_TYPE.INSTANT_EFFECT,
		targetsId: targets.map(target => target.id),
		payload: {
			effect: INSTANT_EFFECT.DAMAGE,
			value: payload.value,
		},
	} as SubEvent;

	return subEvent;
}
