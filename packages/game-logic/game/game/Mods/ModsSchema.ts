import { z } from "zod";
import {
	GrantAbilityModifierPayload,
	GrantAbilityPayload,
	GrantBaseStatPayload,
	GrantPerkPayload,
	MOD_TYPE,
	ModTag,
	PossibleMods,
} from "./ModsTypes";
import { STAT } from "../Stats/StatsTypes";
import { EQUIPMENT_TAG } from "../Equipment/EquipmentTypes";
import { ABILITY_CATEGORY } from "../Ability/AbilityTypes";

const GrantAbilityPayloadSchema = z.object({
	name: z.string(),
	type: z.nativeEnum(ABILITY_CATEGORY),
}) satisfies z.ZodType<GrantAbilityPayload>;

const GrantPerkPayloadSchema = z.object({
	name: z.string(),
	tier: z.optional(z.number()),
}) satisfies z.ZodType<GrantPerkPayload>;

const GrantBaseStatPayloadSchema = z.object({
	stat: z.nativeEnum(STAT),
	value: z.number(),
}) satisfies z.ZodType<GrantBaseStatPayload>;

const GrantAbilityModifierPayloadSchema = z.object({
	name: z.string(),
	modifier: z.string(),
}) satisfies z.ZodType<GrantAbilityModifierPayload>;

export const PossibleModsSchema = z.array(
	z.union([
		z.object({
			type: z.literal(MOD_TYPE.GRANT_ABILITY),
			payload: GrantAbilityPayloadSchema,
			tier: z.union([z.number(), z.literal("implicit")]).optional(),
		}),
		z.object({
			type: z.literal(MOD_TYPE.GRANT_PERK),
			payload: GrantPerkPayloadSchema,
			tier: z.union([z.number(), z.literal("implicit")]).optional(),
		}),
		z.object({
			type: z.literal(MOD_TYPE.GRANT_BASE_STAT),
			payload: GrantBaseStatPayloadSchema,
			tier: z.union([z.number(), z.literal("implicit")]).optional(),
		}),
		z.object({
			type: z.literal(MOD_TYPE.GRANT_ABILITY_MODIFIER),
			payload: GrantAbilityModifierPayloadSchema,
			tier: z.union([z.number(), z.literal("implicit")]).optional(),
		}),
	]),
) satisfies z.ZodType<PossibleMods>;

export const ModTagSchema = z.object({
	name: z.nativeEnum(EQUIPMENT_TAG),
	weight: z.number(),
}) satisfies z.ZodType<ModTag>;
