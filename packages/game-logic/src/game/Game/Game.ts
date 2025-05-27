import { BattleUnit } from "@/game/BattleUnit/BattleUnit";
import { BoardManager, OWNER } from "@/game/BoardManager/BoardManager";

export class Game {
	boardManager: BoardManager;

	constructor() {
		this.boardManager = new BoardManager(2, 3);

		const unit1 = new BattleUnit();
		unit1.setPosition(1, 1);

		this.boardManager.addToBoard(unit1, OWNER.TEAM_ONE);

		const unit2 = new BattleUnit();
		unit2.setPosition(0, 1);
		this.boardManager.addToBoard(unit2, OWNER.TEAM_TWO);

		this.boardManager.printBattlefield();
	}
}
