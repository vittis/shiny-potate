import { parseMarkdownWithYamlFrontmatter } from "@/utils/parseMarkdown";

export async function importMarkdownFile(filePath: string) {
	try {
		const finalFilePath = filePath.replace("%20", " ");
		const module = await import(`@obsidian/${finalFilePath}.md`); // todo cache?
		const response = await fetch(module.default);
		const source = await response.text();
		const result = parseMarkdownWithYamlFrontmatter(source);

		return { content: result.content, metadata: result.metadata };
	} catch (error) {
		throw Error(`Error importing file: ${error}`);
	}
}

// todo get from game-logic

export function modToMarkdown(mod: any) {
	let finalString = "";
	if (mod.type === "GRANT_BASE_STAT") {
		const isPositive = mod.payload.value > 0;
		finalString = `- *${isPositive ? "+" : "-"}${mod.payload.value}%* `;

		let displayName = "";
		let path = "";
		if (mod.payload.stat === "ATTACK_DAMAGE") {
			displayName = "Attack Damage";
			path = "Stats/Attack%20Damage.md";
		}
		if (mod.payload.stat === "SPELL_DAMAGE") {
			displayName = "Spell Damage";
			path = "Stats/Spell%20Damage.md";
		}
		if (mod.payload.stat === "ATTACK_COOLDOWN") {
			displayName = "Attack Cooldown Recovery";
			path = "Stats/Attack%20Cooldown.md";
		}
		if (mod.payload.stat === "SPELL_COOLDOWN") {
			displayName = "Spell Cooldown Recovery";
			path = "Stats/Spell%20Cooldown.md";
		}

		finalString += `increased [${displayName}](${path})`;
	}
	if (mod.type === "GRANT_ABILITY") {
		const subPath = mod.payload.type === "ATTACK" ? "Attacks" : "Spells";
		let transformedName = mod.payload.name.replace(" ", "%20");
		let path = `Abilities/${subPath}/${transformedName}.md`;

		finalString = `- Grants ability: [${mod.payload.name}](${path})`;
	}

	if (mod.type === "GRANT_PERK") {
		let transformedName = mod.payload.name.replace(" ", "%20");

		let path = `Perks/${transformedName}.md`;

		finalString = `- *+${mod.payload.tier}* [${mod.payload.name}](${path})`;
	}
	finalString += ` **(${mod?.tier === "implicit" ? "" : "T"}${mod?.tier})**`;

	return finalString;
}
