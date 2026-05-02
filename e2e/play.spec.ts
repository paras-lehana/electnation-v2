import { expect, test } from '@playwright/test';
import {
  collectConsoleErrors,
  expectNoCriticalConsoleErrors,
  expectNoHorizontalOverflow,
} from './helpers';

test.describe('Vote Sanrakshan scenario', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/play');
    await page.evaluate(() => window.localStorage.clear());
  });

  test('awards XP and prevents duplicate claims for the safe answer', async ({ page }) => {
    const consoleErrors = collectConsoleErrors(page);
    await page.goto('/play/scenario/vote-sanrakshan');

    await page.getByTestId('scenario-start').click();
    await page.getByTestId('choice-1').click();
    await expect(page.getByTestId('feedback-panel')).toContainText(/correct/i);
    await page.getByTestId('claim-xp').click();

    await expect(page).toHaveURL(/\/play$/);
    await expect(page.getByTestId('xp-total')).toHaveText('120');
    await expect(page.getByTestId('badge-count')).toContainText('2/12');
    await expect(page.getByTestId('scenario-card-vote-sanrakshan')).toContainText(/completed/i);

    await page.goto('/play/scenario/vote-sanrakshan');
    await page.getByTestId('scenario-start').click();
    await page.getByTestId('choice-1').click();
    await expect(page.getByTestId('claim-xp')).toBeDisabled();
    await expect(page.getByTestId('claim-xp')).toContainText(/already claimed/i);

    await expectNoHorizontalOverflow(page);
    expectNoCriticalConsoleErrors(consoleErrors);
  });
});
