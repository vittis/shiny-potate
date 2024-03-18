export function addFadingText(scene: Phaser.Scene, x: number, y: number, text: string) {
	const abilityText = scene.add.text(x, y, text, {
		fontSize: 32,
		color: "#7655AE",
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
	abilityText.setOrigin(0.5);

	// damage text going up
	scene.tweens.add({
		targets: abilityText,
		x: Phaser.Math.Between(-15, 15),
		y: abilityText.y - 38 - Phaser.Math.Between(0, 10),
		alpha: 0,
		duration: 3500,
		ease: "Linear",
		onComplete: () => {
			abilityText.destroy();
		},
	});

	return abilityText;
}
