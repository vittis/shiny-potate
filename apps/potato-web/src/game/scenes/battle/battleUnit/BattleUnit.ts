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
import { INSTANT_EFFECT_TYPE, PossibleEffect } from "game-logic";

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

	public applyEffect(effect: PossibleEffect) {
		if (effect.type === INSTANT_EFFECT_TYPE.DAMAGE) {
			this.barsManager.onReceiveDamage(effect.payload.value);
		}
		if (effect.type === INSTANT_EFFECT_TYPE.STATUS_EFFECT) {
			effect.payload.forEach(statusEffect => {
				this.statusEffectsManager.addStatusEffect({
					name: statusEffect.name,
					quantity: statusEffect.quantity,
				});
			});
		}
		if (effect.type === INSTANT_EFFECT_TYPE.DISABLE) {
			// this.disablesManager.addDisable(effect.payload, 0);
		}
		if (effect.type === INSTANT_EFFECT_TYPE.SHIELD) {
			// this.barsManager.onReceiveShield(effect.payload.value);
		}
		if (effect.type === INSTANT_EFFECT_TYPE.HEAL) {
			//  this.barsManager.onReceiveHeal(effect.payload.value);
		}
	}

	public playEvent({
		board,
		event,
		targets,
		onEnd,
		onStart,
		onImpact,
		allUnits,
		step,
	}: {
		board: any;
		event: any;
		targets?: BattleUnit[];
		onEnd?: Function;
		onAttack?: Function;
		onStart?: Function;
		onImpact?: Function;
		allUnits?: BattleUnit[];
		step?: number;
	}) {
		// console.log("playing ", event.type, event.trigger);
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
				if (onImpact) {
					onImpact();
				}

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

						target.add(
							addFadingText(this.scene, 0, -50, {
								text: `-${damageSubEvent.payload.payload.value}`,
								color: "red",
								duration: 1800,
								fontSize: 38,
							}),
						);
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
						// todo text
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
						// todo text
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
				abilityUsed?.overlay?.setAlpha(0.7);
				if (onEnd) onEnd();
			};

			const onImpactPoint = ({ onVFXEnd }) => {
				if (onImpact) {
					onImpact();
				}
				const slash = this.scene.add.sprite(targets?.[0].x, targets?.[0].y, "slash2");
				board.add(slash);
				slash.setScale(2.6, 3.5);
				slash.flipX = this.owner !== 0;
				slash.play("slash2_attack").on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
					slash.destroy();
					//resume
					if (onVFXEnd) {
						onVFXEnd();
					}
				});

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

						target.add(
							addFadingText(this.scene, 0, -50, {
								text: `-${damageSubEvent.payload.payload.value}`,
								color: "red",
								duration: 1800,
								fontSize: 38,
							}),
						);
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
						// todo text
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
						// todo text
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
