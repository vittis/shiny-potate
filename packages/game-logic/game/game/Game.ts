import { BoardManager, OWNER, POSITION } from "./BoardManager";
import { Unit } from "./Unit/Unit";
import { Equipment } from "./Equipment/Equipment";
import { EQUIPMENT_SLOT, EquipmentInstance } from "./Equipment/EquipmentTypes";
import {
	executeStepEffects,
	getDeathIntents,
	getEventsFromIntents,
	getStepEffects,
	sortEventsByType,
} from "./Event/EventUtils";
import { Class } from "./Class/Class";
import { Classes, Trinkets, Weapons } from "./data";
import {
	EVENT_TYPE,
	PossibleEvent,
	PossibleIntent,
	StepEffects,
	SubStepEffects,
} from "./Event/EventTypes";
import { TRIGGER } from "./Trigger/TriggerTypes";
import { Board } from "../shop/ArenaTypes";

export interface UnitsDTO {
	equipments: EquipmentInstance[];
	position: POSITION;
	unitClass: string;
}

export class Game {
	boardManager: BoardManager;

	constructor({ skipConstructor = false } = {}) {
		this.boardManager = new BoardManager();

		if (skipConstructor) {
			return;
		}

		const unit1 = new Unit(OWNER.TEAM_ONE, POSITION.TOP_BACK, this.boardManager);
		unit1.equip(new Equipment(Weapons.Longbow, 5), EQUIPMENT_SLOT.TWO_HANDS);
		unit1.equip(new Equipment(Trinkets.ScoutsEye), EQUIPMENT_SLOT.TRINKET);
		unit1.equip(new Equipment(Trinkets.KamesLostSash), EQUIPMENT_SLOT.TRINKET_2);
		unit1.setClass(new Class(Classes.Paladin));

		const unit2 = new Unit(OWNER.TEAM_TWO, POSITION.TOP_FRONT, this.boardManager);
		unit2.equip(new Equipment(Weapons.Sword, 3), EQUIPMENT_SLOT.MAIN_HAND);
		unit2.equip(new Equipment(Weapons.Dagger, 3), EQUIPMENT_SLOT.OFF_HAND);
		unit2.equip(new Equipment(Trinkets.TrainingArmbands), EQUIPMENT_SLOT.TRINKET);
		unit2.equip(new Equipment(Trinkets.TrainingArmbands), EQUIPMENT_SLOT.TRINKET_2);
		unit2.setClass(new Class(Classes.Rogue));

		this.boardManager.addToBoard(unit1);
		this.boardManager.addToBoard(unit2);
	}

	// todo use this instead of setTeam
	setBoard(team: OWNER, board: Board) {
		board.forEach(boardSpace => {
			const boardUnit = boardSpace?.unit;
			if (!boardUnit) return;
			const unit = boardUnit.unit;

			const gameUnit = new Unit(team, parseInt(boardSpace.position), this.boardManager);
			gameUnit.setClass(new Class(Classes[unit.className as keyof typeof Classes]));

			// todo uncomment when not hardcoding SLOT in arena
			/* unit.shopEquipment.forEach(equipment => {
				gameUnit.equip(new Equipment(equipment.shopEquip.equip), equipment.slot);
			}); */

			unit.shopEquipment.forEach(equipment => {
				const equipmentData = equipment.shopEquip.equip;
				if (equipmentData.slots.includes(EQUIPMENT_SLOT.TRINKET)) {
					if (gameUnit.equipmentManager.isSlotOccupied(EQUIPMENT_SLOT.TRINKET)) {
						gameUnit.equip(new Equipment(equipmentData), EQUIPMENT_SLOT.TRINKET_2);
					} else {
						gameUnit.equip(new Equipment(equipmentData), EQUIPMENT_SLOT.TRINKET);
					}
				} else if (equipmentData.slots.includes(EQUIPMENT_SLOT.TWO_HANDS)) {
					gameUnit.equip(new Equipment(equipmentData), EQUIPMENT_SLOT.TWO_HANDS);
				} else {
					if (!gameUnit.equipmentManager.isSlotOccupied(EQUIPMENT_SLOT.MAIN_HAND)) {
						gameUnit.equip(new Equipment(equipmentData), EQUIPMENT_SLOT.MAIN_HAND);
					} else {
						if (
							gameUnit.equipmentManager.canEquipOnSlot(
								new Equipment(equipmentData),
								EQUIPMENT_SLOT.OFF_HAND,
							)
						) {
							gameUnit.equip(new Equipment(equipmentData), EQUIPMENT_SLOT.OFF_HAND);
						} else {
							throw Error(`setTeams: Can't equip ${equipmentData.name} on offhand`);
						}
					}
				}
			});
			this.boardManager.addToBoard(gameUnit);
		});
	}

