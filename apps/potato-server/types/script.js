const fs = require("fs");

// Define your custom types
const customTypes = {
	shop: "Shop",
	storage: "Storage",
	board: "Board",
};

fs.readFile("./supabase.ts", "utf8", (err, data) => {
	if (err) {
		console.error("Error reading file:", err);
		return;
	}

	// Add import statement for custom types at the top of the file
	const importStatement = `import { ${Object.values(customTypes).join(
		", ",
	)} } from 'game-logic';\n\n`;

	// Initialize correctedData with the importStatement and existing data
	let correctedData = importStatement + data;

	// Replace the specified types with consideration for their original optionality and nullability
	Object.entries(customTypes).forEach(([key, value]) => {
		// Pattern to match the property definition, capturing optional, type, and nullable parts
		const regexPattern = new RegExp(`(${key}\\??)\\s*:\\s*(Json(\\[\\])?)(\\s*\\|\\s*null)?`, "g");
		correctedData = correctedData.replace(regexPattern, (match, p1, p2, p3, p4) => {
			// p1: property with optional, p2: Json or Json[], p3: array indicator, p4: nullable part
			let replacementType = p3 ? value : value; // Here you can adjust if array/non-array types have different names
			return `${p1}: ${replacementType}${p4 || ""}`;
		});
	});

	// Write the corrected data back to the file
	fs.writeFile("./supabase.ts", correctedData, "utf8", err => {
		if (err) {
			console.error("Error writing file:", err);
			return;
		}
		console.log("Type file has been corrected successfully!");
	});
});
