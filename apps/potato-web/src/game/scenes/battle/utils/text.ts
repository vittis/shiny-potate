export function addFadingText(
	scene: Phaser.Scene,
	x: number,
	y: number,
	{
		text,
		color = "#7655AE",
		fontSize = 32,
		duration = 3500,
	}: { text: string; color?: string; fontSize?: number; duration?: number },
) {
	const abilityText = scene.add.text(x, y, text, {
		fontSize: fontSize,
		color: color,
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
		x: Phaser.Math.Between(x + -15, x + 15),
		y: abilityText.y - 38 - Phaser.Math.Between(0, 10),
		alpha: 0,
		duration: duration,
		ease: "Linear",
		onComplete: () => {
			abilityText.destroy();
		},
	});

	return abilityText;
}
