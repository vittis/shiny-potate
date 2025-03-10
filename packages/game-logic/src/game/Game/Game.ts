import { BattleUnit } from "../BattleUnit/BattleUnit";
import { BoardManager, OWNER } from "../BoardManager/BoardManager";

export class Game {
	boardManager: BoardManager;

	constructor() {
		this.boardManager = new BoardManager(2, 3);

		const unit1 = new BattleUnit();
		unit1.setPosition(1, 1);

		this.boardManager.addToBoard(unit1, OWNER.TEAM_ONE);

		const unit2 = new BattleUnit();
		unit2.setPosition(2, 1);
		this.boardManager.addToBoard(unit2, OWNER.TEAM_TWO);

		this.boardManager.printBattlefield();
	}
}
