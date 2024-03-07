import { Game } from "../../dist";
import { BoardManager, OWNER, POSITION } from "./BoardManager";
import { Equipment } from "./Equipment/Equipment";
import { EQUIPMENT_SLOT, ShopEquipmentData } from "./Equipment/EquipmentTypes";
import { ShopEquipment } from "./Equipment/ShopEquipment";
import { generateEquipmentData } from "./Equipment/ShopUtils";
import { UnitsDTO, runGame } from "./Game";
import { Unit } from "./Unit/Unit";
import { Weapons } from "./data";

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
		it("generate BATTLE_START events (From AXE)", () => {
			const bm = new BoardManager();

			const unit1 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT, bm);
			unit1.equip(new Equipment(Weapons.Axe), EQUIPMENT_SLOT.MAIN_HAND);
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

		it("generate ALLY_FAINT events (From DESPERATE WILL (from sword))", () => {
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

			const equip1: ShopEquipmentData = new ShopEquipment(
				Weapons.Sword,
				5,
			).generateShopEquipmentData();

			const unit1: UnitsDTO = {
				equipments: [equip1],
				position: POSITION.TOP_FRONT,
				unitClass: "Rogue",
			};

			const team1: UnitsDTO[] = [unit1];

			game.setTeam(OWNER.TEAM_ONE, team1);

			const equip2: ShopEquipmentData = new ShopEquipment(
				Weapons.Shortbow,
				5,
			).generateShopEquipmentData();

			const unit2: UnitsDTO = {
				equipments: [equip2],
				position: POSITION.TOP_FRONT,
				unitClass: "Ranger",
			};

			const team2: UnitsDTO[] = [unit2];

			game.setTeam(OWNER.TEAM_TWO, team2);

			const boardUnit1 = game.boardManager.getAllAliveUnitsOfOwner(OWNER.TEAM_ONE)[0];
			const boardUnit2 = game.boardManager.getAllAliveUnitsOfOwner(OWNER.TEAM_TWO)[0];

			expect(boardUnit1.equipment[0].equip.data).toStrictEqual(generateEquipmentData(equip1));
			expect(boardUnit2.equipment[0].equip.data).toStrictEqual(generateEquipmentData(equip2));

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
});
