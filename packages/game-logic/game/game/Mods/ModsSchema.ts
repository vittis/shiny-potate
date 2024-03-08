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
import { AbilityModifier } from "../Class/ClassTypes";
import { STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { EQUIPMENT_TAG } from "../Equipment/EquipmentTypes";
import { TARGET_TYPE } from "../Target/TargetTypes";

// todo better type
const AbilityModifierSchema = z.object({
	trigger: z
		.array(
			z.object({
				name: z.string(),
				remove: z.boolean().optional(),
			}),
		)
		.optional(),
	target: z
		.array(
			z.object({
				name: z.string(),
				remove: z.boolean().optional(),
			}),
		)
		.optional(),
	status_effect: z
		.array(
			z.object({
				name: z.nativeEnum(STATUS_EFFECT),
				target: z.nativeEnum(TARGET_TYPE),
				value: z.number(),
				remove: z.boolean().optional(),
			}),
		)
		.optional(),
	stats: z
		.array(
			z.object({
				name: z.nativeEnum(STAT),
				target: z.nativeEnum(TARGET_TYPE),
				value: z.number(),
				remove: z.boolean().optional(),
			}),
		)
		.optional(),
	heal: z
		.array(
			z.object({
				target: z.nativeEnum(TARGET_TYPE),
				value: z.number(),
				remove: z.boolean().optional(),
			}),
		)
		.optional(),
	shield: z
		.array(
			z.object({
				target: z.nativeEnum(TARGET_TYPE),
				value: z.number(),
				remove: z.boolean().optional(),
			}),
		)
		.optional(),
}) satisfies z.ZodType<AbilityModifier>;

const GrantAbilityPayloadSchema = z.object({
	name: z.string(),
}) satisfies z.ZodType<GrantAbilityPayload>;

const GrantPerkPayloadSchema = z.object({
	name: z.string(),
	tier: z.optional(z.number()),
}) satisfies z.ZodType<GrantPerkPayload>;

const GrantBaseStatPayloadSchema = z.object({
	stat: z.nativeEnum(STAT),
	value: z.number(),
}) satisfies z.ZodType<GrantBaseStatPayload>;

const GrantAbilityModifierPayload = z.union([
	z.object({
		name: z.string(),
		modifiers: AbilityModifierSchema,
	}),
	z.object({
		name: z.string(),
		nodeName: z.string(),
		unique: z.boolean(),
	}),
]) satisfies z.ZodType<GrantAbilityModifierPayload>;

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
			payload: GrantAbilityModifierPayload,
			tier: z.union([z.number(), z.literal("implicit")]).optional(),
		}),
	]),
) satisfies z.ZodType<PossibleMods>;

export const ModTagSchema = z.object({
	name: z.nativeEnum(EQUIPMENT_TAG),
	weight: z.number(),
}) satisfies z.ZodType<ModTag>;
