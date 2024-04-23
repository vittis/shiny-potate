export const EXISTING_PLAYER_ID = "c690ee4a-d4c1-4eef-91b4-f7da0da5e404";

export const ROUND_1_BOARD = [
	{
		unit: null,
		position: "2",
	},
	{
		unit: null,
		position: "1",
	},
	{
		unit: {
			id: "Qa5DCvTI",
			unit: {
				className: "Warlock",
				shopEquipment: [
					{
						slot: "MAIN_HAND",
						shopEquip: {
							id: "k79voU89",
							equip: {
								id: "k79voU89",
								mods: [
									{
										tier: "implicit",
										type: "GRANT_ABILITY",
										payload: {
											name: "Stab",
											type: "ATTACK",
										},
									},
									{
										tier: "implicit",
										type: "GRANT_ABILITY",
										payload: {
											name: "Reinforce Allies",
											type: "SPELL",
										},
									},
									{
										tier: 1,
										type: "GRANT_BASE_STAT",
										payload: {
											stat: "ATTACK_COOLDOWN",
											value: 5,
										},
									},
								],
								name: "Axe",
								tags: ["WEAPON", "PHYSICAL"],
								tier: 1,
								slots: ["MAIN_HAND"],
								effects: [],
							},
							price: 6,
						},
					},
					{
						slot: "TRINKET",
						shopEquip: {
							id: "ECstuFqy",
							equip: {
								id: "ECstuFqy",
								mods: [
									{
										tier: "implicit",
										type: "GRANT_ABILITY",
										payload: {
											name: "Ki Focus",
											type: "SPELL",
										},
									},
									{
										tier: "implicit",
										type: "GRANT_BASE_STAT",
										payload: {
											stat: "ATTACK_DAMAGE",
											value: 5,
										},
									},
								],
								name: "Kame's Lost Sash",
								tags: ["TRINKET"],
								tier: 0,
								slots: ["TRINKET"],
								effects: [],
							},
							price: 2,
						},
					},
					{
						slot: "TRINKET",
						shopEquip: {
							id: "YGBwzoMK",
							equip: {
								id: "YGBwzoMK",
								mods: [
									{
										tier: "implicit",
										type: "GRANT_PERK",
										payload: {
											name: "Focused Mind",
											tier: 1,
										},
									},
									{
										tier: 1,
										type: "GRANT_PERK",
										payload: {
											name: "Desperate Will",
											tier: 1,
										},
									},
								],
								name: "Brains in a Jar",
								tags: ["TRINKET", "MAGICAL"],
								tier: 1,
								slots: ["TRINKET"],
								effects: [],
							},
							price: 5,
						},
					},
				],
			},
			price: 11,
			position: "0",
		},
		position: "0",
	},
	{
		unit: null,
		position: "5",
	},
	{
		unit: null,
		position: "4",
	},
	{
		unit: null,
		position: "3",
	},
];

