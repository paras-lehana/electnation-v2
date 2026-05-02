import { expect, test } from '@playwright/test';
import {
  collectConsoleErrors,
  expectNoCriticalConsoleErrors,
  expectNoHorizontalOverflow,
} from './helpers';

test.describe('Onboarding functionality', () => {
  test('captures persona inputs and routes to the Yatra', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);
    await page.goto('/onboarding');

    await page.getByRole('button', { name: /yes, i am 18/i }).click();
    await page.getByRole('button', { name: /continue/i }).click();
    await page.getByRole('button', { name: /yes, my first time/i }).click();
    await page.getByRole('button', { name: /continue/i }).click();
    await page.getByRole('button', { name: /hindi/i }).click();
    await page.getByRole('button', { name: /continue/i }).click();
    await page.getByPlaceholder(/city or zip/i).fill('Delhi');
    await page.getByRole('button', { name: /start my yatra/i }).click();

    await expect(page).toHaveURL(/\/yatra$/);
    await expect(page.getByRole('heading', { name: /your election yatra/i })).toBeVisible();
    await expect(
      page.evaluate(() => window.localStorage.getItem('voter_persona')),
    ).resolves.toContain('Delhi');

    await expectNoHorizontalOverflow(page);
    expectNoCriticalConsoleErrors(consoleErrors);
  });
});
