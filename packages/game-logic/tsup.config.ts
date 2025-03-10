import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/game/main.ts"],
	format: ["cjs", "esm"],
	dts: true,
	watch: true,
	onSuccess: "node dist/main.js",
	sourcemap: true,
});
