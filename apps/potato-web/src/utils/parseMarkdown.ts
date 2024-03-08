type MarkdownWithYamlFrontmatter = {
	metadata?: {
		tags?: string[];
	};
	content?: string;
};

export const parseMarkdownWithYamlFrontmatter = <T extends Record<string, string>>(
	markdown: string,
): MarkdownWithYamlFrontmatter => {
	const metaRegExp = new RegExp(/^---[\n\r](((?!---).|[\n\r])*)[\n\r]---$/m);

	// "rawYamlHeader" is the full matching string, including the --- and ---
	// "yamlVariables" is the first capturing group, which is the string content between the --- and ---
	const [rawYamlHeader, yamlVariables] = metaRegExp.exec(markdown) ?? [];

	if (!rawYamlHeader || !yamlVariables) {
		return { content: markdown };
	}

	const keyValues = yamlVariables.split("\n");

	const frontmatter = Object.fromEntries<string>(
		keyValues.map(keyValue => {
			const splitted = keyValue.split(":");
			const [key, value] = splitted;

			return [key ?? keyValue, value?.trim() ?? ""];
		}),
	) as Record<keyof T, string>;

	const parsedFrontMatter = {
		...frontmatter,
		tags:
			frontmatter?.tags
				?.split(",")
				?.map(t => t.trim().charAt(0).toUpperCase() + t.trim().slice(1)) || [],
	};

	const parsedContent = markdown.replace(rawYamlHeader, "").trim();

	return { content: parsedContent, metadata: parsedFrontMatter };
};
