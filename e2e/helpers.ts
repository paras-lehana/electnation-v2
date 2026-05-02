import { expect, type Page } from '@playwright/test';

export const isDeployedRun = (): boolean => Boolean(process.env.E2E_BASE_URL);

export const expectNoHorizontalOverflow = async (page: Page) => {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBeLessThanOrEqual(2);
};

export const collectConsoleErrors = (page: Page): string[] => {
  const messages: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') messages.push(message.text());
  });
  page.on('pageerror', (error) => messages.push(error.message));
  return messages;
};

export const expectNoCriticalConsoleErrors = (messages: string[]) => {
  const ignoredPatterns = [/favicon/i, /google maps javascript api/i];
  const criticalMessages = messages.filter(
    (message) => !ignoredPatterns.some((pattern) => pattern.test(message)),
  );
  expect(criticalMessages).toEqual([]);
};
