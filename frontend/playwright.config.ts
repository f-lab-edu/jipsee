import { defineConfig } from "@playwright/test";
import { mockStorageState } from "./e2e/support/mockStorageState";

export default defineConfig({
	testDir: "e2e",
	globalSetup: "./e2e/support/globalSetup.ts",
	outputDir: "test-results",
	fullyParallel: true,
	reporter: "list",
	timeout: 60_000,
	expect: { timeout: 15_000 },
	use: {
		baseURL: "http://localhost:3000",
		channel: "chrome",
		screenshot: "only-on-failure",
		storageState: mockStorageState,
	},
	webServer: {
		command: "pnpm dev",
		url: "http://localhost:3000",
		reuseExistingServer: true,
	},
});
