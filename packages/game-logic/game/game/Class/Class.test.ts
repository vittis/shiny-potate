import { Class } from "./Class";
import { Unit } from "../Unit/Unit";
import { OWNER, POSITION } from "../BoardManager";
import { Classes } from "../data";

describe("Class", () => {
	it("should create", () => {
		const unitClass = new Class(Classes.Ranger);
		expect(unitClass).toBeDefined();
	});

	it("should grant base class abilities", () => {
		const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);
		unit.setClass(new Class(Classes.Ranger));
		expect(unit.abilities.length).toBe(1);
	});

	it("should obtain talent node", () => {
		const unit = new Unit(OWNER.TEAM_ONE, POSITION.TOP_FRONT);
		unit.setClass(new Class(Classes.Ranger));

		const nodeId = unit.classManager.class.talentTreesInstance[0].talents[0].id;

		expect(unit.perkManager.getPerks().length).toBe(1);
	});
});
