import { parseMarkdownWithYamlFrontmatter } from "@/utils/parseMarkdown";

export async function importMarkdownFile(filePath: string) {
	try {
		const module = await import(`@obsidian/${filePath}.md`);
		const response = await fetch(module.default);
		const source = await response.text();
		const result = parseMarkdownWithYamlFrontmatter<any>(source);

		return { content: result.content, metadata: result.metadata };
	} catch (error) {
		throw Error(`Error importing file: ${error}`);
	}
}
