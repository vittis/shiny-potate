import { useGameControlsStore } from "@/services/features/Game/useGameControlsStore";
import { BattleUnit } from "./BattleUnit";
import { addFadingText } from "../utils/text";

export function createWiggleAnimation(unit: BattleUnit) {
	const animationSpeed = useGameControlsStore.getState().animationSpeed;

	const fx = unit.sprite.preFX?.addDisplacement("distort", 0);
	unit.scene.tweens.add({
		targets: fx,
		x: { from: -0.004, to: 0.004 },
		y: { from: -0.011, to: 0.011 },
		yoyo: true,
		loop: -1,
		duration: Phaser.Math.Between(500, 700) * animationSpeed,
		ease: Phaser.Math.Easing.Sine.InOut,
	});
}

export function createDeathAnimation({
	unit,
	onFinishAnimation,
}: {
	unit: BattleUnit;
	onFinishAnimation: Function;
}) {
	const animationSpeed = useGameControlsStore.getState().animationSpeed;

	const deathTween = unit.scene.tweens.add({
		targets: unit.sprite,
		alpha: 0,
		scaleX: 0,
		scaleY: 0,
		angle: 180,
		duration: 1200 * animationSpeed,
		delay: 10 * animationSpeed,
		ease: "Sine.easeInOut",
		onComplete: () => {
			unit.scene.time.delayedCall(10 * animationSpeed, onFinishAnimation);
		},
	});

	return { deathTween };
}

export function createAttackAnimation({
	unit,
	mainTarget,
	targets,
	onImpactPoint,
	onFinishAnimation,
}: {
	unit: BattleUnit;
	mainTarget: BattleUnit;
	targets: BattleUnit[];
	onImpactPoint: Function;
	onFinishAnimation: Function;
}) {
	const animationSpeed = useGameControlsStore.getState().animationSpeed;

	// const unitGlowFx = unit.sprite.preFX?.addGlow(0xeeee00, 2);

	//const targetGlowFx = target.sprite.preFX?.addGlow(0xff0000, 0);

	/* const targetsGlowFx = targets.map(target => {
		return target.sprite.preFX?.addGlow(0xff0000, 0);
	}); */

	/* unit.scene.tweens.add({
		targets: targetsGlowFx,
		outerStrength: 2,
		duration: 260 * animationSpeed,
	}); */

	const RUN_DISTANCE = unit.owner === 0 ? 70 : -70;
	const DISTANCE_TO_ENEMY = unit.owner === 0 ? 80 : -80;
	const PUSHBACK_DISTANCE = unit.owner === 0 ? 25 : -25;

	const attackTweenChain = unit.scene.tweens.chain({
		delay: 200 * animationSpeed,
		targets: unit,
		onComplete: () => {
			onFinishAnimation();
		},
		completeDelay: 150 * animationSpeed,
		tweens: [
			{
				delay: 20 * animationSpeed,
				x: unit.x + PUSHBACK_DISTANCE,
				duration: 120 * animationSpeed,
				yoyo: true,
				ease: Phaser.Math.Easing.Cubic.In,
				onYoyo: () => {
					targets?.[0]?.sprite?.setTintFill(0xffffff);
					unit.scene.time.delayedCall(50, () => {
						targets?.[0]?.sprite?.clearTint();
					});

					// particle burst

					// attackTweenChain.pause();
					onImpactPoint({
						onVFXEnd: () => {
							/* targetsGlowFx.forEach(glowFx => {
								unit.scene.tweens.add({
									targets: targetsGlowFx,
									outerStrength: 0,
									duration: 260 * animationSpeed,
									onComplete: () => {
										glowFx?.destroy();
									},
								});
							}); */
							// attackTweenChain.resume();
						},
					});
				},
			},
		],
	});

	return { attackTweenChain };
}

