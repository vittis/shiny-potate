/* import { OWNER } from "../BoardManager/BoardManager";
import { PackUnit } from "../PackUnit/PackUnit";
import { BattleUnitInfo } from "./BattleUnitTypes";
import { EquippedItem } from "../Equipment/EquipmentManager";
import { Ability } from "../Ability/Ability"; */

import { Ability } from "@/game/Ability/Ability";
import { BattleUnitInfo } from "@/game/BattleUnit/BattleUnitTypes";
import { OWNER } from "@/game/BoardManager/BoardManager";
import { EquippedItem } from "@/game/Equipment/EquipmentManager";
import { PossibleIntent } from "@/game/Event/EventTypes";
import { INSTANT_EFFECT, ModEffectPayload } from "@/game/Mod/ModTypes";
import { PackUnit } from "@/game/PackUnit/PackUnit";
import { nanoid } from "nanoid";

export class BattleUnit {
	id: string;
	owner!: OWNER;

	column!: number;
	row!: number;

	packUnit!: PackUnit;
	equipment!: EquippedItem[];
	abilities!: Ability[];

	currentStep = 0;

	isDead = false;

	stepIntents: PossibleIntent[] = [];

	constructor(battleUnitInfo?: BattleUnitInfo) {
		this.id = nanoid(8);
		if (battleUnitInfo) {
			this.setBattleUnitInfo(battleUnitInfo);
		}
	}

	setBattleUnitInfo(battleUnitInfo: BattleUnitInfo) {
		this.owner = battleUnitInfo.owner;
		this.packUnit = battleUnitInfo.packUnit;
		this.equipment = battleUnitInfo.equipment;
		this.abilities = battleUnitInfo.abilities;
		this.setPosition(battleUnitInfo.position.row, battleUnitInfo.position.column);
	}

	setPosition(row: number, column: number) {
		this.column = column;
		this.row = row;
	}

	setOwner(owner: OWNER) {
		this.owner = owner;
	}

	toString() {
		return `${this.row},${this.column}_${this.id}`;
	}

	serializeIntents() {
		const intents = [...this.stepIntents];
		this.stepIntents = [];
		return intents;
	}

	step(stepNumber: number) {
		this.currentStep = stepNumber;

		this.abilities.forEach(ability => {
			ability.step();

			if (ability.canActivate()) {
				this.stepIntents.push(ability.createAbilityIntent(this));
			}
		});
	}

	applyEffect(effect: ModEffectPayload) {
		if (effect.effect === INSTANT_EFFECT.DAMAGE) {
			this.receiveDamage(effect.value);
		}
	}

	receiveDamage(damage: number) {
		console.log("levei dano ", damage);
	}
}
