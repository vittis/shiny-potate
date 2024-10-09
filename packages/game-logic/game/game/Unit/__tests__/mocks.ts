import { AbilityData } from "../../Ability/AbilityTypes";
import { EquipmentData } from "../../Equipment/EquipmentTypes";

export default {
	Weapons: {
		Wand: {
			name: "Wand",
			tags: ["WEAPON", "MAGICAL"],
			slots: ["MAIN_HAND"],
			mods: [
				{
					type: "GRANT_PERK",
					payload: {
						name: "Last Words",
						tier: 3,
					},
					tier: "implicit",
				},
				{
					type: "GRANT_PERK",
					payload: {
						name: "Berserk",
						tier: 3,
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
					type: "GRANT_BASE_STAT",
					payload: {
						stat: "ATTACK_DAMAGE",
						value: 15,
					},
					tier: "implicit",
				},
			],
		} as EquipmentData,
		Shortbow: {
			name: "Shortbow",
			tags: ["WEAPON", "RANGED", "PHYSICAL"],
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
			],
		} as EquipmentData,
		Sword: {
			name: "Sword",
			tags: ["WEAPON", "PHYSICAL"],
			slots: ["MAIN_HAND", "OFF_HAND"],
			mods: [
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
		ShortSpear: {
			name: "Short Spear",
			tags: ["WEAPON", "PHYSICAL", "MAGICAL"],
			slots: ["MAIN_HAND"],
			mods: [
				{
					type: "GRANT_BASE_STAT",
					payload: {
						stat: "ATTACK_DAMAGE",
						value: 10,
					},
					tier: "implicit",
				},
			],
		} as EquipmentData,
	},
	Perks: {
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
		},
		Berserk: {
			name: "Berserk",
			type: "TIER_SCALE",
			tags: [
				{
					name: "WEAPON",
					weight: 1,
				},
				{
					name: "TRINKET",
					weight: 1,
				},
			],
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
		},
		RangedProficiency: {
			name: "Ranged Proficiency",
			type: "TIER_SCALE",
			tags: [
				{
					name: "RANGED",
					weight: 5,
				},
			],
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
								slots: ["TWO_HANDS", "MAIN_HAND", "OFF_HAND"],
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
		},
	},
	Classes: {
		Ranger: {
			name: "Ranger",
			hp: 180,
			base: [
				{
					mods: [
						{
							type: "GRANT_BASE_STAT",
							payload: {
								stat: "ATTACK_COOLDOWN",
								value: 7,
							},
						},
						{
							type: "GRANT_BASE_STAT",
							payload: {
								stat: "ATTACK_DAMAGE",
								value: 7,
							},
						},
					],
					description: "Gain base stats",
				},
				{
					mods: [
						{
							type: "GRANT_ABILITY",
							payload: {
								name: "Disarming Shot",
								type: "ATTACK",
							},
						},
					],
					description: "Gain the Disarming Shot attack",
				},
				{
					mods: [
						{
							type: "GRANT_PERK",
							payload: {
								name: "Ranged Proficiency",
								tier: 2,
							},
						},
					],
					description: "Gain the Ranged Proficiency perk",
				},
			],
			utility: [
				{
					mods: [
						{
							type: "GRANT_PERK",
							payload: {
								name: "Desperate Will",
								tier: 1,
							},
						},
					],
					description: "Gain 1 Desperate Will",
				},
				{
					mods: [
						{
							type: "GRANT_PERK",
							payload: {
								name: "Dampening Field",
								tier: 1,
							},
						},
					],
					description: "Gain 1 Dampening Field",
				},
				{
					mods: [
						{
							type: "GRANT_PERK",
							payload: {
								name: "Focused Mind",
								tier: 1,
							},
						},
					],
					description: "Gain 1 Focused Mind",
				},
			],
			tree: [
				{
					name: "Sniper",
					talents: [
						{
							tier: 1,
							req: 0,
							mods: [
								{
									type: "GRANT_PERK",
									payload: {
										name: "Ranged Proficiency",
										tier: 1,
									},
								},
							],
							description: "Gain 1 Ranged Proficiency",
						},
						{
							tier: 1,
							req: 0,
							mods: [
								{
									type: "GRANT_PERK",
									payload: {
										name: "Open Field Tactics",
										tier: 1,
									},
								},
							],
							description: "Gain 1 Open Field Tactics",
						},
						{
							tier: 2,
							req: 2,
							mods: [
								{
									type: "GRANT_ABILITY",
									payload: {
										name: "Powershot",
										type: "ATTACK",
									},
								},
							],
							description: "Gain the Powershot attack",
						},
					],
				},
				{
					name: "Hunter",
					talents: [
						{
							tier: 1,
							req: 0,
							mods: [
								{
									type: "GRANT_ABILITY",
									payload: {
										name: "Summon Crab",
										type: "SPELL",
									},
								},
							],
							description: "Gain the Summon Crab spell",
						},
						{
							tier: 1,
							req: 0,
							mods: [
								{
									type: "GRANT_ABILITY",
									payload: {
										name: "Summon Rabbit",
										type: "SPELL",
									},
								},
							],
							description: "Gain the Summon Rabbit spell",
						},
						{
							tier: 1,
							req: 0,
							mods: [
								{
									type: "GRANT_ABILITY",
									payload: {
										name: "Summon Boar",
										type: "SPELL",
									},
								},
							],
							description: "Gain the Summon Boar spell",
						},
						{
							tier: 2,
							req: 1,
							mods: [
								{
									type: "GRANT_PERK",
									payload: {
										name: "Companion Master",
									},
								},
							],
							description: "Gain Companion Master",
						},
						{
							tier: 3,
							req: 3,
							mods: [
								{
									type: "GRANT_PERK",
									payload: {
										name: "Summoner's Farewell",
									},
								},
							],
							description: "Gain Summoner's Farewell",
						},
					],
				},
			],
		},
	},
	Abilities: {
		DisarmingShot: {
			name: "Disarming Shot",
			type: "ATTACK",
			tags: ["WEAPON_ABILITY"],
			target: "STANDARD",
			cooldown: 120,
			effects: [
				{
					type: "DAMAGE",
					trigger: "ON_HIT",
					target: "STANDARD",
					conditions: [],
					payload: {
						value: 40,
					},
				},
				{
					type: "STATUS_EFFECT",
					trigger: "ON_HIT",
					target: "STANDARD",
					conditions: [],
					payload: [
						{
							name: "VULNERABLE",
							quantity: 15,
						},
					],
				},
			],
		} as AbilityData,
	},
	Trinkets: {},
};
