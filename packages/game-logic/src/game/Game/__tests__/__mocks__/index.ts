import { AbilityData } from "@/game/Ability/AbilityTypes";
import { PackUnitData } from "@/game/PackUnit/PackUnitTypes";
import * as Lumberjack from "./Lumberjack.json";
import * as RoundSwing from "./RoundSwing.json";

export default {
	Abilities: {
		RoundSwing: RoundSwing as AbilityData,
	},
	Units: {
		Lumberjack: Lumberjack as PackUnitData,
	},
};
