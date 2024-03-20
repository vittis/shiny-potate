import Phaser from "phaser";
import { StepEvent } from "../BattleScene";
import { createShadow, getUnitPos, setupUnitPointerEvents } from "./BattleUnitSetup";
import {
	createAttackAnimation,
	createDeathAnimation,
	createTriggerEffectAnimation,
	createWiggleAnimation,
} from "./BattleUnitAnimations";
import { BattleUnitSprite } from "./BattleUnitSprite";
import { Ability, BattleUnitAbilities } from "./BattleUnitAbilities";
import { BattleUnitStatusEffects } from "./BattleUnitStatusEffects";
import { BattleUnitBars } from "./BattleUnitBars";
import { addFadingText } from "../utils/text";
import { BattleUnitDisables } from "./BattleUnitDisables";

export class BattleUnit extends Phaser.GameObjects.Container {
	public id: string;
	public battleUnitSprite!: BattleUnitSprite;
	public sprite!: Phaser.GameObjects.Image;
	public boardPosition: number;
	public owner: number;

	public stats: any;
	public equipment: any;
	public unitName: string;

	public dataUnit: any;

	public isSelected = false;
	public spBarTween!: Phaser.Tweens.Tween;

	public abilitiesManager: BattleUnitAbilities;
	public statusEffectsManager: BattleUnitStatusEffects;
	public disablesManager: BattleUnitDisables;
	public barsManager: BattleUnitBars;

	public isDead = false;
	public startingX;
	public startingY: number;
	public currentAnimation!: Phaser.Tweens.TweenChain | Phaser.Tweens.Tween;

	public glow: Phaser.FX.Glow | undefined;

	constructor(scene: Phaser.Scene, dataUnit: any) {
		const { x, y } = getUnitPos(dataUnit.position, dataUnit.owner, scene["tiles"]);

		super(scene, x, y);

		this.startingX = x;
		this.startingY = y;
		this.setDepth(1);
		this.id = dataUnit.id;
		this.boardPosition = dataUnit.position;
		this.dataUnit = dataUnit;
		this.unitName = dataUnit.name;
		this.stats = dataUnit.stats;
		// this.equipment = dataUnit.equipment;
		this.owner = dataUnit.owner;

		this.battleUnitSprite = new BattleUnitSprite(scene, x, y, dataUnit);
		this.sprite = scene.add.image(0, 0, this.battleUnitSprite.textureName);
		if (dataUnit.owner === 0) {
			this.sprite.flipX = true;
		}
		this.sprite.setScale(0.79);

		createShadow(this, scene);
		this.add(this.sprite);

		setupUnitPointerEvents(this);

		this.glow = this.sprite.preFX?.addGlow(0xeeee00, 4);
		this.glow?.setActive(false);

		createWiggleAnimation(this);

		this.barsManager = new BattleUnitBars(this, scene, dataUnit);
		this.add(this.barsManager);

		this.abilitiesManager = new BattleUnitAbilities(this, scene, dataUnit);
		this.add(this.abilitiesManager);

		this.statusEffectsManager = new BattleUnitStatusEffects(scene, dataUnit);
		this.add(this.statusEffectsManager);

		this.disablesManager = new BattleUnitDisables(this, scene, dataUnit);
		this.add(this.disablesManager);

		scene.add.existing(this);
	}

	public onSelected() {
		this.isSelected = true;
		this.glow?.setActive(true);
	}

	public onDeselected() {
		this.isSelected = false;
		this.glow?.setActive(false);
	}

