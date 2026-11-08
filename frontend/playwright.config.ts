import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "e2e",
	outputDir: "test-results",
	fullyParallel: true,
	reporter: "list",
	timeout: 60_000,
	expect: { timeout: 15_000 },
	use: {
		baseURL: "http://localhost:3000",
		channel: "chrome",
		screenshot: "only-on-failure",
	},
	webServer: {
		command: "pnpm dev",
		url: "http://localhost:3000",
		reuseExistingServer: true,
	},
});