	setTeam(team: OWNER, units: UnitsDTO[]) {
		units.forEach(unitDTO => {
			const unit = new Unit(team, unitDTO.position, this.boardManager);
			unit.setClass(new Class(Classes[unitDTO.unitClass as keyof typeof Classes]));
			unitDTO.equipments.forEach(equipmentData => {
				if (equipmentData.slots.includes(EQUIPMENT_SLOT.TRINKET)) {
					if (unit.equipmentManager.isSlotOccupied(EQUIPMENT_SLOT.TRINKET)) {
						unit.equip(new Equipment(equipmentData), EQUIPMENT_SLOT.TRINKET_2);
					} else {
						unit.equip(new Equipment(equipmentData), EQUIPMENT_SLOT.TRINKET);
					}
				} else if (equipmentData.slots.includes(EQUIPMENT_SLOT.TWO_HANDS)) {
					unit.equip(new Equipment(equipmentData), EQUIPMENT_SLOT.TWO_HANDS);
				} else {
					if (!unit.equipmentManager.isSlotOccupied(EQUIPMENT_SLOT.MAIN_HAND)) {
						unit.equip(new Equipment(equipmentData), EQUIPMENT_SLOT.MAIN_HAND);
					} else {
						if (
							unit.equipmentManager.canEquipOnSlot(
								new Equipment(equipmentData),
								EQUIPMENT_SLOT.OFF_HAND,
							)
						) {
							unit.equip(new Equipment(equipmentData), EQUIPMENT_SLOT.OFF_HAND);
						} else {
							throw Error(`setTeams: Can't equip ${equipmentData.name} on offhand`);
						}
					}
				}
			});

			this.boardManager.addToBoard(unit);
		});
	}

	startGame() {
		const result = runGame(this.boardManager);

		return result;
	}
}

function hasGameEnded(bm: BoardManager) {
	return (
		bm.getAllUnitsOfOwner(OWNER.TEAM_ONE).every(unit => unit.isDead) ||
		bm.getAllUnitsOfOwner(OWNER.TEAM_TWO).every(unit => unit.isDead)
	);
}

function getWinner(bm: BoardManager) {
	if (bm.getAllUnitsOfOwner(OWNER.TEAM_ONE).every(unit => unit.isDead)) {
		return OWNER.TEAM_TWO;
	} else {
		return OWNER.TEAM_ONE;
	}
}

function reachTimeLimit(currentStep: number) {
	const STEP_LIMIT = 2000;
	return currentStep >= STEP_LIMIT;
}

