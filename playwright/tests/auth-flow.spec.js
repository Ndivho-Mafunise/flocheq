import { test, expect } from '@playwright/test';
import { loginViaUI, CREDENTIALS } from './helpers.js';

test.describe('Authentication', () => {

  test('login form is visible on /login', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/^password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
  });

  test('valid credentials log the user in and land on dashboard', async ({ page }) => {
    await loginViaUI(page);
    await expect(page.locator('aside')).toBeVisible();
  });

  test('login button shows a loading state while the request is in flight', async ({ page }) => {
    await page.goto('/login');
    await page.route('**/login', async route => {
      await new Promise(r => setTimeout(r, 1000));
      await route.continue();
    });
    await page.getByLabel(/email address/i).fill(CREDENTIALS.email);
    await page.getByLabel(/^password/i).fill(CREDENTIALS.password);
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByRole('button', { name: /signing in/i })).toBeVisible();
  });

  test('wrong password shows an error and stays on /login', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel(/email address/i).fill(CREDENTIALS.email);
    await page.getByLabel(/^password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL('/login');
    await expect(page.locator('[class*="rose"]').first()).toBeVisible({ timeout: 5000 });
  });

  test('authenticated user visiting /login is redirected to dashboard', async ({ page }) => {
    await loginViaUI(page);
    await page.goto('/login');
    await expect(page).toHaveURL('/dashboard', { timeout: 5000 });
  });

  test('unauthenticated user visiting a protected route is redirected to /login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/login', { timeout: 5000 });
  });

  test('user can log out and is sent to /login', async ({ page }) => {
    await loginViaUI(page);
    await page.getByRole('button', { name: /log\s*out/i }).click();
    await expect(page).toHaveURL('/login', { timeout: 5000 });
  });

  test('after logout the dashboard is no longer accessible', async ({ page }) => {
    await loginViaUI(page);
    await page.getByRole('button', { name: /log\s*out/i }).click();
    await expect(page).toHaveURL('/login', { timeout: 5000 });
    await page.goto('/dashboard', { waitUntil: 'networkidle' });
    await expect(page).not.toHaveURL('/dashboard');
  });

});
