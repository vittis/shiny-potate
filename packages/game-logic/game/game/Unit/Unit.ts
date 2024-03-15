import { nanoid } from "nanoid";
import { AbilityManager } from "../Ability/AbilityManager";
import { BoardManager, OWNER, POSITION } from "../BoardManager";
import { Class } from "../Class/Class";
import { ClassManager } from "../Class/ClassManager";
import { Equipment } from "../Equipment/Equipment";
import { EquipmentManager } from "../Equipment/EquipmentManager";
import { EQUIPMENT_SLOT } from "../Equipment/EquipmentTypes";
import {
	EVENT_TYPE,
	INSTANT_EFFECT_TYPE,
	PossibleEvent,
	SubEvent,
	TICK_EFFECT_TYPE,
	TickEffectEvent,
	TriggerEffectEvent,
	UseAbilityEvent,
} from "../Event/EventTypes";
import { PerkManager } from "../Perk/PerkManager";
import { StatsManager } from "../Stats/StatsManager";
import { UnitStats } from "../Stats/StatsTypes";
import { StatusEffectManager } from "../StatusEffect/StatusEffectManager";
import { ActiveStatusEffect, STATUS_EFFECT } from "../StatusEffect/StatusEffectTypes";
import { TriggerManager } from "../Trigger/TriggerManager";
import { TRIGGER } from "../Trigger/TriggerTypes";

// use for better perfomance
/* export enum EVENT_TYPE {
  ATTACK = 0,
  IS_PREPARING_ATTACK = 1,
  RECEIVED_DAMAGE = 2,
  HAS_DIED = 3,
} */

export class Unit {
	id: string;
	owner: OWNER;
	position: POSITION;
	bm: BoardManager;

	isDead = false;

	currentStep = 1;
	stepEvents: PossibleEvent[] = [];

	public statsManager: StatsManager;
	public equipmentManager: EquipmentManager;
	public classManager: ClassManager;
	public abilityManager: AbilityManager;
	public perkManager: PerkManager;
	public statusEffectManager: StatusEffectManager;
	public triggerManager: TriggerManager;

	get stats() {
		return this.statsManager.getStats();
	}
	set stats(stats: UnitStats) {
		this.statsManager.setStats(stats);
	}

	// todo better stats merge
	get statsFromMods() {
		return this.statsManager.getStatsFromMods();
	}

	get triggerEffects() {
		return this.triggerManager.triggerEffects;
	}

	get equips() {
		return this.equipmentManager.equips;
	}

	get equipment() {
		return this.equipmentManager.equips;
	}

	get abilities() {
		return this.abilityManager.abilities;
	}

	get perks() {
		return this.perkManager.perks;
	}

	get statusEffects() {
		return this.statusEffectManager.activeStatusEffects;
	}

	constructor(owner: OWNER, position: POSITION, bm?: BoardManager) {
		this.statsManager = new StatsManager();
		this.equipmentManager = new EquipmentManager();
		this.classManager = new ClassManager();
		this.abilityManager = new AbilityManager();
		this.perkManager = new PerkManager();
		this.statusEffectManager = new StatusEffectManager();
		this.triggerManager = new TriggerManager();
		this.bm = bm as BoardManager;

		this.id = nanoid(8);
		this.owner = owner;
		this.position = position;

		const finalHp = 100;

		const finalShield = 0;

		this.statsManager.initializeStats({
			hp: finalHp,
			maxHp: finalHp,
			shield: finalShield,
			attackCooldownModifier: 0,
			attackDamageModifier: 0,
			spellCooldownModifier: 0,
			spellDamageModifier: 0,
			damageReductionModifier: 0,
		});
	}

