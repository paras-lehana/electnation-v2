import { defineConfig, devices } from '@playwright/test';

const deployedBaseUrl = process.env.E2E_BASE_URL;
const localBaseUrl = 'http://localhost:3000';

export default defineConfig({
  testDir: './e2e',
  timeout: 90_000,
  expect: { timeout: 20_000 },
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: deployedBaseUrl ?? localBaseUrl,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: deployedBaseUrl
    ? undefined
    : [
        {
          command: 'pnpm --filter @yatra/functions dev',
          url: 'http://localhost:8080/api/health',
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
          env: {
            NODE_ENV: 'development',
            DEMO_MODE: 'true',
            RECAPTCHA_BYPASS: 'true',
            ALLOW_NO_ORIGIN_REQUESTS: 'true',
            LLM_SERVICE_ENABLED: 'false',
            GOOGLE_MAPS_API_KEY: '',
          },
        },
        {
          command: 'pnpm --filter @yatra/web dev',
          url: localBaseUrl,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
          env: {
            NEXT_PUBLIC_API_BASE_URL: 'http://localhost:8080',
          },
        },
      ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } },
    },
    {
      name: 'mobile-chromium',
      use: { ...devices['Pixel 5'], viewport: { width: 390, height: 844 } },
    },
  ],
});
