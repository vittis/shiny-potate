import { PossibleTriggerEffect, TRIGGER, TriggerEffect } from "../Trigger/TriggerTypes";
import { TARGET_TYPE } from "../Target/TargetTypes";
import { GrantAbilityModifierPayload } from "../Mods/ModsTypes";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { STAT } from "../Stats/StatsTypes";
import { DISABLE } from "../Disable/DisableTypes";

export enum ABILITY_CATEGORY {
	ATTACK = "ATTACK",
	SPELL = "SPELL",
}

export enum ABILITY_TAG {
	WEAPON_ABILITY = "WEAPON_ABILITY",
	USE_WEAPON_ABILITY = "USE_WEAPON_ABILITY",
	SUMMON = "SUMMON",
	BUFF = "BUFF",
}

export enum ABILITY_MOD_TYPES {
	TRIGGER = "TRIGGER",
	CATEGORY = "CATEGORY",
	TARGET = "TARGET",
	DAMAGE = "DAMAGE",
	HEAL = "HEAL",
	SHIELD = "SHIELD",
	STATUS_EFFECT = "STATUS_EFFECT",
	DISABLE = "DISABLE",
}

// this represents the JSON of the ability
export interface AbilityData {
	name: string;
	type: ABILITY_CATEGORY;
	tags: ABILITY_TAG[];
	target: TARGET_TYPE;
	cooldown: number;
	effects: PossibleTriggerEffect[];
	abilityModifiers?: AbilityModifier[];
}

export type AbilityModifier = UniqueAbilityModifier | DefaultAbilityModifier;

export interface UniqueAbilityModifier {
	name: string;
	unique: true;
}

export interface DefaultAbilityModifier {
	name: string;
	modifiers: AbilityModifierPossibleMods[];
}

export type AbilityModifierPossibleMods =
	| AbilityModifierPossibleEffectMods
	| AbilityModifierMod<ABILITY_MOD_TYPES.TRIGGER>
	| AbilityModifierMod<ABILITY_MOD_TYPES.CATEGORY>
	| AbilityModifierMod<ABILITY_MOD_TYPES.TARGET>;

export type AbilityModifierPossibleEffectMods =
	| AbilityModifierMod<ABILITY_MOD_TYPES.DAMAGE>
	| AbilityModifierMod<ABILITY_MOD_TYPES.HEAL>
	| AbilityModifierMod<ABILITY_MOD_TYPES.SHIELD>
	| AbilityModifierMod<ABILITY_MOD_TYPES.DISABLE>
	| AbilityModifierMod<ABILITY_MOD_TYPES.STATUS_EFFECT>;

export interface AbilityModifierMod<T extends ABILITY_MOD_TYPES> {
	type: T;
	payload: AbilityModifierPayloadMap[T];
}

export type AbilityModifierPayloadMap = {
	[ABILITY_MOD_TYPES.TRIGGER]: AbilityModifierTriggerPayload;
	[ABILITY_MOD_TYPES.CATEGORY]: AbilityModifierCategoryPayload;
	[ABILITY_MOD_TYPES.TARGET]: AbilityModifierTargetPayload;
	[ABILITY_MOD_TYPES.DAMAGE]: AbilityModifierDamagePayload;
	[ABILITY_MOD_TYPES.HEAL]: AbilityModifierHealPayload;
	[ABILITY_MOD_TYPES.SHIELD]: AbilityModifierShieldPayload;
	[ABILITY_MOD_TYPES.STATUS_EFFECT]: AbilityModifierStatusEffectPayload;
	[ABILITY_MOD_TYPES.DISABLE]: AbilityModifierDisablePayload;
};

export interface AbilityModifierTriggerPayload {
	name: TRIGGER;
	remove?: boolean;
}

export interface AbilityModifierTargetPayload {
	name: TARGET_TYPE;
}

export interface AbilityModifierStatusEffectPayload {
	name: STATUS_EFFECT;
	target: TARGET_TYPE;
	value: number;
	remove?: boolean;
}

export interface AbilityModifierDisablePayload {
	name: DISABLE;
	target: TARGET_TYPE;
	value: number;
	remove?: boolean;
}

export interface AbilityModifierDamagePayload {
	target: TARGET_TYPE;
	value: number;
	remove?: boolean;
}

export interface AbilityModifierHealPayload {
	target: TARGET_TYPE;
	value: number;
	remove?: boolean;
}

export interface AbilityModifierShieldPayload {
	target: TARGET_TYPE;
	value: number;
	remove?: boolean;
}

export interface AbilityModifierCategoryPayload {
	name: ABILITY_CATEGORY;
}

export type AbilityModifierWithEffects = AbilityModifier & {
	effects: PossibleTriggerEffect[];
};