export function runGame(bm: BoardManager) {
	const eventHistory: PossibleEvent[] = [];
	const effectHistory: StepEffects[] = [];

	const serializedUnits = bm.getAllUnits().map(unit => unit.serialize());
	const firstStep = { units: serializedUnits };

	// Get BATTLE_START trigger events
	const battleStartIntents: PossibleIntent[] = [];
	bm.getAllUnits().forEach(unit => {
		unit.triggerManager.onTrigger(TRIGGER.BATTLE_START, unit, bm);
		battleStartIntents.push(...unit.serializeIntents());
	});

	const battleStartEvents: PossibleEvent[] = getEventsFromIntents(bm, battleStartIntents);

	if (battleStartEvents.length > 0) {
		const orderedEvents = sortEventsByType(battleStartEvents) as PossibleEvent[];
		orderedEvents.forEach(event => {
			eventHistory.push(event);
		});
		const stepEffects = getStepEffects(orderedEvents);
		executeStepEffects(bm, stepEffects);
		effectHistory.push(stepEffects);
	}

	let currentStep = 1;

	// Loop steps
	do {
		// Step each unit alive
		bm.getAllAliveUnits().forEach(unit => {
			unit.step(currentStep);
		});

		// Get each stepIntent from each unit and store on stepIntentsMap
		let stepIntentsMap = new Map<string, PossibleIntent[]>();
		bm.getAllUnits().forEach(unit => {
			stepIntentsMap.set(unit.id, unit.serializeIntents());
		});

		// Get the first intent of each unit and add it to stepEvents
		const stepEvents: PossibleEvent[] = [];
		bm.getAllUnits().forEach(unit => {
			let stepIntents = stepIntentsMap.get(unit.id);
			if (!stepIntents || stepIntents.length == 0) return;

			// Get all intents of type TICK_EFFECT and add them to stepEvents as events (if exists)
			const tickEffectIntents = stepIntents.filter(
				intent => intent.type === EVENT_TYPE.TICK_EFFECT,
			);
			if (tickEffectIntents) {
				stepEvents.push(...getEventsFromIntents(bm, tickEffectIntents));
				stepIntents = stepIntents.filter(intent => intent.type !== EVENT_TYPE.TICK_EFFECT);
			}

			// Get first intent (excluding TICK_EFFECT) and add to stepEvents (if exists)
			const firstIntent = stepIntents.shift();
			if (firstIntent) {
				stepEvents.push(...getEventsFromIntents(bm, [firstIntent]));
			}

			stepIntentsMap.set(unit.id, stepIntents);
		});

		// Order each stepEvents
		const orderedEvents = sortEventsByType(stepEvents) as PossibleEvent[];

		if (orderedEvents.length > 0) {
			// Add events to eventHistory
			eventHistory.push(...orderedEvents);

			// Get effects from events and execute them
			let stepEffects = getStepEffects(orderedEvents);
			executeStepEffects(bm, stepEffects);

			// Get death related intents, add them to stepIntentsMap and order them
			const deathIntentsMap = getDeathIntents(bm);
			stepIntentsMap.forEach((intents, unitId) => {
				const allIntents = [...(deathIntentsMap.get(unitId) || []), ...intents];
				stepIntentsMap.set(unitId, sortEventsByType(allIntents) as PossibleIntent[]);
			});

			let subStep: number = 1;
			let subStepEvents: PossibleEvent[] = [];
			let subSteps: SubStepEffects[] = [];

			// Check for all units intents and get the first one (if exists)
			bm.getAllUnits().forEach(unit => {
				let stepIntents = stepIntentsMap.get(unit.id);
				if (!stepIntents || stepIntents.length == 0) return;

				const firstIntent = stepIntents.shift();
				if (firstIntent) {
					subStepEvents.push(...getEventsFromIntents(bm, [firstIntent]));
				}

				stepIntentsMap.set(unit.id, stepIntents);
			});

			// Loop subSteps
			while (subStepEvents.length > 0) {
				// Add subStep to events then add to eventHistory
				subStepEvents.forEach(event => {
					event.subStep = subStep;
				});
				eventHistory.push(...subStepEvents);

				// Get subStepEffects from events and execute them
				let subStepEffects = getStepEffects(subStepEvents);
				executeStepEffects(bm, subStepEffects);

				// Add subStep to subStepEffects and add it to subSteps
				const subStepEffectsWithSubStep = {
					units: subStepEffects.units,
					deadUnits: subStepEffects.deadUnits,
					subStep,
				} as SubStepEffects;
				subSteps.push(subStepEffectsWithSubStep);

				// Check for more subStep events to continue looping
				subStep++;
				subStepEvents = [];
				const deathIntentsMap = getDeathIntents(bm);
				stepIntentsMap.forEach((intents, unitId) => {
					const allIntents = [...(deathIntentsMap.get(unitId) || []), ...intents];
					stepIntentsMap.set(unitId, sortEventsByType(allIntents) as PossibleIntent[]);
				});

				bm.getAllUnits().forEach(unit => {
					let stepIntents = stepIntentsMap.get(unit.id);
					if (!stepIntents || stepIntents.length == 0) return;

					const firstIntent = stepIntents.shift();
					if (firstIntent) {
						subStepEvents.push(...getEventsFromIntents(bm, [firstIntent]));
					}

					stepIntentsMap.set(unit.id, stepIntents);
				});
			}

			// If there are subSteps, add them to stepEffects
			if (subSteps.length > 0) {
				stepEffects = { ...stepEffects, subSteps };
			}

			// Add stepEffects to effectHistory
			effectHistory.push(stepEffects);
		}

		currentStep++;
	} while (!hasGameEnded(bm) && !reachTimeLimit(currentStep));

	return {
		totalSteps: currentStep - 1,
		eventHistory,
		firstStep,
		effectHistory,
		winner: getWinner(bm),
	};
}

