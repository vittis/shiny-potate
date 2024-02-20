import { BoardManager } from "../BoardManager";
import { EVENT_TYPE, PossibleEvent } from "./EventTypes";

function sortEventsByType(events: PossibleEvent[]) {
  return events.sort((a, b) => {
    const order = {
      [EVENT_TYPE.TICK_EFFECT]: 1,
      [EVENT_TYPE.USE_ABILITY]: 2,
      [EVENT_TYPE.TRIGGER_EFFECT]: 3,
      [EVENT_TYPE.FAINT]: 4,
    };

    return order[a.type] - order[b.type];
  });
}

function executeStepEvents(bm: BoardManager, events: PossibleEvent[]) {
  events.forEach((event) => {
    bm.getUnitById(event.actorId).applyEvent(event);
  });

  return events;
}

export function sortAndExecuteEvents(
  bm: BoardManager,
  events: PossibleEvent[]
) {
  return executeStepEvents(bm, sortEventsByType(events));
}

export function getAndExecuteDeathEvents(bm: BoardManager) {
  let events: PossibleEvent[] = [];
  bm.getAllAliveUnits().forEach((unit) => {
    if (!unit.isDead && unit.hasDied()) {
      unit.onDeath();

      // execute events from death related triggers
      bm.getAllUnits().forEach((unit) => {
        const triggerEvents: PossibleEvent[] = [];
        triggerEvents.push(...unit.serializeEvents());
        const orderedEvents = sortAndExecuteEvents(bm, triggerEvents);
        events.push(...orderedEvents);
      });
    }
  });

  return events;
}
