import { convertModTemplateToMod } from "@/game/Mod/ModsUtils";
import { FILTER_TYPE, INSTANT_EFFECT, MOD, ModTemplate } from "@/game/Mod/ModTypes";
import { TAG } from "@/game/Tag/TagTypes";
import { TARGET_TYPE } from "@/game/Target/TargetTypes";

describe("Mods", () => {
	describe("Utils functions", () => {
		it("convertModTemplateToMod - Stat mod", () => {
			const id = "id-test";
			const tier = 3;
			const statModTemplate: ModTemplate<MOD.STAT> = {
				minimumTier: 1,
				type: MOD.STAT,
				targets: [
					{
						target: TARGET_TYPE.SELF,
						filters: [],
					},
				],
				conditions: [],
				payload: [
					{
						stat: "COOLDOWN_MODIFIER",
						category: "PERCENTAGE",
						values: [
							{
								ref: "BASE",
								values: [-10, -20, -30, -40],
							},
						],
						quantity: [
							{
								ref: "BASE",
								filters: [
									{
										type: FILTER_TYPE.ABILITY,
										payload: {
											tags: [TAG.SUPPORT],
											target: TARGET_TYPE.SELF,
										},
									},
								],
							},
						],
						tags: [],
					},
				],
			};

			const expectedStatModPayload = [
				{
					stat: "COOLDOWN_MODIFIER",
					category: "PERCENTAGE",
					value: -30,
					tags: [],
				},
			];

			const convertedMod = convertModTemplateToMod(statModTemplate, tier, id);

			expect(convertedMod.payload).toStrictEqual(expectedStatModPayload);
			expect(convertedMod.type).toStrictEqual(MOD.STAT);
			expect(convertedMod.targets).toStrictEqual(statModTemplate.targets);
			expect(convertedMod.conditions).toStrictEqual(statModTemplate.conditions);
			expect(convertedMod.sourceId).toStrictEqual(id);
			expect(convertedMod.id).toBeDefined();
		});
		it("convertModTemplateToMod - Gain ability mod", () => {
			const id = "id-test";
			const tier = 2;
			const gainAbilityModTemplate: ModTemplate<MOD.GAIN_ABILITY> = {
				minimumTier: 2,
				type: MOD.GAIN_ABILITY,
				conditions: [],
				targets: [
					{
						target: TARGET_TYPE.SELF,
						filters: [],
					},
				],
				payload: [
					{
						name: "Ability name",
					},
				],
			};

			const expectedGainAbilityModPayload = [
				{
					name: "Ability name",
				},
			];

			const convertedMod = convertModTemplateToMod(gainAbilityModTemplate, tier, id);

			expect(convertedMod.payload).toStrictEqual(expectedGainAbilityModPayload);
			expect(convertedMod.type).toStrictEqual(MOD.GAIN_ABILITY);
			expect(convertedMod.targets).toStrictEqual(gainAbilityModTemplate.targets);
			expect(convertedMod.conditions).toStrictEqual(gainAbilityModTemplate.conditions);
			expect(convertedMod.sourceId).toStrictEqual(id);
			expect(convertedMod.id).toBeDefined();
		});
		it("convertModTemplateToMod - Effect mod", () => {
			const id = "id-test";
			const tier = 3;
			const effectModTemplate: ModTemplate<MOD.EFFECT> = {
				type: MOD.EFFECT,
				targets: [
					{
						target: TARGET_TYPE.STANDARD,
						filters: [],
					},
				],
				conditions: [],
				payload: [
					{
						effect: INSTANT_EFFECT.DAMAGE,
						values: [
							{
								ref: "BASE",
								values: [20, 30, 40, 50],
							},
						],
						quantity: [
							{
								ref: "BASE",
							},
						],
					},
				],
			};

			const expectedEffectModPayload = [
				{
					effect: INSTANT_EFFECT.DAMAGE,
					value: 40,
				},
			];

			const convertedMod = convertModTemplateToMod(effectModTemplate, tier, id);

			expect(convertedMod.payload).toStrictEqual(expectedEffectModPayload);
			expect(convertedMod.type).toStrictEqual(MOD.EFFECT);
			expect(convertedMod.targets).toStrictEqual(effectModTemplate.targets);
			expect(convertedMod.conditions).toStrictEqual(effectModTemplate.conditions);
			expect(convertedMod.sourceId).toStrictEqual(id);
			expect(convertedMod.id).toBeDefined();
		});
		it("convertModTemplateToMod - using different refs", () => {
			const id = "id-test";
			const tier = 1;
			const statModTemplate: ModTemplate<MOD.STAT> = {
				minimumTier: 1,
				type: MOD.STAT,
				targets: [
					{
						target: TARGET_TYPE.SELF,
						filters: [],
					},
				],
				conditions: [],
				payload: [
					{
						stat: "HP_MODIFIER",
						category: "FLAT",
						values: [
							{
								ref: "REF 1",
								values: [10, 20, 30, 40],
							},
							{
								ref: "REF 2",
								values: [20, 30, 40, 50],
							},
						],
						quantity: [
							{
								ref: "REF 1",
								filters: [],
							},
							{
								ref: "REF 2",
								filters: [],
							},
						],
						tags: [],
					},
				],
			};

			const expectedStatModPayload = [
				{
					stat: "HP_MODIFIER",
					category: "FLAT",
					value: 30,
					tags: [],
				},
			];

			const convertedMod = convertModTemplateToMod(statModTemplate, tier, id);

			expect(convertedMod.payload).toStrictEqual(expectedStatModPayload);
		});
	});
});