/* 

	ordenar abilities pra loopar no step (qual a logica de prioridade?)
	multistrike gera no step mesmo (levando em conta as regras de ordem e mandando todo o multistrike pra ability 1)
	ai gera passando flag true pra gerar subEvent removendo multistrike na ability
	no game loop de steps:
	separa os eventos de cada unit, criando uma pilha pra cada unit com os eventos sequencialmente
	step normal: inclui tick_effect se houver, e 1 entre trigger / ability
	*prioriza tick -> trigger -> ability
	remove primeiro elemento das pilhas, se tiver algum ainda loopa subSteps, removendo a cada loop
	no começo de cada loop, checar por death events e adicionar nas pilhas, ordenando novamente
	*faint pode ser usado junto de trigger self_faint
	*no caso de faint, ele vai pro topo da pilha e depois de usado a pilha é esvaziada (como se as ações deixassem de existir)

	*como passar os eventos pro stepEvents no caso de multiplas abilities?
	 precisa indicar q tem multistrike mas ter a opção de gerar o target novamente

 */

/* 
Ideia:
 - Implicit weapons aplicam debuff. Ex: 
    - bow: apply 1 weak on hit,
    - greatmace: apply 1 stunned on hit
    - dagger: start: gain 3 fast


  - stunned X: dont add ap for X turns


RAÇA
CLASSE
EQUIP
COMBATE

ATTACK SPEED:
(BASE + B) * (1 + (DEX * 5) / 100)

DANO TOTAL:
(BASE_ARMA + B) * (1 + (STR * strScale + DEX * dexScale + INT * intScale) / 100)
 */

/* +3% / str */

/* 

   


    Batalha baseada em buffs/debuffs tipo super auto battlemon


___________________________________________________________________________________________________

dex = each point increase X% attack speed (X is a constant, like 5 (5%)) 
OR start with X fast



STATUS EFFECTS

REGEN = heal 1 hp per stack per 5 steps and remove 1 stack
FAST = increase 1 attack speed per stack and remove 1 per attack
FOCUS)= increase 1 skill speed per stack and remove 1 per skill used
ATTACK POWER = increase 1 attack damage per stack and remove 1 per attack
SPELL POTENCY = increase 1 skill damage per stack and remove 1 per skill use
POISON = deal 1 dmg per stack per 5 steps and remove 1 stack
SLOW = reduce 1 attack speed per stack per 5 steps and remove 1 stack per attack
VULNERABLE = increase 1% damage taken per stack, remove all on hit
STURDY = reduce 1% damage taken per stack, remove 1 stack on hit
THORN = deal 1 dmg per stack on hit and remove 1 stack
TAUNT = force enemy units to attack this unit, remove 1 stack on hit
MULTISTRIKE = on weapon attack/skill immediately trigger the attack again more X times and remove all stacks

DISABLES

STUN = barrinha (duração em step) e icone


INSTANT EFFECTS

DAMAGE = deal X dmg
HEAL = heal X hp
APPLY SHIELD = gain X shield









XP

cada round player tem um número específico de xp disponivel
por ex. round 1 = 1, round 5 = 10 etc
xp pode ser utilizado pra ganhar uma perk de uma unidade, como uma skill tree
é possivel colocar e tirar pontos de qualquer unidade livremente entre os rounds


SKILLS

ULT = skill da barra

EX:
- PASSIVA APLICA POISON ON HIT
- COMEÇA COM 20 THORN STACKS
- TRIGGER (30%- HP) CASTA SKILL DOIDA


CLASS

PERKS ROGUE
- PASSIVA APLICA POISON ON HIT
- SE TIVER NA BACKLINE, GANHA 20% DAMAGE


RACE

PERKS ANÃO
- +10 DEF
- COMEÇA COM 20 THORN STACKS


PERKS CATEGORIES

- PASSIVA
EX: APLICA POISON ON HIT

- STATS BUFF
EX: BATTLE START: GAIN 20 FAST

- INSTANT EFFECT
EX: HEAL X HP ON TRIGGER


PERKS

PARKS HAVE TIERS (1, 2, 3, 4, 5) THAT CAN BE STACKED THROUGH DIFERRENT SOURCES
EX: GAIN AGILE PERK LVL 1 FROM CLASS, AND LVL 2 FROM DAGGER, THEN UNIT HAS AGILE PERK LVL 3

 */

