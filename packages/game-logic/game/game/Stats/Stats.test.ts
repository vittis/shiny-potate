import { MOD_TYPE, Mod } from "../Mods/ModsTypes";
import { StatsManager } from "./StatsManager";
import { STAT } from "./StatsTypes";
import { calculateDamage } from "./StatsUtils";

const statsMock = {
	hp: 200,
	maxHp: 200,
	shield: 0,
	attackCooldownModifier: 0,
	attackDamageModifier: 0,
	spellCooldownModifier: 0,
	spellDamageModifier: 0,
	damageReductionModifier: 0,
};

const modsMock: Mod<MOD_TYPE.GRANT_BASE_STAT>[] = [
	{
		type: MOD_TYPE.GRANT_BASE_STAT,
		payload: {
			stat: STAT.ATTACK_DAMAGE,
			value: 5,
		},
	},
	{
		type: MOD_TYPE.GRANT_BASE_STAT,
		payload: {
			stat: STAT.DAMAGE_REDUCTION,
			value: 10,
		},
	},
];

describe("Stats", () => {
	describe("StatsManager", () => {
		it("initialize correctly", () => {
			const manager = new StatsManager();
			manager.initializeStats(statsMock);

			expect(manager.getStatsFromMods()).toBeDefined();
			expect(manager.getActiveMods()).toHaveLength(0);

			expect(manager.getStats()).toEqual(statsMock);
		});

		it("add mod", () => {
			const manager = new StatsManager();
			manager.addMods(modsMock);

			expect(manager.getActiveMods()).toEqual(modsMock);
			expect(manager.getStatsFromMods()).toEqual({
				attackDamageModifier: 5,
				attackCooldownModifier: 0,
				damageReductionModifier: 10,
				maxHp: 0,
				shield: 0,
				spellCooldownModifier: 0,
				spellDamageModifier: 0,
			});
		});

		it("remove mod", () => {
			const manager = new StatsManager();
			manager.addMods(modsMock);
			manager.removeMods([modsMock[0]]);
			expect(manager.getActiveMods()).toEqual([modsMock[1]]);

			expect(manager.getStatsFromMods()).toEqual({
				attackDamageModifier: 0,
				attackCooldownModifier: 0,
				damageReductionModifier: 10,
				maxHp: 0,
				shield: 0,
				spellCooldownModifier: 0,
				spellDamageModifier: 0,
			});
		});
	});

	describe("StatsUtils", () => {
		it("calculateDamage", () => {
			const damage = 100;

			expect(calculateDamage(damage, 400)).toBe(20);
			expect(calculateDamage(damage, 200)).toBe(33);
			expect(calculateDamage(damage, 100)).toBe(50);
			expect(calculateDamage(damage, 90)).toBe(53);
			expect(calculateDamage(damage, 80)).toBe(56);
			expect(calculateDamage(damage, 70)).toBe(59);
			expect(calculateDamage(damage, 60)).toBe(63);
			expect(calculateDamage(damage, 50)).toBe(67);
			expect(calculateDamage(damage, 40)).toBe(71);
			expect(calculateDamage(damage, 30)).toBe(77);
			expect(calculateDamage(damage, 20)).toBe(83);
			expect(calculateDamage(damage, 10)).toBe(91);
			expect(calculateDamage(damage, 1)).toBe(99);
			expect(calculateDamage(damage, 0)).toBe(100);
			expect(calculateDamage(damage, -1)).toBe(101);
			expect(calculateDamage(damage, -10)).toBe(109);
			expect(calculateDamage(damage, -20)).toBe(117);
			expect(calculateDamage(damage, -30)).toBe(123);
			expect(calculateDamage(damage, -40)).toBe(129);
			expect(calculateDamage(damage, -50)).toBe(133);
			expect(calculateDamage(damage, -60)).toBe(137);
			expect(calculateDamage(damage, -70)).toBe(141);
			expect(calculateDamage(damage, -80)).toBe(144);
			expect(calculateDamage(damage, -90)).toBe(147);
			expect(calculateDamage(damage, -100)).toBe(150);
			expect(calculateDamage(damage, -200)).toBe(167);
			expect(calculateDamage(damage, -400)).toBe(180);
		});
	});
});
