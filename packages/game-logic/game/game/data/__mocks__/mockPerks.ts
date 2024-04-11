import { PerkData } from "../../Perk/PerkTypes";

export const MockPerks = {
	FocusedMind: {
		name: "Focused Mind",
		type: "TIER_SCALE",
		tags: [
			{
				name: "WEAPON",
				weight: 2,
			},
			{
				name: "MAGICAL",
				weight: 5,
			},
		],
		tiers: [
			{
				name: "FOCUS",
				values: [5, 10, 15, 20, 30],
			},
		],
		effects: [
			{
				type: "STATUS_EFFECT",
				trigger: "BATTLE_START",
				target: "SELF",
				conditions: [],
				payload: [
					{
						name: "FOCUS",
						quantity: "DYNAMIC",
					},
				],
			},
		],
	} as PerkData,
	DesperateWill: {
		name: "Desperate Will",
		type: "TIER_SCALE",
		tiers: [
			{
				name: "ATTACK_POWER",
				values: [5, 10, 15, 20, 30],
			},
			{
				name: "SPELL_POTENCY",
				values: [5, 10, 15, 20, 30],
			},
		],
		effects: [
			{
				type: "STATUS_EFFECT",
				trigger: "ALLY_FAINT",
				target: "SELF",
				conditions: [],
				payload: [
					{
						name: "ATTACK_POWER",
						quantity: "DYNAMIC",
					},
					{
						name: "SPELL_POTENCY",
						quantity: "DYNAMIC",
					},
				],
			},
		],
	} as PerkData,
	LastWords: {
		name: "Last Words",
		type: "TIER_SCALE",
		tiers: [
			{
				name: "STURDY",
				values: [20, 25, 30, 35, 45],
			},
		],
		effects: [
			{
				type: "STATUS_EFFECT",
				trigger: "SELF_FAINT",
				target: "ALL_ALLIES",
				conditions: [],
				payload: [
					{
						name: "STURDY",
						quantity: "DYNAMIC",
					},
				],
			},
		],
	} as PerkData,
	Berserk: {
		name: "Berserk",
		type: "TIER_SCALE",
		tiers: [
			{
				name: "ATTACK_POWER",
				values: [5, 10, 15, 20, 30],
			},
			{
				name: "VULNERABLE",
				values: [5, 10, 15, 20, 30],
			},
		],
		effects: [
			{
				type: "STATUS_EFFECT",
				trigger: "BATTLE_START",
				target: "SELF",
				conditions: [
					{
						type: "POSITION",
						payload: {
							target: "SELF",
							position: "FRONT",
						},
					},
				],
				payload: [
					{
						name: "ATTACK_POWER",
						quantity: "DYNAMIC",
					},
					{
						name: "VULNERABLE",
						quantity: "DYNAMIC",
					},
				],
			},
		],
	} as PerkData,
	RangedProficiency: {
		name: "Ranged Proficiency",
		type: "TIER_SCALE",
		tiers: [
			{
				name: "FAST",
				values: [5, 10, 15, 20, 30],
			},
		],
		effects: [
			{
				type: "STATUS_EFFECT",
				trigger: "BATTLE_START",
				target: "SELF",
				conditions: [
					{
						type: "EQUIPMENT",
						payload: {
							target: "SELF",
							slots: ["MAIN_HAND", "OFF_HAND"],
							tags: ["PHYSICAL", "RANGED"],
						},
					},
				],
				payload: [
					{
						name: "FAST",
						quantity: "DYNAMIC",
					},
				],
			},
		],
	} as PerkData,
	PreyTheWeak: {
		name: "Prey The Weak",
		type: "TIER_SCALE",
		tags: [
			{
				name: "WEAPON",
				weight: 1,
			},
			{
				name: "PHYSICAL",
				weight: 3,
			},
		],
		tiers: [
			{
				name: "VULNERABLE",
				values: [4, 10, 18, 30, 45],
			},
		],
		effects: [
			{
				type: "STATUS_EFFECT",
				trigger: "ON_HIT",
				target: "HIT_TARGET",
				conditions: [],
				payload: [
					{
						name: "VULNERABLE",
						quantity: "DYNAMIC",
					},
				],
			},
		],
	} as PerkData,
	VenomousStrikes: {
		name: "Venomous Strikes",
		type: "TIER_SCALE",
		tags: [
			{
				name: "WEAPON",
				weight: 1,
			},
			{
				name: "PHYSICAL",
				weight: 3,
			},
		],
		tiers: [
			{
				name: "POISON",
				values: [2, 4, 6, 8, 10],
			},
		],
		effects: [
			{
				type: "STATUS_EFFECT",
				trigger: "ON_ATTACK_HIT",
				target: "HIT_TARGET",
				conditions: [],
				payload: [
					{
						name: "POISON",
						quantity: "DYNAMIC",
					},
				],
			},
		],
	} as PerkData,
};
