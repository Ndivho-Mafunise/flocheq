import { test, expect } from '@playwright/test';

test.describe('Home page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads with correct title', async ({ page }) => {
    await expect(page).toHaveTitle(/Flocheq/i);
  });

  test('navbar logo is visible and links to home', async ({ page }) => {
    const logo = page.locator('nav img[alt="Flocheq"]');
    await expect(logo).toBeVisible();
    await logo.click();
    await expect(page).toHaveURL('/');
  });

  test('navbar shows Pricing and Login links', async ({ page }) => {
    await expect(page.getByRole('link', { name: 'Pricing', exact: true })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Login' })).toBeVisible();
  });

  test('hero heading is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('"Get started free" CTA navigates to register', async ({ page }) => {
    await page.getByRole('link', { name: /get started free/i }).click();
    await expect(page).toHaveURL('/register');
  });

  test('"View pricing" CTA navigates to pricing', async ({ page }) => {
    await page.getByRole('link', { name: /view pricing/i }).click();
    await expect(page).toHaveURL('/pricing');
  });

  test('"Why Flocheq" section is visible', async ({ page }) => {
    await expect(page.getByText('Why Flocheq')).toBeVisible();
  });

  
  test('bottom CTA "Start building with Flocheq today" is visible', async ({ page }) => {
    await expect(page.getByText('Start building with Flocheq today')).toBeVisible();
  });

  test('"Sign up" button in navbar navigates to register', async ({ page }) => {
    await page.getByRole('link', { name: /sign up/i }).click();
    await expect(page).toHaveURL('/register');
  });

});
