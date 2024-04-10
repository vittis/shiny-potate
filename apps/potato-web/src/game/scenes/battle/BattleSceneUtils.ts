import { EVENT_TYPE } from "game-logic";
import { Ability, highlightAbility, restoreAbilities } from "./battleUnit/BattleUnitAbilities";

export function loopStepEvents({
	scene,
	loopEvents,
	effectsOnThisStep,
	subStep,
	onAllAnimationsEnd,
}) {
	let impactsEnded = 0;
	let animationsEnded = 0;

	loopEvents.forEach(event => {
		const unit = scene.units.find(u => u.id === event.actorId);
		if (unit) {
			let targets;

			if (event.type === EVENT_TYPE.USE_ABILITY) {
				targets = scene.units.filter(u => event.payload.targetsId.includes(u.id));
			}
			if (event.type === EVENT_TYPE.TRIGGER_EFFECT) {
				targets = [unit];
			}
			unit.playEvent({
				board: scene.board,
				event: event as any,
				targets,
				onImpact: () => {
					impactsEnded++;
					if (impactsEnded === loopEvents.length) {
						if (subStep === 0) {
							effectsOnThisStep?.units.forEach(unitEffect => {
								const currentUnit = scene.units.find(u => u.id === unitEffect.unitId);
								unitEffect.effects.forEach(effect => {
									currentUnit?.applyEffect(effect);
								});
							});
						} else {
							effectsOnThisStep?.subSteps
								.find(s => s.subStep == subStep)
								.units.forEach(unitEffect => {
									const currentUnit = scene.units.find(u => u.id === unitEffect.unitId);
									unitEffect.effects.forEach(effect => {
										currentUnit?.applyEffect(effect);
									});
								});
						}
					}
				},
				onEnd: () => {
					animationsEnded++;
					if (animationsEnded === loopEvents.length) {
						onAllAnimationsEnd();
						//scene.resumeTimeEvents();
					}

					if (event.type === EVENT_TYPE.USE_ABILITY) {
						const abilityUsed = unit?.abilitiesManager.abilities.find(
							ability => ability.id === event.payload.id,
						) as Ability;
						restoreAbilities([abilityUsed], scene);
					}
				},
				onStart: () => {
					if (event.type === EVENT_TYPE.USE_ABILITY) {
						const abilityUsed = unit?.abilitiesManager.abilities.find(
							ability => ability.id === event.payload.id,
						) as Ability;
						highlightAbility(abilityUsed, scene);
					}
				},
				allUnits: scene.units,
			});
		}
	});
}
