import { EquipmentData } from "../../Equipment/EquipmentTypes";

export const MockTrinkets = {
	BrainsInAJar: {
		name: "Brains in a Jar",
		tags: ["TRINKET", "MAGICAL"],
		slots: ["TRINKET"],
		mods: [
			{
				type: "GRANT_PERK",
				payload: {
					name: "Focused Mind",
					tier: 1,
				},
				tier: "implicit",
			},
		],
		effects: [],
	} as EquipmentData,
	KamesLostSash: {
		name: "Kame's Lost Sash",
		tags: ["TRINKET"],
		slots: ["TRINKET"],
		mods: [
			{
				type: "GRANT_ABILITY",
				payload: {
					name: "Ki Focus",
					type: "SPELL",
				},
				tier: "implicit",
			},
			{
				type: "GRANT_BASE_STAT",
				payload: {
					stat: "ATTACK_DAMAGE",
					value: 5,
				},
				tier: "implicit",
			},
		],
		effects: [],
	} as EquipmentData,
	OrbOfCoagulatedBlood: {
		name: "Orb of Coagulated Blood",
		tags: ["TRINKET", "DEFENSE", "MAGICAL"],
		slots: ["TRINKET"],
		mods: [
			{
				type: "GRANT_PERK",
				payload: {
					name: "Vitality Boost",
					tier: 1,
				},
				tier: "implicit",
			},
			{
				type: "GRANT_BASE_STAT",
				payload: {
					stat: "ATTACK_DAMAGE",
					value: 7,
				},
				tier: "implicit",
			},
		],
		effects: [],
	} as EquipmentData,
	SagesBrandNewHat: {
		name: "Sage's Brand New Hat",
		tags: ["TRINKET", "MAGICAL"],
		slots: ["TRINKET"],
		mods: [
			{
				type: "GRANT_BASE_STAT",
				payload: {
					stat: "SPELL_DAMAGE",
					value: 10,
				},
				tier: "implicit",
			},
			{
				type: "GRANT_BASE_STAT",
				payload: {
					stat: "SPELL_COOLDOWN",
					value: 10,
				},
				tier: "implicit",
			},
		],
		effects: [],
	} as EquipmentData,
	ScoutsEye: {
		name: "Scout's Eye",
		tags: ["TRINKET", "RANGED", "PHYSICAL"],
		slots: ["TRINKET"],
		mods: [
			{
				type: "GRANT_PERK",
				payload: {
					name: "Open Field Tactics",
					tier: 1,
				},
				tier: "implicit",
			},
			{
				type: "GRANT_BASE_STAT",
				payload: {
					stat: "ATTACK_COOLDOWN",
					value: 10,
				},
				tier: "implicit",
			},
		],
		effects: [],
	} as EquipmentData,
	TrainingArmbands: {
		name: "Training Armbands",
		tags: ["TRINKET", "RANGED", "PHYSICAL"],
		slots: ["TRINKET"],
		mods: [
			{
				type: "GRANT_BASE_STAT",
				payload: {
					stat: "ATTACK_DAMAGE",
					value: 15,
				},
				tier: "implicit",
			},
		],
		effects: [],
	} as EquipmentData,
	Dagger: {
		name: "Dagger",
		tags: ["WEAPON", "PHYSICAL"],
		slots: ["MAIN_HAND", "OFF_HAND"],
		mods: [
			{
				type: "GRANT_ABILITY",
				payload: {
					name: "Stab",
					type: "ATTACK",
				},
				tier: "implicit",
			},
			{
				type: "GRANT_BASE_STAT",
				payload: {
					stat: "ATTACK_COOLDOWN",
					value: 15,
				},
				tier: "implicit",
			},
			{
				type: "GRANT_BASE_STAT",
				payload: {
					stat: "ATTACK_DAMAGE",
					value: 15,
				},
				tier: "implicit",
			},
		],
		effects: [],
	} as EquipmentData,
};