export function createTriggerEffectAnimation({
	unit,
	target,
	trigger,
	onImpactPoint,
	onFinishAnimation,
	allSourceNames,
}: {
	unit: BattleUnit;
	target: BattleUnit;
	trigger: string;
	onImpactPoint: Function;
	onFinishAnimation: Function;
	allSourceNames: string[];
}) {
	const animationSpeed = useGameControlsStore.getState().animationSpeed;

	const targetGlowFx = target.sprite.preFX?.addGlow(0x10ab8c, 0);
	unit.scene.tweens.add({
		targets: targetGlowFx,
		outerStrength: 2,
		duration: 150 * animationSpeed,
	});

	const triggerEffectTweenChain = unit.scene.tweens.chain({
		delay: 200 * animationSpeed,
		targets: unit,
		onComplete: () => {
			onFinishAnimation();
		},
		completeDelay: 150 * animationSpeed,
		tweens: [
			// pulinho
			{
				targets: unit.sprite,
				y: unit.sprite.y - 38,
				duration: 225 * animationSpeed,
				yoyo: true,
				ease: Phaser.Math.Easing.Bounce.InOut,
				onYoyo: () => {
					onImpactPoint();

					/* const triggerText = unit.scene.add.text(0, -30, trigger.replace(/_/g, " "), {
						fontSize: 28,
						color: "#10AB8C",
						fontFamily: "IM Fell DW Pica",
						stroke: "#000000",
						strokeThickness: 2,
						fontStyle: "bold",
						shadow: {
							offsetX: 0,
							offsetY: 3,
							color: "#000",
							blur: 0,
							stroke: true,
							fill: false,
						},
					});
					triggerText.setOrigin(0.5);
					// damage text going up
					unit.scene.tweens.add({
						targets: triggerText,
						x: Phaser.Math.Between(-15, 15),
						y: triggerText.y - 38 - Phaser.Math.Between(0, 10),
						alpha: 0,
						duration: 1200,
						ease: "Linear",
						onComplete: () => {
							triggerText.destroy();
						},
					}); */

					allSourceNames.forEach(sourceName => {
						unit.add(
							addFadingText(
								unit.scene,
								Phaser.Math.Between(-50, 0),
								Phaser.Math.Between(-75, -50),
								{
									text: sourceName,
									color: "orange",
									fontSize: 22,
									duration: 2000,
								},
							),
						);
					});
				},
				onComplete: () => {
					targetGlowFx?.destroy();
				},
			},
		],
	});

	return { triggerEffectTweenChain };
}

