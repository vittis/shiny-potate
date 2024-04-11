export function toCamelCase(inputString: string) {
	return inputString
		.split(" ")
		.map((word, index) => {
			if (index === 0) {
				return word.toLowerCase();
			}
			return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
		})
		.join("");
}

export function capitalizeFirstLetter(input: string): string {
	// Check if input is not a string
	if (typeof input !== "string") {
		throw new Error("Input must be a string");
	}

	// Check if input is an empty string
	if (input.length === 0) return input;

	// Capitalize the first letter and concatenate with the rest of the string
	return input.charAt(0).toUpperCase() + input.slice(1);
}
