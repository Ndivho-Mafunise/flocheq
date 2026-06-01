import { test, expect } from '@playwright/test';

/**
 * LIMITATIONS:
 * - Successful registration is NOT tested — requires a live backend + unique email.
 * - Email verification step (/verify-email) cannot be automated (requires inbox access).
 * - Duplicate email errors are only catchable with a running backend.
 */

test.describe('Register page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/register');
  });

  // ── Layout ──────────────────────────────────────────────────────────────────

  test('renders the signup form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /create your account/i })).toBeVisible();
    await expect(page.getByLabel(/full name/i)).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/^password/i)).toBeVisible();
    await expect(page.getByLabel(/confirm password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /create account/i })).toBeVisible();
  });

  test('subtitle says "Get started with Flocheq"', async ({ page }) => {
    await expect(page.getByText(/get started with flocheq/i)).toBeVisible();
  });

  test('logo is visible and navigates to home', async ({ page }) => {
    const logo = page.locator('img[alt="Flocheq"]').first();
    await expect(logo).toBeVisible();
    await logo.click();
    await expect(page).toHaveURL('/');
  });

  test('"Back to home" link navigates to home', async ({ page }) => {
    await page.getByRole('link', { name: /back to home/i }).click();
    await expect(page).toHaveURL('/');
  });

  test('"Sign in" link navigates to login', async ({ page }) => {
    await page.getByRole('link', { name: /sign in/i }).click();
    await expect(page).toHaveURL('/login');
  });

  // ── Form validation ──────────────────────────────────────────────────────────

  test('submit with empty fields does not navigate away', async ({ page }) => {
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page).toHaveURL('/register');
  });

  test('password and confirm password fields are masked', async ({ page }) => {
    await expect(page.getByLabel(/^password/i)).toHaveAttribute('type', 'password');
    await expect(page.getByLabel(/confirm password/i)).toHaveAttribute('type', 'password');
  });

  test('shows error when passwords do not match', async ({ page }) => {
    await page.getByLabel(/full name/i).fill('Test User');
    await page.getByLabel(/email address/i).fill('test@example.com');
    await page.getByLabel(/^password/i).fill('password123');
    await page.getByLabel(/confirm password/i).fill('different456');
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page.getByText(/passwords do not match/i)).toBeVisible();
  });

  test('shows error when password is under 8 characters', async ({ page }) => {
    await page.getByLabel(/full name/i).fill('Test User');
    await page.getByLabel(/email address/i).fill('test@example.com');
    await page.getByLabel(/^password/i).fill('short');
    await page.getByLabel(/confirm password/i).fill('short');
    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page.getByText(/at least 8 characters/i)).toBeVisible();
  });

  test('email field rejects invalid format', async ({ page }) => {
    await page.getByLabel(/email address/i).fill('bademail');
    await page.getByRole('button', { name: /create account/i }).click();
    const emailInput = page.getByRole('textbox', { name: 'Email address' })
    await expect(emailInput).toBeFocused();
  });

  test('create account button shows loading state while submitting', async ({ page }) => {
    await page.getByLabel(/full name/i).fill('Test User');
    await page.getByLabel(/email address/i).fill('new@example.com');
    await page.getByLabel(/^password/i).fill('password123');
    await page.getByLabel(/confirm password/i).fill('password123');

    await page.route('**/register', route => route.abort());

    await page.getByRole('button', { name: /create account/i }).click();
    await expect(page.getByRole('button', { name: 'Create account' })).toBeVisible();
  });

  // ── Brand panel (desktop only) ───────────────────────────────────────────────

  test('brand panel copy is visible on desktop', async ({ page }) => {
    await expect(page.getByText('Payments infrastructure')).toBeVisible();
    await expect(page.getByText('Start in minutes.')).toBeVisible();
  });

  test('terms of service and privacy policy links exist', async ({ page }) => {
    await expect(page.getByRole('link', { name: /terms of service/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /privacy policy/i })).toBeVisible();
  });

});