export const ROUND_2_BOARD = [
	{
		unit: null,
		position: "2",
	},
	{
		unit: {
			id: "sBck7BqV",
			unit: {
				xp: 0,
				level: 1,
				className: "Paladin",
				talentTrees: [
					{
						name: "Warden",
						talents: [
							{
								id: "lEY-AUQa",
								req: 0,
								mods: [
									{
										type: "GRANT_PERK",
										payload: {
											name: "Iron Heart",
											tier: 1,
										},
									},
								],
								tier: 1,
								obtained: false,
								description: "Gain 1 Iron Heart",
							},
							{
								id: "5v0P6hgr",
								req: 0,
								mods: [
									{
										type: "GRANT_ABILITY_MODIFIER",
										payload: {
											name: "Blessed Beacon",
											modifier: "Agile Beacon",
										},
									},
								],
								tier: 1,
								obtained: false,
								description: "Blessed Beacon also gives 5 FAST and 5 FOCUS to self",
							},
							{
								id: "Y7Oh6Zib",
								req: 0,
								mods: [
									{
										type: "GRANT_ABILITY",
										payload: {
											name: "Break Will",
											tier: 1,
											type: "SPELL",
										},
									},
								],
								tier: 1,
								obtained: false,
								description: "Gain the Break Will spell",
							},
							{
								id: "0I7eEJIy",
								req: 2,
								mods: [
									{
										type: "GRANT_PERK",
										payload: {
											name: "Vitality Boost",
										},
									},
								],
								tier: 2,
								obtained: false,
								description: "Gain 2 Vitality Boost",
							},
						],
					},
					{
						name: "Bastion",
						talents: [
							{
								id: "-Z3-X0un",
								req: 0,
								mods: [
									{
										type: "GRANT_ABILITY",
										payload: {
											name: "Bastion Bond",
											type: "SPELL",
										},
									},
								],
								tier: 1,
								obtained: false,
								description: "Gain the Bastion Bond spell",
							},
							{
								id: "BPX2Po32",
								req: 0,
								mods: [
									{
										type: "GRANT_ABILITY_MODIFIER",
										payload: {
											name: "Blessed Beacon",
											modifier: "Sturdy Beacon",
										},
									},
								],
								tier: 1,
								obtained: false,
								description: "Blessed Beacon also gives 10 STURDY to front ally",
							},
							{
								id: "sJ8M4cZy",
								req: 0,
								mods: [
									{
										type: "GRANT_ABILITY_MODIFIER",
										payload: {
											name: "Blessed Beacon",
											modifier: "Power Beacon",
										},
									},
								],
								tier: 1,
								obtained: false,
								description:
									"Blessed Beacon also gives 5 ATTACK POWER and 5 SPELL POTENCY to back ally",
							},
							{
								id: "TonHa01z",
								req: 3,
								mods: [
									{
										type: "GRANT_ABILITY",
										payload: {
											name: "Divine Intervention",
											type: "SPELL",
										},
									},
								],
								tier: 2,
								obtained: false,
								description: "Gain the Divine Intervention spell",
							},
						],
					},
				],
				utilityNodes: [
					{
						id: "jNgLoFvC",
						mods: [
							{
								type: "GRANT_PERK",
								payload: {
									name: "Fallen Guardian",
									tier: 1,
								},
							},
						],
						obtained: false,
						description: "Gain 1 Fallen Guardian",
					},
					{
						id: "cRx50B3M",
						mods: [
							{
								type: "GRANT_PERK",
								payload: {
									name: "Vengeful Legacy",
									tier: 1,
								},
							},
						],
						obtained: false,
						description: "Gain 1 Vengeful Legacy",
					},
				],
				shopEquipment: [
					{
						slot: "MAIN_HAND",
						shopEquip: {
							id: "Z8NHVK2_",
							equip: {
								id: "Z8NHVK2_",
								mods: [
									{
										tier: "implicit",
										type: "GRANT_ABILITY",
										payload: {
											name: "Bastion Bond",
											type: "SPELL",
										},
									},
									{
										tier: "implicit",
										type: "GRANT_PERK",
										payload: {
											name: "Desperate Will",
											tier: 1,
										},
									},
								],
								name: "Wand",
								tags: ["WEAPON", "MAGICAL", "RANGED"],
								tier: 0,
								slots: ["MAIN_HAND"],
								effects: [],
							},
							price: 2,
						},
					},
					{
						slot: "OFF_HAND",
						shopEquip: {
							id: "KyB6ss9p",
							equip: {
								id: "KyB6ss9p",
								mods: [
									{
										tier: "implicit",
										type: "GRANT_ABILITY",
										payload: {
											name: "Stab",
											type: "ATTACK",
										},
									},
									{
										tier: "implicit",
										type: "GRANT_PERK",
										payload: {
											name: "Venomous Strikes",
											tier: 1,
										},
									},
								],
								name: "Venomous Dagger",
								tags: ["WEAPON", "PHYSICAL"],
								tier: 0,
								slots: ["MAIN_HAND", "OFF_HAND"],
								effects: [],
							},
							price: 2,
						},
					},
				],
			},
			price: 14,
			position: "1",
		},
		position: "1",
	},
	{
		unit: null,
		position: "0",
	},
	{
		unit: null,
		position: "5",
	},
	{
		unit: null,
		position: "4",
	},
	{
		unit: null,
		position: "3",
	},
];

