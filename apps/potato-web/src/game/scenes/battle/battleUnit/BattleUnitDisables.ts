import { useGameControlsStore } from "@/services/features/Game/useGameControlsStore";
import { Ability } from "./BattleUnitAbilities";
import { BattleUnit } from "./BattleUnit";

interface Disable {
	name: string; // TODO maybe use enum?
	duration: number;
	step: number; // TODO better way of controlling disable duration
	container: Phaser.GameObjects.Container;
	icon: Phaser.GameObjects.Image;
	overlay: Phaser.GameObjects.Image;
	tween: Phaser.Tweens.Tween;
	text: Phaser.GameObjects.Text;
}

const SHOW_TEXT = false;

export class BattleUnitDisables extends Phaser.GameObjects.Container {
	public disables: Disable[] = [];

	public battleUnit: BattleUnit;
	public dataUnit: any;

	constructor(battleUnit: BattleUnit, scene: Phaser.Scene, dataUnit: any) {
		super(scene);

		this.battleUnit = battleUnit;
		this.dataUnit = dataUnit;
	}

	addDisable({ name, duration }: any, step: number) {
		const disableAlreadyExists = this.disables.find(disable => disable.name === name);

		if (disableAlreadyExists) {
			const newDuration =
				disableAlreadyExists.duration > duration ? disableAlreadyExists.duration : duration;
			disableAlreadyExists.duration = newDuration;
			disableAlreadyExists.text.setText(`${newDuration}`);

			if (newDuration > duration) {
				disableAlreadyExists.tween = this.scene.tweens.add({
					targets: disableAlreadyExists.overlay,
					scaleY: { from: 1, to: 0 },
					duration: useGameControlsStore.getState().stepTime * duration,
					ease: "Linear",
					repeat: -1,
				});
			}
			return;
		}

		const disableContainer = this.scene.add.container(this.dataUnit.owner === 0 ? -35 : 33, -30);

		const disableImage = this.scene.add.image(
			0,
			0,
			"disable_" + name.toLowerCase().replace(/\s/g, "_"),
		);

		disableImage.setRotation(-Math.PI / 4);

		if (this.dataUnit.owner === 0) {
			disableImage.flipX = true;
			disableImage.setRotation(Math.PI / 4);
		}

		disableImage.scale = 0.12;

		disableContainer.add(disableImage);

		const disableText = this.scene.add.text(this.dataUnit.owner === 0 ? -22 : 6, -25, duration, {
			fontSize: "16px",
			color: "#D7D5D1",
			fontFamily: "IM Fell DW Pica",
			stroke: "#000000",
			strokeThickness: 2,
			fontStyle: "bold",
			shadow: {
				offsetX: 0,
				offsetY: 1,
				color: "#000",
				blur: 0,
				stroke: true,
			},
		});

		disableContainer.add(disableText);

		this.add(disableContainer);

		if (!SHOW_TEXT) disableText.alpha = 0;

		const overlay = this.scene.add.image(0, 0, "disable_" + name.toLowerCase().replace(/\s/g, "_"));

		overlay.setRotation(-Math.PI / 4);

		if (this.dataUnit.owner === 0) {
			overlay.flipX = true;
			overlay.setRotation(Math.PI / 4);
		}

		overlay.scale = 0.12;
		overlay.setTint(0x000000).setAlpha(0.7);

		disableContainer.add(overlay);

		const initialHeight = disableImage.height;
		const width = overlay.width;

		const tween = this.scene.tweens.add({
			targets: overlay,
			duration: useGameControlsStore.getState().stepTime * duration,
			onUpdateScope: this,
			onUpdate: function (tween) {
				const currentHeight = initialHeight * tween.progress;

				overlay.setCrop(0, initialHeight - currentHeight, width, currentHeight);
			},
			ease: "Linear",
			repeat: 1,
		});

		this.disables.push({
			name,
			duration,
			step,
			container: disableContainer,
			icon: disableImage,
			tween,
			overlay,
			text: disableText,
		});

		if (name === "STUN") {
			this.battleUnit.abilitiesManager.pauseSkillCooldown();
		}
	}

	decreaseDurations(step: number) {
		this.disables = this.disables.map(disable => {
			const newDuration = Math.max(0, disable.duration + disable.step - step);

			return {
				...disable,
				duration: newDuration,
				step,
				text: disable.text.setText(`${newDuration}`),
			};
		});

		this.disables.forEach(disable => {
			if (disable.duration == 0) {
				this.removeDisable(disable.name);
			}
		});
	}

	removeDisable(name: string) {
		const disableToRemove = this.disables.find(disable => disable.name === name);

		if (!disableToRemove) return;

		disableToRemove.container.destroy();
		this.disables = this.disables.filter(disable => disable.name !== name);

		if (disableToRemove.name === "STUN") {
			this.battleUnit.abilitiesManager.resumeSkillCooldown();
		}
	}

	resumeDisableDuration() {
		this.disables.forEach(disable => {
			if (disable.tween && disable.tween.isPaused()) {
				disable.tween.resume();
			}
		});
	}

	pauseDisableDuration() {
		this.disables.forEach(disable => {
			if (disable.tween && disable.tween.isPlaying()) {
				disable.tween.pause();
			}
		});
	}

	isStunned(): boolean {
		return !!this.disables.find(disable => disable.name === "STUN");
	}
}
