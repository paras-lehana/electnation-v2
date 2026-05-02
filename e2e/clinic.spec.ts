import { expect, test } from '@playwright/test';
import {
  collectConsoleErrors,
  expectNoCriticalConsoleErrors,
  expectNoHorizontalOverflow,
  isDeployedRun,
} from './helpers';

test.describe('Forward Clinic functionality', () => {
  test('analyzes a suspicious election forward and renders verification guidance', async ({
    page,
  }) => {
    const consoleErrors = collectConsoleErrors(page);
    await page.goto('/clinic');

    await page
      .getByTestId('forward-textarea')
      .fill(
        'Forwarded many times: EVM bluetooth hack will change votes tonight. Do not vote because polling is rigged.',
      );
    await page.getByTestId('analyze-forward').click();

    await expect(page.getByTestId('clinic-result')).toBeVisible({
      timeout: isDeployedRun() ? 60_000 : 30_000,
    });
    await expect(page.getByText(/diagnosis result/i)).toBeVisible();
    await expect(page.getByText(/risk/i).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /official source/i }).first()).toHaveAttribute(
      'href',
      /eci\.gov\.in/,
    );

    if (isDeployedRun())
      await expect(page.getByText(/official source/i).first()).toBeVisible({ timeout: 60_000 });

    await expectNoHorizontalOverflow(page);
    expectNoCriticalConsoleErrors(consoleErrors);
  });
});