export const ROUND_3_BOARD = [
	{
		unit: null,
		position: "2",
	},
	{
		unit: {
			id: "sBck7BqV",
			unit: {
				xp: 0,
				level: 1,
				className: "Paladin",
				talentTrees: [
					{
						name: "Warden",
						talents: [
							{
								id: "lEY-AUQa",
								req: 0,
								mods: [
									{
										type: "GRANT_PERK",
										payload: {
											name: "Iron Heart",
											tier: 1,
										},
									},
								],
								tier: 1,
								obtained: false,
								description: "Gain 1 Iron Heart",
							},
							{
								id: "5v0P6hgr",
								req: 0,
								mods: [
									{
										type: "GRANT_ABILITY_MODIFIER",
										payload: {
											name: "Blessed Beacon",
											modifier: "Agile Beacon",
										},
									},
								],
								tier: 1,
								obtained: false,
								description: "Blessed Beacon also gives 5 FAST and 5 FOCUS to self",
							},
							{
								id: "Y7Oh6Zib",
								req: 0,
								mods: [
									{
										type: "GRANT_ABILITY",
										payload: {
											name: "Break Will",
											tier: 1,
											type: "SPELL",
										},
									},
								],
								tier: 1,
								obtained: false,
								description: "Gain the Break Will spell",
							},
							{
								id: "0I7eEJIy",
								req: 2,
								mods: [
									{
										type: "GRANT_PERK",
										payload: {
											name: "Vitality Boost",
										},
									},
								],
								tier: 2,
								obtained: false,
								description: "Gain 2 Vitality Boost",
							},
						],
					},
					{
						name: "Bastion",
						talents: [
							{
								id: "-Z3-X0un",
								req: 0,
								mods: [
									{
										type: "GRANT_ABILITY",
										payload: {
											name: "Bastion Bond",
											type: "SPELL",
										},
									},
								],
								tier: 1,
								obtained: false,
								description: "Gain the Bastion Bond spell",
							},
							{
								id: "BPX2Po32",
								req: 0,
								mods: [
									{
										type: "GRANT_ABILITY_MODIFIER",
										payload: {
											name: "Blessed Beacon",
											modifier: "Sturdy Beacon",
										},
									},
								],
								tier: 1,
								obtained: false,
								description: "Blessed Beacon also gives 10 STURDY to front ally",
							},
							{
								id: "sJ8M4cZy",
								req: 0,
								mods: [
									{
										type: "GRANT_ABILITY_MODIFIER",
										payload: {
											name: "Blessed Beacon",
											modifier: "Power Beacon",
										},
									},
								],
								tier: 1,
								obtained: false,
								description:
									"Blessed Beacon also gives 5 ATTACK POWER and 5 SPELL POTENCY to back ally",
							},
							{
								id: "TonHa01z",
								req: 3,
								mods: [
									{
										type: "GRANT_ABILITY",
										payload: {
											name: "Divine Intervention",
											type: "SPELL",
										},
									},
								],
								tier: 2,
								obtained: false,
								description: "Gain the Divine Intervention spell",
							},
						],
					},
				],
				utilityNodes: [
					{
						id: "jNgLoFvC",
						mods: [
							{
								type: "GRANT_PERK",
								payload: {
									name: "Fallen Guardian",
									tier: 1,
								},
							},
						],
						obtained: false,
						description: "Gain 1 Fallen Guardian",
					},
					{
						id: "cRx50B3M",
						mods: [
							{
								type: "GRANT_PERK",
								payload: {
									name: "Vengeful Legacy",
									tier: 1,
								},
							},
						],
						obtained: false,
						description: "Gain 1 Vengeful Legacy",
					},
				],
				shopEquipment: [
					{
						slot: "MAIN_HAND",
						shopEquip: {
							id: "Z8NHVK2_",
							equip: {
								id: "Z8NHVK2_",
								mods: [
									{
										tier: "implicit",
										type: "GRANT_ABILITY",
										payload: {
											name: "Bastion Bond",
											type: "SPELL",
										},
									},
									{
										tier: "implicit",
										type: "GRANT_PERK",
										payload: {
											name: "Desperate Will",
											tier: 1,
										},
									},
								],
								name: "Wand",
								tags: ["WEAPON", "MAGICAL", "RANGED"],
								tier: 0,
								slots: ["MAIN_HAND"],
								effects: [],
							},
							price: 2,
						},
					},
					{
						slot: "OFF_HAND",
						shopEquip: {
							id: "KyB6ss9p",
							equip: {
								id: "KyB6ss9p",
								mods: [
									{
										tier: "implicit",
										type: "GRANT_ABILITY",
										payload: {
											name: "Stab",
											type: "ATTACK",
										},
									},
									{
										tier: "implicit",
										type: "GRANT_PERK",
										payload: {
											name: "Venomous Strikes",
											tier: 1,
										},
									},
								],
								name: "Venomous Dagger",
								tags: ["WEAPON", "PHYSICAL"],
								tier: 0,
								slots: ["MAIN_HAND", "OFF_HAND"],
								effects: [],
							},
							price: 2,
						},
					},
				],
			},
			price: 14,
			position: "1",
		},
		position: "1",
	},
	{
		unit: null,
		position: "0",
	},
	{
		unit: null,
		position: "5",
	},
	{
		unit: null,
		position: "4",
	},
	{
		unit: null,
		position: "3",
	},
];

