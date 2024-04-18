export const MockClasses = {
	Ranger: {
		name: "Ranger",
		hp: 80,
		base: [
			{
				mods: [
					{
						type: "GRANT_ABILITY",
						payload: {
							name: "Thrust",
							type: "ATTACK",
						},
					},
				],
				description: "Gain the Weak Spot attack",
			},
			{
				mods: [
					{
						type: "GRANT_PERK",
						payload: {
							name: "Ranged Proficiency",
							tier: 1,
						},
					},
				],
				description: "Gain the Ranged Proficiency perk",
			},
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
				description: "Gain 10% Damage Reduction",
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
									tier: 1,
								},
							},
						],
						description: "Gain 1 Companion Master",
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
	Blacksmith: {
		name: "Blacksmith",
		hp: 210,
		base: [
			{
				mods: [
					{
						type: "GRANT_ABILITY",
						payload: {
							name: "Reinforce Allies",
							type: "SPELL",
						},
					},
				],
				description: "Gain the Reinforce Allies spell",
			},
			{
				mods: [
					{
						type: "GRANT_BASE_STAT",
						payload: {
							stat: "DAMAGE_REDUCTION",
							value: 10,
						},
					},
				],
				description: "Gain 10% Damage Reduction",
			},
		],
		utility: [
			{
				mods: [
					{
						type: "GRANT_ABILITY_MODIFIER",
						payload: {
							name: "Reinforce Allies",
							modifier: "Reinforce Self",
						},
					},
				],
				description:
					"Reinforce Allies don't affect adjacents units anymore. Apply the same amount to self",
			},
			{
				mods: [
					{
						type: "GRANT_ABILITY_MODIFIER",
						payload: {
							name: "Reinforce Allies",
							modifier: "Reinforce on Battle Start",
						},
					},
				],
				description: "BATTLE START: Trigger Reinforce Allies",
			},
			{
				mods: [
					{
						type: "GRANT_ABILITY_MODIFIER",
						payload: {
							name: "Reinforce Allies",
							modifier: "Reinforce on Faint",
						},
					},
				],
				description: "FAINT: Trigger Reinforce Allies",
			},
		],
		tree: [
			{
				name: "Weaponsmith",
				talents: [
					{
						tier: 1,
						req: 0,
						mods: [
							{
								type: "GRANT_ABILITY_MODIFIER",
								payload: {
									name: "Reinforce Allies",
									modifier: "Reinforce Speed",
								},
							},
						],
						description: "Reinforce Allies also gives 5 FAST to adjacents allies",
					},
					{
						tier: 1,
						req: 0,
						mods: [
							{
								type: "GRANT_ABILITY_MODIFIER",
								payload: {
									name: "Reinforce Allies",
									modifier: "Reinforce Front Offense",
								},
							},
						],
						description:
							"Reinforce Allies also gives 10 ATTACK POWER, 10 SPELL POTENCY and 10 FAST to FRONT ally",
					},
					{
						tier: 2,
						req: 2,
						mods: [
							{
								type: "GRANT_ABILITY_MODIFIER",
								payload: {
									name: "Reinforce Allies",
									modifier: "Reinforce Front Offense 2",
								},
							},
						],
						description: "Reinforce Allies also gives 1 MULTISTRIKE to FRONT ally",
					},
				],
			},
			{
				name: "Armorsmith",
				talents: [
					{
						tier: 1,
						req: 0,
						mods: [
							{
								type: "GRANT_ABILITY_MODIFIER",
								payload: {
									name: "Reinforce Allies",
									modifier: "Reinforce Shield",
								},
							},
						],
						description: "Reinforce Allies also gives gives 15 more SHIELD to adjacents allies",
					},
					{
						tier: 1,
						req: 0,
						mods: [
							{
								type: "GRANT_ABILITY_MODIFIER",
								payload: {
									name: "Reinforce Allies",
									modifier: "Reinforce Defense",
								},
							},
						],
						description: "Reinforce Allies give 10 STURDY and 20 more SHIELD to FRONT ally",
					},
					{
						tier: 2,
						req: 2,
						mods: [
							{
								type: "GRANT_ABILITY_MODIFIER",
								payload: {
									name: "Reinforce Allies",
									modifier: "Reinforce Defense 2",
								},
							},
						],
						description: "Reinforce Allies: Give 2 TAUNT and 25 THORN to FRONT ally",
					},
				],
			},
		],
	},
	Rogue: {
		name: "Rogue",
		hp: 180,
		base: [
			{
				mods: [
					{
						type: "GRANT_ABILITY",
						payload: {
							name: "Quick Attack",
							type: "ATTACK",
						},
					},
				],
				description: "Gain the Quick Attack attack",
			},
			{
				mods: [
					{
						type: "GRANT_BASE_STAT",
						payload: {
							stat: "ATTACK_DAMAGE",
							value: 15,
						},
					},
				],
				description: "TODO should be perk? -> If isolated +15% Attack Damage Modifier",
			},
		],
		utility: [
			{
				mods: [
					{
						type: "GRANT_ABILITY_MODIFIER",
						payload: {
							name: "Quick Attack",
							modifier: "Quick Spell",
						},
					},
				],
				description: "Quick attack is a spell now",
			},
			{
				mods: [
					{
						type: "GRANT_PERK",
						payload: {
							name: "Dead Man Tells No Tales",
						},
					},
				],
				description: "Gain Dead Man Tells No Tales",
			},
		],
		tree: [
			{
				name: "Master Poisoner",
				talents: [
					{
						tier: 1,
						req: 0,
						mods: [
							{
								type: "GRANT_PERK",
								payload: {
									name: "Prey The Weak",
									tier: 1,
								},
							},
						],
						description: "Gain 1 Prey The Weak",
					},
					{
						tier: 1,
						req: 0,
						mods: [
							{
								type: "GRANT_ABILITY",
								payload: {
									name: "Decay Strike",
									type: "SPELL",
								},
							},
						],
						description: "Gain Decay Strike Spell",
					},
					{
						tier: 2,
						req: 1,
						mods: [
							{
								type: "GRANT_ABILITY_MODIFIER",
								payload: {
									name: "Decay Strike",
									modifier: "Decay Row Strike",
								},
							},
						],
						description: "Decay Strike applies to all enemies in row",
					},
					{
						tier: 2,
						req: 1,
						mods: [
							{
								type: "GRANT_PERK",
								payload: {
									name: "Twin Toxins",
								},
							},
						],
						description: "Gain Twin Toxins",
					},
				],
			},
			{
				name: "Trickster",
				talents: [
					{
						tier: 1,
						req: 0,
						mods: [
							{
								type: "GRANT_ABILITY",
								payload: {
									name: "Careful Preparation",
									type: "ATTACK",
								},
							},
						],
						description: "Gain Careful Preparation Spell",
					},
					{
						tier: 1,
						req: 0,
						mods: [
							{
								type: "GRANT_ABILITY",
								payload: {
									name: "Opening Gambit",
									type: "ATTACK",
								},
							},
						],
						description: "Gain Opening Gambit attack",
					},
					{
						tier: 2,
						req: 1,
						mods: [
							{
								type: "GRANT_PERK",
								payload: {
									name: "Savage Fury",
									tier: 2,
								},
							},
						],
						description: "Gain 2 Savage Fury",
					},
					{
						tier: 2,
						req: 1,
						mods: [
							{
								type: "GRANT_ABILITY_MODIFIER",
								payload: {
									name: "Opening Gambit",
									modifier: "Constant Gambit",
								},
							},
						],
						description:
							"TODO should be modifier or unique perk? -> Opening Gambit now has a cooldown of X seconds",
					},
				],
			},
		],
	},
};
