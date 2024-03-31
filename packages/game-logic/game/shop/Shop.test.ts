import { generateShop } from "./ShopUtils";

describe("Shop", () => {
	it("generateShop", () => {
		const stuff = generateShop(1);

		console.log(stuff);

		expect(stuff).toBeDefined();
	});
});
