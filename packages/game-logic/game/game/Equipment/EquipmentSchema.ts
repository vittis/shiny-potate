import { z } from "zod";
import { EQUIPMENT_SLOT, EQUIPMENT_TAG, EquipmentData, EquipmentStatsData } from "./EquipmentTypes";
import { ModTagSchema, PossibleModsSchema } from "../Mods/ModsSchema";
import { TriggerEffectsSchema } from "../Perk/PerkSchema";
import { STAT } from "../Stats/StatsTypes";

export const EquipmentDataSchema = z.object({
	name: z.string(),
	tags: z.array(z.nativeEnum(EQUIPMENT_TAG)),
	slots: z.array(z.nativeEnum(EQUIPMENT_SLOT)),
	mods: PossibleModsSchema,
	effects: TriggerEffectsSchema,
}) satisfies z.ZodType<EquipmentData>;

export const EquipmentStatsDataArraySchema = z.array(
	z.object({
		name: z.nativeEnum(STAT),
		tiers: z.array(z.number()),
		tags: z.array(ModTagSchema),
	}),
) satisfies z.ZodType<EquipmentStatsData[]>;
