import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [tsconfigPaths()],
	test: {
		include: ["./src/**/*.test.ts"],
		globals: true,
		setupFiles: ["./testSetup.ts"],
	},
});
