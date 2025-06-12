import { BoardManager, OWNER } from "@/game/BoardManager/BoardManager";
import { PossibleEvent } from "@/game/Event/EventTypes";
import { executeStepEffects, getEventsFromIntents, getStepEffects } from "@/game/Event/EventUtils";

function hasGameEnded(bm: BoardManager) {
	return bm.getAllUnitsOfOwner(OWNER.TEAM_ONE).every(unit => unit.isDead) || bm.getAllUnitsOfOwner(OWNER.TEAM_TWO).every(unit => unit.isDead);
}

function getWinner(bm: BoardManager, currentStep: number): OWNER | "DRAW" | "TIME_LIMIT" {
	if (hasReachedTimeLimit(currentStep)) {
		return "TIME_LIMIT";
	}

	if (bm.getAllUnitsOfOwner(OWNER.TEAM_ONE).every(unit => unit.isDead)) {
		if (bm.getAllUnitsOfOwner(OWNER.TEAM_TWO).every(unit => unit.isDead)) {
			return "DRAW";
		}
		return OWNER.TEAM_TWO;
	} else {
		return OWNER.TEAM_ONE;
	}
}

function hasReachedTimeLimit(currentStep: number) {
	const STEP_LIMIT = 2000;
	return currentStep >= STEP_LIMIT;
}

export function runGame(bm: BoardManager) {
	let currentStep = 1;

	const eventHistory: PossibleEvent[] = [];

	// Loop steps
	do {
		// Step each unit alive
		bm.getAllAliveUnits().forEach(unit => {
			unit.step(currentStep);
		});

		const stepIntents = bm.getAllUnits().flatMap(unit => unit.serializeIntents());
		const stepEvents = getEventsFromIntents(bm, stepIntents);
		eventHistory.push(...stepEvents);

		if (stepEvents.length > 0) {
			let stepEffects = getStepEffects(stepEvents);
			executeStepEffects(bm, stepEffects);
		}

		currentStep++;
	} while (!hasGameEnded(bm) && !hasReachedTimeLimit(currentStep));

	return {
		totalSteps: currentStep - 1,
		winner: getWinner(bm, currentStep),
	};
}