export const ROUND_4_BOARD = [
	{
		unit: null,
		position: "2",
	},
	{
		unit: {
			id: "sBck7BqV",
			unit: {
				xp: 0,
				level: 1,
				className: "Paladin",
				talentTrees: [
					{
						name: "Warden",
						talents: [
							{
								id: "lEY-AUQa",
								req: 0,
								mods: [
									{
										type: "GRANT_PERK",
										payload: {
											name: "Iron Heart",
											tier: 1,
										},
									},
								],
								tier: 1,
								obtained: false,
								description: "Gain 1 Iron Heart",
							},
							{
								id: "5v0P6hgr",
								req: 0,
								mods: [
									{
										type: "GRANT_ABILITY_MODIFIER",
										payload: {
											name: "Blessed Beacon",
											modifier: "Agile Beacon",
										},
									},
								],
								tier: 1,
								obtained: false,
								description: "Blessed Beacon also gives 5 FAST and 5 FOCUS to self",
							},
							{
								id: "Y7Oh6Zib",
								req: 0,
								mods: [
									{
										type: "GRANT_ABILITY",
										payload: {
											name: "Break Will",
											tier: 1,
											type: "SPELL",
										},
									},
								],
								tier: 1,
								obtained: false,
								description: "Gain the Break Will spell",
							},
							{
								id: "0I7eEJIy",
								req: 2,
								mods: [
									{
										type: "GRANT_PERK",
										payload: {
											name: "Vitality Boost",
										},
									},
								],
								tier: 2,
								obtained: false,
								description: "Gain 2 Vitality Boost",
							},
						],
					},
					{
						name: "Bastion",
						talents: [
							{
								id: "-Z3-X0un",
								req: 0,
								mods: [
									{
										type: "GRANT_ABILITY",
										payload: {
											name: "Bastion Bond",
											type: "SPELL",
										},
									},
								],
								tier: 1,
								obtained: false,
								description: "Gain the Bastion Bond spell",
							},
							{
								id: "BPX2Po32",
								req: 0,
								mods: [
									{
										type: "GRANT_ABILITY_MODIFIER",
										payload: {
											name: "Blessed Beacon",
											modifier: "Sturdy Beacon",
										},
									},
								],
								tier: 1,
								obtained: false,
								description: "Blessed Beacon also gives 10 STURDY to front ally",
							},
							{
								id: "sJ8M4cZy",
								req: 0,
								mods: [
									{
										type: "GRANT_ABILITY_MODIFIER",
										payload: {
											name: "Blessed Beacon",
											modifier: "Power Beacon",
										},
									},
								],
								tier: 1,
								obtained: false,
								description:
									"Blessed Beacon also gives 5 ATTACK POWER and 5 SPELL POTENCY to back ally",
							},
							{
								id: "TonHa01z",
								req: 3,
								mods: [
									{
										type: "GRANT_ABILITY",
										payload: {
											name: "Divine Intervention",
											type: "SPELL",
										},
									},
								],
								tier: 2,
								obtained: false,
								description: "Gain the Divine Intervention spell",
							},
						],
					},
				],
				utilityNodes: [
					{
						id: "jNgLoFvC",
						mods: [
							{
								type: "GRANT_PERK",
								payload: {
									name: "Fallen Guardian",
									tier: 1,
								},
							},
						],
						obtained: false,
						description: "Gain 1 Fallen Guardian",
					},
					{
						id: "cRx50B3M",
						mods: [
							{
								type: "GRANT_PERK",
								payload: {
									name: "Vengeful Legacy",
									tier: 1,
								},
							},
						],
						obtained: false,
						description: "Gain 1 Vengeful Legacy",
					},
				],
				shopEquipment: [
					{
						slot: "MAIN_HAND",
						shopEquip: {
							id: "Z8NHVK2_",
							equip: {
								id: "Z8NHVK2_",
								mods: [
									{
										tier: "implicit",
										type: "GRANT_ABILITY",
										payload: {
											name: "Bastion Bond",
											type: "SPELL",
										},
									},
									{
										tier: "implicit",
										type: "GRANT_PERK",
										payload: {
											name: "Desperate Will",
											tier: 1,
										},
									},
								],
								name: "Wand",
								tags: ["WEAPON", "MAGICAL", "RANGED"],
								tier: 0,
								slots: ["MAIN_HAND"],
								effects: [],
							},
							price: 2,
						},
					},
					{
						slot: "OFF_HAND",
						shopEquip: {
							id: "KyB6ss9p",
							equip: {
								id: "KyB6ss9p",
								mods: [
									{
										tier: "implicit",
										type: "GRANT_ABILITY",
										payload: {
											name: "Stab",
											type: "ATTACK",
										},
									},
									{
										tier: "implicit",
										type: "GRANT_PERK",
										payload: {
											name: "Venomous Strikes",
											tier: 1,
										},
									},
								],
								name: "Venomous Dagger",
								tags: ["WEAPON", "PHYSICAL"],
								tier: 0,
								slots: ["MAIN_HAND", "OFF_HAND"],
								effects: [],
							},
							price: 2,
						},
					},
				],
			},
			price: 14,
			position: "1",
		},
		position: "1",
	},
	{
		unit: null,
		position: "0",
	},
	{
		unit: null,
		position: "5",
	},
	{
		unit: null,
		position: "4",
	},
	{
		unit: null,
		position: "3",
	},
];

