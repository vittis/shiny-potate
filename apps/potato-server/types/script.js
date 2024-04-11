const fs = require("fs");

// Define your custom shop type
const customShopType = "Shop";
const customStorageType = "Storage";
const customBoardType = "Board";

fs.readFile("./supabase.ts", "utf8", (err, data) => {
	if (err) {
		console.error("Error reading file:", err);
		return;
	}

	// Add import statement for custom shop type at the top of the file
	const importStatement = `import { ${customShopType}, ${customStorageType}, ${customBoardType} } from 'game-logic';\n\n`;

	// Define the regular expression pattern to match the shop type
	const shopRegexPattern = /shop\s*:\s*Json\s*\|\s*null|shop\?\s*:\s*Json\s*\|\s*null/g;

	// Replace the matched instances with the custom shop type
	let correctedData = data.replace(shopRegexPattern, `shop?: ${customShopType} | null`);

	const storageRegexPattern = /storage\s*:\s*Json\s*\|\s*null|storage\?\s*:\s*Json\s*\|\s*null/g;
	correctedData = correctedData.replace(
		storageRegexPattern,
		`storage?: ${customStorageType} | null`,
	);

	const boardRegexPattern = /board\??\s*:\s*Json\[\]\s*\|\s*null/g;
	correctedData = correctedData.replace(boardRegexPattern, `board?: ${customBoardType} | null`);

	// Insert the import statement at the beginning of the file
	correctedData = importStatement + correctedData;

	// Write the corrected data back to the file
	fs.writeFile("./supabase.ts", correctedData, "utf8", err => {
		if (err) {
			console.error("Error writing file:", err);
			return;
		}
		console.log("Type file has been corrected successfully!");
	});
});