	equip(equip: Equipment, slot: EQUIPMENT_SLOT) {
		if (this.equipmentManager.isSlotOccupied(slot)) this.unequip(slot);

		this.equipmentManager.equip(equip, slot);

		this.statsManager.addMods(equip.getStatsMods());

		this.abilityManager.addAbilitiesFromSource(equip.getGrantedAbilities(), equip.id);

		this.abilityManager.applyCooldownModifierFromStats(this.stats);

		this.triggerManager.addTriggerEffectsFromSource(equip.getTriggerEffects(), equip.id);

		const grantedPerks = equip.getGrantedPerks();
		this.perkManager.addPerksFromSource(grantedPerks, equip.id);
		grantedPerks.forEach(perk => {
			this.triggerManager.addTriggerEffectsFromSource(perk.getTriggerEffects(), perk.id);
		});
	}

	unequip(slot: EQUIPMENT_SLOT) {
		const unequippedItems = this.equipmentManager.unequip(slot);

		unequippedItems.forEach(unequippedItem => {
			this.abilityManager.removeAbilitiesFromSource(unequippedItem.equip.id);
			this.statsManager.removeMods(unequippedItem.equip.getStatsMods());
			this.perkManager.removePerksFromSource(unequippedItem.equip.id);
		});

		this.abilityManager.applyCooldownModifierFromStats(this.stats);

		// Put items on storage
	}

	setClass(unitClass: Class) {
		this.classManager.setClass(unitClass);
		this.statsManager.setBaseHp(unitClass.getBaseHp());
		this.statsManager.addMods(unitClass.getStatsMods());

		this.abilityManager.addAbilitiesFromSource(
			this.classManager.getClassAbilities(),
			unitClass.data.name,
		);

		const grantedPerks = unitClass.getPerks();
		this.perkManager.addPerksFromSource(grantedPerks, unitClass.data.name);
		grantedPerks.forEach(perk => {
			this.triggerManager.addTriggerEffectsFromSource(perk.getTriggerEffects(), perk.id);
		});
	}

	serialize() {
		return {
			id: this.id,
			owner: this.owner,
			name: this.getName(),
			class: `${this.classManager?.class?.data?.name}`,
			stats: {
				...this.stats,
			},
			abilities: this.abilities,
			equipment: this.equipment,
			position: this.position,
			statusEffects: [...this.statusEffects],
		};
	}

	serializeEvents() {
		const events = [...this.stepEvents];
		this.stepEvents = [];
		return events;
	}

	step(stepNumber: number) {
		this.currentStep = stepNumber;

		//this.decreaseDisables();

		this.abilities.forEach(ability => {
			ability.step();

			if (ability.canActivate()) {
				const event = ability.use(this);

				if (event) {
					this.stepEvents.push(event);

					if (this.statusEffectManager.hasStatusEffect(STATUS_EFFECT.MULTISTRIKE)) {
						/* 
							TODO:
							IDEALLY if event deals damage check if enemy will die before all hits, then get new target for the remaining ones
							FOR NOW repeat same event
							maybe create a function to do this multistrike stuff if step gets too big
						*/
						const multistrikeQuantity = (
							this.statusEffects.find(
								statusEffect => statusEffect.name === STATUS_EFFECT.MULTISTRIKE,
							) as ActiveStatusEffect
						).quantity;

						for (let i = 0; i < multistrikeQuantity; i++) {
							this.stepEvents.push(event);
						}

						this.statusEffectManager.removeAllStacks(STATUS_EFFECT.MULTISTRIKE);
					}
				}
			}
		});

		this.statusEffectManager.tickEffectStep(this);
	}

	applySubEvents(subEvents: SubEvent[]) {
		subEvents.forEach(subEvent => {
			const target = this.bm.getUnitById(subEvent.payload.targetId);

			if (subEvent.payload.type === INSTANT_EFFECT_TYPE.DAMAGE) {
				target.receiveDamage(subEvent.payload.payload.value);
			}

			if (subEvent.payload.type === INSTANT_EFFECT_TYPE.STATUS_EFFECT) {
				subEvent.payload.payload.forEach(statusEffect => {
					if (statusEffect.quantity > 0) {
						target.statusEffectManager.applyStatusEffect(statusEffect);
					} else {
						target.statusEffectManager.removeStacks(statusEffect.name, statusEffect.quantity * -1);
					}
				});

				target.statsManager.recalculateStatsFromStatusEffects(target.statusEffects);
				target.abilityManager.applyCooldownModifierFromStats(target.stats);
			}

			if (subEvent.payload.type === INSTANT_EFFECT_TYPE.SHIELD) {
				target.receiveShield(subEvent.payload.payload.value);
			}

			if (subEvent.payload.type === INSTANT_EFFECT_TYPE.HEAL) {
				target.receiveHeal(subEvent.payload.payload.value);
			}
		});
	}

