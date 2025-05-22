import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["./src/**/*.test.ts"],
		globals: true,
		setupFiles: ["./testSetup.ts"],
		alias: {
			"@/data": new URL("./src/data", import.meta.url).pathname,
		},
	},
});