export const ROUND_5_BOARD = [
	{
		unit: null,
		position: "2",
	},
	{
		unit: {
			id: "sBck7BqV",
			unit: {
				xp: 0,
				level: 1,
				className: "Paladin",
				talentTrees: [
					{
						name: "Warden",
						talents: [
							{
								id: "lEY-AUQa",
								req: 0,
								mods: [
									{
										type: "GRANT_PERK",
										payload: {
											name: "Iron Heart",
											tier: 1,
										},
									},
								],
								tier: 1,
								obtained: false,
								description: "Gain 1 Iron Heart",
							},
							{
								id: "5v0P6hgr",
								req: 0,
								mods: [
									{
										type: "GRANT_ABILITY_MODIFIER",
										payload: {
											name: "Blessed Beacon",
											modifier: "Agile Beacon",
										},
									},
								],
								tier: 1,
								obtained: false,
								description: "Blessed Beacon also gives 5 FAST and 5 FOCUS to self",
							},
							{
								id: "Y7Oh6Zib",
								req: 0,
								mods: [
									{
										type: "GRANT_ABILITY",
										payload: {
											name: "Break Will",
											tier: 1,
											type: "SPELL",
										},
									},
								],
								tier: 1,
								obtained: false,
								description: "Gain the Break Will spell",
							},
							{
								id: "0I7eEJIy",
								req: 2,
								mods: [
									{
										type: "GRANT_PERK",
										payload: {
											name: "Vitality Boost",
										},
									},
								],
								tier: 2,
								obtained: false,
								description: "Gain 2 Vitality Boost",
							},
						],
					},
					{
						name: "Bastion",
						talents: [
							{
								id: "-Z3-X0un",
								req: 0,
								mods: [
									{
										type: "GRANT_ABILITY",
										payload: {
											name: "Bastion Bond",
											type: "SPELL",
										},
									},
								],
								tier: 1,
								obtained: false,
								description: "Gain the Bastion Bond spell",
							},
							{
								id: "BPX2Po32",
								req: 0,
								mods: [
									{
										type: "GRANT_ABILITY_MODIFIER",
										payload: {
											name: "Blessed Beacon",
											modifier: "Sturdy Beacon",
										},
									},
								],
								tier: 1,
								obtained: false,
								description: "Blessed Beacon also gives 10 STURDY to front ally",
							},
							{
								id: "sJ8M4cZy",
								req: 0,
								mods: [
									{
										type: "GRANT_ABILITY_MODIFIER",
										payload: {
											name: "Blessed Beacon",
											modifier: "Power Beacon",
										},
									},
								],
								tier: 1,
								obtained: false,
								description:
									"Blessed Beacon also gives 5 ATTACK POWER and 5 SPELL POTENCY to back ally",
							},
							{
								id: "TonHa01z",
								req: 3,
								mods: [
									{
										type: "GRANT_ABILITY",
										payload: {
											name: "Divine Intervention",
											type: "SPELL",
										},
									},
								],
								tier: 2,
								obtained: false,
								description: "Gain the Divine Intervention spell",
							},
						],
					},
				],
				utilityNodes: [
					{
						id: "jNgLoFvC",
						mods: [
							{
								type: "GRANT_PERK",
								payload: {
									name: "Fallen Guardian",
									tier: 1,
								},
							},
						],
						obtained: false,
						description: "Gain 1 Fallen Guardian",
					},
					{
						id: "cRx50B3M",
						mods: [
							{
								type: "GRANT_PERK",
								payload: {
									name: "Vengeful Legacy",
									tier: 1,
								},
							},
						],
						obtained: false,
						description: "Gain 1 Vengeful Legacy",
					},
				],
				shopEquipment: [
					{
						slot: "MAIN_HAND",
						shopEquip: {
							id: "Z8NHVK2_",
							equip: {
								id: "Z8NHVK2_",
								mods: [
									{
										tier: "implicit",
										type: "GRANT_ABILITY",
										payload: {
											name: "Bastion Bond",
											type: "SPELL",
										},
									},
									{
										tier: "implicit",
										type: "GRANT_PERK",
										payload: {
											name: "Desperate Will",
											tier: 1,
										},
									},
								],
								name: "Wand",
								tags: ["WEAPON", "MAGICAL", "RANGED"],
								tier: 0,
								slots: ["MAIN_HAND"],
								effects: [],
							},
							price: 2,
						},
					},
					{
						slot: "OFF_HAND",
						shopEquip: {
							id: "KyB6ss9p",
							equip: {
								id: "KyB6ss9p",
								mods: [
									{
										tier: "implicit",
										type: "GRANT_ABILITY",
										payload: {
											name: "Stab",
											type: "ATTACK",
										},
									},
									{
										tier: "implicit",
										type: "GRANT_PERK",
										payload: {
											name: "Venomous Strikes",
											tier: 1,
										},
									},
								],
								name: "Venomous Dagger",
								tags: ["WEAPON", "PHYSICAL"],
								tier: 0,
								slots: ["MAIN_HAND", "OFF_HAND"],
								effects: [],
							},
							price: 2,
						},
					},
				],
			},
			price: 14,
			position: "1",
		},
		position: "1",
	},
	{
		unit: null,
		position: "0",
	},
	{
		unit: null,
		position: "5",
	},
	{
		unit: null,
		position: "4",
	},
	{
		unit: null,
		position: "3",
	},
];
