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
	PossibleEffect,
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
import { DisableManager } from "../Disable/DisableManager";
import { DISABLE } from "../Disable/DisableTypes";
import { BoardUnitInstance } from "./UnitTypes";

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
	public disableManager: DisableManager;
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

	get disables() {
		return this.disableManager.activeDisables;
	}

	constructor(owner: OWNER, position: POSITION, bm?: BoardManager) {
		this.statsManager = new StatsManager();
		this.equipmentManager = new EquipmentManager();
		this.classManager = new ClassManager();
		this.abilityManager = new AbilityManager();
		this.perkManager = new PerkManager();
		this.statusEffectManager = new StatusEffectManager();
		this.disableManager = new DisableManager();
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

	step(stepNumber: number) {
		this.currentStep = stepNumber;

		this.statusEffectManager.tickEffectStep(this);

		if (this.disableManager.hasDisable(DISABLE.STUN)) {
			this.disableManager.decreaseDurations();
			return;
		}

		this.disableManager.decreaseDurations();

		this.abilities.forEach(ability => {
			ability.step();

			if (ability.canActivate()) {
				const event = ability.use(this);

				if (event) {
					this.stepEvents.push(event);

					if (this.statusEffectManager.hasStatusEffect(STATUS_EFFECT.MULTISTRIKE)) {
						const multistrikeQuantity = (
							this.statusEffects.find(
								statusEffect => statusEffect.name === STATUS_EFFECT.MULTISTRIKE,
							) as ActiveStatusEffect
						).quantity;

						const eventWithMultistrike = ability.use(this, true);

						for (let i = 0; i < multistrikeQuantity; i++) {
							this.stepEvents.push(eventWithMultistrike);
						}
					}
				}
			}
		});
	}

	applyEffect(effect: PossibleEffect) {
		if (effect.type === INSTANT_EFFECT_TYPE.DAMAGE) {
			this.receiveDamage(effect.payload.value);
		} else if (effect.type === INSTANT_EFFECT_TYPE.HEAL) {
			this.receiveHeal(effect.payload.value);
		} else if (effect.type === INSTANT_EFFECT_TYPE.SHIELD) {
			this.receiveShield(effect.payload.value);
		} else if (effect.type === INSTANT_EFFECT_TYPE.STATUS_EFFECT) {
			effect.payload.forEach(statusEffect => {
				if (statusEffect.quantity > 0) {
					this.statusEffectManager.applyStatusEffect(statusEffect);
				} else {
					this.statusEffectManager.removeStacks(statusEffect.name, statusEffect.quantity * -1);
				}
			});

			this.statsManager.recalculateStatsFromStatusEffects(this.statusEffects);
			this.abilityManager.applyCooldownModifierFromStats(this.stats);
		} else if (effect.type === INSTANT_EFFECT_TYPE.DISABLE) {
			effect.payload.forEach(disable => {
				this.disableManager.applyDisable(disable);
			});
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
			perks: this.perks,
			position: this.position,
			statusEffects: [...this.statusEffects],
		};
	}

	// not being used
	/* serializeUnitInfo(): BoardUnitInstance {
		return {
			id: this.id,
			className: `${this.classManager?.class?.data?.name}`,
			equipment: this.equipmentManager.serializeEquips(),
			position: this.position,
		};
	} */

	serializeEvents() {
		const events = [...this.stepEvents];
		this.stepEvents = [];
		return events;
	}
}
