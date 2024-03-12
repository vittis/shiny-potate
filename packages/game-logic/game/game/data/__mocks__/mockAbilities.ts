export const MockAbilities = {
	Thrust: {
		name: "Thrust",
		type: "ATTACK",
		tags: ["WEAPON_ABILITY"],
		target: "STANDARD",
		cooldown: 80,
		effects: [
			{
				type: "DAMAGE",
				trigger: "ON_HIT",
				target: "STANDARD",
				conditions: [],
				payload: {
					value: 20,
				},
			},
		],
	},
	Slash: {
		name: "Slash",
		type: "ATTACK",
		tags: ["WEAPON_ABILITY"],
		target: "STANDARD",
		cooldown: 50,
		effects: [
			{
				type: "DAMAGE",
				trigger: "ON_HIT",
				target: "STANDARD",
				conditions: [],
				payload: {
					value: 20,
				},
			},
		],
	},
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
	},
	EmpoweringStrike: {
		name: "Empowering Strike",
		type: "ATTACK",
		tags: ["WEAPON_ABILITY"],
		target: "STANDARD",
		cooldown: 60,
		effects: [
			{
				type: "DAMAGE",
				trigger: "ON_HIT",
				target: "STANDARD",
				conditions: [],
				payload: {
					value: 20,
				},
			},
			{
				type: "STATUS_EFFECT",
				trigger: "ON_HIT",
				target: "SELF",
				conditions: [],
				payload: [
					{
						name: "ATTACK_POWER",
						quantity: 10,
					},
				],
			},
			{
				type: "STATUS_EFFECT",
				trigger: "ON_HIT",
				target: "STANDARD",
				conditions: [],
				payload: [
					{
						name: "VULNERABLE",
						quantity: 5,
					},
				],
			},
		],
	},
	ReinforceAllies: {
		name: "Reinforce Allies",
		type: "SPELL",
		tags: [],
		target: "ADJACENT_ALLIES",
		cooldown: 100,
		effects: [
			{
				type: "SHIELD",
				trigger: "ON_USE",
				target: "ADJACENT_ALLIES",
				conditions: [],
				payload: {
					value: 20,
				},
			},
		],
	},
	BlessedBeacon: {
		name: "Blessed Beacon",
		type: "SPELL",
		tags: ["BUFF"],
		target: "ADJACENT_ALLIES",
		cooldown: 120,
		effects: [
			{
				type: "STATUS_EFFECT",
				trigger: "ON_USE",
				target: "ADJACENT_ALLIES",
				conditions: [],
				payload: [
					{
						name: "REGEN",
						quantity: 5,
					},
				],
			},
			{
				type: "HEAL",
				trigger: "ON_USE",
				target: "ADJACENT_ALLIES",
				conditions: [],
				payload: {
					value: 10,
				},
			},
		],
	},
	PhalanxFury: {
		name: "Phalanx Fury",
		type: "ATTACK",
		tags: ["WEAPON_ABILITY"],
		target: "STANDARD_ROW",
		cooldown: 40,
		effects: [
			{
				type: "DAMAGE",
				trigger: "ON_HIT",
				target: "STANDARD_ROW",
				conditions: [],
				payload: {
					value: 40,
				},
			},
		],
	},
	DecayStrike: {
		name: "Decay Strike",
		type: "SPELL",
		tags: [],
		target: "STANDARD",
		cooldown: 30,
		effects: [
			{
				type: "STATUS_EFFECT",
				trigger: "ON_HIT",
				target: "STANDARD",
				conditions: [],
				payload: [
					{
						name: "POISON",
						quantity: 5,
					},
				],
			},
		],
	},
	ArcaneStudies: {
		name: "Arcane Studies",
		type: "SPELL",
		tags: ["BUFF"],
		target: "SELF",
		cooldown: 40,
		effects: [
			{
				type: "STATUS_EFFECT",
				trigger: "ON_USE",
				target: "SELF",
				conditions: [],
				payload: [
					{
						name: "SPELL_POTENCY",
						quantity: 5,
					},
				],
			},
			{
				type: "STATUS_EFFECT",
				trigger: "ON_USE",
				target: "SELF",
				conditions: [],
				payload: [
					{
						name: "FOCUS",
						quantity: 5,
					},
				],
			},
		],
	},
	DarkBolt: {
		name: "Dark Bolt",
		type: "SPELL",
		tags: [],
		target: "STANDARD",
		cooldown: 40,
		effects: [
			{
				type: "DAMAGE",
				trigger: "ON_HIT",
				target: "STANDARD",
				conditions: [],
				payload: {
					value: 30,
				},
			},
			{
				type: "HEAL",
				trigger: "ON_HIT",
				target: "SELF",
				conditions: [],
				payload: {
					value: 5,
				},
			},
		],
	},
	SummonCrab: {
		name: "Summon Crab",
		type: "SPELL",
		tags: ["SUMMON"],
		target: "ADJACENT_ALLIES",
		cooldown: 80,
		effects: [
			{
				type: "STATUS_EFFECT",
				trigger: "ON_USE",
				target: "ADJACENT_ALLIES",
				conditions: [],
				payload: [
					{
						name: "STURDY",
						quantity: 5,
					},
					{
						name: "THORN",
						quantity: 5,
					},
				],
			},
		],
	},
	Stab: {
		name: "Stab",
		type: "ATTACK",
		tags: ["WEAPON_ABILITY"],
		target: "STANDARD",
		cooldown: 20,
		effects: [
			{
				type: "DAMAGE",
				trigger: "ON_HIT",
				target: "STANDARD",
				conditions: [],
				payload: {
					value: 15,
				},
			},
		],
	},
	Fireball: {
		name: "Fireball",
		type: "SPELL",
		tags: [],
		target: "STANDARD",
		cooldown: 50,
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
		],
	},
	BastionBond: {
		name: "Bastion Bond",
		type: "SPELL",
		tags: ["BUFF"],
		target: "LOWEST_HEALTH_ALLY",
		cooldown: 100,
		effects: [
			{
				type: "STATUS_EFFECT",
				trigger: "ON_USE",
				target: "LOWEST_HEALTH_ALLY",
				conditions: [],
				payload: [
					{
						name: "REGEN",
						quantity: 5,
					},
				],
			},
			{
				type: "HEAL",
				trigger: "ON_USE",
				target: "LOWEST_HEALTH_ALLY",
				conditions: [],
				payload: {
					value: 30,
				},
			},
		],
	},
};