export function createHealingWordAnimation({
	unit,
	onImpactPoint,
	onFinishAnimation,
}: {
	unit: BattleUnit;
	onImpactPoint: Function;
	onFinishAnimation: Function;
}) {
	const animationSpeed = useGameControlsStore.getState().animationSpeed;

	const healingWordTween = unit.scene.tweens.chain({
		delay: 50 * animationSpeed,
		targets: unit,
		onComplete: () => {
			onFinishAnimation();
		},
		completeDelay: 150 * animationSpeed,
		tweens: [
			// pulinho
			{
				onStart: () => {
					unit.sprite.setTint(0x00ee00);
				},
				targets: unit.sprite,
				y: unit.sprite.y - 14,
				duration: 100 * animationSpeed,
				yoyo: true,
				repeat: 2,
				completeDelay: 70 * animationSpeed,
				ease: Phaser.Math.Easing.Bounce.InOut,
				onComplete: () => {
					unit.sprite.clearTint();

					onImpactPoint();
				},
			},
		],
	});

	return { healingWordTween };
}
export function createPowershotAnimation({
	unit,
	target,
	onImpactPoint,
	onFinishAnimation,
}: {
	unit: BattleUnit;
	target: BattleUnit;
	onImpactPoint: Function;
	onFinishAnimation: Function;
}) {
	const animationSpeed = useGameControlsStore.getState().animationSpeed;

	const RUN_DISTANCE = unit.owner === 0 ? 70 : -70;
	const DISTANCE_TO_ENEMY = unit.owner === 0 ? 80 : -80;
	const PUSHBACK_DISTANCE = unit.owner === 0 ? 45 : -45;

	const powershotAnimation = unit.scene.tweens.chain({
		delay: 45 * animationSpeed,
		targets: unit,
		onComplete: () => {
			onFinishAnimation();
		},
		completeDelay: 150 * animationSpeed,
		tweens: [
			// pulinho
			{
				targets: unit.sprite,
				y: unit.sprite.y - 38,
				duration: 125 * animationSpeed,
				yoyo: true,
				onYoyo: () => {
					unit.sprite.setTint(0x054f57);
				},
				ease: Phaser.Math.Easing.Bounce.InOut,
			},
			// corridinha indo
			{
				delay: 50 * animationSpeed,
				alpha: 0,
				x: unit.x + RUN_DISTANCE,
				duration: 200 * animationSpeed,
				onStart: () => {
					// start bouncing
					unit.scene.tweens.add({
						targets: unit.sprite,
						y: unit.sprite.y - 3,
						duration: (100 / 2) * animationSpeed,
						yoyo: true,
						repeat: 1,
						ease: Phaser.Math.Easing.Bounce.InOut,
					});
				},
			},
			// corridinha chegando
			{
				delay: 100 * animationSpeed,
				alpha: 1,
				x: {
					from: target.startingX - (DISTANCE_TO_ENEMY + RUN_DISTANCE),
					to: target.startingX - DISTANCE_TO_ENEMY,
				},
				y: { from: target.startingY, to: target.startingY },
				duration: 200 * animationSpeed,
				onStart: () => {
					// start bouncing
					unit.scene.tweens.add({
						targets: unit.sprite,
						y: unit.sprite.y - 2,
						duration: (100 / 2) * animationSpeed,
						yoyo: true,
						repeat: 1,
						ease: Phaser.Math.Easing.Bounce.InOut,
					});
				},
			},
			// attack (pushback)
			{
				delay: 200 * animationSpeed,
				x: target.startingX - PUSHBACK_DISTANCE,
				duration: 125 * animationSpeed,
				yoyo: true,
				ease: Phaser.Math.Easing.Bounce.InOut,
				onYoyo: () => {
					onImpactPoint();

					unit.sprite.clearTint();

					// particle burst
					const angle = target.owner === 0 ? { min: 140, max: 220 } : { min: -40, max: 40 };
					const xOffset = target.owner === 0 ? -12 : 12;
					const rect = new Phaser.Geom.Line(xOffset, -20, xOffset, 40);
					const emitter = unit.scene.add.particles(xOffset, 15, "square", {
						angle: angle,
						speed: { min: 200, max: 200 },
						frequency: 40,
						color: [0xde3c45],
						emitZone: { type: "random", source: rect, quantity: 10 },
						duration: 100 * animationSpeed,
						quantity: 7,
						lifespan: 400,
						alpha: { start: 1, end: 0 },
						scale: 0.7,
					});
					// todo: better way to positionate emitter without using .add
					target.add(emitter);
					// target.bringToTop(target.sprite);

					// receive damage pushback
					target.sprite.setTint(0xde3c45);
					target.scene.tweens.add({
						targets: target,
						x: target.owner === 0 ? target.x - 4 : target.x + 4,
						duration: 150 * animationSpeed,
						yoyo: true,
						ease: Phaser.Math.Easing.Bounce.InOut,
						onComplete: () => {
							target.sprite.clearTint();
							unit.sprite.setFlipX(unit.owner === 0 ? false : true);
						},
					});
				},
			},
			// corridinha vazando
			{
				delay: 100 * animationSpeed,
				alpha: 0,
				x: {
					from: target.startingX - DISTANCE_TO_ENEMY,
					to: target.startingX - (DISTANCE_TO_ENEMY + RUN_DISTANCE),
				},
				y: { from: target.startingY, to: target.startingY },
				duration: 200 * animationSpeed,
				onStart: () => {
					// start bouncing
					unit.scene.tweens.add({
						targets: unit.sprite,
						y: unit.sprite.y - 2,
						duration: (100 / 2) * animationSpeed,
						yoyo: true,
						repeat: 1,
						ease: Phaser.Math.Easing.Bounce.InOut,
					});
				},
			},
			// corridinha chegando
			{
				alpha: 1,
				x: { from: unit.startingX + RUN_DISTANCE, to: unit.startingX },
				y: { from: unit.startingY, to: unit.startingY },
				duration: 200 * animationSpeed,
				onComplete: () => {
					unit.sprite.setFlipX(unit.owner === 1 ? false : true);
				},
				onStart: () => {
					// start bouncing
					unit.scene.tweens.add({
						targets: unit.sprite,
						y: unit.sprite.y - 3,
						duration: (100 / 2) * animationSpeed,
						yoyo: true,
						repeat: 1,
						ease: Phaser.Math.Easing.Bounce.InOut,
					});
				},
			},
		],
	});

	return { powershotAnimation };
}
export function createHeadCrushAnimation({
	unit,
	target,
	onImpactPoint,
	onFinishAnimation,
}: {
	unit: BattleUnit;
	target: BattleUnit;
	onImpactPoint: Function;
	onFinishAnimation: Function;
}) {
	const animationSpeed = useGameControlsStore.getState().animationSpeed;

	const RUN_DISTANCE = unit.owner === 0 ? 70 : -70;
	const DISTANCE_TO_ENEMY = unit.owner === 0 ? 80 : -80;
	const PUSHBACK_DISTANCE = unit.owner === 0 ? 45 : -45;

	const headCrushAnimation = unit.scene.tweens.chain({
		delay: 45 * animationSpeed,
		targets: unit,
		onComplete: () => {
			onFinishAnimation();
		},
		completeDelay: 150 * animationSpeed,
		tweens: [
			// pulinho
			{
				targets: unit.sprite,
				y: unit.sprite.y - 38,
				duration: 125 * animationSpeed,
				yoyo: true,
				onYoyo: () => {
					unit.sprite.setTint(0x054f57);
				},
				ease: Phaser.Math.Easing.Bounce.InOut,
			},
			// corridinha indo
			{
				delay: 50 * animationSpeed,
				alpha: 0,
				x: unit.x + RUN_DISTANCE,
				duration: 200 * animationSpeed,
				onStart: () => {
					// start bouncing
					unit.scene.tweens.add({
						targets: unit.sprite,
						y: unit.sprite.y - 3,
						duration: (100 / 2) * animationSpeed,
						yoyo: true,
						repeat: 1,
						ease: Phaser.Math.Easing.Bounce.InOut,
					});
				},
			},
			// corridinha chegando
			{
				delay: 100 * animationSpeed,
				alpha: 1,
				x: {
					from: target.startingX - (DISTANCE_TO_ENEMY + RUN_DISTANCE),
					to: target.startingX - DISTANCE_TO_ENEMY,
				},
				y: { from: target.startingY, to: target.startingY },
				duration: 200 * animationSpeed,
				onStart: () => {
					// start bouncing
					unit.scene.tweens.add({
						targets: unit.sprite,
						y: unit.sprite.y - 2,
						duration: (100 / 2) * animationSpeed,
						yoyo: true,
						repeat: 1,
						ease: Phaser.Math.Easing.Bounce.InOut,
					});
				},
			},
			// attack (pushback)
			{
				delay: 200 * animationSpeed,
				x: target.startingX - PUSHBACK_DISTANCE,
				duration: 125 * animationSpeed,
				yoyo: true,
				ease: Phaser.Math.Easing.Bounce.InOut,
				onYoyo: () => {
					onImpactPoint();

					unit.sprite.clearTint();

					// particle burst
					const angle = target.owner === 0 ? { min: 140, max: 220 } : { min: -40, max: 40 };
					const xOffset = target.owner === 0 ? -12 : 12;
					const rect = new Phaser.Geom.Line(xOffset, -20, xOffset, 40);
					const emitter = unit.scene.add.particles(xOffset, 15, "square", {
						angle: angle,
						speed: { min: 200, max: 200 },
						frequency: 40,
						color: [0xde3c45],
						emitZone: { type: "random", source: rect, quantity: 10 },
						duration: 100 * animationSpeed,
						quantity: 7,
						lifespan: 400,
						alpha: { start: 1, end: 0 },
						scale: 0.7,
					});
					// todo: better way to positionate emitter without using .add
					target.add(emitter);
					// target.bringToTop(target.sprite);

					// receive damage pushback
					target.sprite.setTint(0xde3c45);
					target.scene.tweens.add({
						targets: target,
						x: target.owner === 0 ? target.x - 4 : target.x + 4,
						duration: 150 * animationSpeed,
						yoyo: true,
						ease: Phaser.Math.Easing.Bounce.InOut,
						onComplete: () => {
							target.sprite.clearTint();
							unit.sprite.setFlipX(unit.owner === 0 ? false : true);
						},
					});
				},
			},
			// corridinha vazando
			{
				delay: 100 * animationSpeed,
				alpha: 0,
				x: {
					from: target.startingX - DISTANCE_TO_ENEMY,
					to: target.startingX - (DISTANCE_TO_ENEMY + RUN_DISTANCE),
				},
				y: { from: target.startingY, to: target.startingY },
				duration: 200 * animationSpeed,
				onStart: () => {
					// start bouncing
					unit.scene.tweens.add({
						targets: unit.sprite,
						y: unit.sprite.y - 2,
						duration: (100 / 2) * animationSpeed,
						yoyo: true,
						repeat: 1,
						ease: Phaser.Math.Easing.Bounce.InOut,
					});
				},
			},
			// corridinha chegando
			{
				alpha: 1,
				x: { from: unit.startingX + RUN_DISTANCE, to: unit.startingX },
				y: { from: unit.startingY, to: unit.startingY },
				duration: 200 * animationSpeed,
				onComplete: () => {
					unit.sprite.setFlipX(unit.owner === 1 ? false : true);
				},
				onStart: () => {
					// start bouncing
					unit.scene.tweens.add({
						targets: unit.sprite,
						y: unit.sprite.y - 3,
						duration: (100 / 2) * animationSpeed,
						yoyo: true,
						repeat: 1,
						ease: Phaser.Math.Easing.Bounce.InOut,
					});
				},
			},
		],
	});

	return { headCrushAnimation };
}
