import path from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig } from "vite";
import dynamicImport from "vite-plugin-dynamic-import";

export default defineConfig({
	plugins: [react(), dynamicImport()],
	assetsInclude: ["**/*.md"],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
			"@obsidian": path.resolve(__dirname, "obsidian"),
		},
	},
});
