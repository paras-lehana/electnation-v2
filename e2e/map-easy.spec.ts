import { expect, test } from '@playwright/test';
import {
  collectConsoleErrors,
  expectNoCriticalConsoleErrors,
  expectNoHorizontalOverflow,
} from './helpers';

test.describe('Map and Easy Mode validation', () => {
  test('renders map fallback or map panel with official lookup cards', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);
    await page.goto('/map');

    await expect(page.getByRole('heading', { name: /map your booth/i })).toBeVisible();
    await expect(page.getByTestId('facility-booth-card')).toContainText(/polling booth/i);
    await expect(page.getByTestId('facility-ero-card')).toContainText(/ero office/i);
    await expect(page.getByRole('link', { name: /voters\.eci\.gov\.in/i }).first()).toBeVisible();

    await expectNoHorizontalOverflow(page);
    expectNoCriticalConsoleErrors(consoleErrors);
  });

  test('renders Easy Mode action tiles and read-aloud controls', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);
    await page.goto('/easy-mode');

    await expect(page.getByText(/easy mode/i).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /listen/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /forward check karo/i })).toBeVisible();
    await expect(page.getByTestId('easy-mode-language')).toBeVisible();
    await expect(page.getByTestId('easy-mode-transcript')).toContainText(/ईज़ी मोड|Easy Mode/i);
    await page.getByTestId('easy-mode-language').selectOption('ta');
    await expect(page.getByTestId('easy-mode-transcript')).toContainText(/ஈசி மோடு/);
    await expect(page.getByTestId('easy-mode-voice-support')).toContainText(/Tamil/);

    await expectNoHorizontalOverflow(page);
    expectNoCriticalConsoleErrors(consoleErrors);
  });

  test('renders Google Services evidence with honest implementation statuses', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);
    await page.goto('/google-services');

    await expect(page.getByRole('heading', { name: /google civic stack/i })).toBeVisible();
    await expect(page.getByText(/Google service slots/i)).toBeVisible();
    await expect(page.getByText(/Implemented/i).first()).toBeVisible();
    await expect(page.getByText(/Ready with key/i).first()).toBeVisible();
    await expect(page.getByText(/Planned scaffold/i).first()).toBeVisible();
    await expect(page.getByText(/Antigravity Gemini/i).first()).toBeVisible();
    await expect(page.getByText(/Google Maps JavaScript API/i).first()).toBeVisible();

    await expectNoHorizontalOverflow(page);
    expectNoCriticalConsoleErrors(consoleErrors);
  });
});
