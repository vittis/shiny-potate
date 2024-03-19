import { DisableManager } from "./DisableManager";
import { DISABLE } from "./DisableTypes";

describe("Disable", () => {
	describe("DisableManager", () => {
		it("applies disable", () => {
			const manager = new DisableManager();

			manager.applyDisable({
				name: DISABLE.STUN,
				duration: 20,
			});

			expect(manager.activeDisable).toEqual([
				{
					name: DISABLE.STUN,
					duration: 20,
				},
			]);
		});

		it("when applies disable with less duration should keep current duration", () => {
			const manager = new DisableManager();

			manager.applyDisable({
				name: DISABLE.STUN,
				duration: 20,
			});

			expect(manager.activeDisable[0].duration).toBe(20);

			manager.applyDisable({
				name: DISABLE.STUN,
				duration: 10,
			});

			expect(manager.activeDisable[0].duration).toBe(20);
		});

		it("when applies disable with more duration should replace duration", () => {
			const manager = new DisableManager();

			manager.applyDisable({
				name: DISABLE.STUN,
				duration: 20,
			});

			expect(manager.activeDisable[0].duration).toBe(20);

			manager.applyDisable({
				name: DISABLE.STUN,
				duration: 30,
			});

			expect(manager.activeDisable[0].duration).toBe(30);
		});

		it("check if has disable", () => {
			const manager = new DisableManager();

			expect(manager.hasDisable(DISABLE.STUN)).toBeFalsy();

			manager.applyDisable({
				name: DISABLE.STUN,
				duration: 20,
			});

			expect(manager.hasDisable(DISABLE.STUN)).toBeTruthy();
		});

		it("remove stack", () => {
			const manager = new DisableManager();

			manager.applyDisable({
				name: DISABLE.STUN,
				duration: 20,
			});

			expect(manager.activeDisable[0].duration).toBe(20);

			manager.removeStack(DISABLE.STUN);

			expect(manager.activeDisable[0].duration).toBe(19);
		});

		it("remove disable when remove last stack", () => {
			const manager = new DisableManager();

			manager.applyDisable({
				name: DISABLE.STUN,
				duration: 1,
			});

			expect(manager.hasDisable(DISABLE.STUN)).toBeTruthy();
			expect(manager.activeDisable[0].duration).toBe(1);

			manager.removeStack(DISABLE.STUN);

			expect(manager.hasDisable(DISABLE.STUN)).toBeFalsy();
		});
	});
});
