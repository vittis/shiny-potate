import { ActiveStatusEffect, STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { ActiveDisable, DISABLE } from "./DisableTypes";

export class DisableManager {
	private _activeDisables = [] as ActiveDisable[];

	constructor() {}

	get activeDisables() {
		return this._activeDisables;
	}

	applyDisable(disable: ActiveDisable) {
		const alreadyHasDisable = this.hasDisable(disable.name);
		if (alreadyHasDisable) {
			this._activeDisables = this._activeDisables.map(activeDisable => {
				if (activeDisable.name === disable.name) {
					const duration =
						disable.duration > activeDisable.duration ? disable.duration : activeDisable.duration;

					return {
						...activeDisable,
						duration,
					};
				}
				return activeDisable;
			});
		} else {
			this._activeDisables = [...this._activeDisables, disable];
		}
	}

	hasDisable(name: DISABLE): boolean {
		return this._activeDisables.some(disable => disable.name === name);
	}

	decreaseDurations() {
		this._activeDisables = this._activeDisables.map(disable => {
			return {
				...disable,
				duration: disable.duration - 1,
			};
		});

		this._activeDisables.forEach(disable => {
			if (disable.duration == 0) {
				this.removeDisable(disable.name);
			}
		});
	}

	removeDisable(name: DISABLE) {
		this._activeDisables = this._activeDisables.filter(disable => disable.name !== name);
	}
}
