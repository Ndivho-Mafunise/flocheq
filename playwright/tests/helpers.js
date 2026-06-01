import { expect } from '@playwright/test';

export const CREDENTIALS = { email: 'user@test.dev', password: 'pass_123' };

export async function loginViaUI(page) {
  await page.goto('/login');
  await page.getByLabel(/email address/i).fill(CREDENTIALS.email);
  await page.getByLabel(/^password/i).fill(CREDENTIALS.password);
  await page.getByRole('button', { name: /sign in/i }).click();
  await expect(page).toHaveURL('/dashboard', { timeout: 10000 });
}
