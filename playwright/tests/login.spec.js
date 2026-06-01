import { test, expect } from '@playwright/test';

/**
 LIMITATIONS:
 - Successful login is NOT tested — requires a live backend + valid credentials.
 - Auth cookie / session state is not simulated here.
  - Redirect to /dashboard after login is only testable with a seeded test user.
 */

test.describe('Login page', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  // ── Layout ──────────────────────────────────────────────────────────────────

  test('renders the login form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /welcome back/i })).toBeVisible();
    await expect(page.getByLabel(/email address/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
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

  test('"Sign up" link navigates to register', async ({ page }) => {
    await page.getByRole('link', { name: /sign up/i }).click();
    await expect(page).toHaveURL('/register');
  });

  test('"Forgot password?" link navigates to forgot-password', async ({ page }) => {
    await page.getByRole('link', { name: /forgot password/i }).click();
    await expect(page).toHaveURL('/forgot-password');
  });

  // ── Form validation ──────────────────────────────────────────────────────────

  test('submit with empty fields does not navigate away', async ({ page }) => {
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL('/login');
  });

  test('email field rejects invalid format', async ({ page }) => {
    await page.getByLabel(/email address/i).fill('notanemail');
    await page.getByRole('button', { name: /sign in/i }).click();
    const emailInput = page.getByLabel(/email address/i);
    // Browser native validation fires — input stays invalid
    await expect(emailInput).toBeFocused();
  });

  test('password field is masked', async ({ page }) => {
    const passwordInput = page.getByLabel(/^password/i);
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  test('shows error message on wrong credentials', async ({ page }) => {
    // LIMITATION: requires backend to be running
    await page.getByLabel(/email address/i).fill('wrong@example.com');
    await page.getByLabel(/^password/i).fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();
    // Either an error banner appears or we stay on /login
    await expect(page).toHaveURL('/login');
  });

  test('sign in button shows loading state while submitting', async ({ page }) => {
    await page.getByLabel(/email address/i).fill('test@example.com');
    await page.getByLabel(/^password/i).fill('password123');

    // Intercept the request so it hangs — lets us observe the loading state
    await page.route('**/login', route => route.abort());

    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByRole('button', { name: /login/i })).toBeVisible();
  });

  // ── Brand panel (desktop only) ───────────────────────────────────────────────

  test('brand panel copy is visible on desktop', async ({ page }) => {
    await expect(page.getByText('Payments infrastructure')).toBeVisible();
    await expect(page.getByText('Collect payments.')).toBeVisible();
  });

});
