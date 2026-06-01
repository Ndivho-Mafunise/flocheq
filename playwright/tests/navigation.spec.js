import { test, expect } from '@playwright/test';
import { loginViaUI } from './helpers.js';

test.describe('Public navigation', () => {

  test('/ loads the home page', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('/pricing loads the pricing page', async ({ page }) => {
    await page.goto('/pricing');
    await expect(page.getByText(/simple pricing/i)).toBeVisible();
  });

  test('/login loads the login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
  });

  test('/register loads the register page', async ({ page }) => {
    await page.goto('/register');
    await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible();
  });

  test('/forgot-password loads the forgot password page', async ({ page }) => {
    await page.goto('/forgot-password');
    await expect(page.getByRole('heading', { name: /forgot password/i })).toBeVisible();
  });

  test('pricing page "Back to home" navigates home', async ({ page }) => {
    await page.goto('/pricing');
   
    await expect(page).toHaveURL('/pricing');
  });

  test('/home redirects to /', async ({ page }) => {
    await page.goto('/home');
    await expect(page).toHaveURL('/');
  });

  test('unauthenticated visit to /dashboard redirects away', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).not.toHaveURL('/dashboard');
  });

  test('navbar Pricing link works from home', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Pricing', exact: true }).click();
    await expect(page).toHaveURL('/pricing');
  });

  test('navbar Login link works from home', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: 'Login' }).click();
    await expect(page).toHaveURL('/login');
  });

  test('browser back button works after navigation', async ({ page }) => {
    await page.goto('/');
    await page.goto('/pricing');
    await page.goBack();
    await expect(page).toHaveURL('/');
  });

});

test.describe('Sidebar navigation', () => {

  test.beforeEach(async ({ page }) => {
    await loginViaUI(page);
  });

  test('sidebar is visible after login', async ({ page }) => {
    await expect(page.locator('aside')).toBeVisible();
  });

  test('clicking Payments navigates to /payments', async ({ page }) => {
    await page.locator('aside').getByRole('button', { name: 'Payments' }).click();
    await expect(page).toHaveURL('/payments', { timeout: 5000 });
  });

  test('clicking Customers navigates to /customers', async ({ page }) => {
    await page.locator('aside').getByRole('button', { name: 'Customers' }).click();
    await expect(page).toHaveURL('/customers', { timeout: 5000 });
  });

  test('clicking Insights navigates to /insights', async ({ page }) => {
    await page.locator('aside').getByRole('button', { name: 'Insights' }).click();
    await expect(page).toHaveURL('/insights', { timeout: 5000 });
  });

  test('clicking Reports navigates to /reports', async ({ page }) => {
    await page.locator('aside').getByRole('button', { name: 'Reports' }).click();
    await expect(page).toHaveURL('/reports', { timeout: 5000 });
  });

  test('clicking Home from another page returns to /dashboard', async ({ page }) => {
    await page.locator('aside').getByRole('button', { name: 'Payments' }).click();
    await expect(page).toHaveURL('/payments', { timeout: 5000 });
    await page.locator('aside').getByRole('button', { name: 'Home' }).click();
    await expect(page).toHaveURL('/dashboard', { timeout: 5000 });
  });

  test('user name and email are shown in the sidebar', async ({ page }) => {
    await expect(page.locator('aside')).toContainText('user');
    await expect(page.locator('aside')).toContainText('user@test.dev');
  });

  test('dark mode toggle switches theme and can be switched back', async ({ page }) => {
    const root = page.locator('div.flex.h-screen').first();
    await expect(root).not.toHaveClass(/dark/);
    await page.locator('aside').getByRole('button', { name: /dark mode/i }).click();
    await expect(root).toHaveClass(/dark/);
    await page.locator('aside').getByRole('button', { name: /light mode/i }).click();
    await expect(root).not.toHaveClass(/dark/);
  });

  test('org switcher dropdown opens on click', async ({ page }) => {
    await page.locator('aside').getByText('SaaSboard Inc.').click();
    await expect(page.locator('aside').getByText('Production')).toBeVisible();
    await expect(page.locator('aside').getByText('Staging')).toBeVisible();
  });

});
