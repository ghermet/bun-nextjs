// Import necessary Playwright and Synpress modules
import { defineConfig, devices } from "@playwright/test";
import { config } from "dotenv";

config({ quiet: true });

// Define Playwright configuration
export default defineConfig({
  testDir: "./playwright/tests",
  outputDir: "./playwright/results/",
  snapshotDir: "./playwright/snapshots/",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  timeout: process.env.CI ? 30000 : 60000,
  reporter: "html",
  use: {
    // Set base URL for tests
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  webServer: [
    {
      command: "npm run e2e:setup",
      port: 8545,
      reuseExistingServer: !process.env.CI,
    },
    {
      command: "npm run dev",
      port: 3000,
      reuseExistingServer: !process.env.CI,
    },
  ],
});
