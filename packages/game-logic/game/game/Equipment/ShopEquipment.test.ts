import { Weapons } from "../data"
import { ShopEquipment } from "./ShopEquipment"

describe("ShopEquipment", () => {
	describe("getAllApplicableMods", () => {
		/* it("different mods are added to the applicable pool", () => {
    }) */

		it("same mod from different sources adds to weight", () => {
			const equip = new ShopEquipment(Weapons.Shortbow, 2)

			const mods = equip.getAllApplicableMods()

			expect(mods).toHaveLength(1)
			expect(mods[0].weight).toBe(2)
		})
	})
})
