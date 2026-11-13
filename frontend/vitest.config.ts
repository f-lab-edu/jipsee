import react from "@vitejs/plugin-react";
import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [react()],
	resolve: { tsconfigPaths: true },
	test: {
		exclude: [...configDefaults.exclude, "e2e/**"],
		environment: "jsdom",
		setupFiles: ["./vitest.setup.ts"],
		server: { deps: { inline: [/@seed-design/] } },
	},
});