	applyEvent(event: PossibleEvent) {
		if (event.type === EVENT_TYPE.USE_ABILITY) {
			this.applySubEvents((event as UseAbilityEvent).payload.subEvents);
		}
		if (event.type === EVENT_TYPE.TRIGGER_EFFECT) {
			this.applySubEvents((event as TriggerEffectEvent).subEvents);
		}
		if (event.type === EVENT_TYPE.TICK_EFFECT) {
			this.applyTickEffectEvents(event as TickEffectEvent);
		}
	}

	applyTickEffectEvents(tickEffect: TickEffectEvent) {
		if (tickEffect.payload.type === TICK_EFFECT_TYPE.POISON) {
			const target = this.bm.getUnitById(tickEffect.payload.targetId);
			target.receiveDamage(tickEffect.payload.payload.value);
			this.statusEffectManager.removeStacks(
				STATUS_EFFECT.POISON,
				tickEffect.payload.payload.decrement,
			);
		}
		if (tickEffect.payload.type === TICK_EFFECT_TYPE.REGEN) {
			const target = this.bm.getUnitById(tickEffect.payload.targetId);
			target.receiveHeal(tickEffect.payload.payload.value);
			this.statusEffectManager.removeStacks(
				STATUS_EFFECT.REGEN,
				tickEffect.payload.payload.decrement,
			);
		}
	}

	receiveDamage(damage: number) {
		let newHp = this.stats.hp;
		let newShield = this.stats.shield;

		const finalDamage = damage;

		if (newShield > 0) {
			newShield -= finalDamage;
			if (newShield < 0) {
				// If the armor is now depleted, apply any remaining damage to the unit's HP
				newHp = Math.max(newHp + newShield, 0);
				newShield = 0;
			}
		} else {
			newHp = Math.max(newHp - finalDamage, 0);
		}

		this.stats = { ...this.stats, hp: newHp, shield: newShield };

		this.statsManager.recalculateStatsFromStatusEffects(this.statusEffects);
	}

	receiveShield(shieldAmount: number) {
		const newShield = this.stats.shield + shieldAmount;

		this.stats = { ...this.stats, shield: newShield };
	}

	receiveHeal(healAmount: number) {
		const newHp = Math.min(this.stats.hp + healAmount, this.stats.maxHp);

		this.stats = { ...this.stats, hp: newHp };
	}

	onDeath() {
		if (this.isDead) {
			throw Error(`Unit ${this.toString()} is already dead`);
		}
		this.isDead = true;

		// todo add other death triggers

		const teamUnits = this.bm.getAllUnitsOfOwner(this.owner);
		teamUnits.forEach(teamUnit => {
			if (!teamUnit.isDead && teamUnit.id !== this.id) {
				teamUnit.triggerManager.onTrigger(TRIGGER.ALLY_FAINT, teamUnit, this.bm);
			}
		});

		this.triggerManager.onTrigger(TRIGGER.SELF_FAINT, this, this.bm);

		this.stepEvents.push({
			actorId: this.id,
			type: EVENT_TYPE.FAINT,
			step: this.currentStep,
		});
	}

	hasDied() {
		return this.stats.hp <= 0;
	}

	getPercentageHp() {
		return this.stats.hp / this.stats.maxHp;
	}

	getName() {
		return `${this.owner}${this.position} ${this.classManager?.class?.data?.name}`;
	}

	public toString = (): string => {
		return `${this.owner}${this.position} ${this.classManager?.class?.data?.name}`;
	};
}