/* 

Classes brainstorm



------------------------------------------------------------------
Blacksmith
- Gain skill: 
  - Reinforce Allies: Give adjacent allies 20 SHIELD / CD: X

- Skill Trees (or subclasses) 
  - Weaponsmith
    - Tier 1:
      - ???: "Reinforce Allies" also gives 5 FAST to adjacents allies
      - ???: "Reinforce Allies" also gives 10 DAMAGE and 10 FAST to FRONT ally
    - Tier 2 (req 2):
      - ???: "Reinforce Allies" also gives 1 MULTISTRIKE to FRONT ally
  - Armorsmith
    - Tier 1:
      - ???: "Reinforce Allies" also gives gives 15 more SHIELD to adjacents allies
      - ???: "Reinforce Allies" give 10 STURDY and 20 more SHIELD to FRONT ally
    - Tier 2 (req 2):
      - ???: "Reinforce Allies": Give 2 TAUNT and 25 THORN to FRONT ally

    - Utility skills 
      - "Reinforce Allies" don't affect adjacents units anymore. Apply the same amount to self
      - BATTLE START: Trigger base skill 
      - DEATH: Trigger base skill 
------------------------------------------------------------------

RANGER
  - Gain attack: 
    - Weak Spot: Attack furthest enemy and apply 10 Slow / CD: 7s
  - Skill Trees
    - Sniper
      - Tier 1: 
        - Gain 1 Ranged Proficiency
        - Gain 1 Open Field Tactics
      - Tier 2 (req 2): 
        - Gain attack: POWERSHOT: Attack all enemies on a row with 70% attack damage. Requires physical ranged weapon
    - Hunter
      - Tier 1: 
        - Gain skill: Summon Crab: Give adjacent allies 5 STURDY and 5 THORN / CD: 8
        - Gain skill: Summon Rabbit: Give adjacent allies 10 FAST / CD: X
        - Gain skill: Summon Boar: Attack X damage and apply 10 STUN on hit / CD: X
      - Tier 2 (req 1):
        - All team summon skills 15% less base cooldown
      - Tier 3 (req 3):
        - DEATH: Trigger all summons skill

  - Utility tree
    - Desperate Will: ALLY DEATH: Gain 5 A. DAMAGE
    - Surprise Assault: BATTLE START: Give 5 SLOW to all enemies
    - Nature Insight: BATTLE START: Gain 15 FOCUS

---------------------------------------------------------------------------



BOW MODS POOL: 
  - Gain X Ranged Profiency (Specialized)
  - Gain X Field Tactics ()
  - Gain X Coat In Poison (Serpent)
  - Gain X Heavy Puncher
  - Gain X Swift Spellcasting
  - Gain attack: Weak Spot: Attack furthest enemy and apply 10 Slow / CD: 7s


---------------------------------------------------------------------------
PERKS: 
  - Ranged Proficiency: BATTLE START: Gain X FAST if using ranged physical weapons
  - Open Field Tactics: BATTLE START: Gain X FAST if no ally in front
  - Coat In Poison: On Attack Hit: Apply X Poison
  - Penetrating Attack: ON WEAPON HIT: DEALS X% damage to enemy behind the target
  - Disarming Blow: ON ATTACK HIT: Apply X VULNERABLE
  - Heavy Puncher: BATTLE START: GAIN 10 A. DAMAGE
  - Arcane Potency: BATTLE START: GAIN 10 S. DAMAGE
  - Swift Spellcasting: BATTLE START: GAIN 10 FOCUS

---------------------------------------------------------------------------
POSSIBLE BOWS:
  - T0
    - Longbow
      - Gain attack: Deals BASE_DAMAGE / CD: X 
      - Gain 1 Ranged Proficiency (implicit)
    - Shortbow (T0)
      - Gain attack: Deals BASE_DAMAGE / CD: X
      - Gain 1 Disarming Blow (implicit)
    - Viscous Bow
      - Gain attack: Deals BASE_DAMAGE / CD: X
      - Gain 1 Coat In Poison (implicit)

BOWS T1:
  - Specialized Longbow (T1)
    - Gain attack: Deals BASE_DAMAGE / CD: X (implicit)
    - Gain 1 Ranged Proficiency (implicit)
    - Gain 1 Ranged Proficiency (MOD T1)
  - Arcane Shortbow (T1)
    - Gain attack: Deals BASE_DAMAGE  / CD: X (implicit)
    - Gain 1 Disarming Blow (implicit)
    - Gain 1 Swift Spellcasting (MOD T1)

BOWS T2:
 - Tactical Longbow 
    - Gain attack: Deals BASE_DAMAGE / CD: X (implicit)
    - Gain 1 Ranged Proficiency (implicit)
    - Gain 2 Open Field Tactics (MOD T2)
    - Gain 1 Heavy Puncher (MOD T1)

BOWS T3:
  - Fatal Viscous Bow 
    - Gain attack: Deals BASE_DAMAGE / CD: X (implicit)
    - Gain 1 Coat In Poison (implicit)
    - Gain 3 Disarming Blow (MOD T3)
    - Gain 2 Coat In Poison (MOD T2)
  - Impaler Viscous Bow 
    - Gain attack: Deals BASE_DAMAGE / CD: X (implicit)
    - Gain 1 Coat In Poison (implicit)
    - Gain 3 Penetrating Attack (MOD T3)
    - Gain 1 Coat In Poison (MOD T1)
    - Gain 1 Heavy Puncher (MOD T1)


ITEMS:
    Gain X Ranged Proficiency

    Longsword TBlueprint
    Sem Mods

    Longsword T1:
    DexT1

    Longsword T2:
    DamageT2 + DexT1

    Longsword T3:
    DamageT3 + PenT1 + DexT1 ou DamageT3 + PenT2

    Longsword T4:
    DamageT4 + Pen2 + DexT1

    Longsword T5:
    DamageT5 + PenT3 + DexT1 ou DamageT5 + PenT4 


    Item sempre vai ter um MOD do próprio tier
    Os outros mods vão ser randomizados e somados tem valor de TierDoItem - 1
    Cada Mod tem seu peso de raridade

    
    Weapon blueprint: One handed sword, One handed mace, bow
    Weapon Example: Katana, Gladius, Great axe

    Na blueprint é definido os possíveis modifiers q podem ser rollados no item.



    Longbow T0 (base)
    Sem Mods

    Longbow T1:
    DexT1

    Longbow T2:
    DamageT2 + DexT1

    Longbow T3:
    DamageT3 + PenT1 + DexT1

    Longbow T4:
    DamageT4 + Pen2 + DexT1

    Longbow T5:
    DamageT5 + PenT3 + DexT1 ou DamageT5 + PenT4 





RAÇAS, bonuses que liberam qdo upa

RACIAL BONUS LV 1: 
RACIAL BONUS LV 3:  
RACIAL BONUS LV 5: 









- NEXT STEPS:

VITU: 
- obsidian bonito
- remover mecanicas antigas
- implementar novo sistema de ataques/skills
- status effects

GULM
- Arrumar front (usar render texture)
- Classes/Perks
- ajudar vitu






*/