	public playEvent({
		event,
		targets,
		onEnd,
		onStart,
		allUnits,
		step,
	}: {
		event: StepEvent;
		targets?: BattleUnit[];
		onEnd?: Function;
		onAttack?: Function;
		onStart?: Function;
		allUnits?: BattleUnit[];
		step?: number;
	}) {
		// console.log("playing ", event.type, event.trigger);

		if (event.type === "FAINT") {
			const onFinishAnimation = () => {
				this.setVisible(false);
				this.isDead = true;
				if (onEnd) onEnd();
			};

			const { deathTween } = createDeathAnimation({
				unit: this,
				onFinishAnimation,
			});

			this.currentAnimation = deathTween;
		}
		if (event.type === "TRIGGER_EFFECT") {
			if (!targets) {
				throw new Error("Trigger Effect target is undefined");
			}

			const onImpactPoint = () => {
				const receiveDamageEvents =
					(event.subEvents?.filter(
						e => e.type === "INSTANT_EFFECT" && e.payload.type === "DAMAGE",
					) as StepEvent[]) || [];

				receiveDamageEvents &&
					receiveDamageEvents.forEach(damageSubEvent => {
						const targetId = damageSubEvent.payload.targetId as string;

						const target = allUnits?.find(unit => unit.id === targetId);
						if (!target) {
							throw Error(
								`Trying to apply damage on TRIGGER_EFFECT: Couldn't find target with id: ${targetId}`,
							);
						}

						target.playEvent({ event: damageSubEvent, step });
					});

				const statusEffectEvents =
					(event.subEvents?.filter(
						e => e.type === "INSTANT_EFFECT" && e.payload.type === "STATUS_EFFECT",
					) as StepEvent[]) || [];

				statusEffectEvents &&
					statusEffectEvents.forEach(statusEffectSubEvent => {
						const targetId = statusEffectSubEvent.payload.targetId as string;

						const target = allUnits?.find(unit => unit.id === targetId);
						if (!target) {
							throw Error(
								`Trying to apply status effect on TRIGGER_EFFECT: Couldn't find target with id: ${targetId}`,
							);
						}
						target.playEvent({ event: statusEffectSubEvent, step });
					});

				const disableEvents =
					(event.subEvents?.filter(
						e => e.type === "INSTANT_EFFECT" && e.payload.type === "DISABLE",
					) as StepEvent[]) || [];

				disableEvents &&
					disableEvents.forEach(disableSubEvent => {
						const targetId = disableSubEvent.payload.targetId as string;

						const target = allUnits?.find(unit => unit.id === targetId);
						if (!target) {
							throw Error(
								`Trying to apply disable on TRIGGER_EFFECT: Couldn't find target with id: ${targetId}`,
							);
						}
						target.playEvent({ event: disableSubEvent, step });
					});

				const shieldEvents =
					(event.subEvents?.filter(
						e => e.type === "INSTANT_EFFECT" && e.payload.type === "SHIELD",
					) as StepEvent[]) || [];

				shieldEvents &&
					shieldEvents.forEach(shieldSubEvent => {
						const targetId = shieldSubEvent.payload.targetId as string;

						const target = allUnits?.find(unit => unit.id === targetId);
						if (!target) {
							throw Error(
								`Trying to apply shield on TRIGGER_EFFECT: Couldn't find target with id: ${targetId}`,
							);
						}
						target.playEvent({ event: shieldSubEvent, step });
					});

				const healEvents =
					(event.subEvents?.filter(
						e => e.type === "INSTANT_EFFECT" && e.payload.type === "HEAL",
					) as StepEvent[]) || [];

				healEvents &&
					healEvents.forEach(healEvent => {
						const targetId = healEvent.payload.targetId as string;

						const target = allUnits?.find(unit => unit.id === targetId);
						if (!target) {
							throw Error(
								`Trying to apply heal on TRIGGER_EFFECT: Couldn't find target with id: ${targetId}`,
							);
						}
						target.playEvent({ event: healEvent, step });
					});
			};

			const onFinishAnimation = () => {
				if (onEnd) onEnd();
			};

			// TODO set animationTarget based on target type
			const animationTarget = targets?.[0];

			const allSources = event.subEvents?.map(subEvent => subEvent.sourceId) || [];

			const allSourceNames = allSources.map(sourceId => {
				const source = this.dataUnit.perks.find(perk => perk.id === sourceId);
				return source?.data?.name;
			});

			const { triggerEffectTweenChain } = createTriggerEffectAnimation({
				unit: this,
				target: animationTarget,
				trigger: event?.trigger || "",
				onImpactPoint,
				onFinishAnimation,
				allSourceNames,
			});

			this.currentAnimation = triggerEffectTweenChain;
		}

		if (event.type === "USE_ABILITY") {
			this.add(addFadingText(this.scene, 0, -50, { text: event.payload.name }));

			const abilityUsed = this.abilitiesManager.abilities.find(
				ability => ability.id === event.payload.id,
			) as Ability;

			if (targets === undefined || targets?.length === 0) {
				throw new Error("Ability target is undefined");
			}

			const onStartAnimation = () => {
				if (onStart) onStart();
			};

			const onFinishAnimation = () => {
				abilityUsed?.overlay?.setAlpha(0.6);
				if (onEnd) onEnd();
			};

			const onImpactPoint = () => {
				const receiveDamageEvents =
					(event.payload?.subEvents?.filter(
						e => e.type === "INSTANT_EFFECT" && e.payload.type === "DAMAGE",
					) as StepEvent[]) || [];

				receiveDamageEvents &&
					receiveDamageEvents.forEach(damageSubEvent => {
						const targetId = damageSubEvent.payload.targetId as string;

						const target = allUnits?.find(unit => unit.id === targetId);
						if (!target) {
							throw Error(
								`Trying to apply damage on USE_ABILITY: Couldn't find target with id: ${targetId}`,
							);
						}

						target.playEvent({ event: damageSubEvent, step });
					});

				const statusEffectEvents =
					(event.payload?.subEvents?.filter(
						e => e.type === "INSTANT_EFFECT" && e.payload.type === "STATUS_EFFECT",
					) as StepEvent[]) || [];

				statusEffectEvents &&
					statusEffectEvents.forEach(statusEffectSubEvent => {
						const targetId = statusEffectSubEvent.payload.targetId as string;

						const target = allUnits?.find(unit => unit.id === targetId);
						if (!target) {
							throw Error(
								`Trying to apply status effect on USE_ABILITY: Couldn't find target with id: ${targetId}`,
							);
						}
						target.playEvent({ event: statusEffectSubEvent, step });
					});

				const disableEvents =
					(event.payload?.subEvents?.filter(
						e => e.type === "INSTANT_EFFECT" && e.payload.type === "DISABLE",
					) as StepEvent[]) || [];

				disableEvents &&
					disableEvents.forEach(disableSubEvent => {
						const targetId = disableSubEvent.payload.targetId as string;

						const target = allUnits?.find(unit => unit.id === targetId);
						if (!target) {
							throw Error(
								`Trying to apply disable on USE_ABILITY: Couldn't find target with id: ${targetId}`,
							);
						}
						target.playEvent({ event: disableSubEvent, step });
					});

				const shieldEvents =
					(event.payload?.subEvents?.filter(
						e => e.type === "INSTANT_EFFECT" && e.payload.type === "SHIELD",
					) as StepEvent[]) || [];

				shieldEvents &&
					shieldEvents.forEach(shieldSubEvent => {
						const targetId = shieldSubEvent.payload.targetId as string;

						const target = allUnits?.find(unit => unit.id === targetId);
						if (!target) {
							throw Error(
								`Trying to apply shield on USE_ABILITY: Couldn't find target with id: ${targetId}`,
							);
						}
						target.playEvent({ event: shieldSubEvent, step });
					});

				const healEvents =
					(event.payload?.subEvents?.filter(
						e => e.type === "INSTANT_EFFECT" && e.payload.type === "HEAL",
					) as StepEvent[]) || [];

				healEvents &&
					healEvents.forEach(healEvent => {
						const targetId = healEvent.payload.targetId as string;

						const target = allUnits?.find(unit => unit.id === targetId);
						if (!target) {
							throw Error(
								`Trying to apply heal on USE_ABILITY: Couldn't find target with id: ${targetId}`,
							);
						}
						target.playEvent({ event: healEvent, step });
					});
			};

			// TODO set mainTarget based on target type
			const mainTarget = targets?.[0];

			onStartAnimation();
			const { attackTweenChain } = createAttackAnimation({
				unit: this,
				mainTarget,
				targets,
				onImpactPoint,
				onFinishAnimation,
			});

			this.currentAnimation = attackTweenChain;
		}

		if (event.type === "INSTANT_EFFECT" && event.payload.type === "DAMAGE") {
			this.barsManager.onReceiveDamage(event.payload.payload.value);
		}

		if (event.type === "INSTANT_EFFECT" && event.payload.type === "STATUS_EFFECT") {
			event.payload.payload.forEach(statusEffect => {
				if (statusEffect.quantity < 0) {
					this.statusEffectsManager.removeStatusEffect({
						name: statusEffect.name,
						quantity: statusEffect.quantity * -1,
					});
				} else {
					this.statusEffectsManager.addStatusEffect({
						name: statusEffect.name,
						quantity: statusEffect.quantity,
					});
				}
			});
		}

		if (event.type === "INSTANT_EFFECT" && event.payload.type === "DISABLE") {
			event.payload.payload.forEach(disable => {
				this.disablesManager.addDisable(disable, step as number);
			});
		}

		if (event.type === "INSTANT_EFFECT" && event.payload.type === "SHIELD") {
			this.barsManager.onReceiveShield(event.payload.payload.value);
		}

		if (event.type === "INSTANT_EFFECT" && event.payload.type === "HEAL") {
			this.barsManager.onReceiveHeal(event.payload.payload.value);
		}

		if (event.type === "TICK_EFFECT") {
			const { payload } = event;
			if (payload.type === "POISON") this.barsManager.onReceiveDamage(payload.payload.value);
			if (payload.type === "REGEN") this.barsManager.onReceiveHeal(payload.payload.value);

			this.statusEffectsManager.removeStatusEffect({
				name: payload.type,
				quantity: payload.payload.decrement,
			});

			if (onEnd) onEnd();
		}
	}

	public onStart() {
		this.abilitiesManager.createAbilityOverlayTween();
	}

	public resumeAnimations() {
		if (this.currentAnimation?.isPaused()) {
			this.currentAnimation.resume();
		}
	}
	public pauseAnimations() {
		if (this.currentAnimation?.isPlaying()) {
			this.currentAnimation.pause();
		}
	}
}
