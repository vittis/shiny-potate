import { ActiveStatusEffect, STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { ActiveDisable, DISABLE } from "./DisableTypes";

export class DisableManager {
	private _activeDisable = [] as ActiveDisable[];

	constructor() {}

	get activeDisable() {
		return this._activeDisable;
	}

	applyDisable(disable: ActiveDisable) {
		const alreadyHasDisable = this.hasDisable(disable.name);
		if (alreadyHasDisable) {
			this._activeDisable = this._activeDisable.map(activeDisable => {
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
			this._activeDisable = [...this._activeDisable, disable];
		}
	}

	hasDisable(name: DISABLE): boolean {
		return this._activeDisable.some(disable => disable.name === name);
	}

	removeStack(name: DISABLE) {
		this._activeDisable = this._activeDisable.map(disable => {
			if (disable.name === name) {
				return {
					...disable,
					duration: disable.duration - 1,
				};
			}
			return disable;
		});

		if (this._activeDisable.find(disable => disable.name === name)?.duration === 0) {
			this.removeDisable(name);
		}
	}

	removeDisable(name: DISABLE) {
		this._activeDisable = this._activeDisable.filter(disable => disable.name !== name);
	}
}
