import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const routes = [
  '/',
  '/easy-mode',
  '/sanrakshan',
  '/clinic',
  '/play',
  '/play/scenario/vote-sanrakshan',
  '/map',
  '/google-services',
  '/pwd',
  '/yatra',
];

test.describe('Accessibility smoke', () => {
  for (const route of routes) {
    test(`has no serious axe violations on ${route}`, async ({ page }) => {
      await page.goto(route);
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
      const seriousViolations = results.violations.filter(
        (violation) => violation.impact === 'serious' || violation.impact === 'critical',
      );

      expect(seriousViolations).toEqual([]);
    });
  }
});
