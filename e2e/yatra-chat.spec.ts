import { expect, test } from '@playwright/test';
import {
  collectConsoleErrors,
  expectNoCriticalConsoleErrors,
  expectNoHorizontalOverflow,
} from './helpers';

test.describe('Yatra and Chunav Saathi', () => {
  test('validates station flow and streams a chat answer', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);
    await page.goto('/yatra');

    await expect(page.getByRole('heading', { name: /your election yatra/i })).toBeVisible();
    await page.getByPlaceholder(/enter epic number/i).fill('ABC1234567');
    await page.getByRole('button', { name: /complete station/i }).click();
    await expect(page.getByText(/learn about candidates and issues/i)).toBeVisible();

    await page.getByRole('button', { name: /open chunav saathi chat/i }).click();
    await page.getByPlaceholder(/ask a question/i).fill('How do I check my voter registration?');
    await page.getByRole('button', { name: /send question to chunav saathi/i }).click();
    await expect(page.getByText(/voters\.eci\.gov\.in|registration|official/i).first()).toBeVisible(
      { timeout: 45_000 },
    );

    await expectNoHorizontalOverflow(page);
    expectNoCriticalConsoleErrors(consoleErrors);
  });
});
