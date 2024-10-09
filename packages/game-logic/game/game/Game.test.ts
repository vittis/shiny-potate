import { Board } from "../shop/ArenaTypes";
import { BoardManager, OWNER, POSITION } from "./BoardManager";
import { Equipment } from "./Equipment/Equipment";
import { EQUIPMENT_SLOT } from "./Equipment/EquipmentTypes";
import { Game, UnitsDTO, runGame } from "./Game";
import { Unit } from "./Unit/Unit";
import { Weapons } from "./data";

vi.mock("./data", async () => {
	const mocks = (await import("./Unit/__tests__/mocks")).default;
	return {
		...mocks,
	};
});

// todo ok to remove this and delete test
const sampleBoardLeft = [
	{
		unit: null,
		position: "2",
	},
	{
		unit: {
			id: "MsO3pr_L",
			unit: {
				xp: 0,
				level: 2,
				className: "Blacksmith",
				talentTrees: [
					{
						name: "Warden",
						talents: [
							{
								id: "h_fPx_i7",
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
								obtained: true,
								description: "Gain 1 Iron Heart",
							},
							{
								id: "P41tLQUn",
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
								id: "V79hhqcH",
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
								id: "eJ4A8zw8",
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
								id: "acM2Ey1f",
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
								id: "Q9jpz2oc",
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
								id: "Sod3WDm5",
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
								id: "QRoiT3-5",
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
						id: "h1gwF_BF",
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
						id: "gzj9Vo45",
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
							id: "Uh6gXIev",
							equip: {
								id: "Uh6gXIev",
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
										type: "GRANT_BASE_STAT",
										payload: {
											stat: "ATTACK_COOLDOWN",
											value: 5,
										},
									},
								],
								name: "Dagger",
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
			price: 11,
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
const sampleBoardRight = [
	{
		unit: null,
		position: "2",
	},
	{
		unit: {
			id: "MsO3pr_L",
			unit: {
				xp: 0,
				level: 2,
				className: "Blacksmith",
				talentTrees: [
					{
						name: "Warden",
						talents: [
							{
								id: "h_fPx_i7",
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
								id: "P41tLQUn",
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
								id: "V79hhqcH",
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
								id: "eJ4A8zw8",
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
								id: "acM2Ey1f",
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
								id: "Q9jpz2oc",
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
								id: "Sod3WDm5",
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
								id: "QRoiT3-5",
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
						id: "h1gwF_BF",
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
						id: "gzj9Vo45",
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
							id: "Uh6gXIev",
							equip: {
								id: "Uh6gXIev",
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
										type: "GRANT_BASE_STAT",
										payload: {
											stat: "ATTACK_COOLDOWN",
											value: 5,
										},
									},
								],
								name: "Dagger",
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
			price: 11,
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

describe("Run Game", () => {
	it("runs game 1v1 and both units die", () => {
		const bm = new BoardManager();

		const unit1 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
		unit1.equip(new Equipment(Weapons.Shortbow), EQUIPMENT_SLOT.MAIN_HAND);
		bm.addToBoard(unit1);

		const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
		unit2.equip(new Equipment(Weapons.Shortbow), EQUIPMENT_SLOT.MAIN_HAND);
		bm.addToBoard(unit2);

		const { eventHistory } = runGame(bm);

		const stepItEnded = eventHistory[eventHistory.length - 1].step;

		expect(eventHistory?.[eventHistory.length - 1]?.step).toBe(stepItEnded);
		expect(eventHistory?.[eventHistory.length - 1]).toHaveProperty("type", "FAINT");
		expect(eventHistory?.[eventHistory.length - 2]).toHaveProperty("type", "FAINT");
		expect(eventHistory?.[eventHistory.length - 3]).toHaveProperty("type", "USE_ABILITY");
		expect(eventHistory?.[eventHistory.length - 3]?.step).toBe(stepItEnded);
	});

	describe("EVENTS", () => {
		it("generate BATTLE_START events (From WAND)", () => {
			const bm = new BoardManager();

			const unit1 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
			unit1.equip(new Equipment(Weapons.Wand), EQUIPMENT_SLOT.MAIN_HAND);
			bm.addToBoard(unit1);

			const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
			unit2.equip(new Equipment(Weapons.Shortbow), EQUIPMENT_SLOT.MAIN_HAND);
			bm.addToBoard(unit2);

			const { eventHistory } = runGame(bm);

			expect(eventHistory[0]).toHaveProperty("type", "TRIGGER_EFFECT");
			expect(eventHistory[0]).toHaveProperty("trigger", "BATTLE_START");
		});

		it("generate BATTLE_START events (From FOCUSED MIND (from wand))", () => {
			const bm = new BoardManager();

			const unit1 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
			unit1.equip(new Equipment(Weapons.Wand), EQUIPMENT_SLOT.MAIN_HAND);
			bm.addToBoard(unit1);

			const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
			unit2.equip(new Equipment(Weapons.Shortbow), EQUIPMENT_SLOT.MAIN_HAND);
			bm.addToBoard(unit2);

			const { eventHistory } = runGame(bm);

			expect(eventHistory[0]).toHaveProperty("type", "TRIGGER_EFFECT");
			expect(eventHistory[0]).toHaveProperty("trigger", "BATTLE_START");
		});

		it.skip("generate ALLY_FAINT events (From DESPERATE WILL (from sword))", () => {
			const bm = new BoardManager();

			const unit1 = new Unit(OWNER.TEAM_ONE, POSITION.BOT_BACK, bm);
			unit1.equip(new Equipment(Weapons.Sword), EQUIPMENT_SLOT.MAIN_HAND);
			bm.addToBoard(unit1);

			// this one will be killed
			const unit2 = new Unit(OWNER.TEAM_ONE, POSITION.BOT_FRONT, bm);
			unit2.equip(new Equipment(Weapons.Shortbow), EQUIPMENT_SLOT.MAIN_HAND);
			bm.addToBoard(unit2);

			const unit3 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
			unit3.equip(new Equipment(Weapons.Shortbow), EQUIPMENT_SLOT.MAIN_HAND);
			bm.addToBoard(unit3);

			const unit4 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_BACK, bm);
			unit4.equip(new Equipment(Weapons.Shortbow), EQUIPMENT_SLOT.MAIN_HAND);
			bm.addToBoard(unit4);

			const { eventHistory } = runGame(bm);

			expect(
				eventHistory.filter(e => e.type === "TRIGGER_EFFECT" && e.trigger === "ALLY_FAINT"),
			).toHaveLength(1);
		});

		it("generate SELF_FAINT events (From LAST WORDS (from wand))", () => {
			const bm = new BoardManager();

			const unit1 = new Unit(OWNER.TEAM_ONE, POSITION.BOT_BACK, bm);
			unit1.equip(new Equipment(Weapons.Sword), EQUIPMENT_SLOT.MAIN_HAND);
			bm.addToBoard(unit1);

			// this one will be killed
			const unit2 = new Unit(OWNER.TEAM_ONE, POSITION.BOT_FRONT, bm);
			unit2.equip(new Equipment(Weapons.Wand), EQUIPMENT_SLOT.MAIN_HAND);
			bm.addToBoard(unit2);

			const unit3 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
			unit3.equip(new Equipment(Weapons.Shortbow), EQUIPMENT_SLOT.MAIN_HAND);
			bm.addToBoard(unit3);

			const unit4 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_BACK, bm);
			unit4.equip(new Equipment(Weapons.Shortbow), EQUIPMENT_SLOT.MAIN_HAND);
			bm.addToBoard(unit4);

			const { eventHistory } = runGame(bm);

			expect(
				eventHistory.filter(e => e.type === "TRIGGER_EFFECT" && e.trigger === "SELF_FAINT"),
			).toHaveLength(1);
		});
	});

	describe("setTeam", () => {
		it("should generate teams correctly", () => {
			const game = new Game({ skipConstructor: true });

			const equip1 = new Equipment(Weapons.Sword, 5);

			const unit1: UnitsDTO = {
				equipments: [equip1.serialize()],
				position: POSITION.TOP_FRONT,
				unitClass: "Ranger",
			};

			const team1: UnitsDTO[] = [unit1];

			game.setTeam(OWNER.TEAM_ONE, team1);

			const equip2 = new Equipment(Weapons.Shortbow, 5);

			const unit2: UnitsDTO = {
				equipments: [equip2.serialize()],
				position: POSITION.TOP_FRONT,
				unitClass: "Ranger",
			};

			const team2: UnitsDTO[] = [unit2];

			game.setTeam(OWNER.TEAM_TWO, team2);

			const boardUnit1 = game.boardManager.getAllAliveUnitsOfOwner(OWNER.TEAM_ONE)[0];
			const boardUnit2 = game.boardManager.getAllAliveUnitsOfOwner(OWNER.TEAM_TWO)[0];

			expect(equip1.serialize()).toStrictEqual(
				expect.objectContaining(boardUnit1.equipment[0].equip.data),
			);
			expect(equip2.serialize()).toStrictEqual(
				expect.objectContaining(boardUnit2.equipment[0].equip.data),
			);

			expect(boardUnit1.position).toStrictEqual(unit1.position);
			expect(boardUnit2.position).toStrictEqual(unit2.position);

			expect(boardUnit1.toString()).toStrictEqual(
				`${OWNER.TEAM_ONE}${unit1.position} ${unit1.unitClass}`,
			);
			expect(boardUnit2.toString()).toStrictEqual(
				`${OWNER.TEAM_TWO}${unit2.position} ${unit2.unitClass}`,
			);
		});
	});

	// todo move this
	describe.skip("talents", () => {
		it("should gain perk", () => {
			/* const bm = new BoardManager();

			const unit1 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
			unit1.equip(new Equipment(Weapons.Shortbow), EQUIPMENT_SLOT.MAIN_HAND);
			bm.addToBoard(unit1);

			const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
			unit2.equip(new Equipment(Weapons.Shortbow), EQUIPMENT_SLOT.MAIN_HAND);
			bm.addToBoard(unit2);

			const { eventHistory } = runGame(bm); */

			const game = new Game({ skipConstructor: true });
			game.setBoard(0, sampleBoardLeft as Board);
			game.setBoard(1, sampleBoardRight as Board);

			const { eventHistory, firstStep } = game.startGame();

			// console.log(firstStep);
			const unit = game.boardManager.getAllUnitsOfOwner(OWNER.TEAM_ONE)[0];

			const useAbilityEvents = eventHistory.filter(
				e => e.type === "USE_ABILITY" && e.actorId === unit.id,
			);

			expect(1).toBe(2);
		});
	});
});

describe("Game (NEW)", () => {
	it("test", () => {
		console.log(Weapons.Shortbow);
		const bm = new BoardManager();

		const unit1 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
		unit1.equip(new Equipment(Weapons.Shortbow), EQUIPMENT_SLOT.MAIN_HAND);
		bm.addToBoard(unit1);

		console.log(unit1.abilities);

		expect(1).toBe(1);

		/* const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, bm);
		unit2.equip(new Equipment(Weapons.Shortbow), EQUIPMENT_SLOT.MAIN_HAND);
		bm.addToBoard(unit2);

		const { eventHistory, totalSteps } = runGame(bm);

		console.log(totalSteps);

		const stepItEnded = eventHistory[eventHistory.length - 1].step;

		expect(eventHistory?.[eventHistory.length - 1]?.step).toBe(stepItEnded);
		expect(eventHistory?.[eventHistory.length - 1]).toHaveProperty("type", "FAINT");
		expect(eventHistory?.[eventHistory.length - 2]).toHaveProperty("type", "FAINT");
		expect(eventHistory?.[eventHistory.length - 3]).toHaveProperty("type", "USE_ABILITY");
		expect(eventHistory?.[eventHistory.length - 3]?.step).toBe(stepItEnded); */
	});
});
