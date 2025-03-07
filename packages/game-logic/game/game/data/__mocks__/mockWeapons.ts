import { EquipmentData } from "../../Equipment/EquipmentTypes";

export const MockWeapons = {
	Shortbow: {
		name: "Shortbow",
		tags: ["WEAPON", "qqRANGED", "PHYSICAL"],
		slots: ["MAIN_HAND"],
		mods: [
			{
				type: "GRANT_ABILITY",
				payload: {
					name: "Disarming Shot",
					type: "ATTACK",
				},
				tier: "implicit",
			},
			/* {
        type: "GRANT_PERK",
        payload: {
          name: "Ranged Proficiency",
        },
      }, */
		],
	} as EquipmentData,
	ShortSpear: {
		name: "Short Spear",
		tags: ["WEAPON", "PHYSICAL"],
		slots: ["MAIN_HAND"],
		mods: [
			{
				type: "GRANT_ABILITY",
				payload: {
					name: "Thrust",
					type: "ATTACK",
				},
				tier: "implicit",
			},
			{
				type: "GRANT_BASE_STAT",
				payload: {
					stat: "ATTACK_DAMAGE",
					value: 10,
				},
				tier: "implicit",
			},
			{
				type: "GRANT_PERK",
				payload: {
					name: "Focused Mind",
					tier: 1,
				},
				tier: "implicit",
			},
		],
	} as EquipmentData,
	Sword: {
		name: "Sword",
		tags: ["WEAPON", "PHYSICAL"],
		slots: ["MAIN_HAND", "OFF_HAND"],
		mods: [
			{
				type: "GRANT_ABILITY",
				payload: {
					name: "Slash",
					type: "ATTACK",
				},
				tier: "implicit",
			},
			{
				type: "GRANT_PERK",
				payload: {
					name: "Desperate Will",
					tier: 1,
				},
				tier: "implicit",
			},
			{
				type: "GRANT_PERK",
				payload: {
					name: "Berserk",
					tier: 1,
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
	} as EquipmentData,
	Axe: {
		name: "Axe",
		tags: ["WEAPON", "PHYSICAL"],
		slots: ["MAIN_HAND"],
		mods: [
			{
				type: "GRANT_ABILITY",
				payload: {
					name: "Empowering Strike",
					type: "ATTACK",
				},
				tier: "implicit",
			},
		],
	} as EquipmentData,
	Wand: {
		name: "Wand",
		tags: ["WEAPON", "MAGICAL"],
		slots: ["MAIN_HAND"],
		mods: [
			{
				type: "GRANT_ABILITY",
				payload: {
					name: "Bastion Bond",
					type: "SPELL",
				},
				tier: "implicit",
			},
			{
				type: "GRANT_PERK",
				payload: {
					name: "Focused Mind",
					tier: 1,
				},
				tier: "implicit",
			},
			{
				type: "GRANT_PERK",
				payload: {
					name: "Last Words",
					tier: 3,
				},
				tier: "implicit",
			},
			{
				type: "GRANT_BASE_STAT",
				payload: {
					stat: "SPELL_DAMAGE",
					value: 5,
				},
				tier: "implicit",
			},
		],
	} as EquipmentData,
	Longbow: {
		name: "Longbow",
		tags: ["WEAPON", "PHYSICAL", "RANGED"],
		slots: ["TWO_HANDS"],
		mods: [
			{
				type: "GRANT_ABILITY",
				payload: {
					name: "Long Shot",
					type: "ATTACK",
				},
				tier: "implicit",
			},
			{
				type: "GRANT_PERK",
				payload: {
					name: "Open Field Tactics",
					tier: 1,
				},
				tier: "implicit",
			},
			{
				type: "GRANT_PERK",
				payload: {
					name: "Prey The Weak",
					tier: 1,
				},
				tier: "implicit",
			},
		],
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
			{
				type: "GRANT_PERK",
				payload: {
					name: "Iron Heart",
					tier: 1,
				},
				tier: "implicit",
			},
		],
	} as EquipmentData,
	VenomousDagger: {
		name: "Venomous Dagger",
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
				type: "GRANT_PERK",
				payload: {
					name: "Venomous Strikes",
					tier: 1,
				},
				tier: "implicit",
			},
		],
	} as EquipmentData,
	Staff: {
		name: "Staff",
		tags: ["WEAPON", "MAGICAL", "RANGED"],
		slots: ["TWO_HANDS"],
		mods: [
			{
				type: "GRANT_ABILITY",
				payload: {
					name: "Fireball",
					type: "SPELL",
				},
				tier: "implicit",
			},
			{
				type: "GRANT_BASE_STAT",
				payload: {
					stat: "SPELL_DAMAGE",
					value: 15,
				},
				tier: "implicit",
			},
		],
	} as EquipmentData,
};
