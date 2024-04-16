import { MOD_TYPE, Mod, PossibleMods } from "../Mods/ModsTypes";
import { filterModsByType } from "../Mods/ModsUtils";
import { Perk } from "./Perk";
import { Perks } from "../data";
import { PossibleTriggerEffect } from "../Trigger/TriggerTypes";
import { Unit } from "../Unit/Unit";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { POSITION } from "../BoardManager";

function getPerkData(name: string) {
	const nameWithoutSpaces = name.replace(/\s/g, "");
	const PerkData = Perks[nameWithoutSpaces];
	if (PerkData) {
		return PerkData;
	} else {
		throw new Error(`Unknown perk: ${name}`);
	}
}

function filterPerkMods(mods: PossibleMods): Mod<MOD_TYPE.GRANT_PERK>[] {
	return filterModsByType(mods, MOD_TYPE.GRANT_PERK);
}

export function filterAndInstantiatePerksFromMods(mods: PossibleMods) {
	const perkMods = filterPerkMods(mods);

	return perkMods.map(mod => {
		const PerkData = getPerkData(mod.payload.name);
		const tier = mod.tier === "implicit" ? undefined : mod.tier;
		return new Perk(PerkData, tier);
	});
}

const PerkFunctionMap: {
	[key: string]: (perk: Perk, unit: Unit) => PossibleTriggerEffect[];
} = {
	"Open Field Tactics": getPerkOpenFieldTactics,
};

export function getSpecificPerkEffect(perk: Perk, unit: Unit): PossibleTriggerEffect[] {
	const perkFunction = PerkFunctionMap[perk.data.name];
	if (!perkFunction) throw new Error(`getSpecificPerkEffect: Unknown perk: ${perk.data.name}`);

	const effects = perkFunction(perk, unit);

	return effects;
}

export function getPerkOpenFieldTactics(perk: Perk, unit: Unit): PossibleTriggerEffect[] {
	let multiplier = 0;

	if (unit.position === POSITION.TOP_MID) {
		if (unit.bm.getUnitByPosition(unit.owner, POSITION.TOP_FRONT).length === 0) {
			multiplier = 1;
		}
	} else if (unit.position === POSITION.BOT_MID) {
		if (unit.bm.getUnitByPosition(unit.owner, POSITION.BOT_FRONT).length === 0) {
			multiplier = 1;
		}
	} else if (unit.position === POSITION.TOP_BACK) {
		if (unit.bm.getUnitByPosition(unit.owner, POSITION.TOP_MID).length === 0) {
			multiplier += 1;
		}
		if (unit.bm.getUnitByPosition(unit.owner, POSITION.TOP_FRONT).length === 0) {
			multiplier += 1;
		}
	} else if (unit.position === POSITION.BOT_BACK) {
		if (unit.bm.getUnitByPosition(unit.owner, POSITION.BOT_MID).length === 0) {
			multiplier += 1;
		}
		if (unit.bm.getUnitByPosition(unit.owner, POSITION.BOT_FRONT).length === 0) {
			multiplier += 1;
		}
	}

	if (multiplier === 0) return [];

	const fastQuantity = perk.getTierValue(STATUS_EFFECT.FAST) * multiplier;
	const attackPowerQuantity = perk.getTierValue(STATUS_EFFECT.ATTACK_POWER) * multiplier;

	const effect = {
		type: "STATUS_EFFECT",
		trigger: "BATTLE_START",
		target: "SELF",
		conditions: [],
		payload: [
			{
				name: "FAST",
				quantity: fastQuantity,
			},
			{
				name: "ATTACK_POWER",
				quantity: attackPowerQuantity,
			},
		],
	} as PossibleTriggerEffect;

	return [effect] as PossibleTriggerEffect[];
}
